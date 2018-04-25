<?php

require_once('modules/SpiceImports/SpiceImport.php');

$bean = new SpiceImport();

$app->group('/import/{beanName}', function () use ($app, $bean) {
    $app->post('/upf', function($req, $res, $args) use ($app, $bean) {
        $postBody = $req->getParsedBody();
        $postParams = $_GET ?: Array();
        echo $bean->saveImportFiles(array_merge($postBody, $postParams));
    });
    $app->group('/savedImports', function () use ($app, $bean) {
        $app->get('', function($req, $res, $args) use ($app, $bean) {
            echo json_encode($bean->getSavedImports($args['beanName']));
        });
    });
    $app->post('/save', function($req, $res, $args) use ($app, $bean) {
        global $current_user;
        $postBody = $req->getParsedBody();
        $postParams = $_GET ?: Array();
        $bean->name = $args['beanName']."_".gmdate('Y-m-d H:i:s');
        $bean->assigned_user_id = $current_user->id;
        $bean->status = 'o';
        $bean->save();
        echo $bean->process(array_merge($postBody, $postParams, array('module' => $args['beanName'], 'import_id' => $bean->id)));
    });
});