<?php

namespace SpiceCRM\includes\WebHook;

use SpiceCRM\data\api\handlers\SpiceBeanHandler;
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

    private $webhooks;

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

    public function callWebhook($event, $bean)
    {
        if($this->hooksMap && isset($this->hooksMap[$bean->_module]) && isset($this->hooksMap[$bean->_module][$event])) {
            // if successful fire the event
            $this->makeCall($this->hooksMap[$bean->_module][$event], $bean, false);
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