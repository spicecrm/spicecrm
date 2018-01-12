<?php
$app->group('/systrashcan', function () use ($app) {
    $app->get('/', function () use ($app) {
        global $current_user;

        echo json_encode(SystemTrashCan::getRecords());
    });
    $app->get('/related/:transactionid/:recordid', function ($transactionid, $recordid) use ($app) {
        global $current_user;

        echo json_encode(SystemTrashCan::getRelated($transactionid, $recordid));
    });
    $app->post('/recover/:id', function ($id) use ($app) {
        global $current_user;

        $requestData = $app->request->get();

        $recovery = SystemTrashCan::recover($id, $requestData['recoverrelated'] == 'true' ? true : false);

        echo json_encode(Array(
            'status' => $recovery === true ? 'success' : 'error',
            'message' => $recovery === true ? '' : $recovery
        ));
    });
});