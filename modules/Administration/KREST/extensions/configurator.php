<?php
$app->group('/configurator', function () use ($app) {
    $app->get('/entries/:table', function ($table) use ($app) {
        global $current_user, $db;

        if (!$current_user->is_admin) {
            http_response_code(401);
            header('HTTP/1.0 401', true, 401);
            header("Access-Control-Allow-Origin: *");
            HttpResponse::send('no admin privileges');
            exit;
        }

        $retArray = [];

        $entries = $db->query("SELECT * FROM $table");
        while($entry = $db->fetchByAssoc($entries)){
            $retArrayEntry = [];
            foreach($entry as $key => $value){
                $retArrayEntry[$key] = html_entity_decode($value);
            }

            $retArray[] = $retArrayEntry;
        }

        echo json_encode($retArray);
    });
    $app->delete('/:table/:id', function ($table, $id) use ($app) {
        global $current_user, $db;

        if (!$current_user->is_admin) {
            http_response_code(401);
            header('HTTP/1.0 401', true, 401);
            header("Access-Control-Allow-Origin: *");
            HttpResponse::send('no admin privileges');
            exit;
        }

        $db->query("DELETE FROM $table WHERE id = '$id'");

        echo json_encode(['status' => 'success']);
    });
    $app->post('/:table/:id', function ($table, $id) use ($app) {
        global $current_user, $db;

        if (!$current_user->is_admin) {
            http_response_code(401);
            header('HTTP/1.0 401', true, 401);
            header("Access-Control-Allow-Origin: *");
            HttpResponse::send('no admin privileges');
            exit;
        }

        $postBody = json_decode($app->request->getBody(), true);

        $setArray = [];
        foreach($postBody as $field => $value){
            if($field !== 'id')
                $setArray[] = "$field = '$value'";
        }

        if(count($setArray) > 0) {
            $exists = $db->fetchByAssoc($db->query("SELECT id FROM $table WHERE id='$id'"));
            if($exists) {
                $db->query("UPDATE $table SET ". implode(',', $setArray) ." WHERE id='$id'");
            }else{
                $setArray[] = "id='$id'";
                $db->query("INSERT INTO $table SET ". implode(',', $setArray));
            }
        }

        echo json_encode(['status' => 'success']);
    });
    $app->post('/update', function () use ($app) {
        $postBody = $body = $app->request->getBody();
        $postParams = $app->request->get();
        $data = array_merge(json_decode($postBody, true), $postParams);
        echo json_encode();
    });
});