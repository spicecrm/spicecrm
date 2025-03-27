<?php

namespace SpiceCRM\includes\TXControlEditor;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SpiceSingleton;
use SpiceCRM\includes\SpiceTemplateCompiler\Compiler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;

class TXControlHandler extends SpiceSingleton
{
    /**
     * holds the token
     * @var null|object
     */
    private ?object $token = null;
    /**
     * parse content replace the placeholders with the bean values
     * @param string $pdfContent
     * @param string $format
     * @param SpiceBean $bean
     * @return string
     * @throws Exception
     */
    public function parse(string $pdfContent, string $format, SpiceBean $bean): string
    {
        $config = (object) SpiceConfig::getInstance()->get('DocXEditor');

        $info = $this->getDocumentInfo($pdfContent);

        $token = $this->getToken();

        $payload = [
            "mergeData" => [(object)[]],
            "template" => $pdfContent,
        ];

        $compiler = new Compiler(null);
        $compiler->app_list_strings = SpiceUtils::returnAppListStringsLanguage();

        foreach ($info->mergeFields as $field) {
            $parsedBlock = $compiler->compileblock("{{$field->name}}", ['bean' => $bean]);
            $payload['mergeData'][0]->{$field->name} = $parsedBlock;
        }

        $curl = curl_init();

        $curlOptions = [
            CURLOPT_URL => "$config->serverUrl/documentprocessing/document/merge?returnFormat=$format",
            CURLOPT_POST => 1,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => 1,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                "Authorization: Bearer " . $token->access_token,
            ]
        ];

        curl_setopt_array($curl, $curlOptions);
        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, 'txcontrol');

        $result = curl_exec($curl);
        $info = curl_getinfo($curl);

        $logEntryHandler->updateOutgoingLogEntry($curl, $result);
        $logEntryHandler->writeOutogingLogEntry();

        if (!$result || $info['http_code'] != 200) {
            throw new Exception('DocXEditor failed to process document');
        }

        return json_decode(substr($result, $info['header_size']))[0];
    }

    /**
     * parse content replace the placeholders with the bean values
     * @param string $pdfContent
     * @return object
     * @throws Exception
     */
    public function getDocumentInfo(string $pdfContent): object
    {
        $config = (object) SpiceConfig::getInstance()->get('DocXEditor');

        $token = $this->getToken();

        $curl = curl_init();

        $curlOptions = [
            CURLOPT_URL => "$config->serverUrl/documentprocessing/document/info",
            CURLOPT_POST => 1,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => 1,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POSTFIELDS => json_encode($pdfContent),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                "Authorization: Bearer " . $token->access_token,
            ]
        ];

        curl_setopt_array($curl, $curlOptions);

        $result = curl_exec($curl);
        $info = curl_getinfo($curl);

        if (!$result || $info['http_code'] != 200) {
            throw new Exception('DocXEditor failed to process document');
        }

        return json_decode(substr($result, $info['header_size']));
    }

    /**
     * get TxControl access token
     * @return mixed
     * @throws Exception
     */
    public function getToken(): object
    {
        if ($this->token) {
            return $this->token;
        }

        $config = (object) SpiceConfig::getInstance()->get('DocXEditor');

        if (!$config->clientId || !$config->clientSecret || !$config->serverUrl || !$config->scriptUrl) {
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
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, 'txcontrol');

        $result = curl_exec($curl);
        $info = curl_getinfo($curl);

        $logEntryHandler->updateOutgoingLogEntry($curl, $result);
        $logEntryHandler->writeOutogingLogEntry();

        if (!$result || $info['http_code'] != 200) {
            throw new Exception('DocXEditor failed to obtain access token');
        }

        $this->token = json_decode(substr($result, $info['header_size']));

        return $this->token;
    }
}