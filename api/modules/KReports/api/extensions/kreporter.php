<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/
/////////////// KEEP A WHILE FFOR ARCHIVE AND DEV PURPOSES ////////////////////
//use SpiceCRM\data\BeanFactory;
//use SpiceCRM\includes\RESTManager;
//use SpiceCRM\modules\KReports\KReport;
//use SpiceCRM\modules\KReports\KReportPluginManager;
//use SpiceCRM\extensions\modules\KReports\api\controllers\KReportsPluginSavedFiltersController;
//use Slim\Routing\RouteCollectorProxy;
//
//require_once('modules/KReports/KReportVisualizationManager.php');
//require_once('modules/KReports/KReportPresentationManager.php');
//require_once('modules/KReports/KReportRESTHandler.php');
//
///**
// * get a Rest Manager Instance
// */
//$RESTManager = RESTManager::getInstance();
//
///**
// * register the Extension
// */
//$RESTManager->registerExtension('reporting', '1.0');
//
///**
// * restrict routes to authenticated users
// */
//if(!SpiceCRM\includes\authentication\AuthenticationController::getInstance()->isAuthenticated()) return;
//
//$KReportRestHandler = new KReporterRESTHandler();

//$RESTManager->app->group('kreporter', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//    $group->group('/core', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//@deprecated
//        $group->get('/whereinitialize', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            return $res->withJson($restHandler->whereInitialize());
//        });
//@deprecated
//        $group->get('/whereoperators', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getWhereOperators($getParams['path'], $getParams['grouping'], $getParams['designer']));
//        });
//        $group->get('/whereoperators/all', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
////            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getAllWhereOperators());
//        });
//        $group->get('/enumoptions', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getEnumOptions($getParams['path'], $getParams['grouping'], json_decode(html_entity_decode($getParams['operators']), true)));
//        });
//@deprecated
//        $group->get('/nodes', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getNodes($getParams['nodeid']));
//        });
//@deprecated
//        $group->get('/fields', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getFields($getParams['nodeid']));
//        });
//@deprecated
//        $group->get('/buckets', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getBuckets());
//        });
//@deprecated
//        $group->get('/modulefields', function ($req, $res, $args) use ($RESTManager) {
//          $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getModuleFields($getParams['module']));lds', function ($req, $res, $args) use ($RESTManager) {
//        });
//        $group->get('/wherefunctions', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            return $res->withJson($restHandler->getWhereFunctions());
//        });
//@deprecated
//        $group->get('/autocompletevalues', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->geAutoCompletevalues($getParams['path'], $getParams['query'], $getParams['start'], $getParams['limit']));
//        });
//@deprecated
//        $group->get('/layouts', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            return $res->withJson($restHandler->getLayouts());
//        });

//        $group->get('/vizcolors', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            return $res->withJson($restHandler->getVizColors());
//        });

//@renamed
//        $group->group('/savelayout', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//            $group->post('', function ($req, $res, $args) use ($KReportRestHandler) {
//                $postBody = $req->getParsedBody();
//                return $res->withJson($KReportRestHandler->saveStandardLayout($postBody['record'], $postBody['layout']));
//            });
//            $group->post('/{report_id}', function ($req, $res, $args) use ($KReportRestHandler) {
//                $postBody = $req->getParsedBody();
//                return $res->withJson($KReportRestHandler->saveStandardLayout($args['report_id'], $postBody['layout']));
//            });
//        });
//@deprecated
//        $group->get('/config', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            return $res->withJson($restHandler->getConfig());
//        });
//@deprecated
//        $group->get('/labels', function ($req, $res, $args) use ( $RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            return $res->withJson($restHandler->getLabels());
//        });
//@deprecated
//        $group->get('/currencies', function ($req, $res, $args) use ($KReportRestHandler) {
//            return $res->withJson($KReportRestHandler->getCurrencies());
//        });
//    });
//@deprecated
//    $group->group('/user', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//        $group->get('/datetimeformat', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            return $res->withJson($restHandler->get_user_datetime_format());
//        });
//        $group->get('/userprefs', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            return $res->withJson($restHandler->get_user_prefs());
//        });
//        $group->get('/getlist', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $params = $req->getQueryParams();
//            return $res->withJson($restHandler->get_users_list($params));
//        });
//    });
//    $group->group('/plugins', function (RouteCollectorProxy $group) use ($KReportRestHandler) {
//@deprecated
//        $group->get('', function ($req, $res, $args) use ($KReportRestHandler) {
//            $pluginManager = new KReportPluginManager();
//
//            $params = $req->getQueryParams();
//            $pluginData = $pluginManager->getPlugins($params['report']);
//
//            $addDataArray = [];
//            if ($params['addData']) {
//                $addData = json_decode(html_entity_decode($params['addData']), true);
//                foreach ($addData as $addDataEntry) {
//                    switch ($addDataEntry) {
//                        case 'currencies':
//                            $addDataArray[$addDataEntry] = $KReportRestHandler->getCurrencies();
//                            break;
//                        case 'sysinfo':
//                            $addDataArray[$addDataEntry] = $KReportRestHandler->getSysinfo();
//                            break;
//                    }
//                }
//            }
//
//            $pluginData['addData'] = $addDataArray;
//
//            return $res->withJson($pluginData);
//        });
//        $group->group('/action/{plugin}/{action}', function(RouteCollectorProxy $group) {
//            $group->post('', function($req, $res, $args) {
//                $pluginManager = new KReportPluginManager();
//                $getParams = $req->getQueryParams();
//
//                //BEGINAFTER slim update
//                $formBody = $req->getParsedBody();
//                $postBody = $formBody;
//                if(!$postBody && $formBody != ''){
//                    parse_str($req->getParsedBody(), $postBody);
//                }
//                //END
//
//                if(!$postBody) $postBody = [];
//
//                //Only return if not null! In case of empty we get a null line in exports (csv, xlsx) and excel can't open file properly
//                //echo json_encode($pluginManager->processPluginAction($args['plugin'], 'action_' . $args['action'], array_merge($getParams,$postBody)));
//                $resultsPluginAction = $pluginManager->processPluginAction($args['plugin'], 'action_' . $args['action'], array_merge($getParams,$postBody));
//                if(!empty($resultsPluginAction)){
//                    $res->getBody()->write($resultsPluginAction);
//                    return $res->withStatus(200);
//                }
//            });
////@deprecated
////            $group->get('', function($req, $res, $args) {
////                $pluginManager = new KReportPluginManager();
////                $getParams = $req->getQueryParams();
////                return $res->withJson($pluginManager->processPluginAction($args['plugin'], 'action_' . $args['action'], $getParams));
////            });
//        });
//    });

//    $group->group('/{id}', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//@deprecated
//        $group->get('', function ($req, $res, $args) use ($RESTManager) {
//            $thisReport = BeanFactory::getBean('KReports', $args['id']);
//            $vizData = json_decode(html_entity_decode($thisReport->visualization_params, ENT_QUOTES, 'UTF-8'), true);
//            $pluginManager = new KReportPluginManager();
//            $vizObject = $pluginManager->getVisualizationObject('googlecharts');
//            return $res->withJson($vizObject->getItem('', $thisReport, $vizData[1]['googlecharts']));
//        });
//        $group->group('/snapshot', function (RouteCollectorProxy $group) use ($RESTManager) {
//            $group->get('', function ($req, $res, $args) use ($RESTManager) {
//                $thisReport = new KReport();
//                $thisReport->retrieve($args['id']);
//                $requestParams = $req->getQueryParams();
//                return $res->withJson($thisReport->getSnapshots($requestParams['withoutActual']));
//            });
//            $group->group('/{snapshotid}', function (RouteCollectorProxy $group) use ($RESTManager) {
//                $group->delete('', function ($req, $res, $args) use ($RESTManager) {
//                    $thisReport = new KReport();
//                    $thisReport->retrieve($args['id']);
//                    $thisReport->deleteSnapshot($args['snapshotid']);
//                });
//@deprecated
//                $group->get('/whereconditions', function ($req, $res, $args) use ($RESTManager) {
//                    return $res->withJson(KReport::getSnapshotWhereClause($args['snapshotid']));
//                });
//            });
//        });

//        if (class_exists('SpiceCRM\modules\KReports\api\controllers\KReportsPluginSavedFiltersController')) {
//            $group->group('/savedfilter', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//                $group->get('', [new KReportsPluginSavedFiltersController(), 'getSavedFilters']);
//@deprecated
//                $group->get('/assigneduserid/{assigneduserid}', [new KReportsPluginSavedFiltersController(), 'getSavedFilters']);

//                $group->group('/{savedfilterid}', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//                    $group->post('', [new KReportsPluginSavedFiltersController(), 'saveFilter']);
//                    $group->delete('', [new KReportsPluginSavedFiltersController(), 'deleteFilter']);
//                });
//            });
//        }

//@deprecated
//        $group->get('/layout', function($req, $res, $args) use ($RESTManager) {
//            $layout = [];
//            $thisReport = BeanFactory::getBean('KReports', $args['id']);
//            $vizData = json_decode(html_entity_decode($thisReport->visualization_params, ENT_QUOTES, 'UTF-8'), true);
//            echo(json_encode($vizData));
//            $vizManager = new KReportVisualizationManager();
//
//            for ($i = 0; $i < count($vizManager->layouts[$vizData['layout']]['items']); $i++) {
//                $layout[] = [
//                    "top" => $vizManager->layouts[$vizData['layout']]['items'][$i]['top'],
//                    "left" => $vizManager->layouts[$vizData['layout']]['items'][$i]['left'],
//                    "height" => $vizManager->layouts[$vizData['layout']]['items'][$i]['height'],
//                    "width" => $vizManager->layouts[$vizData['layout']]['items'][$i]['width']
//                ];
//            }
//            // echo json_encode($layout);
//        });
//
//        $group->group('/visualization', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//            $group->post('', function($req, $res, $args) use ($KReportRestHandler) {
//                $requestParams = $req->getQueryParams();
//                $postBody = json_decode($req->getParsedBody(), true);
//                if(!is_array($requestParams))
//                    $requestParams = [];
//                if(is_array($postBody))
//                    $requestParams = array_merge($requestParams, $postBody);
//                return $res->withJson($KReportRestHandler->getVisualization($args['id'], $requestParams));
//            });
//            $group->get('', function($req, $res, $args) use ($KReportRestHandler) {
//                return $res->withJson($KReportRestHandler->getVisualization($args['id'], $req->getQueryParams()));
//            });
//            //passing dynamicoptions in url may generate a far too long url and trigger a http 400 bad request
//            //pass dynamicoptions to post
//            $group->group('/dynamicoptions', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//                $group->post('', function($req, $res, $args) use ($RESTManager, $KReportRestHandler) {
//                    $requestParams = $req->getQueryParams();
//                    $postBody = $req->getParsedBody();
//                    if(!is_array($requestParams))
//                        $requestParams = [];
//                    if(is_array($postBody))
//                        $requestParams = array_merge($requestParams, $postBody);
//                    return $res->withJson($KReportRestHandler->getVisualization($args['id'], $requestParams));
//                });
//                //keep a get for UI and Sugar7....
//                $group->get('', function($req, $res, $args) use ($RESTManager, $KReportRestHandler) {
//                    $requestParams = $req->getQueryParams();
//                    $postBody = $req->getParsedBody();
//                    if(!is_array($requestParams))
//                        $requestParams = [];
//                    if(is_array($postBody))
//                        $requestParams = array_merge($requestParams, $postBody);
//                    return $res->withJson($KReportRestHandler->getPresentation($args['id'], $requestParams));
//                });
//            });
//        });

//        $group->group('/presentation', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//            $group->post('', function($req, $res, $args) use ($KReportRestHandler) {
//                $requestParams = $req->getQueryParams();
//                $postBody = $req->getParsedBody();
//                if(!is_array($requestParams))
//                    $requestParams = [];
//                if(is_array($postBody))
//                    $requestParams = array_merge($requestParams, $postBody);
//                return $res->withJson($KReportRestHandler->getPresentation($args['id'], $requestParams));
//            });
//            $group->get('', function($req, $res, $args) use ($KReportRestHandler) {
//                return $res->withJson($KReportRestHandler->getPresentation($args['id'], $req->getQueryParams()));
//            });
            //passing dynamicoptions in url may generate a far too long url and trigger a http 400 bad request
            //pass dynamicoptions to post
//            $group->group('/dynamicoptions', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//                $group->post('', function($req, $res, $args) use ($RESTManager, $KReportRestHandler) {
//                    $requestParams = $req->getQueryParams();
//                    $postBody = $req->getParsedBody();
//                    if(!is_array($requestParams))
//                        $requestParams = [];
//                    if(is_array($postBody))
//                        $requestParams = array_merge($requestParams, $postBody);
//                    return $res->withJson($KReportRestHandler->getPresentation($args['id'], $requestParams));
//                });
//                //keep a get for UI and Sugar7....
//                $group->get('', function($req, $res, $args) use ($RESTManager, $KReportRestHandler) {
//                    $requestParams = $req->getQueryParams();
//                    $postBody = $req->getParsedBody();
//                    if(!is_array($requestParams))
//                        $requestParams = [];
//                    if(is_array($postBody))
//                        $requestParams = array_merge($requestParams, $postBody);
//                    return $res->withJson($KReportRestHandler->getPresentation($args['id'], $requestParams));
//                });
//            });
//        });
//    });

//@deprecated in Spice version but not integrated yet
//    $group->group('/bucketmanager', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//        $group->get('/enumfields', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getEnumfields($getParams['modulename']));
//        });
//        $group->get('/enumfieldvalues', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getEnumfieldvalues($getParams));
//        });
//        $group->get('/groupings', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getGroupings());
//        });
//        $group->post('/savenewgrouping', function ($req, $res, $args) use ($KReportRestHandler) {
//            $postBody = $req->getParsedBody();
//            return $res->withJson($KReportRestHandler->saveNewGrouping($postBody));
//        });
//        $group->post('/updateGrouping', function ($req, $res, $args) use ($KReportRestHandler) {
//            $postBody = $req->getParsedBody();
//            return $res->withJson($KReportRestHandler->updateGrouping($postBody));
//        });
//        $group->post('/deleteGrouping', function ($req, $res, $args) use ($KReportRestHandler) {
//            $postBody = $req->getParsedBody();
//            return $res->withJson($KReportRestHandler->deleteGrouping($postBody));
//        });
//    });
//

//@deprecated in Spice version but not integrated yet
//distributionlists should be stored in a separate SpiceCRM module  and integrated in KReports
//    $group->group('/dlistmanager', function (RouteCollectorProxy $group) use ($RESTManager, $KReportRestHandler) {
//        $group->get('/dlists', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getDLists());
//        });
//        $group->get('/users', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getUsers($getParams));
//        });
//        $group->get('/contacts', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getContacts($getParams));
//        });
//        $group->get('/kreports', function ($req, $res, $args) use ($RESTManager) {
//            $restHandler = new KReporterRESTHandler();
//            $getParams = $req->getQueryParams();
//            return $res->withJson($restHandler->getKReports($getParams));
//        });
//
//        $group->post('/savenewdlist', function ($req, $res, $args) use ($KReportRestHandler) {
//            $postBody = $req->getParsedBody();
//            return $res->withJson($KReportRestHandler->saveNewDList($postBody));
//        });
//        $group->post('/updatedlist', function ($req, $res, $args) use ($KReportRestHandler) {
//            $postBody = $req->getParsedBody();
//            return $res->withJson($KReportRestHandler->updateDList($postBody));
//        });
//        $group->post('/deletedlist', function ($req, $res, $args) use ($KReportRestHandler) {
//            $postBody = $req->getParsedBody();
//            return $res->withJson($KReportRestHandler->deleteDList($postBody));
//        });
//    });
//
//});
