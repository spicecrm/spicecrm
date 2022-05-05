<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\Logger;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Mailboxes\Mailbox;
use Swift_Message;

class APILogEntryHandler
{
    private $logEntry;
    private $startingTime;

    private $responseWithHeaders = false;

    private $logtables = [];

    const DIRECTION_INBOUND  = 'I';
    const DIRECTION_OUTBOUND = 'O';

    static function getTimestamp(){
        $thisMS = round(microtime() * 1000);
        while (strlen($thisMS) < 3) {
            $thisMS = '0' . $thisMS;
        }

        return   time() . $thisMS;
    }

    /**
     * Generates the log entry from the curl options.
     *
     * @param array $curlOptions
     * @param string $route
     * @param $transactionId - optional pass a transaction ID in if you want to override the global one for the log
     */
    public function generateOutgoingLogEntry(array $curlOptions, string $route, string $transactionId = null): void {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $this->startingTime = microtime(true);

        $this->logEntry = new \stdClass();
        $this->logEntry->url = $curlOptions[CURLOPT_URL];
        $this->logEntry->method = $this->extractRestMethod($curlOptions);
        $this->logEntry->route = $route; // it is just an arbitrary string for the outgoing requests
        $this->logEntry->ip = $_SERVER['SERVER_ADDR'];
        $this->logEntry->request_headers = self::headerArrayToJson($curlOptions[CURLOPT_HTTPHEADER]);
        $this->logEntry->request_body = is_array($curlOptions[CURLOPT_POSTFIELDS]) ? json_encode($curlOptions[CURLOPT_POSTFIELDS]) : $curlOptions[CURLOPT_POSTFIELDS];
        $this->logEntry->date_entered = gmdate('Y-m-d H:i:s');
        $this->logEntry->date_timestamp   = self::getTimestamp();

        $this->responseWithHeaders = $curlOptions[CURLOPT_HEADER] == 1;

        $this->logEntry->user_id = $currentUser->id;
        $this->logEntry->session_id = session_id();
        $this->logEntry->transaction_id = $transactionId ?: LoggerManager::getLogger()->getTransactionId();
        $this->logEntry->direction = self::DIRECTION_OUTBOUND;
    }

    /**
     * Generates the log entry for an SMTP request.
     *
     * @param Swift_Message $message
     * @param Mailbox $mailbox
     * @param string $route
     * @param string|null $transactionId
     */
    public function generateSmtpLogEntry(Swift_Message $message, Mailbox $mailbox, string $route, string $transactionId = null): void {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $this->startingTime = microtime(true);

        $this->logEntry = new \stdClass();
        $this->logEntry->url = $mailbox->smtp_host . ':' . $mailbox->smtp_port;
        $this->logEntry->method = 'smtp';
        $this->logEntry->route = $route; // it is just an arbitrary string for the outgoing requests
        $this->logEntry->ip = $_SERVER['SERVER_ADDR'];
        $this->logEntry->request_headers = null;
        $this->logEntry->request_body = $message->toString();
        $this->logEntry->date_entered = gmdate('Y-m-d H:i:s');
        $this->logEntry->date_timestamp   = self::getTimestamp();

        $this->responseWithHeaders = false;

        $this->logEntry->user_id = $currentUser->id;
        $this->logEntry->session_id = session_id();
        $this->logEntry->transaction_id = $transactionId ?: LoggerManager::getLogger()->getTransactionId();
        $this->logEntry->direction = self::DIRECTION_OUTBOUND;
    }

    /**
     * converts a header array to JSON
     *
     * @param $header
     */
    static function headerArrayToJson($headers){
        $retArray = [];
        foreach($headers as $header){
            $h = explode(':', $header);
            $retArray[trim($h[0])] = trim($h[1]);
        }
        return json_encode($retArray);
    }

    /**
     * Checks the config table wether or not the request should be logged.
     * And depending on the results logs the request or not.
     *
     * @param bool $force if set to true forces the entry to be written
     * @param $logtable if force is set a logtable to write to can be specified. If force is not set this is ignored
     *
     * @return void
     * @throws \Exception
     */
    public function writeOutogingLogEntry(bool $force = false, $logtable = ''): void {
        $spice_config = SpiceConfig::getInstance()->config;

        if($force === true ?? $logtable){
            $this->logtables[] = $logtable;
        }

        if (!$force && ($spice_config['system']['no_table_exists_check'] === true || DBManagerFactory::getInstance()->tableExists('sysapilogconfig'))) {
            // build the subroute matches by exploding it, then removing the last part and building the string going forward
            $routeparts = explode('/', $this->logEntry->route);
            // pop the last entry (this is then the full route
            array_pop($routeparts);
            $routematches = ["route = '*'"];
            $routematchString = '';
            foreach ($routeparts as $routepart) {
                // we might get an empty entry
                if(empty($routepart)) continue;
                // build the string gradually
                $routematchString .= '/' . $routepart;
                $routematches[] = "route = '{$routematchString}/*'";
            }
            $routematches[] = "route = '{$this->logEntry->route}'";
            $routeWhere = '(' . implode(' OR ', $routematches) . ')';


            // check if this request has to be logged by some rules...
            $sql = "SELECT count(id) cnt, logtable FROM sysapilogconfig WHERE $routeWhere AND (method = '{$this->logEntry->method}' OR method = '*') AND (user_id = '{$this->logEntry->user_id}' OR user_id = '*') AND (ip = '{$this->logEntry->ip}' OR ip = '*') AND is_active = 1 GROUP BY logtable";
            $res = DBManagerFactory::getInstance()->query($sql);
            while($row = DBManagerFactory::getInstance()->fetchByAssoc($res)){
                if(array_search($row['logtable'] ?: 'sysapilog',$this->logtables) === false) $this->logtables[] = $row['logtable'] ?: 'sysapilog';
            }
        }

        // write the log
        if(count($this->logtables) > 0){
            $this->logging = true;
            $this->logEntry->id = SpiceUtils::createGuid();
            foreach ($this->logtables as $lt) {
                DBManagerFactory::getInstance('spicelogger')->insertQuery($lt, (array)$this->logEntry);
            }
        }
    }

    /**
     * An alias for uniformity reasons.
     *
     * @param bool $force
     * @throws \Exception
     */
    public function writeSmtpLogEntry(bool $force = false): void {
        $this->writeOutogingLogEntry($force);
    }

    /**
     * Updates the log entry after the response has been received.
     *
     * @param $curl
     * @param $response
     * @param $transactionId - optional pass a transaction ID in if you want to override the current one
     */
    public function updateOutgoingLogEntry($curl, $response, string $transactionId = null): void {

        $error = curl_error($curl);
        $info = curl_getinfo($curl);

        $this->logEntry->http_status_code = $info['http_code'];
        $this->logEntry->runtime = (microtime(true) - $this->startingTime)*1000;

        if($this->responseWithHeaders) {
            $header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
            $response_header = substr($response, 0, $header_size);
            $response_body = substr($response, $header_size);

            $this->logEntry->response_body = $response_body;
            $this->logEntry->response_headers = self::responseHeaders2Json($response_header);
        } else {
            $this->logEntry->response_body = $response;
        }

        $this->logEntry->response_error = $error;

        if ($transactionId) {
            $this->logEntry->transaction_id = $transactionId;
        }

        // update the log...
        foreach ($this->logtables as $lt) {
            DBManagerFactory::getInstance('spicelogger')->updateQuery($lt, ['id' => $this->logEntry->id], (array)$this->logEntry);
        }
    }

    /**
     * Updates the log entry after the SMTP response has been received.
     *
     * @param $response
     * @param string|null $transactionId
     */
    public function updateSmtpLogEntry($response, string $transactionId = null): void {
        $this->logEntry->runtime = (microtime(true) - $this->startingTime) * 1000;

        if ($response instanceof \Exception) {
            $this->logEntry->response_error   = $response->getMessage();
            $this->logEntry->http_status_code = $response->getCode();
        } else {
            $this->logEntry->response_body    = json_encode($response);
            $this->logEntry->http_status_code = null;
        }

        if ($transactionId) {
            $this->logEntry->transaction_id = $transactionId;
        }
    }

    static function responseHeaders2Json($headers){
        $headersArray = [];
        $ha = explode("\r\n", $headers);
        foreach($ha as $he){
            $h = explode(': ', $he);
            if(count($h) == 2){
                $headersArray[trim($h[0])] = trim($h[1]);
            }
        }
        return json_encode($headersArray);
    }

    /**
     * Extract the REST method out of the curl options.
     *
     * @param array $curlOptions
     * @return string
     */
    private function extractRestMethod(array $curlOptions): string {
        if (isset($curlOptions[CURLOPT_CUSTOMREQUEST])) {
            return $curlOptions[CURLOPT_CUSTOMREQUEST];
        }

        if ($curlOptions[CURLOPT_POST]) {
            return 'POST';
        }

        return 'GET';
    }
}
