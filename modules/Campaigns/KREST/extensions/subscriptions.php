<?php
require_once 'modules/Campaigns/utils.php';
$app->group('/newsletters', function () use ($app) {
    $app->get('/subscriptions/:contactid', function ($contactid) use ($app) {
        $focus = BeanFactory::getBean('Contacts', $contactid);
        $subscription_arrays = get_subscription_lists_query($focus, true);
        echo json_encode($subscription_arrays);
    });
    $app->post('/subscriptions/:contactid', function ($contactid) use ($app) {
        $postBody = json_decode($app->request->getBody(), true);
        $postParams = $app->request->get();
        $focus = BeanFactory::getBean('Contacts', $contactid);
        foreach($postBody['subscribed'] as $subscribed){
            subscribe($subscribed['id'], '', $focus, true);
        }
        foreach($postBody['unsubscribed'] as $unsubscribed){
            unsubscribe($unsubscribed['id'], $focus);
        }
        echo json_encode(array('status' => 'success'));
    });
});