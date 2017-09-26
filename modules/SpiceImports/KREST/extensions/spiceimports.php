<?php

require_once('modules/SpiceImports/SpiceImport.php');

$bean = new SpiceImport();

$app->group('/import/:beanName', function () use ($app, $bean) {
    $app->post('/upf', function ($beanname) use ($app, $bean) {
        $postBody = $body = $app->request->getBody();
        $postParams = $app->request->get() ?: Array();
        echo $bean->saveImportFiles(array_merge(json_decode($postBody, true), $postParams));
    });
    $app->group('/savedImports', function () use ($app, $bean) {
        $app->get('', function ($beanname) use ($app, $bean) {
            echo json_encode($bean->getSavedImports($beanname));
        });
    });
    $app->post('/save', function ($beanname) use ($app, $bean) {
        global $current_user;
        $postBody = $body = $app->request->getBody();
        $postParams = $app->request->get() ?: Array();
        $bean->name = $beanname."_".gmdate('Y-m-d H:i:s');
        $bean->assigned_user_id = $current_user->id;
        $bean->status = 'o';
        $bean->save();
        echo $bean->process(array_merge(json_decode($postBody, true), $postParams, array('module' => $beanname, 'import_id' => $bean->id)));
    });
});