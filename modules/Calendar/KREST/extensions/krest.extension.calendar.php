<?php
require_once 'modules/Calendar/KREST/handlers/krest.handler.calendar.php';

$app->group('/calendar', function () use ($app) {
    $app->get('/{user}', function($req, $res, $args) use ($app) {
        $restHandler = new CalendarRestHandler();
        $params = $_GET;
        echo json_encode($restHandler->getUserCalendar($args['user'], $params));

    });
});