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
// header('Access-Control-Allow-Origin: *');
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

// disrgeard a sessionid sent via cookie
// unset($_COOKIE['PHPSESSID']);

// initialize the Rest Manager
require 'KREST/KRESTManager.php';
$KRESTManager = new KRESTManager($app, $app->request->get());

// set a global transactionid
$GLOBALS['transactionID'] = create_guid();

// check if we have extension in the local path
$checkRootPaths= ['include', 'modules', 'custom/modules'];
foreach($checkRootPaths as $checkRootPath) {
    $KRestDirHandle = opendir("./$checkRootPath");
    if ($KRestDirHandle) {
        while (($KRestNextDir = readdir($KRestDirHandle)) !== false) {
            if ($KRestNextDir != '.' && $KRestNextDir != '..' && is_dir("./$checkRootPath/$KRestNextDir") && file_exists("./$checkRootPath/$KRestNextDir/KREST/extensions")) {
                $KRestSubDirHandle = opendir("./$checkRootPath/$KRestNextDir/KREST/extensions");
                if ($KRestSubDirHandle) {
                    while (false !== ($KRestNextFile = readdir($KRestSubDirHandle))) {
                        if (preg_match('/.php$/', $KRestNextFile)) {
                            require_once("./$checkRootPath/$KRestNextDir/KREST/extensions/$KRestNextFile");
                        }
                    }
                }
            }
        }
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

$KRestDirHandle = opendir('./KREST/extensions');
while (false !== ($KRestNextFile = readdir($KRestDirHandle))) {
    $statusInclude = 'NOP';
    if (preg_match('/.php$/', $KRestNextFile)) {
        $statusInclude = 'included';
        require_once('./KREST/extensions/' . $KRestNextFile);
    }
}

// authenticate
$KRESTManager->authenticate();

// specific handler for the files
$KRESTManager->getProxyFiles();

// SpiceCRM Deployment Maintenance Windows Check
if(file_exists("modules/KDeploymentMWs/KDeploymentMW.php")) {
    global $db, $timedate;
    $date = new DateTime('now', new DateTimeZone('UTC'));
    $res = $db->query("SELECT * FROM kdeploymentmws WHERE deleted = 0 AND from_date <= '" . date_format($date, $timedate->get_db_date_time_format()) . "' AND to_date > '" . date_format($date, $timedate->get_db_date_time_format()) . "'");
    while ($row = $db->fetchByAssoc($res)) {
        $logged_in_user = new User();
        $logged_in_user->retrieve($_SESSION['authenticated_user_id']);
        if ($row['disable_krest'] > 0 && !$logged_in_user->is_admin && !$KRESTManager->noAuthentication) {
            unset($_GET['PHPSESSID']);
            session_destroy();
            $to_date = $timedate->fromDb($row['to_date']);
            $KRESTManager->authenticationError('System in Deployment Maintenance Window till ' . $timedate->asUser($to_date) . " !");
            exit;
        }
    }
}
// run the request
$app->contentType('application/json');
$app->run();

// cleanup
$KRESTManager->cleanup();
