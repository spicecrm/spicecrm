<?php

require_once('include/SpiceFTSManager/SpiceFTSHandler.php');

$app->group('/fts', function () use ($app) {
    $app->post('/search/:module', function ($module) use ($app) {
        $getParams = $app->request->get();
        $postBody = json_decode($app->request->getBody(), true);

        $ftsManager = new SpiceFTSHandler();
        echo json_encode($ftsManager->getSearchResults($module, $postBody['searchterm'], $postBody['page'], $postBody['aggregates']));
    });
    $app->get('/globalsearch', function () use ($app) {
        $getParams = $app->request->get();
        $ftsManager = new SpiceFTSHandler();
        echo json_encode($ftsManager->getGlobalSearchResults('', '', $getParams));
    });
    $app->post('/globalsearch', function () use ($app) {
        $getParams = $app->request->get();
        $ftsManager = new SpiceFTSHandler();
        echo json_encode($ftsManager->getGlobalSearchResults('', '', $getParams));
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
    $app->post('/globalsearch/:modules', function ($modules) use ($app) {
        $getParams = $app->request->get();
        $postBody = json_decode($app->request->getBody(), true);
        $ftsManager = new SpiceFTSHandler();
        echo json_encode($ftsManager->getGlobalSearchResults($modules, '', $getParams, $postBody['aggregates'], $postBody['sort']));
    });
    $app->post('/globalsearch/:modules/:searchterm', function ($modules, $searchterm) use ($app) {
        $getParams = $app->request->get();
        $postBody = json_decode($app->request->getBody(), true);
        $ftsManager = new SpiceFTSHandler();
        echo json_encode($ftsManager->getGlobalSearchResults($modules, $searchterm, $getParams, $postBody['aggregates'], $postBody['sort']));
    });
    $app->get('/searchmodules', function () use ($app) {
        $ftsManager = new SpiceFTSHandler();
        echo json_encode($ftsManager->getGlobalSearchModules());
    });
    $app->get('/searchterm/:searchterm', function ($searchterm) use ($app) {
        $ftsManager = new SpiceFTSHandler();
        $getParams = $app->request->get();
        echo json_encode($ftsManager->searchTerm($searchterm, array(), $getParams['size'] ?: 10, $getParams['from'] ?: 0));
    });
});