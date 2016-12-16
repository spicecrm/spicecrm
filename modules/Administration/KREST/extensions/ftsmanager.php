<?php

require_once('include/SpiceFTSManager/SpiceFTSRESTManager.php');
$spiceFTSManager = new SpiceFTSRESTManager();

$app->group('/ftsmanager', function () use ($app, $spiceFTSManager) {
    $app->group('/core', function () use ($app, $spiceFTSManager) {
        $app->get('/index', function () use ($app, $spiceFTSManager) {
            echo json_encode($spiceFTSManager->getIndex());
        });
        $app->get('/nodes', function () use ($app, $spiceFTSManager) {
            $getParams = $app->request->get();
            echo json_encode($spiceFTSManager->getNodes($getParams['nodeid']));
        });
        $app->get('/fields', function () use ($app, $spiceFTSManager) {
            $getParams = $app->request->get();
            echo json_encode($spiceFTSManager->getFields($getParams['nodeid']));
        });
    });
    $app->group('/:module', function () use ($app, $spiceFTSManager) {
        $app->get('/fields', function ($module) use ($app, $spiceFTSManager) {
            echo json_encode($spiceFTSManager->getFTSFields($module));
        });
        $app->get('/settings', function ($module) use ($app, $spiceFTSManager) {
            echo json_encode($spiceFTSManager->getFTSSettings($module));
        });
        $app->delete('/', function ($module) use ($app, $spiceFTSManager) {
            echo json_encode($spiceFTSManager->deleteIndex($module));
        });
        $app->post('/', function ($module) use ($app, $spiceFTSManager) {
            $items = json_decode($app->request->getBody(), true);
            echo json_encode($spiceFTSManager->setFTSFields($module, $items));
        });
        $app->post('/resetindex', function ($module) use ($app, $spiceFTSManager) {
            require_once('include/SpiceFTSManager/SpiceFTSHandler.php');
            $ftsHandler = new SpiceFTSHandler();

            // delete and recreate the index
            $spiceFTSManager->deleteIndex($module);
            $spiceFTSManager->mapModule($module);

            // index the beans
            $ftsHandler->resetIndexModule($module);

            echo json_encode(array('status' => 'success'));
        });
        $app->post('/index', function ($module) use ($app, $spiceFTSManager) {
            require_once('include/SpiceFTSManager/SpiceFTSHandler.php');
            $ftsHandler = new SpiceFTSHandler();

            // delete and recreate the index
            $spiceFTSManager->deleteIndex($module);
            $spiceFTSManager->mapModule($module);

            // index the beans
            $ftsHandler->indexModule($module);

            echo json_encode(array('status' => 'success'));
        });
        $app->post('/map', function ($module) use ($app, $spiceFTSManager) {
            $spiceFTSManager->mapModule($module);
            echo json_encode(array('status' => 'success'));
        });
    });
});