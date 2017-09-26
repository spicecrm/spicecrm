<?php
require_once 'modules/Calendar/KREST/handlers/krest.handler.calendar.php';

$app->group('/calendar', function () use ($app) {
    $app->get('/:user', function ($user) use ($app) {
        $restHandler = new CalendarRestHandler();
        $params = $app->request->get();
        echo json_encode($restHandler->getUserCalendar($user, $params));

    });
});