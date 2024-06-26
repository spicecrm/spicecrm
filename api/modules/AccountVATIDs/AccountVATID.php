<?php

namespace SpiceCRM\modules\AccountVATIDs;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\modules\Accounts\AccountVIESCheck;
use SpiceCRM\modules\Accounts\api\controllers\AccountsVIESController;

class AccountVATID extends SpiceBean
{

    public function validate(){
        $response = (new AccountVIESCheck())->checkUID($this->name);
        if(!$response){
            $this->vatid_status = 'error';
        } else {
            $this->vatid_status = $response['valid'] ? 'valid' : 'invalid';
            $this->verification_details = json_encode($response);
        }

        return $this;
    }

    public function validate2(){

        $soapUrl = "http://ec.europa.eu/taxation_customs/vies/services/checkVatService"; // asmx URL of WSDL

        // xml post structure
        $xml_post_string = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types"><soapenv:Header/><soapenv:Body><urn:checkVat><urn:countryCode>' . $this->country . '</urn:countryCode><urn:vatNumber>' . $this->vat_id . '</urn:vatNumber></urn:checkVat></soapenv:Body></soapenv:Envelope>';

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
        $e = curl_error($ch);
        curl_close($ch);

        if ($response !== false) {
            // converting
            $response1 = str_replace("<soap:Body>", "", $response);
            $response2 = str_replace("</soap:Body>", "", $response1);

            // convertingc to XML
            $result = simplexml_load_string($response2);

            $this->viesresponse = $response;
            $this->vatid_status = (string)$result->checkVatResponse->valid ?: 'invalid';
            $this->verification_details = json_encode([
                    'countrycode' => (string)$result->checkVatResponse->countryCode,
                    'vatnumber' => (string)$result->checkVatResponse->vatNumber,
                    'vatid' => (string)$result->checkVatResponse->countryCode . (string)$result->checkVatResponse->vatNumber,
                    'valid' => $result->checkVatResponse->valid,
                    'name' => (string)$result->checkVatResponse->name,
                    'address' => (string)$result->checkVatResponse->address,
                    'requestdate' => substr((string)$result->checkVatResponse->requestDate, 0, 10)
            ]);
        } else {
            $this->vatid_status = 'error';
        }

        return $this;
    }
}