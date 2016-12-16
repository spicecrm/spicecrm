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

$KRESTManager->registerExtension('module', '2.0');

$app->group('/module', function () use ($app, $KRESTManager, $KRESTModuleHandler) {
    $app->get('/language', function () use ($app, $KRESTModuleHandler) {
        $getParams = $app->request->get();

        // see if we have a language passed in .. if not use the defaulöt 
        $language = $getParams['lang'];
        if (empty($language))
            $language = $GLOBALS['sugar_config']['default_language'];

        $modules = json_decode($getParams['modules']);
        $dynamicDomains = $KRESTModuleHandler->get_dynamic_domains($modules, $language);
        $appListStrings = return_app_list_strings_language($language);
        $appStrings = array_merge($appListStrings, $dynamicDomains);

        $responseArray = array('languages' => array('available' => $GLOBALS['sugar_config']['languages'], 'default' => $GLOBALS['sugar_config']['default_language']), 'mod' => $KRESTModuleHandler->get_mod_language(json_decode($getParams['modules']), $language), 'applang' => return_application_language($language), 'applist' => $appStrings);

        $responseArray['md5'] = md5(json_encode($responseArray));

        // if an md5 was sent in and matches the curent one .. no change .. do not send the language to save bandwidth
        if ($_REQUEST['md5'] == $responseArray['md5']) {
            $responseArray = array('md5' => $_REQUEST['md5']);
        }

        echo json_encode($responseArray);
    });
    $app->get('/:beanName', function ($beanName) use ($app, $KRESTModuleHandler) {
        $searchParams = $app->request->get();

        $postParams = json_decode($app->request->getBody(), true);
        if(is_array($postParams))
            $searchParams = array_merge($searchParams, $postParams);

        echo json_encode($KRESTModuleHandler->get_bean_list($beanName, $searchParams));
    });
    $app->post('/:beanName', function ($beanName) use ($app, $KRESTModuleHandler) {
        $requestParams = $app->request->get();

        $retArray = array();

        $items = json_decode($app->request->getBody(), true);

        foreach ($items as $item) {
            $beanId = $KRESTModuleHandler->add_bean($beanName, $item['id'], array_merge($item, $requestParams));
            $item['id'] = $beanId;
            $retArray[] = $item;
        }

        echo json_encode($retArray);
    });
    $app->group('/:beanName', function () use ($app, $KRESTModuleHandler) {
        $app->get('/:beanId', function ($beanName, $beanId) use ($app, $KRESTModuleHandler) {
            $requestParams = $app->request->get();
            echo json_encode($KRESTModuleHandler->get_bean_detail($beanName, $beanId, $requestParams));
        });
        $app->post('/:beanId', function ($beanName, $beanId) use ($app, $KRESTModuleHandler) {
            $postBody = $body = $app->request->getBody();
            $postParams = $app->request->get();
            $thisBean = $KRESTModuleHandler->add_bean($beanName, $beanId, array_merge(json_decode($postBody, true), $postParams));
            echo json_encode($thisBean);
        });
        $app->delete('/:beanId', function ($beanName, $beanId) use ($app, $KRESTModuleHandler) {
            return $KRESTModuleHandler->delete_bean($beanName, $beanId);
        });
        $app->group('/:beanId', function ($beanName, $beanId) use ($app, $KRESTModuleHandler) {
            $app->group('/noteattachment', function ($beanName, $beanId) use ($app, $KRESTModuleHandler) {
                $app->get('', function ($beanName, $beanId) use ($app, $KRESTModuleHandler) {
                    echo json_encode($KRESTModuleHandler->get_bean_attachment($beanName, $beanId));
                });
            });
            $app->group('/attachment', function ($beanName, $beanId) use ($app) {
                $app->post('', function ($beanName, $beanId) use ($app) {
                    $postBody = $body = $app->request->getBody();
                    $postParams = $app->request->get();
                    require_once('include/SpiceAttachments/SpiceAttachments.php');
                    echo SpiceAttachments::saveAttachmentHashFiles($beanName, $beanId, array_merge(json_decode($postBody, true), $postParams));
                });
                $app->get('', function ($beanName, $beanId) use ($app) {
                    require_once('include/SpiceAttachments/SpiceAttachments.php');
                    echo SpiceAttachments::getAttachmentsForBeanHashFiles($beanName, $beanId);
                });
                $app->delete('/:attachmentId', function ($beanName, $beanId, $attachmentId) use ($app) {
                    require_once('include/SpiceAttachments/SpiceAttachments.php');
                    echo SpiceAttachments::deleteAttachment($attachmentId);
                });
                $app->post('/ui', function ($beanName, $beanId) use ($app) {
                    /* for fielupload over $_FILE. used by theme */
                    $postBody = $body = $app->request->getBody();
                    $postParams = $app->request->get();
                    require_once('include/SpiceAttachments/SpiceAttachments.php');
                    echo SpiceAttachments::saveAttachment($beanName, $beanId, array_merge(json_decode($postBody, true), $postParams));
                });
                $app->get('/ui', function ($beanName, $beanId) use ($app) {
                    /* for get file url for theme, not file in base64 */
                    require_once('include/SpiceAttachments/SpiceAttachments.php');
                    echo SpiceAttachments::getAttachmentsForBean($beanName, $beanId);
                });
            });
            $app->group('/favorite', function ($beanName, $beanId) use ($app, $KRESTModuleHandler) {
                $app->get('', function($beanName, $beanId) use ($app, $KRESTModuleHandler) {
                    $actionData = $KRESTModuleHandler->get_favorite($beanName, $beanId);
                    echo json_encode($actionData);
                });
                $app->post('', function($beanName, $beanId) use ($app, $KRESTModuleHandler) {
                    $actionData = $KRESTModuleHandler->set_favorite($beanName, $beanId);
                });
                $app->delete('', function($beanName, $beanId) use ($app, $KRESTModuleHandler) {
                    $actionData = $KRESTModuleHandler->delete_favorite($beanName, $beanId);
                });
            });
            $app->group('/note', function ($beanName, $beanId) use ($app) {
                $app->get('', function ($beanName, $beanId) use ($app) {
                    require_once('modules/SpiceThemeController/SpiceThemeController.php');
                    $SpiceThemeController = new SpiceThemeController();
                    echo $SpiceThemeController->getQuickNotes($beanName, $beanId);
                });
                $app->post('', function ($beanName, $beanId) use ($app) {
                    require_once('modules/SpiceThemeController/SpiceThemeController.php');
                    $postBody = $body = $app->request->getBody();
                    $postParams = $app->request->get();
                    $data = array_merge(json_decode($postBody, true), $postParams);
                    $SpiceThemeController = new SpiceThemeController();
                    echo $SpiceThemeController->saveQuickNote($beanName, $beanId, $data);
                });
                $app->post('/:noteId', function ($beanName, $beanId, $noteId) use ($app) {
                    require_once('modules/SpiceThemeController/SpiceThemeController.php');
                    $postBody = $body = $app->request->getBody();
                    $postParams = $app->request->get();
                    $data = array_merge(json_decode($postBody, true), $postParams);
                    $SpiceThemeController = new SpiceThemeController();
                    echo $SpiceThemeController->editQuickNote($beanName, $beanId, $noteId, $data);
                });
                $app->delete('/:noteId', function ($beanName, $beanId, $noteId) use ($app) {
                    require_once('modules/SpiceThemeController/SpiceThemeController.php');
                    $SpiceThemeController = new SpiceThemeController();
                    echo $SpiceThemeController->deleteQuickNote($noteId);
                });
            });
            $app->group('/reminder', function ($beanName, $beanId) use ($app) {
                $app->get('', function ($beanName, $beanId) use ($app) {
                    require_once('modules/SpiceThemeController/SpiceThemeController.php');
                    $SpiceThemeController = new SpiceThemeController();
                    echo $SpiceThemeController->getReminder();
                });
                $app->post('', function ($beanName, $beanId) use ($app) {
                    $postBody = $body = $app->request->getBody();
                    $postParams = $app->request->get();
                    $data = array_merge(json_decode($postBody, true), $postParams);
                    require_once('modules/SpiceThemeController/SpiceThemeController.php');
                    $SpiceThemeController = new SpiceThemeController();
                    echo $SpiceThemeController->setReminder($beanName, $beanId, $data);
                });
                $app->delete('', function ($beanName, $beanId) use ($app) {
                    require_once('modules/SpiceThemeController/SpiceThemeController.php');
                    $SpiceThemeController = new SpiceThemeController();
                    echo $SpiceThemeController->removeReminder($beanName, $beanId);
                });
            });

            $app->group('/related/:linkname', function () use ($app, $KRESTModuleHandler) {
                $app->get('', function($beanName, $beanId, $linkname) use ($app, $KRESTModuleHandler) {
                    echo json_encode($KRESTModuleHandler->get_related($beanName, $beanId, $linkname));
                });
                $app->post('', function($beanName, $beanId, $linkname) use ($app, $KRESTModuleHandler) {
                    echo json_encode($KRESTModuleHandler->add_related($beanName, $beanId, $linkname));
                });
                $app->delete('', function($beanName, $beanId, $linkname) use ($app, $KRESTModuleHandler) {
                    echo json_encode($KRESTModuleHandler->delete_related($beanName, $beanId, $linkname));
                });
            });
            $app->post('/:beanAction', function($beanName, $beanId, $beanAction) use ($app, $KRESTModuleHandler) {
                $postBody = $body = $app->request->getBody();
                $postParams = $app->request->get();
                $actionData = $KRESTModuleHandler->execute_bean_action($beanName, $beanId, $beanAction, array_merge(json_decode($postBody, true), $postParams));
                if ($actionData === false)
                    $app->response()->status(501);
                else {
                    echo json_encode($actionData);
                }
            });
        });
    });
});
