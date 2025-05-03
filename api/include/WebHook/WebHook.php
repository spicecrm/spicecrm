<?php

namespace SpiceCRM\includes\WebHook;

use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SpiceCache\SpiceCache;


class WebHook
{

    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    /**
     * the webhooks loaded
     *
     * @var array|false
     */
    private $webhooks;

    /**
     * indicates if we are in transactional mode
     *
     * @var bool
     */
    private $inTransaction = false;

    /**
     * the buffer for the hooks to be called
     *
     * @var array
     */
    private $HooksBuffer = [];


    /**
     * @var array the map of the hooks to be called
     *
     * [
     *  'module' => [
     *      'event' => [
     *          'id' => 'id',
     *          'module' => 'module',
     *          'event' => 'event',
     *          'url' => 'url',
     *          'ssl_verifypeer' => 'ssl_verifypeer',
     ]
     ]
     ]
     */
    private $hooksMap = [];

    public final function __construct()
    {
        $cached = SpiceCache::get('webhooks');
        if ($cached){
            $this->webhooks = $cached;
        } else {
            $this->webhooks = DBManagerFactory::getInstance()->fetchAll("SELECT * FROM syswebhooks") ?: [];
            SpiceCache::set('webhooks', $this->webhooks);
        }

        // map towards module and event
        foreach ($this->webhooks as $webhook) {
            if(!isset($this->hooksMap[$webhook['module']])) $this->hooksMap[$webhook['module']] = [];
            $this->hooksMap[$webhook['module']][$webhook['event']] = $webhook;
        }

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

    /**
     * sets the transaciton flag and starts Collecting Webhook Requests
     */
    public function startTransaction(){
        $this->inTransaction = true;
    }

    /**
     * commits the transaction and calls the Webhooks
     */
    public function commitTransaction(){
        // set the transaction to false
        $this->inTransaction= false;

        // process all entries
        foreach($this->HooksBuffer as $hook){
            // get the hook definition
            $hookDefinition = $this->hooksMap[$hook['module']][$hook['event']];

            // reload the bean enforcing retrieve
            $seed = BeanFactory::getBean($hook['module'], $hook['id'], ['forceRetrieve' => true], $hookDefinition['event'] == 'delete');

            // make the call
            $this->makeCall($hookDefinition, $seed, false);
        }

        // reset the notification buffer
        $this->HooksBuffer = [];
    }

    /**
     * call teh webhook resp when we are in a trsnaction just log the call and make the call later on
     *
     * @param $event
     * @param $bean
     * @return void
     */
    public function callWebhook($event, $bean)
    {
        if($this->hooksMap && isset($this->hooksMap[$bean->_module]) && isset($this->hooksMap[$bean->_module][$event])) {
            if($this->inTransaction) {
                $this->HooksBuffer[] = [
                    'event' => $event,
                    'module' => $bean->_module,
                    'id' => $bean->id
                ];
            } else {
                $this->makeCall($this->hooksMap[$bean->_module][$event], $bean, false);
            }
        }
    }

    public function makeCall($hook, $bean, $returnResponse = true)
    {
        $body = [
            'id' => $bean->id,
            'module' => $bean->_module,
            'event' => $hook['event'],
        ];

        if ($hook['send_data']) {
            $body['data'] = (new SpiceBeanHandler())->mapBean($bean);
        }
        // list($user, $pass) = explode(":", $hook['webHook']['custom_headers']);

        // build the custom headers
        $headers = [
            'Content-Type:application/json',
        ];
        $customHeaders = json_decode(html_entity_decode($hook['custom_headers']));
        foreach ($customHeaders as $customHeader) {
            $headers[] = "{$customHeader->name}:{$customHeader->value}";
        }

        $curl = curl_init();
        $curlOptions = [
            CURLOPT_SSL_VERIFYPEER => $hook['ssl_verifypeer'],
            CURLOPT_SSL_VERIFYHOST => $hook['ssl_verifyhost'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL => $hook['url'],
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($body),
            // CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
            CURLOPT_HEADER => 1,
            CURLOPT_HTTPHEADER => $headers
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

        if($returnResponse) {
            if ($info['http_code'] < 300 && $info['http_code'] >= 200) {
                return ['success' => true, 'output' => $info['http_code']];
            }

            return ['success' => false, 'output' => $info['http_code']];
        }
    }
}