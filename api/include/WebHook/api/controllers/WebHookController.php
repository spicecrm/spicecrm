<?php

namespace SpiceCRM\includes\WebHook\api\controllers;
use Exception;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class WebHookController{

    /** retrieves a specific report and delivers an array of records containing their merchant id, merchant name and email address
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function callWebHooks($req, $res, $args)
    {
        $body = $req->getParsedBody();

        $url = $body['url'];
        $ssl_verifypeer = $body['ssl_verifypeer'];
        $ssl_verifyhost = $body['ssl_verifyhost'];
        $payload = json_encode($body);

        $curl = curl_init();
        $curlOptions = [
            CURLOPT_SSL_VERIFYPEER => $ssl_verifypeer,
            CURLOPT_SSL_VERIFYHOST => $ssl_verifyhost,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_URL            => $url,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_HEADER         => 1,
            CURLOPT_HTTPHEADER     => [
                'Content-Type:application/json',
            ],
        ];
        curl_setopt_array($curl, $curlOptions);
        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, '/system/webhooks');
        $logEntryHandler->writeOutogingLogEntry();
        $response = curl_exec($curl);
        $logEntryHandler->updateOutgoingLogEntry($curl, $response);
        $errors = curl_error($curl);
        $info = curl_getinfo($curl);
        curl_close($curl);

        if ($info['http_code'] < 300 && $info['http_code'] >= 200) {
            return $res->withJson(['success' => true]);
        }
//        throw new Exception($response, $info['http_code']);
            return $res->withJson(['success' => false]);
    }
}