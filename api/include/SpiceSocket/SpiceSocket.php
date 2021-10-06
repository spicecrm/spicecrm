<?php
namespace SpiceCRM\includes\SpiceSocket;

use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SpiceSocket
{
    private $ssl_verifyhost = false;
    private $ssl_verifypeer = false;

    private $inTransaction = false;

    private $NotificationsBuffer = [];

    /**
     * holds an instance of this class for singleton use
     * @var null
     */
    private static $instance = null;
    /**
     * return the self instance for singleton use
     * @return SpiceSocket
     */
    static function getInstance(): SpiceSocket
    {
        if (self::$instance === null) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    /**
     * starts a transaction that will ensure all emitted events are buffered and sent whenthe transaction completes
     */
    public function startTransaction(){
        $this->inTransaction= true;
    }

    /**
     * commits the transactionand sends the events
     */
    public function commitTransaction(){
        // set the transaction to false
        $this->inTransaction= false;

        // process all entries
        // ToDo: make this handeld in bulk in one call
        foreach($this->NotificationsBuffer as $event){
            $this->emit($event['namespace'],$event['event'],$event['room'],$event['data']);
        }

        // reset the notification buffer
        $this->NotificationsBuffer = [];
    }

    /**
     * resets the Notification Buffer and prevents any notfications being commited from the transaction
     */
    public function rollbackTransaction(){
        // set the transaction to false
        $this->inTransaction= false;

        // reset the notification buffer
        $this->NotificationsBuffer = [];
    }

    /**
     * emits a message to a specific room to the NodeJs server backend listener to broadcast the message to the frontend
     * namespace must not start with "/"
     * @param $namespace
     * @param $event
     * @param $room
     * @param $data
     */
    public function emit($namespace, $event, $room, $data)
    {

        $coreConfig = SpiceConfig::getInstance()->config['core'];

        if (empty($coreConfig['socket_id']) || empty($coreConfig['socket_backend'])) {
            return;
        }

        // if we are ina  zransaction collect the events and return
        if($this->inTransaction){
            $this->NotificationsBuffer[] = [
                'namespace' => $namespace,
                'event' => $event,
                'room' => $room,
                'data' => $data,
            ];
            return;
        }

        $body = [
            'sysId' => $coreConfig['socket_id'],
            'room' => $room,
            'data' => $data,
            'event' => $event,
            'namespace' => $namespace
        ];

        $curl = curl_init();

        $curlOptions = [
            CURLOPT_SSL_VERIFYPEER => $this->ssl_verifypeer,
            CURLOPT_SSL_VERIFYHOST => $this->ssl_verifyhost,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_CONNECTTIMEOUT => 1,
            CURLOPT_TIMEOUT => 2,
            CURLOPT_URL => $coreConfig['socket_backend'],
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => json_encode($body),
            CURLOPT_HEADER => 1,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
            ]
        ];
        curl_setopt_array($curl, $curlOptions);

        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, 'socket');

        $response = curl_exec($curl);

        /**
        $info = curl_getinfo($curl);

        $debugPath = __CLASS__ . '::' . __FUNCTION__ . ' line ' . __LINE__;
        $debugMessageUrl = "$debugPath url per POST " . print_r($coreConfig['socket_backend'], true);
        LoggerManager::getLogger()->debug($debugMessageUrl);
        LoggerManager::getLogger()->debug("$debugPath response" . print_r($response, true));
        LoggerManager::getLogger()->debug("$debugPath info" . print_r($info, true));
        */

        $logEntryHandler->updateOutgoingLogEntry($curl, $response);
        $logEntryHandler->writeOutogingLogEntry();

        if (!$response) {
            $info = curl_getinfo($curl);
            $debugPath = __CLASS__ . '::' . __FUNCTION__ . ' line ' . __LINE__;
            $debugMessageUrl = "$debugPath url per POST " . print_r($coreConfig['socket_backend'], true);
            LoggerManager::getLogger()->fatal($debugMessageUrl);
            LoggerManager::getLogger()->fatal("$debugPath ERROR info" . print_r($info, true));
        }

        curl_close($curl);
    }
}