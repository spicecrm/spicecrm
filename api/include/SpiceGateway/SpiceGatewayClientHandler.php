<?php

namespace SpiceCRM\includes\SpiceGateway;

use Exception;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SpiceGatewayClientHandler
{
    /**
     * pass the email template data to the gateway server
     * @param array $recipients
     * @param string $type
     * @param array $data
     * @param string|null $language
     * @return object
     * @throws Exception
     */
    public static function sendTemplateTypeEmail(array $recipients, string $type, array $data, ?string $language): object
    {
        if (!$language) {
            $language = SpiceLanguageManager::getInstance()->getSystemDefaultLanguage() ?? 'en_us';
        }

        $payload = [
            'type' => $type,
            'data' => $data,
            'recipients' => $recipients,
            'language' => $language
        ];

        return self::postRequest($payload, 'email/template/send');
    }

    /**
     * pass the sms template data to the gateway server
     * @param string $phoneNumber
     * @param string $type
     * @param array $data
     * @param string $language
     * @return object
     * @throws Exception
     */
    public static function sendTemplateTypeSMS(string $phoneNumber, string $type, array $data, ?string $language): object
    {
        if (!$language) {
            $language = SpiceLanguageManager::getInstance()->getSystemDefaultLanguage() ?? 'en_us';
        }

        $payload = [
            'type' => $type,
            'data' => $data,
            'phoneNumber' => $phoneNumber,
            'language' => $language
        ];

        return self::postRequest($payload, 'sms/template/send');
    }

    /**
     * pass the sendEmail action to the gateway server
     * @param array $message
     * @return object
     */
    public static function sendEmail(array $message): object
    {
        try {
            $response = self::postRequest($message, 'email/send');
            return (object) ['result' => true, 'id' => $response->id];
        } catch (Exception $exception) {
            return (object)['result' => false, 'error' => $exception->getMessage()];
        }
    }

    /**
     * pass the sendSMS action to the gateway server
     * @param array $message
     * @return object
     */
    public static function sendSMS(array $message): object
    {
        try {
            $response = self::postRequest($message, 'sms/send');
            return (object) ['result' => true, 'id' => $response->id];
        } catch (Exception $exception) {
            return (object)['result' => false, 'error' => $exception->getMessage()];
        }
    }

    /**
     * POST request to the gateway server
     * @param array|null $payload
     * @param string $route
     * @return object|bool
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    private static function postRequest(?array $payload, string $route): object|bool
    {
        $domain = SpiceConfig::getInstance()->get('system.gateway_server_domain');
        $apiKey = SpiceConfig::getInstance()->get('system.gateway_server_api_key');
        $sslVerify = SpiceConfig::getInstance()->get('system.gateway_server_ssl_verify');

        if (!$domain || !$apiKey) {
            throw new \SpiceCRM\includes\ErrorHandlers\Exception('Gateway Server not configured properly.');
        }

        $curl = curl_init();

        $options = [
            CURLOPT_URL => "$domain/api/channels/gateway/$route",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_POSTFIELDS => json_encode($payload ?? []),
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_SSL_VERIFYHOST => $sslVerify == 1,
            CURLOPT_SSL_VERIFYPEER => $sslVerify == 1,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                "oauth-token: $apiKey",
                "oauth-issuer: APIKey"
            ],
        ];

        curl_setopt_array($curl, $options);

        $logger = new APILogEntryHandler();
        $logger->generateOutgoingLogEntry($options, 'gateway');

        $response = json_decode(curl_exec($curl));

        $logger->updateOutgoingLogEntry($curl, $response);
        $logger->writeOutogingLogEntry();

        $info = curl_getinfo($curl);

        if ($info['http_code'] >= 400) {
            throw new \SpiceCRM\includes\ErrorHandlers\Exception("Gateway Server Error: {$response->error->message}", $response->error->code);
        }

        # empty response return true on success
        if (!$response && $info['http_code'] >= 200) {
            $response = true;
        }

        curl_close($curl);

        return $response;
    }
}