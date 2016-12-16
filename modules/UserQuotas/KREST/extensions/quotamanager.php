<?php

$app->group('/quotamanager', function () use ($app) {
    $app->get('/users', function () use ($app) {
        $quota = BeanFactory::getBean('UserQuotas');
        echo json_encode($quota->get_quotausers());
    });
    $app->get('/quotas/:year', function ($year) use ($app) {
        $quota = BeanFactory::getBean('UserQuotas');
        echo json_encode($quota->get_quotas($year));
    });
    $app->post('/quota/:userid/:year/:period/:quota', function ($user, $year, $period, $salesquota) use ($app) {
        $quota = BeanFactory::getBean('UserQuotas');
        echo json_encode($quota->set_quota($user, $year, $period, $salesquota));
    });
    $app->delete('/quota/:userid/:year/:period', function ($user, $year, $period) use ($app) {
        $quota = BeanFactory::getBean('UserQuotas');
        echo json_encode($quota->delete_quota($user, $year, $period));
    });
});