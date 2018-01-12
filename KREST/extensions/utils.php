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
require_once('KREST/handlers/utils.php');

$KRESTUtilsHandler = new KRESTUtilsHandler($app);

$KRESTManager->registerExtension('utils', '1.0');

$app->group('/pdf', function () use ($app, $KRESTManager, $KRESTUtilsHandler) {
    $app->group('/toImage', function () use ($app, $KRESTManager, $KRESTUtilsHandler) {
        $app->get('/base64data/:filepath', function ($filepath) use ($app, $KRESTUtilsHandler) {
            $data = $KRESTUtilsHandler->pdfToBase64Image($filepath);
            echo json_encode($data);
        });
        $app->get('/url/:filepath', function ($filepath) use ($app, $KRESTUtilsHandler) {
            $urls = $KRESTUtilsHandler->pdfToUrlImage($filepath);
            echo json_encode($urls);
        });
    });
    $app->group('/upload', function () use ($app, $KRESTManager, $KRESTUtilsHandler) {
        $app->post('/tmp', function () use ($app, $KRESTUtilsHandler) {
            $postBody = $body = $app->request->getBody();
            $temppath = sys_get_temp_dir();
            $filename = create_guid() . '.pdf';
            file_put_contents($temppath . '/' . $filename, base64_decode($postBody));
            echo $temppath . '/' . $filename;
        });
        $app->post('/uploadsDir', function () use ($app, $KRESTUtilsHandler) {
            global $sugar_config;
            $postBody = $body = $app->request->getBody();
            $filename = create_guid() . '.pdf';
            file_put_contents($sugar_config['upload_dir'] . $filename, base64_decode($postBody));
            echo $sugar_config['upload_dir'] . $filename;
        });
    });
});

