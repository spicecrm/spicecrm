<?php

// require_once('modules/KReports/KReport.php');
require_once('modules/KReports/KReport.php');
require_once('modules/KReports/KReportVisualizationManager.php');
require_once('modules/KReports/KReportPresentationManager.php');
require_once('modules/KReports/KReportRESTHandler.php');

$KReportRestHandler = new KReporterRESTHandler();

$app->group('/KReporter', function () use ($app, $KRESTManager, $KReportRestHandler) {

    $app->group('/core', function ($plugin, $action) use ($app, $KRESTManager, $KReportRestHandler) {
        $app->get('/whereinitialize', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            echo json_encode($restHandler->whereInitialize());
        });
        $app->get('/whereoperators', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getWhereOperators($getParams['path'], $getParams['grouping'], $getParams['designer']));
        });
        $app->get('/enumoptions', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getEnumOptions($getParams['path'], $getParams['grouping'], json_decode(html_entity_decode($getParams['operators']), true)));
        });
        $app->get('/nodes', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getNodes($getParams['nodeid']));
        });
        $app->get('/fields', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getFields($getParams['nodeid']));
        });
        $app->get('/buckets', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getBuckets());
        });
        $app->get('/modulefields', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getModuleFields($getParams['module']));
        });
        $app->get('/wherefunctions', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            echo json_encode($restHandler->getWhereFunctions());
        });
        $app->get('/autocompletevalues', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->geAutoCompletevalues($getParams['path'], $getParams['query'], $getParams['start'], $getParams['limit']));
        });
        $app->get('/layouts', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            echo json_encode($restHandler->getLayouts());
        });

        $app->get('/vizcolors', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            echo json_encode($restHandler->getVizColors());
        });
        $app->post('/savelayout', function () use ($app, $KReportRestHandler) {
            $postBody = json_decode($app->request->getBody(), true);
            echo json_encode($KReportRestHandler->saveStandardLayout($postBody['record'], $postBody['layout']));
        });
        $app->get('/config', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            echo json_encode($restHandler->getConfig());
        });
        $app->get('/labels', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            echo json_encode($restHandler->getLabels());
        });
    });
    
    $app->group('/user', function ($plugin, $action) use ($app, $KRESTManager, $KReportRestHandler) {
        $app->get('/datetimeformat', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            echo json_encode($restHandler->get_user_datetime_format());
        });
        $app->get('/userprefs', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            echo json_encode($restHandler->get_user_prefs());
        });
        $app->get('/getlist', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $params = $app->request->get();
            echo json_encode($restHandler->get_users_list($params));
        });
        
    });
    
    

    $app->group('/plugins', function ($plugin, $action) use ($app, $KReportRestHandler) {
        $app->get('', function () use ($app, $KReportRestHandler) {
            $pluginManager = new KReportPluginManager();

            $params = $app->request->get();

            $pluginData = $pluginManager->getPlugins($params['report']);

            $addDataArray = array();
            if ($params['addData']) {
                $addData = json_decode($params['addData'], true);
                foreach ($addData as $addDataEntry) {
                    switch ($addDataEntry) {
                        case 'currencies':
                            $addDataArray[$addDataEntry] = $KReportRestHandler->getCurrencies();
                            break;
                        case 'sysinfo':
                            $addDataArray[$addDataEntry] = $KReportRestHandler->getSysinfo();
                            break;
                    }
                }
            }

            $pluginData['addData'] = $addDataArray;

            echo json_encode($pluginData);
        });

        $app->group('/action/:plugin/:action', function ($plugin, $action) use ($app) {
            $app->post('', function ($plugin, $action) use ($app) {
                $pluginManager = new KReportPluginManager();
                $getParams = $app->request->get();
                
                $formBody = $app->request->getBody();
                $postBody = json_decode($formBody, true);
                
                if(!$postBody && $formBody != ''){
                    $formBody = urldecode($formBody);
                    $formBodyArray = explode('&', $formBody);
                    foreach($formBodyArray as $formBodyArrayItem){
                        $itemArray = explode('=', $formBodyArrayItem, 2);
                        if(count($itemArray) === 2)
                            $postBody[$itemArray[0]] = $itemArray[1];
                    }
                }
                
                if(!$postBody) $postBody = array();
                
                //Only return if not null! In case of empty we get a null line in exports (csv, xlsx) and excel can't open file properly
                //echo json_encode($pluginManager->processPluginAction($plugin, 'action_' . $action, array_merge($getParams,$postBody)));
                $resultsPluginAction = $pluginManager->processPluginAction($plugin, 'action_' . $action, array_merge($getParams,$postBody));
                if(!empty($resultsPluginAction))
                    echo json_encode($resultsPluginAction);
            });
            $app->get('', function ($plugin, $action) use ($app) {
                $pluginManager = new KReportPluginManager();
                $getParams = $app->request->get();
                echo json_encode($pluginManager->processPluginAction($plugin, 'action_' . $action, $getParams));
            });
        });
    });

    $app->get('/:reportId', function ($reportId) use ($app, $KRESTManager) {
        $thisReport = BeanFactory::getBean('KReports', $reportId);
        $vizData = json_decode(html_entity_decode($thisReport->visualization_params, ENT_QUOTES, 'UTF-8'), true);
        $pluginManager = new KReportPluginManager();
        $vizObject = $pluginManager->getVisualizationObject('googlecharts');
        echo json_encode($vizObject->getItem('', $thisReport, $vizData[1]['googlecharts']));
    });
    $app->group('/:reportId', function () use ($app, $KRESTManager, $KReportRestHandler) {
        
        $app->group('/snapshot', function ($reportId) use ($app, $KRESTManager) {
            $app->get('', function ($reportId) use ($app, $KRESTManager) {
                $thisReport = new KReport();
                $thisReport->retrieve($reportId);
                $requestParams = $app->request->get();
                echo json_encode($thisReport->getSnapshots($requestParams['withoutActual']));
            });
            $app->group('/:snapshotId', function ($reportId, $snapshotId) use ($app, $KRESTManager) {
                $app->delete('', function ($reportId, $snapshotId) use ($app, $KRESTManager) {
                    $thisReport = new KReport();
                    $thisReport->retrieve($reportId);
                    $thisReport->deleteSnapshot($snapshotId);
                });
            });
        });
        
        $app->group('/savedfilter', function ($reportId) use ($app, $KRESTManager, $KReportRestHandler) {
            $app->get('', function ($reportId) use ($app, $KRESTManager, $KReportRestHandler) {
                file_put_contents("sugarcrm.log", "savedfilter\n", FILE_APPEND);
                $requestParams = $app->request->get();
                $requestParams['reportid'] = $reportId;
                echo json_encode($KReportRestHandler->getSavedFilters($requestParams));
            });
            $app->group('/assigneduserid/:assigneduserid', function ($reportId, $assignedUserId) use ($app, $KRESTManager, $KReportRestHandler) {                
                $app->get('', function ($reportId, $assignedUserId) use ($app, $KRESTManager, $KReportRestHandler) {
                    $requestParams = $app->request->get();
                    $requestParams = array('reportid' => $reportId, 'assigneduserid' => $assignedUserId, 'context' => $requestParams['context']);
                    echo json_encode($KReportRestHandler->getSavedFilters($requestParams));
                });
            });
            $app->group('/:savedfiltertId', function ($reportId, $savedfiltertId) use ($app, $KRESTManager, $KReportRestHandler) {
                $app->delete('', function ($reportId, $savedfiltertId) use ($app, $KRESTManager, $KReportRestHandler) {
                    $KReportRestHandler->deleteSavedFilter($savedfiltertId);
                });
            });
        });

        $app->get('/layout', function ($reportId) use ($app, $KRESTManager) {
            $layout = array();
            $thisReport = BeanFactory::getBean('KReports', $reportId);
            $vizData = json_decode(html_entity_decode($thisReport->visualization_params, ENT_QUOTES, 'UTF-8'), true);
            echo(json_encode($vizData));
            $vizManager = new KReportVisualizationManager();

            for ($i = 0; $i < count($vizManager->layouts[$vizData['layout']]['items']); $i++) {
                $layout[] = array(
                    "top" => $vizManager->layouts[$vizData['layout']]['items'][$i]['top'],
                    "left" => $vizManager->layouts[$vizData['layout']]['items'][$i]['left'],
                    "height" => $vizManager->layouts[$vizData['layout']]['items'][$i]['height'],
                    "width" => $vizManager->layouts[$vizData['layout']]['items'][$i]['width']
                );
            }
            // echo json_encode($layout);
        });
//        $app->get('/visualization', function ($reportId) use ($app, $KReportRestHandler) {
//            echo json_encode($KReportRestHandler->getVisualization($reportId, $app->request->get()));
//        });
//        $app->get('/presentation', function ($reportId) use ($app, $KReportRestHandler) {
//            echo json_encode($KReportRestHandler->getPresentation($reportId, $app->request->get()));
//        });

        $app->group('/visualization', function ($reportId, $dynamicoptions) use ($app, $KRESTManager, $KReportRestHandler) {
            $app->get('', function ($reportId) use ($app, $KReportRestHandler) {
                echo json_encode($KReportRestHandler->getVisualization($reportId, $app->request->get()));
            });
            $app->group('/dynamicoptions/:dynamicoptions', function ($reportId, $dynamicoptions) use ($app, $KRESTManager, $KReportRestHandler) {
                $app->get('', function ($reportId, $dynamicoptions) use ($app, $KRESTManager, $KReportRestHandler) {
                    
                    $requestParams = $app->request->get();
                    $requestParams['dynamicoptions'] = $dynamicoptions;
                    echo json_encode($KReportRestHandler->getVisualization($reportId, $requestParams));
                });
            });
        });
  
        $app->group('/presentation', function ($reportId, $dynamicoptions) use ($app, $KRESTManager, $KReportRestHandler) {
            $app->get('', function ($reportId) use ($app, $KReportRestHandler) {
                echo json_encode($KReportRestHandler->getPresentation($reportId, $app->request->get()));
            });
            $app->group('/dynamicoptions/:dynamicoptions', function ($reportId, $dynamicoptions) use ($app, $KRESTManager, $KReportRestHandler) {
                $app->get('', function ($reportId, $dynamicoptions) use ($app, $KRESTManager, $KReportRestHandler) {
                    $requestParams = $app->request->get();
                    $requestParams['dynamicoptions'] = $dynamicoptions;
                    echo json_encode($KReportRestHandler->getPresentation($reportId, $requestParams));
                });
            });
        });
//        $app->group('/dynamicoptions', function ($reportId, $dynamicoptions) use ($app, $KRESTManager, $KReportRestHandler) {
//            $app->group('/:dynamicoptions', function ($reportId, $dynamicoptions) use ($app, $KRESTManager, $KReportRestHandler) {
//                $app->get('', function ($reportId, $dynamicoptions) use ($app, $KRESTManager, $KReportRestHandler) {
//                    $requestParams = $app->request->get();
//                    $requestParams['dynamicoptions'] = $dynamicoptions;
//                    echo json_encode($KReportRestHandler->getPresentation($reportId, $requestParams));
//                });
//            });
//        });
    });
    
    
    $app->group('/bucketmanager', function ($plugin, $action) use ($app, $KRESTManager, $KReportRestHandler) {
        $app->get('/enumfields', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getEnumfields($getParams['modulename']));
        });        
        $app->get('/enumfieldvalues', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getEnumfieldvalues($getParams));
        });                
        $app->get('/groupings', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getGroupings());
        });

        $app->post('/savenewgrouping', function () use ($app, $KReportRestHandler) {
            $postBody = json_decode($app->request->getBody(), true);
            echo json_encode($KReportRestHandler->saveNewGrouping($postBody));
        });
        $app->post('/updateGrouping', function () use ($app, $KReportRestHandler) {
            $postBody = json_decode($app->request->getBody(), true);
            echo json_encode($KReportRestHandler->updateGrouping($postBody));
        });
        $app->post('/deleteGrouping', function () use ($app, $KReportRestHandler) {
            $postBody = json_decode($app->request->getBody(), true);
            echo json_encode($KReportRestHandler->deleteGrouping($postBody));
        });
    });
    
    $app->group('/dlistmanager', function ($plugin, $action) use ($app, $KRESTManager, $KReportRestHandler) {
        $app->get('/dlists', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getDLists());
        });        
        $app->get('/users', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getUsers($getParams));
        });
        $app->get('/contacts', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getContacts($getParams));
        });
        $app->get('/kreports', function () use ($app, $KRESTManager) {
            $restHandler = new KReporterRESTHandler();
            $getParams = $app->request->get();
            echo json_encode($restHandler->getKReports($getParams));
        });

        $app->post('/savenewdlist', function () use ($app, $KReportRestHandler) {
            $postBody = json_decode($app->request->getBody(), true);
            echo json_encode($KReportRestHandler->saveNewDList($postBody));
        });
        $app->post('/updatedlist', function () use ($app, $KReportRestHandler) {
            $postBody = json_decode($app->request->getBody(), true);
            echo json_encode($KReportRestHandler->updateDList($postBody));
        });
        $app->post('/deletedlist', function () use ($app, $KReportRestHandler) {
            $postBody = json_decode($app->request->getBody(), true);
            echo json_encode($KReportRestHandler->deleteDList($postBody));
        });
    });

});
