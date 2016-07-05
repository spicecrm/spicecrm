<?php

/*
 * This File is part of KREST is a Restful service extension for SugarCRM
 * 
 * Copyright (C) 2015 AAC SERVICES K.S., DOSTOJEVSKÉHO RAD 5, 811 09 BRATISLAVA, SLOVAKIA
 * 
 * you can contat us at info@spicecrm.io
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */

// set error reporting to E_ERROR
ini_set('error_reporting', 'E_ERROR');
ini_set("display_errors", "off");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
// initalize SLIM Framework
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

// https://github.com/palanik/CorsSlim
require ('Slim/CorsSlim.php');
$app->add(new \CorsSlim\CorsSlim());

$app->mode = 'production';
chdir(dirname(__FILE__) . '/../');
define('sugarEntry', 'SLIM');

// initialize the Rest Manager
require 'KREST/KRESTManager.php';
$KRESTManager = new KRESTManager($app, $app->request->get());


$KRestDirHandle = opendir('./KREST/extensions');
while (false !== ($KRestNextFile = readdir($KRestDirHandle))) {
    $statusInclude = 'NOP';
    if (preg_match('/.php$/', $KRestNextFile)) {
        $statusInclude = 'included';
        require_once('./KREST/extensions/' . $KRestNextFile);
    }
}

$KRestDirHandle = opendir('./custom/KREST/extensions');
if ($KRestDirHandle) {
    while (false !== ($KRestNextFile = readdir($KRestDirHandle))) {
        if (preg_match('/.php$/', $KRestNextFile)) {
            require_once('./custom/KREST/extensions/' . $KRestNextFile);
        }
    }
}

// authenticate
$KRESTManager->authenticate();

// run the request
$app->contentType('application/json');
$app->run();

// cleanup
$KRESTManager->cleanup();
