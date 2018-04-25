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

$KRESTManager->excludeFromAuthentication('/');
$KRESTManager->excludeFromAuthentication('/sysinfo');
$KRESTManager->excludeFromAuthentication('/test');

$KRESTManager->registerExtension('core', '2.0');

$app->get('/', function () use ($KRESTManager) {
    echo json_encode(array(
        'version' => '2.0',
        'extensions' => $KRESTManager->extensions
    ));
});

$app->get('/test', function() use ($KRESTManager)
{
    throw new Exception('test');
    echo "test!";
});

$app->post('/test', function() use ($KRESTManager)
{
    //throw new Exception('test');
    echo "post test!";
});

$app->get('/sysinfo', function () use ($KRESTManager) {
    global $sugar_config;

    echo json_encode(array(
        'version' => '2.0',
        'extensions' => $KRESTManager->extensions,
        'languages' => array(
            'available' => $sugar_config['languages'],
            'default' => $sugar_config['default_language']
        ),
        'loginSidebarUrl' => isset ( $sugar_config['uiLoginSidebarUrl']{0} ) ? $sugar_config['uiLoginSidebarUrl'] : false
    ));
}); #


$app->group('/system', function () use ($app, $KRESTManager) {
    $app->get('/guid', function () use ($KRESTManager) {
        require_once 'include/utils.php';
        echo json_encode(array(
            'id' => create_guid()
        ));
    });
});

$app->get('/validatesession', function () use ($app) {
    $sessionData = $_GET;
    $KRESTManager = new KRESTManager($app);
    echo json_encode($KRESTManager->validate_session($sessionData['session_id']));
});

$app->post('/tmpfile', function ($req, $res, $args) use ($app) {
    $postBody = file_get_contents( 'php://input' );
    $temppath = sys_get_temp_dir();
    $filename = create_guid();
    file_put_contents($temppath . '/' . $filename, base64_decode($postBody));
    echo json_encode( array( 'filepath' => $temppath.'/'.$filename ));
});
