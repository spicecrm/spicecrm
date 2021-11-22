<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

namespace SpiceCRM\includes\Logger;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Mailboxes\Mailbox;
use Swift_Message;

class APILogEntryHandler
{
    private $logEntry;
    private $startingTime;
    private $logging = false;

    private $responseWithHeaders = false;

    const DIRECTION_INBOUND  = 'I';
    const DIRECTION_OUTBOUND = 'O';

    static function getTimestamp(){
        if(function_exists('hrtime' && 1 == 2)) {
            return  hrtime(true);
        } else {
            $thisMS = round(microtime() * 1000);
            while (strlen($thisMS) < 3)
                $thisMS = '0' . $thisMS;

            return   time() . $thisMS;
        }
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
     * Checks the config table whether or not should the request be logged.
     * And depending on the results logs the request or not.
     *
     * @throws \Exception
     */
    public function writeOutogingLogEntry(bool $force = false): void {
        $this->logging = false;
        $logEntry = false;
        if (!$force && DBManagerFactory::getInstance()->tableExists('sysapilogconfig')) {
            // check if this request has to be logged by some rules...
            $sql = "SELECT COUNT(id) cnt FROM sysapilogconfig WHERE
              (route = '{$this->logEntry->route}' OR route = '*' OR '{$this->logEntry->route}' LIKE route) AND
              (method = '{$this->logEntry->method}' OR method = '*') AND
              (user_id = '{$this->logEntry->user_id}' OR user_id = '*') AND
              (ip = '{$this->logEntry->ip}' OR ip = '*') AND
              is_active = 1";
            $res = DBManagerFactory::getInstance()->query($sql);
            $row = DBManagerFactory::getInstance()->fetchByAssoc($res);
            if ($row['cnt'] > 0) {
                $logEntry = true;
            }
        }

        // write the log
        if($force === true || $logEntry === true){
            $this->logging = true;
            $this->logEntry->id = SpiceUtils::createGuid();
            $id = DBManagerFactory::getInstance('spicelogger')->insertQuery('sysapilog', (array) $this->logEntry);
        }

        $this->logging = false;
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
        // $result = DBManagerFactory::getInstance()->updateQuery('sysapilog', ['id' => $this->logEntry->id], (array) $this->logEntry);
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
