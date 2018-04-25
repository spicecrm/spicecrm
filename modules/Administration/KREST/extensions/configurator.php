<?php
$app->group('/configurator', function () use ($app) {
    $app->get('/entries/{table}', function ($req, $res, $args) use ($app) {
        global $current_user, $db;

        if (!$current_user->is_admin) {
            http_response_code(401);
            header('HTTP/1.0 401', true, 401);
            header("Access-Control-Allow-Origin: *");
            HttpResponse::send('no admin privileges');
            exit;
        }

        $retArray = [];

        $entries = $db->query("SELECT * FROM {$args['table']}");
        while ($entry = $db->fetchByAssoc($entries)) {
            $retArrayEntry = [];
            foreach ($entry as $key => $value) {
                $retArrayEntry[$key] = html_entity_decode($value);
            }

            $retArray[] = $retArrayEntry;
        }

        echo json_encode($retArray);
    });
    $app->delete('/{table}/{id}', function ($req, $res, $args) use ($app) {
        global $current_user, $db;

        if (!$current_user->is_admin) {
            http_response_code(401);
            header('HTTP/1.0 401', true, 401);
            header("Access-Control-Allow-Origin: *");
            HttpResponse::send('no admin privileges');
            exit;
        }



        include('modules/TableDictionary.php');
        foreach ($dictionary as $meta) {
            if ($meta['table'] == $args['table']) {
                // check if we have a CR set
                if ($meta['changerequests']['active'] && $_SESSION['SystemDeploymentCRsActiveCR'])
                    $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

                if($cr){
                    $record = $db->fetchByAssoc($db->query("SELECT * FROM {$args['table']} WHERE id = '{$args['id']}'"));
                    if(is_array($meta['changerequests']['name'])){
                        $nameArray = [];
                        foreach($meta['changerequests']['name'] as $item){
                            $nameArray[]=$record['item'];
                        }
                        $cr->addDBEntry($args['table'], $args['id'], 'D', implode('/', $nameArray));
                    } else {
                        $cr->addDBEntry($args['table'], $args['id'], 'D', $record[$meta['changerequests']['name']]);
                    }
                }


            }
        }

        $db->query("DELETE FROM {$args['table']} WHERE id = '{$args['id']}'");

        echo json_encode(['status' => 'success']);
    });
    $app->post('/{table}/{id}', function ($req, $res, $args) use ($app) {
        global $current_user, $db;

        if (!$current_user->is_admin) {
            http_response_code(401);
            header('HTTP/1.0 401', true, 401);
            header("Access-Control-Allow-Origin: *");
            HttpResponse::send('no admin privileges');
            exit;
        }

        $postBody = $req->getParsedBody();

        $setArray = [];
        foreach ($postBody as $field => $value) {
            if ($field !== 'id')
                $setArray[] = "$field = '$value'";
        }

        if (count($setArray) > 0) {
            $exists = $db->fetchByAssoc($db->query("SELECT id FROM {$args['table']} WHERE id='{$args['id']}'"));
            if ($exists) {
                $db->query("UPDATE {$args['table']} SET " . implode(',', $setArray) . " WHERE id='{$args['id']}'");
            } else {
                $setArray[] = "id='{$args['id']}'";
                $db->query("INSERT INTO {$args['table']} SET " . implode(',', $setArray));
            }

            // check for CR relevancy
            include('modules/TableDictionary.php');
            foreach ($dictionary as $meta) {
                if ($meta['table'] == $args['table']) {
                    // check if we have a CR set
                    if ($meta['changerequests']['active'] && $_SESSION['SystemDeploymentCRsActiveCR'])
                        $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

                    if($cr){
                        if(is_array($meta['changerequests']['name'])){
                            $nameArray = [];
                            foreach($meta['changerequests']['name'] as $item){
                                $nameArray[]=$postBody['item'];
                            }
                            $cr->addDBEntry($args['table'], $args['id'], $exists ? 'U' : 'I', implode('/', $nameArray));
                        } else {
                            $cr->addDBEntry($args['table'], $args['id'], $exists ? 'U' : 'I', $postBody[$meta['changerequests']['name']]);
                        }
                    }

                }
            }

        }

        echo json_encode(['status' => 'success']);
    });
    $app->post('/update', function ($req, $res, $args) use ($app) {
        $postBody = $body = $req->getParsedBody();
        $postParams = $_GET;
        $data = array_merge($postBody, $postParams);
        echo json_encode(['status' => 'success']);
    });
});