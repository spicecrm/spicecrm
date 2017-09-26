<?php

require_once('include/google/googleAPIRestHandler.php');

$googleAPIRestHandler = new googleAPIRestHandler();

$app->group('/googleapi', function () use ($app, $googleAPIRestHandler) {
    $app->group('/places', function () use ($app, $googleAPIRestHandler) {
        $app->get('/autocomplete/:term', function ($term) use ($app, $googleAPIRestHandler) {
            echo json_encode($googleAPIRestHandler->autocomplete($term));
        });
        $app->get('/:placeid', function ($placeid) use ($app, $googleAPIRestHandler) {
            echo json_encode($googleAPIRestHandler->getplacedetails($placeid));
        });
    });
});