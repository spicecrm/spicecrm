<?php

require_once('include/SpiceFTSManager/SpiceFTSHandler.php');
$ftsManager = new SpiceFTSHandler();

$app->group('/fts', function () use ($app, $ftsManager)
{
    $app->post('/search/{module}', function ($req, $res, $args) use ($app, $ftsManager) {
        $getParams = $_GET;
        $postBody = $req->getParsedBody();
        echo json_encode($ftsManager->getSearchResults($args['module'], $postBody['searchterm'], $postBody['page'], $postBody['aggregates']));
    });
    $app->get('/globalsearch', function () use ($app, $ftsManager) {
        $getParams = $_GET;
        echo json_encode($ftsManager->getGlobalSearchResults('', '', $getParams));
    });
    $app->post('/globalsearch', function () use ($app, $ftsManager) {
        $getParams = $_GET;
        echo json_encode($ftsManager->getGlobalSearchResults('', '', $getParams));
    });
    $app->get('/globalsearch/{module}', function ($req, $res, $args) use ($app, $ftsManager) {
        $getParams = $_GET;
        echo json_encode($ftsManager->getGlobalSearchResults($args['module'], '', $getParams));
    });
    $app->post('/globalsearch/{module}', function ($req, $res, $args) use ($app, $ftsManager) {
        $postBody = $req->getParsedBody();
        $result = $ftsManager->getGlobalSearchResults($args['module'], '', $_GET, $postBody['aggregates'], $postBody['sort']);
        echo json_encode($result);
    });
    $app->get('/globalsearch/{module}/{searchterm}', function ($req, $res, $args) use ($app, $ftsManager) {
        $getParams = $_GET;
        echo json_encode($ftsManager->getGlobalSearchResults($args['module'], $args['searchterm'], $getParams));
    });
    $app->post('/globalsearch/{module}/{searchterm}', function ($req, $res, $args) use ($app, $ftsManager) {
        $getParams = $_GET;
        $postBody = $req->getParsedBody();
        echo json_encode($ftsManager->getGlobalSearchResults($args['module'], $args['searchterm'], $getParams, $postBody['aggregates'], $postBody['sort']));
    });
    $app->get('/searchmodules', function () use ($app, $ftsManager) {
        echo json_encode($ftsManager->getGlobalSearchModules());
    });
    $app->get('/searchterm/{searchterm}', function ($req, $res, $args) use ($app, $ftsManager) {
        $getParams = $_GET;
        echo json_encode($ftsManager->searchTerm($args['searchterm'], array(), $getParams['size'] ?: 10, $getParams['from'] ?: 0));
    });
});