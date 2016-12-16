<?php
require_once('modules/KReleasePackages/KReleasePackage.php');

$app->group('/kreleasepackages', function () use ($app) {

    $app->get('', function () use ($app) {
        $rp = new KReleasePackage();
        $getParams = $app->request->get();
        $list = $rp->getList($getParams);
        echo json_encode($list);
    });
    $app->post('', function () use ($app) {
        $rp = new KReleasePackage();
        $postBody = $app->request->getBody();
        $postParams = $app->request->get();
        $params = array_merge(json_decode($postBody, true), $postParams);
        $res = $rp->saveRP($params);
        echo json_encode($res);
    });
    $app->delete('/:id', function ($id) use ($app) {
        $rp = new KReleasePackage();
        $rp->retrieve($id);
        $list = $rp->mark_deleted($id);
        echo json_encode(array('status' => 'OK'));
    });

    $app->get('/statusdom', function () use ($app) {
        $list = array();
        $app_list_strings['rpstatus_dom'] = array(
            '0' => 'created',
            '1' => 'in progress',
            '2' => 'completed',
        );
        foreach ($app_list_strings['rpstatus_dom'] as $id => $name) {
            $list[] = array(
                'id' => $id,
                'name' => $name
            );
        }
        echo json_encode(array('list' => $list));
    });

    $app->get('/typedom', function () use ($app) {
        include('custom/application/Ext/Language/en_us.lang.ext.php');
        $list = array();
        foreach ($app_list_strings['rptype_dom'] as $id => $name) {
            if($id === '4') continue; // type imported only over upload in deployment manager
            $list[] = array(
                'id' => $id,
                'name' => $name
            );
        }
        echo json_encode(array('list' => $list));
    });

    $app->get('/getCRs', function () use ($app) {
        $getParams = $app->request->get();
        $rp = new KReleasePackage();
        $files = $rp->getCRs($getParams);
        echo json_encode($files);
    });

    $app->get('/getCRList', function () use ($app) {
        $getParams = $app->request->get();
        $rp = new KReleasePackage();
        $files = $rp->getCRList($getParams);
        echo json_encode($files);
    });

    $app->get('/package', function () use ($app) {
        $getParams = $app->request->get();
        $rp = new KReleasePackage();
        $files = $rp->package($getParams);
        echo json_encode($files);
    });

    $app->get('/release/:id', function ($id) use ($app) {
        $getParams = $app->request->get();
        $rp = new KReleasePackage();
        $files = $rp->release_package($id);
        echo json_encode(array('status' => 'RELEASED '.$id));
    });
});
