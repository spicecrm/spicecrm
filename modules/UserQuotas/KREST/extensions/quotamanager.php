<?php

$app->group('/quotamanager', function () use ($app) {
    $app->get('/users', function () use ($app) {
        $quota = BeanFactory::getBean('UserQuotas');
        echo json_encode($quota->get_quotausers());
    });
    $app->get('/quotas/{year}', function($req, $res, $args) use ($app) {
        $quota = BeanFactory::getBean('UserQuotas');
        echo json_encode($quota->get_quotas($args['year']));
    });
    $app->post('/quota/{userid}/{year}/{period}/{quota}', function($req, $res, $args) use ($app) {
        $quota = BeanFactory::getBean('UserQuotas');
        echo json_encode($quota->set_quota($args['userid'], $args['year'], $args['period'], $args['quota']));
    });
    $app->delete('/quota/{userid}/{year}/{period}', function($req, $res, $args) use ($app) {
        $quota = BeanFactory::getBean('UserQuotas');
        echo json_encode($quota->delete_quota($args['userid'], $args['year'], $args['period']));
    });
});