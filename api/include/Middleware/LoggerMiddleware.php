<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;
use Slim\Routing\RouteContext;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;

class LoggerMiddleware
{
    /**
     * @var the log entry
     */
    private $logEntry;

    /**
     * holds the determines logtables
     *
     * @var array
     */
    private $logtables = [];

    private $startingTime;

    const DIRECTION_INBOUND  = 'I';
    const DIRECTION_OUTBOUND = 'O';

    public function __construct() {

    }

    public function __invoke(Request $request, RequestHandler $handler): Response {
        $this->startingTime = microtime(true);

        // generates the basic request
        $this->generateLogEntry($request);

        // builds the log tables
        $this->buildLogTables();

        // writes the log entr
        $this->writeLogEntry();

        // invoke the request
        $response = $handler->handle($request);

        // updates the log entry with the results
        $this->updateLogEntry($response);

        // returns the response
        return $response;
    }

    /**
     * Generates a log entry object and fills it with data from the request.
     *
     * @param Request $request
     */
    private function generateLogEntry(Request $request) {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $routeContext = RouteContext::fromRequest($request);
        $route = $routeContext->getRoute();

        $this->logEntry = new \stdClass();
        // if no route was found... $route = null
        if ($route) {
            $this->logEntry->route  = $route->getPattern();
            $this->logEntry->method = $route->getMethods()[0];
            $this->logEntry->request_args   = json_encode($route->getArguments());
        }

        $this->logEntry->url = (string) $request->getUri();    // will be converted to the complete url when be used in text context, therefore it is cast to a string...

        $this->logEntry->ip             = $request->getServerParams()['REMOTE_ADDR'];
        $this->logEntry->request_params     = json_encode($_GET);
        $this->logEntry->request_headers  =  json_encode($request->getHeaders());
        $this->logEntry->request_body    = "";
        if ($this->logEntry->method == 'POST' || $this->logEntry->method == 'PUT') {
            $this->logEntry->request_body    = $request->getBody()->getContents();
        }
        $this->logEntry->date_entered   = gmdate('Y-m-d H:i:s');
        $this->logEntry->date_timestamp = APILogEntryHandler::getTimestamp();
        // $current_user is an empty beansobject if the current route doesn't need any authentication...

        $this->logEntry->user_id        = $current_user->id;
        // and session is also missing!
        $this->logEntry->session_id     = session_id();
        $this->logEntry->transaction_id = LoggerManager::getLogger()->getTransactionId();
        $this->logEntry->direction      = self::DIRECTION_INBOUND;
    }

    /**
     * Writes the log entry into the DB.
     * At this point the log entry contains only the data from the request and the internal data
     * like user or session IDs.
     *
     * @throws \Exception
     */
    private function writeLogEntry() {
        if (count($this->logtables) > 0) {
            $this->logEntry->id = SpiceUtils::createGuid();
            foreach ($this->logtables as $lt) {
                DBManagerFactory::getInstance('spicelogger')->insertQuery($lt, (array)$this->logEntry);
            }
        }
    }

    /**
     * builds teh log entries reading the config
     *
     * @return void
     * @throws \Exception
     */
    private function buildLogTables(){
        $db = DBManagerFactory::getInstance();
        $spice_config = SpiceConfig::getInstance()->config;
        if($spice_config['system']['no_table_exists_check'] === true || DBManagerFactory::getInstance()->tableExists('sysapilogconfig')){
            // check if this request has to be logged by some rules...
            $sql = "SELECT count(id) cnt, logtable FROM sysapilogconfig WHERE
              (route = '{$this->logEntry->route}' OR route = '*' OR '{$this->logEntry->route}' LIKE route) AND
              (method = '{$this->logEntry->method}' OR method = '*') AND
              (user_id = '{$this->logEntry->user_id}' OR user_id = '*') AND
              (ip = '{$this->logEntry->ip}' OR ip = '*') AND
              is_active = 1 GROUP BY logtable";
            $res = $db->query($sql);
            while($row = $db->fetchByAssoc($res)){
                if(array_search($row['logtable'] ?: 'sysapilog', $this->logtables) === false) $this->logtables[] = $row['logtable'] ?: 'sysapilog';
            }
        }
    }


    /**
     * Updates the log entry with data from the response and saves the update into the DB.
     *
     * @param Response $response
     */
    private function updateLogEntry(Response $response) {
        if (count($this->logtables) > 0) {
            $this->logEntry->http_status_code = $response->getStatusCode();
            $this->logEntry->runtime = (microtime(true) - $this->startingTime)*1000;
            $this->logEntry->response_headers = $this->buildResponseHeaders($response->getHeaders());
            $this->logEntry->response_body = $response->getBody()->__toString();

            // update the log...
            foreach ($this->logtables as $lt) {
                DBManagerFactory::getInstance('spicelogger')->updateQuery($lt, ['id' => $this->logEntry->id], (array)$this->logEntry);
            }
        }
    }

    /**
     * build flattened response headers as JSON
     *
     * @param $headers
     * @return false|string
     */
    private function buildResponseHeaders($headers){
        $ret = [];
        foreach($headers as $h => $v){
            $ret[$h] = $v[0];
        }
        return json_encode($ret);
    }


}
