<?php
namespace SpiceCRM\modules\Accounts\api\controllers;

use SimpleXMLElement;
use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;


class AccountsVIESController{

    /**
     * get the response of an url
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     */
    public function getVatResponse(Request $req, Response $res, array $args): Response {
        $countryCode = substr($args['vatid'], 0, 2);
        $vatNumber = substr($args['vatid'], 2);

        $soapUrl = "http://ec.europa.eu/taxation_customs/vies/services/checkVatService"; // asmx URL of WSDL

        // xml post structure
        $xml_post_string = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types"><soapenv:Header/><soapenv:Body><urn:checkVat><urn:countryCode>' . $countryCode . '</urn:countryCode><urn:vatNumber>' . $vatNumber . '</urn:vatNumber></urn:checkVat></soapenv:Body></soapenv:Envelope>';

        $headers = [
            "Content-type: text/xml;charset=\"utf-8\"",
            "Accept: text/xml",
            "Cache-Control: no-cache",
            "Pragma: no-cache",
            "Content-length: " . strlen($xml_post_string),
        ];

        $url = $soapUrl;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $xml_post_string);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        // converting
        $response = curl_exec($ch);
        curl_close($ch);

        if ($response !== false) {
            // convertingc to XML
            $patterns = array ('/(<\/env:.[^>]*>)/', '(<env:.[^>]*>)', '/(<\/SOAP-ENV:.[^>]*>)/', '(<SOAP-ENV:.[^>]*>)', '/ns2:/');
            $replace = array("", "", "", "", "");
            $response = preg_replace($patterns, $replace, $response);
            $result = new SimpleXMLElement($response);
            $responseArray = [
                'status' => 'success',
                'data' => [
                    'countrycode' => (string)$result->countryCode,
                    'vatnumber' => (string)$result->vatNumber,
                    'vatid' => (string)$result->countryCode . (string)$result->vatNumber,
                    'valid' => filter_var((string)$result->valid, FILTER_VALIDATE_BOOLEAN),
                    'name' => (string)$result->name,
                    'address' => (string)$result->address,
                    'requestdate' => substr((string)$result->requestDate, 0, 10)
                ]
            ];
        } else {
            $responseArray = [
                'status' => 'error'
            ];
        }
        return $res->withJson($responseArray);
    }
}