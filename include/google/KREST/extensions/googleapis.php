<?php

require_once('include/google/googleAPIRestHandler.php');

$googleAPIRestHandler = new googleAPIRestHandler();

$app->group('/googleapi', function () use ($app, $googleAPIRestHandler) {
    $app->group('/places', function () use ($app, $googleAPIRestHandler) {
        $app->get('/autocomplete/{term}', function($req, $res, $args) use ($app, $googleAPIRestHandler) {
            echo json_encode($googleAPIRestHandler->autocomplete($args['term']));
        });
        $app->get('/{placeid}',  function($req, $res, $args) use ($app, $googleAPIRestHandler) {
            echo json_encode($googleAPIRestHandler->getplacedetails($args['placeid']));
        });
    });
});