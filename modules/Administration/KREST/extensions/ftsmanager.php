<?php

require_once('include/SpiceFTSManager/SpiceFTSRESTManager.php');

$spiceFTSManager = new SpiceFTSRESTManager();

$app->group('/ftsmanager', function () use ($app, $spiceFTSManager) {
    $app->group('/core', function () use ($app, $spiceFTSManager) {
        $app->get('/index', function () use ($app, $spiceFTSManager) {
            echo json_encode($spiceFTSManager->getIndex());
        });
        $app->get('/nodes', function () use ($app, $spiceFTSManager) {
            $getParams = $_GET;
            echo json_encode($spiceFTSManager->getNodes($getParams['nodeid']));
        });
        $app->get('/fields', function () use ($app, $spiceFTSManager) {
            $getParams = $_GET;
            echo json_encode($spiceFTSManager->getFields($getParams['nodeid']));
        });
        $app->get('/analyzers', function () use ($app, $spiceFTSManager) {
            echo json_encode($spiceFTSManager->getAnalyzers());
        });
        $app->post('/initialize', function () use ($app, $spiceFTSManager) {

            echo json_encode($spiceFTSManager->initialize());
        });
    });
    $app->group('/{module}', function() use ($app, $spiceFTSManager) {
        $app->get('/fields', function($req, $res, $args) use ($app, $spiceFTSManager) {
            echo json_encode($spiceFTSManager->getFTSFields($args['module']));
        });
        $app->get('/settings', function($req, $res, $args) use ($app, $spiceFTSManager) {
            echo json_encode($spiceFTSManager->getFTSSettings($args['module']));
        });
        $app->delete('', function($req, $res, $args) use ($app, $spiceFTSManager) {
            echo json_encode($spiceFTSManager->deleteIndex($args['module']));
        });
        $app->post('', function($req, $res, $args) use ($app, $spiceFTSManager) {
            $items = $req->getParsedBody();
            echo json_encode($spiceFTSManager->setFTSFields($args['module'], $items));
        });
        $app->post('/resetindex', function($req, $res, $args) use ($app, $spiceFTSManager) {
            require_once('include/SpiceFTSManager/SpiceFTSHandler.php');
            $ftsHandler = new SpiceFTSHandler();

            // delete and recreate the index
            $spiceFTSManager->deleteIndex($args['module']);
            $spiceFTSManager->mapModule($args['module']);

            // index the beans
            $ftsHandler->resetIndexModule($args['module']);

            echo json_encode(array('status' => 'success'));
        });
        $app->post('/index', function($req, $res, $args) use ($app, $spiceFTSManager) {
            require_once('include/SpiceFTSManager/SpiceFTSHandler.php');
            $ftsHandler = new SpiceFTSHandler();

            // delete and recreate the index
            $spiceFTSManager->deleteIndex($args['module']);
            $spiceFTSManager->mapModule($args['module']);

            // index the beans
            $ftsHandler->indexModule($args['module']);

            echo json_encode(array('status' => 'success'));
        });
        $app->post('/map', function($req, $res, $args) use ($app, $spiceFTSManager) {
            $result = $spiceFTSManager->mapModule($args['module']);
            echo json_encode(array('status' => 'success', 'result' => $result));
        });
    });
});