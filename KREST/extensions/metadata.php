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

require_once('KREST/handlers/module.php');

$KRESTModuleHandler = new KRESTModuleHandler($app);

$KRESTManager->registerExtension('metadata', '1.0');

$app->group('/metadata', function () use ($app, $KRESTModuleHandler) {
    $app->get('/modules', function() use ($app, $KRESTModuleHandler) {
        echo json_encode($KRESTModuleHandler->get_modules());
    });
    $app->post('/beandefs', function ($beanName) use ($app) {
        $KRESTManager = new KRESTManager($app);
        $postBody = $body = $app->request->getBody();
        $beanArray = json_decode($postBody, true);
        echo json_encode($KRESTManager->get_beandefs_multiple($beanArray));
    });
    $app->group('/:beanName', function () use ($app) {
        $app->get('/vardefs', function ($beanName) use ($app) {
            $KRESTManager = new KRESTManager($app);
            echo json_encode($KRESTManager->get_bean_vardefs($beanName));
        });
        $app->get('/beandefs', function ($beanName) use ($app) {
            $KRESTManager = new KRESTManager($app);
            echo json_encode($KRESTManager->get_beandefs($beanName));
        });
        $app->get('/language', function ($beanName) use ($app) {
            $KRESTManager = new KRESTManager($app);
            echo json_encode($KRESTManager->get_bean_language($beanName));
        });
    });
});
