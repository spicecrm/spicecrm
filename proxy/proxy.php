<?php

/*
 * SpiceUI 0.0.95
 *
 * Copyright (c) 2016-present, aac services.k.s - All rights reserved.
 * Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
 * - Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * - If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

require "../config/configHandler.php";

// $baseurl = 'http://127.0.0.1/spicecrm_dev/KREST';

if ( isset( $_REQUEST['useurl']{0} )) {
    $url = base64_decode($_REQUEST['useurl']);
} else {


    $requesturl = $_SERVER['REQUEST_URI'];
    $proxyPos = strpos($requesturl, '/proxy/');
    $sitePos = strpos($requesturl, '/', $proxyPos + 7);
    $siteId = substr($requesturl, $proxyPos + 7, $sitePos - $proxyPos - 7);
    $site = configHandler::getSite( $siteId );
    if ( $site === false ) {
        http_response_code( 404 );
        echo 'Backend site '.$siteId.' not found.';
        exit;
    };
    $baseurl = $site['backendUrl'];

    $url = $baseurl . @$_GET['url'] . substr($requesturl, $sitePos);
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// handle the header
$headers = getallheaders();
// create header array with the originating IP for logging purposes
$headerarray = [
    'X-Forwarded-For' => 'X-Forwarded-For:' . ( isset( $_SERVER['HTTP_CLIENT_IP'][0] ) ? $_SERVER['HTTP_CLIENT_IP'] : $_SERVER['REMOTE_ADDR'])
];

foreach ($headers as $element => $value) {
    switch (strtolower($element)) {
        case 'authorization':
        case 'cookie':
        case 'oauth-token':
        case 'oauth-issuer':
        case 'content-type':
        case 'accept':
            $headerarray[$element] = $element . ': ' . $value;
            break;
        default:
            // add google callback elements
            if(strpos(strtolower($element), 'x-goog') !== false || strpos(strtolower($element), 'x_goog') !== false){
                $headerarray[$element] = $element . ': ' . $value;
            }
            break;
    }
}

curl_setopt($ch, CURLOPT_HTTPHEADER, $headerarray);

// handle the cookie
$cookieArray = [];
foreach ($_COOKIE as $key => $value)
    $cookieArray[] = $key . '=' . $value;

if (is_array($cookieArray) || $cookieArray instanceof Countable) {
    if (count($cookieArray)  > 0) {
        curl_setopt($ch, CURLOPT_COOKIE, implode(',', $cookieArray));
    }
}

curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        curl_setopt($ch, CURLOPT_URL, $url);
        $result = curl_exec($ch);

        break;
    case 'POST':
        $fields = array();
        $fields_string = '';

        // check if we have files ..
        // if yes send them first and then add the temnp files to the header so thje REST proxy will digest them
        if ($_FILES && count($_FILES) > 0) {
            $files = Array();
            $headersForFileUpload = $headerarray;
            $headersForFileUpload['Content-Type'] = 'Content-Type: text/plain';
            foreach ($_FILES as $file => $fileData) {

                $chf = curl_init();
                curl_setopt($chf, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($chf, CURLOPT_HTTPHEADER, $headersForFileUpload );
                curl_setopt($chf, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($chf, CURLOPT_POSTFIELDS, base64_encode(file_get_contents($fileData['tmp_name'])));
                curl_setopt($chf, CURLOPT_URL, $baseurl.'/tmpfile');
                curl_setopt($chf, CURLOPT_POST, 1);
                $result = json_decode( curl_exec($chf),true);
                curl_close($chf);

                $fileData['tmp_name'] = $result['filepath'];
                $fileData['proxy'] = true;
                $files[$file] = $fileData;

            }

            $headerarray[] = 'proxyfiles: ' . base64_encode(json_encode($files));

            curl_setopt($ch, CURLOPT_HTTPHEADER, $headerarray);

        }

        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);


        $result = curl_exec($ch);

        break;
    case 'PUT':
        curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
        curl_setopt($ch, CURLOPT_POST, 1);
    case 'PATCH':
    case 'DELETE':
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);
        $result = curl_exec($ch);

        break;
    default:
        header("Content-Type: application/json");
        echo json_encode(array('result' => 'failure', 'message' => 'There was an error executing your request'));
        break;
}

header('Content-type: ' . curl_getinfo($ch, CURLINFO_CONTENT_TYPE));
// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT');
header('Access-Control-Allow-Headers: authorization,content-type');

// pass throught eh return code
$http_response = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ( ( $location = curl_getinfo( $ch,CURLINFO_REDIRECT_URL )) !== false ) {
    $location = preg_replace('#^'.preg_quote( $baseurl ).'#', dirname( $_SERVER['SCRIPT_NAME'] ), $location);
    header( 'Location: ' . $location, true, $http_response );
} else
    http_response_code( $http_response );

curl_close($ch);

echo $result;
