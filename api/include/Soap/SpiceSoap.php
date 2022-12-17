<?php
namespace SpiceCRM\includes\Soap;
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;
use soap_server;


class SpiceSoap {

    protected $soap_version = '1.1';
    protected $namespace = 'http://www.spicecrm.com/spicecrm';
    protected $implementationClass = 'SugarWebServiceImpl';
    protected $registryClass = "";
    protected $soapURL = "";

    private $startingTime;
    private $logEntry;

    /**
     * holds the determined logtables
     *
     * @var array
     */
    private $logtables = [];

    /**
     * This is the constructor. It creates an instance of NUSOAP server.
     *
     * @param String $url - This is the soap URL
     * @access public
     */
    public function __construct($url)
    {
        LoggerManager::getLogger()->info('Begin: NusoapSoap->__construct');
        $this->server = new soap_server();
        $this->soapURL = $url;
        $this->server->configureWSDL('sugarsoap', $this->getNameSpace(), $url);
        if (!isset($GLOBALS['HTTP_RAW_POST_DATA'])) $GLOBALS['HTTP_RAW_POST_DATA'] = file_get_contents('php://input');
        $this->setObservers();
        LoggerManager::getLogger()->info('End: NusoapSoap->__construct');
        // set a global transaction id
        $GLOBALS['transactionID'] = SpiceUtils::createGuid();
    }

    /**
     * This method sets the soap server object on all the observers
     * @access public
     */
    public function setObservers() {
        global $observers;
        if(!empty($observers)){
            foreach($observers as $observer) {
                if(method_exists($observer, 'set_soap_server')) {
                    $observer->set_soap_server($this->server);
                }
            }
        }
    }

    /**
     * This method returns the soapURL
     *
     * @return String - soapURL
     * @access public
     */
    public function getSoapURL(){
        return $this->soapURL;
    }

    public function getSoapVersion(){
        return $this->soap_version;
    }

    /**
     * This method returns the namespace
     *
     * @return String - namespace
     * @access public
     */
    public function getNameSpace(){
        return $this->namespace;
    }

    /**
     * This mehtod returns registered implementation class
     *
     * @return String - implementationClass
     * @access public
     */
    public function getRegisteredImplClass() {
        return $this->implementationClass;
    }

    /**
     * This mehtod returns registry class
     *
     * @return String - registryClass
     * @access public
     */
    public function getRegisteredClass() {
        return $this->registryClass;
    }

    /**
     * This mehtod returns server
     *
     * @return String -server
     * @access public
     */
    public function getServer() {
        return $this->server;
    }

    /**
     * Fallback function to catch unexpected failure in SOAP
     */
    public function shutdown()
    {
        if ($this->in_service) {
            $out = ob_get_contents();
            ob_end_clean();
            LoggerManager::getLogger()->info('NusoapSoap->shutdown: service died unexpectedly');
            $this->server->fault(-1, "Unknown error in SOAP call: service died unexpectedly", '', $out);
            $this->server->send_response();
            $this->generateLogEntry();
            $this->updateLogEntry();
            $this->writeLog();
        }
    }

    /**
     * It passes request data to NUSOAP server and sends response back to client
     * @access public
     */
    public function serve()
    {
        $this->startingTime = $GLOBALS['soapstart'] ?: microtime(true);
        LoggerManager::getLogger()->info('Begin: NusoapSoap->serve');
        ob_clean();
        $this->in_service = true;
        register_shutdown_function([$this, "shutdown"]);
        ob_start();
        $this->server->service($GLOBALS['HTTP_RAW_POST_DATA']);
        $this->generateLogEntry();
        $this->updateLogEntry();
        $this->writeLog();
        $this->in_service = false;
        ob_end_flush();
        flush();
        LoggerManager::getLogger()->info('End: NusoapSoap->serve');
    }

    /**
     * This method registers all the functions which you want to be available for SOAP.
     *
     * @param array $excludeFunctions - All the functions you don't want to register
     */
    public function register($excludeFunctions = []){
        LoggerManager::getLogger()->info('Begin: SugarSoapService2->register');
        $this->excludeFunctions = $excludeFunctions;
        $registryObject = new $this->registryClass($this);
        $registryObject->register();
        $this->excludeFunctions = [];
        LoggerManager::getLogger()->info('End: SugarSoapService2->register');
    }

    /**
     * This method registers all the complex type with NUSOAP server so that proper WSDL can be generated
     *
     * @param String $name - name of complex type
     * @param String $typeClass - (complexType|simpleType|attribute)
     * @param String $phpType - array or struct
     * @param String $compositor - (all|sequence|choice)
     * @param String $restrictionBase - SOAP-ENC:Array or empty
     * @param Array $elements - array ( name => array(name=>'',type=>'') )
     * @param Array $attrs - array(array('ref'=>'SOAP-ENC:arrayType','wsdl:arrayType'=>'xsd:string[]'))
     * @param String $arrayType - arrayType: namespace:name (xsd:string)
     * @access public
     */
    public function registerType($name, $typeClass, $phpType, $compositor, $restrictionBase, $elements, $attrs = [], $arrayType = '')
    {
        $this->server->wsdl->addComplexType($name, $typeClass, $phpType, $compositor, $restrictionBase, $elements, $attrs, $arrayType);
    }

    /**
     * This method registers all the functions you want to expose as services with NUSOAP
     *
     * @param String $function - name of the function
     * @param Array $input - assoc array of input values: key = param name, value = param type
     * @param Array $output - assoc array of output values: key = param name, value = param type
     * @access public
     */
    function registerFunction($function, $input, $output)
    {
        if (in_array($function, $this->excludeFunctions)) return;
        $use = false;
        $style = false;
        if (isset($_REQUEST['use']) && ($_REQUEST['use'] == 'literal')) {
            $use = "literal";
        } // if
        if (isset($_REQUEST['style']) && ($_REQUEST['style'] == 'document')) {
            $style = "document";
        } // if
        $this->server->register($function, $input, $output, $this->getNameSpace(), '', $style, $use);
    }

    /**
     * This function registers implementation class name with NUSOAP so when NUSOAP makes a call to a funciton,
     * it will be made on this class object
     *
     * @param String $implementationClass
     * @access public
     */
    function registerImplClass($implementationClass)
    {
        LoggerManager::getLogger()->info('Begin: NusoapSoap->registerImplClass');
        if (empty($implementationClass)) {
            $implementationClass = $this->implementationClass;
        } // if
        $this->server->register_class($implementationClass);
        LoggerManager::getLogger()->info('End: NusoapSoap->registerImplClass');
    }

    /**
     * Sets the name of the registry class
     *
     * @param String $registryClass
     * @access public
     */
    function registerClass($registryClass)
    {
        LoggerManager::getLogger()->info('Begin: NusoapSoap->registerClass');
        $this->registryClass = $registryClass;
        LoggerManager::getLogger()->info('End: NusoapSoap->registerClass');
    }

    /**
     * This function sets the fault object on the NUSOAP
     *
     * @param SoapError $errorObject - This is an object of type SoapError
     * @access public
     */
    public function error($errorObject)
    {
        LoggerManager::getLogger()->info('Begin: NusoapSoap->error');
        $this->server->fault($errorObject->getFaultCode(), $errorObject->getName(), '', $errorObject->getDescription());
        LoggerManager::getLogger()->info('Begin: NusoapSoap->error');
    }

    private function generateLogEntry()
    {
        $this->logEntry = new \stdClass();

        $this->logEntry->route = $this->server->methodname;
        $this->logEntry->method = 'SOAP';
        $this->logEntry->args = $this->server->methodparams;
        $this->logEntry->url = $this->server->SOAPAction;
        $this->logEntry->ip = $_SERVER['REMOTE_ADDR'];
        $this->logEntry->request_params = "";
        $this->logEntry->request_headers = json_encode($this->server->headers);
        $this->logEntry->request_body = $GLOBALS['HTTP_RAW_POST_DATA'];
        $this->logEntry->date_entered = gmdate('Y-m-d H:i:s');
        $this->logEntry->date_timestamp = APILogEntryHandler::getTimestamp();

        // $current_user is an empty beansobject if the current route doesn't need any authentication...
        $this->logEntry->user_id = "";
        // and session is also missing!
        $this->logEntry->session_id = session_id();
        $this->logEntry->transaction_id = $GLOBALS['transactionID'];
        $this->logEntry->direction = \SpiceCRM\includes\Middleware\LoggerMiddleware::DIRECTION_INBOUND;

        $this->buildLogTables();
    }

    /**
     * writes the log
     *
     * @return void
     */
    private function writeLog()
    {
        if (count($this->logtables) > 0) {
            $db = DBManagerFactory::getInstance('spicelogger');
            $this->logEntry->id = SpiceUtils::createGuid();
            foreach ($this->logtables as $lt) {
                $db->insertQuery($lt, (array)$this->logEntry);
            }
        }
    }

    /**
     * builds the log entries reading the config
     *
     * @return void
     * @throws \Exception
     */
    private function buildLogTables(){
        $spice_config = SpiceConfig::getInstance()->config;
        if($spice_config['system']['no_table_exists_check'] === true || DBManagerFactory::getInstance()->tableExists('sysapilogconfig')){
            // check if this request has to be logged by some rules...
            $sql = "SELECT count(id) cnt, logtable FROM sysapilogconfig WHERE
              (route = '{$this->logEntry->route}' OR route = '*' OR '{$this->logEntry->route}' LIKE route) AND
              (method = '{$this->logEntry->method}' OR method = '*') AND
              (user_id = '{$this->logEntry->user_id}' OR user_id = '*') AND
              (ip = '{$this->logEntry->ip}' OR ip = '*') AND
              is_active = 1 GROUP BY logtable";
            $res = DBManagerFactory::getInstance()->query($sql);
            while($row = DBManagerFactory::getInstance()->fetchByAssoc($res)){
                if(array_search($row['logtable'] ?: 'sysapilog', $this->logtables) === false) $this->logtables[] = $row['logtable'] ?: 'sysapilog';
            }
        }
    }

    /**
     * updates the log entry
     *
     * @param $save set to true to also write the record to the db
     * @return void
     */
    private function updateLogEntry()
    {
        if (count($this->logtables) > 0) {
            $this->logEntry->user_id = \SpiceCRM\includes\authentication\AuthenticationController::getInstance()->getCurrentUser()->id;
            $this->logEntry->http_status_code = $this->extractHttpCode($this->server->outgoing_headers[0]);
            $this->logEntry->response_headers = $this->buildResponseHeader();
            $this->logEntry->runtime = (microtime(true) - $this->startingTime) * 1000;
            $this->logEntry->response_body = $this->server->responseSOAP ?: $this->server->response;
        }
    }

    /**
     * builds an associative array from the headers
     * @return false|string
     */
    private function buildResponseHeader()
    {
        $headers = [];
        foreach ($this->server->outgoing_headers as $header) {
            $h = explode(':', $header);
            $headers[$h[0]] = $h[1];
        }
        return json_encode($headers);
    }

    private function extractHttpCode($header): int
    {
        $headerParts = explode(' ', $header);
        return (int)$headerParts[1] ?: '200';
    }
}
