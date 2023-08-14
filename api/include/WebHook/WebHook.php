<?php
namespace SpiceCRM\includes\WebHook;

use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\APILogEntryHandler;


class WebHook
{

    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    private $webhooks;

    public final function __construct()
    {
        $db = DBManagerFactory::getInstance();
        $hooks = $db->query("SELECT * FROM syswebhooks");
        while($hook = $db->fetchByAssoc($hooks)) $this->webhooks[]=$hook;
    }

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return WebHook
     */
    static function getInstance()
    {
        if (self::$instance === null) {

            //set instance
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function callWebhook($event, $bean){
        // search in $this->webhooks for hook for module and event

        $hook = reset($this->webhooks);
        $event = array_search($hook['event'],$this->webhooks);

        // if successful
        $this->makeCall($hook, $bean);
    }

   public function makeCall($hook, $bean)
   {
       // todo queue webhook calls

       $body = [
           'id' => $bean->id,
           'module' => $bean->_module,
           'event' => $hook['webHook']['event'],
       ];

       if($hook['webHook']['send_data']){
           $body['data'] = (new SpiceBeanHandler())->mapBean($bean);
       }

       $curl = curl_init();
       $curlOptions = [
           CURLOPT_SSL_VERIFYPEER => $hook['webHook']['ssl_verifypeer'],
           CURLOPT_SSL_VERIFYHOST => $hook['webHook']['ssl_verifyhost'],
           CURLOPT_RETURNTRANSFER => true,
           CURLOPT_URL            => $hook['webHook']['url'],
           CURLOPT_POST           => true,
           CURLOPT_POSTFIELDS     => json_encode($body),
           CURLOPT_HEADER         => 1,
           CURLOPT_HTTPHEADER     => [
               'Content-Type:application/json',
               //$customHeader
           ],
       ];
       curl_setopt_array($curl, $curlOptions);
       $logEntryHandler = new APILogEntryHandler();
       $logEntryHandler->generateOutgoingLogEntry($curlOptions, '/system/webhook');
       $logEntryHandler->writeOutogingLogEntry();
       $response = curl_exec($curl);
       $logEntryHandler->updateOutgoingLogEntry($curl, $response);
       $errors = curl_error($curl);
       $info = curl_getinfo($curl);
       curl_close($curl);

       if ($info['http_code'] < 300 && $info['http_code'] >= 200) {
           return ['success' => true, 'output' => $info['http_code']];
       }
//        throw new Exception($response, $info['http_code']);
       return ['success' => false, 'output' => $info['http_code']];
   }
}