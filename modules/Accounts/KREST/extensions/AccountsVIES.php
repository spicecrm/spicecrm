<?php

$app->get('/module/Accounts/VIES/:vatid', function ($vatid) use ($app) {

    $countryCode = substr($vatid, 0, 2);
    $vatNumber = substr($vatid, 2);


    $soapUrl = "http://ec.europa.eu/taxation_customs/vies/services/checkVatService"; // asmx URL of WSDL

    // xml post structure
    $xml_post_string = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types"><soapenv:Header/><soapenv:Body><urn:checkVat><urn:countryCode>' . $countryCode . '</urn:countryCode><urn:vatNumber>' . $vatNumber . '</urn:vatNumber></urn:checkVat></soapenv:Body></soapenv:Envelope>';

    $headers = array(
        "Content-type: text/xml;charset=\"utf-8\"",
        "Accept: text/xml",
        "Cache-Control: no-cache",
        "Pragma: no-cache",
        "SOAPAction: http://connecting.website.com/WSDL_Service/GetPrice",
        "Content-length: " . strlen($xml_post_string),
    ); //SOAPAction: your op URL

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
        // converting
        $response1 = str_replace("<soap:Body>", "", $response);
        $response2 = str_replace("</soap:Body>", "", $response1);

        // convertingc to XML
        $result = simplexml_load_string($response2);

        $responseArray = array(
            'status' => 'success',
            'data' => array(
                'countrycode' => (string)$result->checkVatResponse->countryCode,
                'vatnumber' => (string)$result->checkVatResponse->vatNumber,
                'vatid' => (string)$result->checkVatResponse->countryCode . (string)$result->checkVatResponse->vatNumber,
                'valid' => (boolean)$result->checkVatResponse->valid,
                'name' => (string)$result->checkVatResponse->name,
                'address' => (string)$result->checkVatResponse->address,
                'requestdate' => substr((string)$result->checkVatResponse->requestDate, 0, 10)
            )
        );
    } else {
        $responseArray = array(
            'status' => 'error'
        );
    }
    echo json_encode($responseArray);
});
