<?php

$app->group('/systemdeploymentcrs', function () use ($app) {

    $app->get('/getFiles', function () use ($app) {
        $getParams = $_GET;
        $cr = BeanFactory::getBean('SystemDeploymentCRs');
        $files = $cr->getFiles($getParams);
        echo json_encode($files);
    });

    $app->get('/getDetailFiles', function () use ($app) {
        $getParams = $_GET;
        $cr = BeanFactory::getBean('SystemDeploymentCRs');
        $files = $cr->getDetailFiles($getParams);
        echo json_encode($files);
    });

    $app->get('/getCommits', function () use ($app) {
        $getParams = $_GET;
        $cr = BeanFactory::getBean('SystemDeploymentCRs');
        $commits = $cr->getCommits($getParams);
        echo json_encode($commits);
    });

    $app->get('/getBranches', function () use ($app) {
        $getParams = $_GET;
        $cr = BeanFactory::getBean('SystemDeploymentCRs');
        $branches = $cr->getBranches($getParams);
        echo json_encode(array('list' => $branches));
    });

    $app->get('/getTables', function () use ($app) {
        $getParams = $_GET;
        $cr = BeanFactory::getBean('SystemDeploymentCRs');
        $branches = $cr->getTables($getParams);
        echo json_encode(array('list' => $branches));
    });

    $app->get('/getDetailDBEntries/{id}',  function($req, $res, $args) use ($app) {
        if($cr = BeanFactory::getBean('SystemDeploymentCRs', $args['id']))
            $files = $cr->getDetailDBEntries();
        echo json_encode($files);
    });

    $app->post('/active/{id}',  function($req, $res, $args) use ($app) {
        $_SESSION['SystemDeploymentCRsActiveCR'] = $args['id'];
        echo json_encode(['status' => 'success']);
    });

    $app->get('/active',  function() use ($app) {
        if($_SESSION['SystemDeploymentCRsActiveCR']){
            $cr = BeanFactory::getBean('SystemDeploymentCRs',$_SESSION['SystemDeploymentCRsActiveCR']);
        }
        echo json_encode([
            'id' => $_SESSION['SystemDeploymentCRsActiveCR'] ?: '',
            'name' => $cr->name ?: ''
        ]);
    });

    $app->get('/sql/{id}',  function($req, $res, $args) use ($app) {
        $cr = BeanFactory::getBean('SystemDeploymentCRs', $args['id']);
        $sql = $cr->getDBEntriesSQL();
        echo json_encode(['sql' => $sql]);
    });

    $app->get('/getDBEntries', function () use ($app) {
        $getParams = $_GET;
        $cr = BeanFactory::getBean('SystemDeploymentCRs');
        $files = $cr->getDBEntries($getParams);
        echo json_encode($files);
    });

    $app->get('/appConfig', function () use ($app) {
        $getParams = $_GET;
        $cr = BeanFactory::getBean('SystemDeploymentCRs');
        $conf = $cr->getAppConfig();
        echo json_encode($conf);
    });

});
