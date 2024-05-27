<?php

namespace SpiceCRM\modules\Accounts;


use SpiceCRM\includes\Logger\APILogEntryHandler;
use SimpleXMLElement;

/**
 * a helper class that checkts VAT IDs with the European Union VIE WebService
 */
class AccountVIESCheck
{

    public $lastError;

    /**
     * runs the VAT check
     *
     * @param $uid
     * @return void
     */
    public function checkUID($uid)
    {
        $countryCode = substr($uid, 0, 2);
        $vatNumber = substr($uid, 2);

        $url = "http://ec.europa.eu/taxation_customs/vies/services/checkVatService";

        // xml post structure
        $xml_post_string = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types"><soapenv:Header/><soapenv:Body><urn:checkVat><urn:countryCode>' . $countryCode . '</urn:countryCode><urn:vatNumber>' . $vatNumber . '</urn:vatNumber></urn:checkVat></soapenv:Body></soapenv:Envelope>';

        // build the options
        $curlOptions = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $xml_post_string,
            CURLOPT_HEADER => 1,
            CURLOPT_HTTPHEADER => [
                "Content-type: text/xml;charset=\"utf-8\"",
                "Accept: text/xml",
                "Cache-Control: no-cache",
                "Pragma: no-cache",
                "Content-length: " . strlen($xml_post_string),
            ]
        ];

        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, "/vies/services/checkVatService");

        $ch = curl_init();
        curl_setopt_array($ch, $curlOptions);

        // converting
        $response = curl_exec($ch);
        $this->lastError = curl_error($ch);
        curl_close($ch);

        $logEntryHandler->updateOutgoingLogEntry($ch, $response);
        $logEntryHandler->writeOutogingLogEntry();

        if ($response !== false) {
            // convertingc to XML
            $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            $patterns = array('/(<\/env:.[^>]*>)/', '(<env:.[^>]*>)', '/(<\/SOAP-ENV:.[^>]*>)/', '(<SOAP-ENV:.[^>]*>)', '/ns2:/');
            $replace = array("", "", "", "", "");
            $xmlContent = preg_replace($patterns, $replace, substr($response, $header_size));
            $result = new SimpleXMLElement($xmlContent);
            return [
                'countrycode' => (string)$result->countryCode,
                'vatnumber' => (string)$result->vatNumber,
                'vatid' => (string)$result->countryCode . (string)$result->vatNumber,
                'valid' => filter_var((string)$result->valid, FILTER_VALIDATE_BOOLEAN),
                'name' => (string)$result->name,
                'address' => (string)$result->address,
                'requestdate' => substr((string)$result->requestDate, 0, 10)
            ];
        }

        return false;
    }


}