<?php
$app->group('/dictionary', function () use ($app) {
    $app->get('/list/:table', function ($table) use ($app) {
        global $db;
        include('modules/TableDictionary.php');
        $return = array( 'fields' => array(), 'items' => array() );
        foreach($dictionary[$table]['fields'] as $field){
            $return['fields'][] = $field['name'];
        }
        $res = $db->query("SELECT ".implode(',',$return['fields'])." FROM ".$dictionary[$table]['table']);
        while($row = $db->fetchByAssoc($res)){
            $return['items'][] = $row;
        }
        echo json_encode($return);
    });
    $app->delete('/:id', function ($id) use ($app) {
        echo json_encode();
    });
    $app->post('/new', function () use ($app) {
        $postBody = $body = $app->request->getBody();
        $postParams = $app->request->get();
        $data = array_merge(json_decode($postBody, true), $postParams);
        echo json_encode();
    });
    $app->post('/update', function () use ($app) {
        $postBody = $body = $app->request->getBody();
        $postParams = $app->request->get();
        $data = array_merge(json_decode($postBody, true), $postParams);
        echo json_encode();
    });
});