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

$KRESTManager->registerExtension('mobile', '2.0');
if(isset($GLOBALS['dictionary']['spicereminders']) && isset($GLOBALS['dictionary']['spicenotes'])) {
    $KRESTManager->registerExtension('spiceenhancements', '1.0');
}
$app->group('/mobile', function () use ($app, $KRESTManager) {
    $app->get('/metadata', function () use ($app, $KRESTManager) {
        include 'KREST/handlers/spicecrmmobile.php';
        $controller = new KRESTSpiceCRMMobileHandler();
        echo json_encode($controller->getMetadata());
    });
    $app->group('/sync', function () use ($app, $KRESTManager) {
        $app->post('/module/:beanName', function ($beanName) use ($app, $KRESTManager) {
            include 'KREST/handlers/spicecrmmobile.php';
            $controller = new KRESTSpiceCRMMobileHandler();
            $syncData = json_decode($app->request->getBody(), true);
            echo json_encode($controller->determineSync($beanName, $syncData));
        });
        $app->group('/relationship/:tablename', function ($tablename) use ($app, $KRESTManager) {
            $app->post('/set', function ($tablename) use ($app, $KRESTManager) {
                include 'KREST/handlers/spicecrmmobile.php';
                $controller = new KRESTSpiceCRMMobileHandler();
                $syncData = json_decode($app->request->getBody(), true);
                echo json_encode($controller->setRelationshipsMultiple($tablename, $syncData));
            });
            $app->post('/get', function ($tablename) use ($app, $KRESTManager) {
                include 'KREST/handlers/spicecrmmobile.php';
                $controller = new KRESTSpiceCRMMobileHandler();
                $syncData = json_decode($app->request->getBody(), true);
                echo json_encode($controller->getRelationshipsChanges($tablename, $syncData));
            });
            $app->post('/massload', function ($tablename) use ($app, $KRESTManager) {
                include 'KREST/handlers/spicecrmmobile.php';
                $controller = new KRESTSpiceCRMMobileHandler();
                $syncData = json_decode($app->request->getBody(), true);
                echo json_encode($controller->getMassRelationships($tablename, $syncData));
            });
        });
        $app->post('/reminder', function () use ($app, $KRESTManager) {
            include 'KREST/handlers/spicecrmmobile.php';
            $controller = new KRESTSpiceCRMMobileHandler();
            $syncData = json_decode($app->request->getBody(), true);
            echo json_encode($controller->syncReminder($syncData));
        });
        $app->post('/quicknote', function () use ($app, $KRESTManager) {
            include 'KREST/handlers/spicecrmmobile.php';
            $controller = new KRESTSpiceCRMMobileHandler();
            $syncData = json_decode($app->request->getBody(), true);
            echo json_encode($controller->syncQuicknotes($syncData));
        });
    });
    $app->group('/reminder', function ($beanName, $beanId) use ($app) {
        $app->get('', function () use ($app) {
            include 'KREST/handlers/spicecrmmobile.php';
            $controller = new KRESTSpiceCRMMobileHandler();
            $syncData = $app->request->get();
            echo json_encode($controller->getReminders($syncData));
        });    
        $app->post('/:beanName/:beanId', function ($beanName, $beanId) use ($app) {
            $postBody = $body = $app->request->getBody();
            $postParams = $app->request->get();
            $data = array_merge(json_decode($postBody, true), $postParams);
            require_once 'KREST/handlers/spicecrmmobile.php';
            $controller = new KRESTSpiceCRMMobileHandler();
            echo json_encode($controller->addReminder($beanName, $beanId, $data));
        });
        $app->delete('/:beanName/:beanId', function ($beanName, $beanId) {
            require_once 'KREST/handlers/spicecrmmobile.php';
            $controller = new KRESTSpiceCRMMobileHandler();
            echo $controller->removeReminder($beanName, $beanId);
        });
    });
});