<?php

require_once('include/SpiceFTSManager/SpiceFTSHandler.php');

$app->group('/fts', function () use ($app) {
    $app->post('/search/:module', function ($module) use ($app) {
        $getParams = $app->request->get();
        $postBody = json_decode($app->request->getBody(), true);

        $ftsManager = new SpiceFTSHandler();
        echo json_encode($ftsManager->getSearchResults($module, $postBody['searchterm'], $postBody['page'], $postBody['aggregates']));
    });
    $app->get('/globalsearch/:modules', function ($modules) use ($app) {
        $getParams = $app->request->get();
        $ftsManager = new SpiceFTSHandler();
        echo json_encode($ftsManager->getGlobalSearchResults($modules, '', $getParams));
    });
    $app->get('/globalsearch/:modules/:searchterm', function ($modules, $searchterm) use ($app) {
        $getParams = $app->request->get();
        $ftsManager = new SpiceFTSHandler();
        echo json_encode($ftsManager->getGlobalSearchResults($modules, $searchterm, $getParams));
    });
    $app->get('/searchmodules', function ($module) use ($app) {
        $ftsManager = new SpiceFTSHandler();
        echo json_encode($ftsManager->getGlobalSearchModules());
    });

});