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

require "configHandler.php";

$url = trim($_SERVER['REQUEST_URI'], '/');
$urlArray = explode('?', $url);

$uri = explode('/', $urlArray[0]);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        switch (end($uri)) {
            case 'stylesheet':
                header('Content-Type: text/css');
                // $genericCss = file_get_contents ( __DIR__.'/../assets/css/spicecrm.css' );
                $customCss = @file_get_contents(__DIR__ . '/assets/css/spicecrm.css');

                # @import statements have to be at the beginning of a CSS file. So we collect any @import statements of the custom CSS file to deliver these lines first.
                $imports = [];
                $customCss = preg_replace_callback('/^\s*@import\s+.*$/im', function ($matches) use (&$imports) {
                    $imports[] = $matches[0];
                    return '';
                }, $customCss);
                echo implode("\n", $imports);

                // echo $genericCss."\n\n\n";

                if (isset($customCss{0})) echo "/***** Custom Stylesheet ***************/\n\n\n" . $customCss;
                else echo "/* NO Custom Stylesheet */\n";

                break;
            case 'loginimage':
                $filetype = '';
                if (file_exists($filepath = __DIR__ . '/assets/images/loginimage.png')) $filetype = 'png';
                elseif (file_exists($filepath = __DIR__ . '/assets/images/loginimage.gif')) $filetype = 'gif';
                elseif (file_exists($filepath = __DIR__ . '/assets/images/loginimage.jpg')) $filetype = 'jpg';
                elseif (file_exists($filepath = __DIR__ . '/../assets/images/loginimage.png')) $filetype = 'png';
                elseif (file_exists($filepath = __DIR__ . '/../assets/images/loginimage.gif')) $filetype = 'gif';
                elseif (file_exists($filepath = __DIR__ . '/../assets/images/loginimage.jpg')) $filetype = 'jpg';
                if ($filetype !== '') {
                    header('Content-Type: image/' . $filetype);
                    readfile($filepath);
                } else http_response_code(404);
                break;
            case 'headerimage':
                $filetype = '';
                if (file_exists($filepath = __DIR__ . '/assets/images/headerimage.png')) $filetype = 'png';
                elseif (file_exists($filepath = __DIR__ . '/assets/images/headerimage.gif')) $filetype = 'gif';
                elseif (file_exists($filepath = __DIR__ . '/assets/images/headerimage.jpg')) $filetype = 'jpeg';
                elseif (file_exists($filepath = __DIR__ . '/../assets/images/headerimage.png')) $filetype = 'png';
                elseif (file_exists($filepath = __DIR__ . '/../assets/images/headerimage.gif')) $filetype = 'gif';
                elseif (file_exists($filepath = __DIR__ . '/../assets/images/headerimage.jpg')) $filetype = 'jpeg';
                if ($filetype !== '') {
                    header('Content-Type: image/' . $filetype);
                    readfile($filepath);
                } else http_response_code(404);
                break;
            case 'favicon':
                $filetype = '';
                if (file_exists($filepath = __DIR__ . '/assets/images/favicon.ico')) $contenttype = 'image/x-icon';
                elseif (file_exists($filepath = __DIR__ . '/assets/images/favicon.png')) $contenttype = 'image/png';
                elseif (file_exists($filepath = __DIR__ . '/assets/images/favicon.jpg')) $contenttype = 'image/jpeg';
                elseif (file_exists($filepath = __DIR__ . '/../assets/images/favicon.ico')) $contenttype = 'image/x-icon';
                elseif (file_exists($filepath = __DIR__ . '/../assets/images/favicon.png')) $contenttype = 'image/png';
                elseif (file_exists($filepath = __DIR__ . '/../assets/images/favicon.jpg')) $contenttype = 'image/jpeg';
                if ($contenttype !== '') {
                    header('Content-Type: ' . $contenttype);
                    readfile($filepath);
                } else http_response_code(404);
                break;
            case 'sites':
                echo json_encode(array('sites' => configHandler::getSites(), 'general' => configHandler::getGeneralConfig()));
                break;
            case 'check':
                $success = false;
                $message = '';

                // get the params
                $params = explode('&', $urlArray[1]);
                $paramsArray = [];
                foreach ($params as $param) {
                    $eqPos = strpos($param, '=');
                    $paramsArray[substr($param, 0, $eqPos)] = substr($param, $eqPos + 1);
                }

                // get the url sent
                $testUrl = base64_decode($paramsArray['url']);

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_URL, $testUrl . '/sysinfo');
                $result = curl_exec($ch);

                if ($result == false) {
                    $message = curl_error($ch);
                } else {
                    $info = curl_getinfo($ch);

                    switch ($info['http_code']) {
                        case '200':
                            $success = true;
                            $message = $result;
                            break;
                        default:
                            $message = 'http response code ' . $info['http_code'] . ' returned from server';
                            break;

                    }
                }

                echo json_encode(array('success' => $success, 'message' => $message));
                break;
            case 'installercheck':
                $success = false;
                $message = '';

                // get the params
                $params = explode('&', $urlArray[1]);
                $paramsArray = [];
                foreach ($params as $param) {
                    $eqPos = strpos($param, '=');
                    $paramsArray[substr($param, 0, $eqPos)] = substr($param, $eqPos + 1);
                }

                // get the url sent
                $testUrl = base64_decode($paramsArray['url']);

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_URL, $testUrl . '/isysinfo');
                $result = curl_exec($ch);

                if ($result == false) {
                    $message = curl_error($ch);
                } else {
                    $info = curl_getinfo($ch);

                    switch ($info['http_code']) {
                        case '200':
                            $success = true;
                            $message = $result;
                            break;
                        default:
                            $message = 'http response code ' . $info['http_code'] . ' returned from server';
                            break;

                    }
                }

                echo json_encode(array('success' => $success, 'message' => $message));
                break;
            case 'outlookxml':
                header('Content-Type: application/xml');

                // build the serverurl from teh request
                $serverurl = str_replace('/config/outlookxml', '', "{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}");
                // check if we have parameers in the request
                $parampos = strpos($serverurl, '?');
                if ($parampos !== false) {
                    $serverurl = substr($serverurl, 0, $parampos);
                }

                // read the template XML and parse it
                $dir = dirname(__DIR__);
                $filepath = "$dir/assets/outlook/spicecrmoutlookplugin.xml";

                // in case we have a custom xml, use it
                $customfilepath = "$dir/config/assets/outlook/spicecrmoutlookplugin.xml";
                if(file_exists($customfilepath)) {
                    $filepath = $customfilepath;
                }

                $file = file_get_contents($filepath);
                echo(str_replace('<serverurl>', $serverurl, $file));
                break;

            case 'systemdetails':
                // CR1000421: read file header of every app + vendor/@angular/core.umd.min.js + slsassets/styles/salesforce-lightening-design-system.css
                // get angular version
                // get path to folder

                $dir = dirname(__DIR__);
                $objects = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir . '/vendor/@angular'), RecursiveIteratorIterator::SELF_FIRST);
                // loop results
                foreach ($objects as $name => $object) {
                    $pathinfo = pathinfo($object->getPathname());
                    if (!is_dir($object->getPathname()) && $pathinfo['extension'] == 'js') {
                        $file = file_get_contents($object->getPathname());
                        preg_match("/\s\*\s@license\sAngular\sv(.*)/", $file, $matches, PREG_OFFSET_CAPTURE);
                        $systemdetails['vendor']['angular'][] = [
                            'name' => $pathinfo['filename'],
                            'version' => $matches[1][0]
                        ];
                    }
                }


                // get lightening design version
                // get path to folder
                $path = dirname(__FILE__);
                $path = str_replace('/config', '/vendor/sldassets', $path);
                $path = realpath($dir . '/vendor/sldassets/styles/salesforce-lightning-design-system.css');
                $file = file_get_contents($path);
                // find version in header: *! Lightning Design System 2.11.7 *
                preg_match("@/\*!\sLightning Design System\s(.*)\*/@", $file, $matches, PREG_OFFSET_CAPTURE);
                $systemdetails['vendor']['lightningdesign'][] = [
                    'name' => 'lightningdesign',
                    'version' => $matches[1][0]
                ];


                // get path to app folder
                $path = dirname(__FILE__);
                $path = str_replace('/config', '/app', $path);
                $path = realpath($dir . '/app');
                // prepare patterns to check in file header text
                $patterns = ['release', 'date', 'build'];
                // create Iterator
                $objects = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path), RecursiveIteratorIterator::SELF_FIRST);
                // loop results
                foreach ($objects as $name => $object) {
                    $pathinfo = pathinfo($object->getPathname());
                    if (!is_dir($object->getPathname()) && $pathinfo['extension'] == 'js') {
                        $file = file_get_contents($object->getPathname());
                        // find file header
                        preg_match("@/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\*/@", $file, $matches, PREG_OFFSET_CAPTURE);
                        // check content of file header
                        $lines = preg_split('/\r\n|\r|\n/', $matches[0][0]);

                        $module = ['name' => $pathinfo['filename']];
                        // loop lines and fill $systemdetails
                        foreach ($lines as $line) {
                            foreach ($patterns as $pattern) {
                                if (preg_match('/' . $pattern . ':/', $line)) {
                                    $lineinfo = explode($pattern . ': ', $line);
                                    $module[$pattern] = trim($lineinfo[1]);
                                }
                            }
                        }
                        $systemdetails['app'][] = $module;
                    }
                }

                // return $systemdetails
                echo json_encode($systemdetails);
                break;

            case 'gsuite':
                // define the extension dir and the archive name
                $gSuiteExtensionDir = dirname(__DIR__) . "/assets/gsuite/";
                $zipFileName = 'GSuiteChromeExtension.zip';
                $zipFileDir = sys_get_temp_dir() . "/$zipFileName";
                $gSuiteJsDir = $gSuiteExtensionDir . "GSuiteBroker.js";

                // define the serverUrl from the request
                $serverUrl = str_replace('/config/gsuite', '', "{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}");
                $serverUrl = (isset($_SERVER['HTTPS']) && !empty($_SERVER['HTTPS']) ? 'https://' : 'http://') . $serverUrl;
                $paramPos = strpos($serverUrl, '?');
                if ($paramPos !== false) $serverUrl = substr($serverUrl, 0, $paramPos);

                // Initialize archive object
                $zip = new ZipArchive();
                $zip->open($zipFileDir, ZipArchive::CREATE | ZipArchive::OVERWRITE);

                // get all files in the extension folder
                $files = new RecursiveIteratorIterator(
                    new RecursiveDirectoryIterator($gSuiteExtensionDir),
                    RecursiveIteratorIterator::LEAVES_ONLY
                );

                foreach ($files as $name => $file) {
                    // Skip typescript and map files and directories (they would be added automatically)
                    $ext = pathinfo($name, PATHINFO_EXTENSION);
                    if ($file->isDir() || strpos($name, 'GSuiteBroker') !== false) continue;

                    $filePath = $file->getRealPath();
                    $relativePath = substr($filePath, strlen($gSuiteExtensionDir));

                    // Add file to archive
                    $zip->addFile($filePath, $relativePath);
                }

                // translate the server url in GSuiteBroker.js temp file
                $gSuiteJsContent = str_replace('<serverurl>', $serverUrl, file_get_contents($gSuiteJsDir));
                $gSuiteJsContent = str_replace('//# sourceMappingURL=GSuiteBroker.js.map', '', $gSuiteJsContent);
                // write the translated content into the GSuiteBroker.js temp file
                $zip->addFromString('GSuiteBroker.js', $gSuiteJsContent);

                // create the zip file
                $zip->close();

                // set header for the zip file download
                header('Content-type: application/zip');
                header("Content-Disposition: attachment; filename=$zipFileName");
                header("Content-Length: " . filesize($zipFileDir));
                header("Pragma: public");
                header("Cache-Control: maxage=1, post-check=0, pre-check=0");
                header("X-Content-Type-Options: nosniff");
                header("Expires: 0");

                // clean the output buffer to the browser
                while (ob_get_level() && @ob_end_clean()) ;

                // read file content to the browser to be downloaded
                readfile($zipFileDir);

                // delete the zip file
                unlink($zipFileDir);
                break;
        }
        break;
    case 'POST':
        switch (end($uri)) {
            case 'set':
                $success = false;
                $message = '';

                // chek that no config is set
                $sitesDefined = configHandler::getSites();
                if (count($sitesDefined) > 0) {
                    echo json_encode(array('success' => false, 'message' => 'configuration already set'));
                    return;
                }

                // get the post Body
                $postBody = json_decode(file_get_contents('php://input'), true);

                $response = configHandler::setSite($postBody);

                if ($response !== false) {
                    echo json_encode(array('success' => true, 'site' => $response));
                    return;
                } else {
                    echo json_encode(array('success' => false, 'message' => 'error writing configuration'));
                    return;
                }

                echo json_encode(array('success' => false, 'message' => ''));

                break;
        }
        break;
}

// $sites = configHandler::getSites();
// echo json_encode($sites);
