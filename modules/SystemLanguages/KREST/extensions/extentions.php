<?php
require_once 'modules/SystemLanguages/SystemLanguagesRESTHandler.php';
$handler = new SystemLanguagesRESTHandler();

$app->group('/syslanguages', function () use ($app, $handler)
{
    $app->group('/labels', function() use ($app, $handler)
    {
        $app->post('', function($req, $res, $args) use($app, $handler) {
           $result = $handler->saveLabels($req->getParsedBody());
            echo json_encode($result);
        });
        $app->delete('/{id}/[{environment}]', function($req, $res, $args) use($app, $handler) {
            // delete a specific label...
            $result = $handler->deleteLabel($args['id'], $args['environment']);
            echo json_encode($result);
        });
        $app->get('/search/{search_term}', function($req, $res, $args) use($app, $handler){
            $result = $handler->searchLabels($args['search_term']);
            echo json_encode($result);
        });
    });
});