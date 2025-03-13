<?php

namespace SpiceCRM\includes\TXControlEditor\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class TXControlEditorController
{
    /**
     * get the editor settings
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function getSettings(Request $req, Response $res, array $args): Response
    {
        $config = (object) SpiceConfig::getInstance()->get('DocXEditor');

        if (!$config->clientId || !$config->clientSecret || !$config->serverUrl) {
            throw new Exception('DocXEditor settings missing');
        }

        $payload = http_build_query([
            'grant_type' => 'client_credentials'
        ]);

        $curl = curl_init();

        $curlOptions = [
            CURLOPT_URL => "$config->serverUrl/oauth/token",
            CURLOPT_POST => 1,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => 1,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded',
                "Authorization: Basic " . base64_encode("{$config->clientId}:{$config->clientSecret}"),
            ]
        ];

        curl_setopt_array($curl, $curlOptions);
        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, 'oauth_fetch_token');

        $result = curl_exec($curl);
        $info = curl_getinfo($curl);

        $logEntryHandler->updateOutgoingLogEntry($curl, $result);
        $logEntryHandler->writeOutogingLogEntry();

        if (!$result || $info['http_code'] != 200) {
            throw new Exception('DocXEditor failed to obtain access token');
        }

        $result = json_decode(substr($result, $info['header_size']));

        return $res->withJson(['token' => $result->access_token, 'serverUrl' => $config->serverUrl]);
    }
}