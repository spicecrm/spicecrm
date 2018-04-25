<?php
require_once 'modules/Campaigns/utils.php';
$app->group('/newsletters', function () use ($app) {
    $app->get('/subscriptions/{contactid}', function($req, $res, $args) use ($app) {
        $focus = BeanFactory::getBean('Contacts', $args['contactid']);
        $subscription_arrays = get_subscription_lists_query($focus, true);
        echo json_encode($subscription_arrays);
    });
    $app->post('/subscriptions/{contactid}', function($req, $res, $args) use ($app) {
        $postBody = json_decode($_POST, true);
        $postParams = $_GET;
        $focus = BeanFactory::getBean('Contacts', $args['contactid']);
        foreach($postBody['subscribed'] as $subscribed){
            subscribe($subscribed['id'], '', $focus, true);
        }
        foreach($postBody['unsubscribed'] as $unsubscribed){
            unsubscribe($unsubscribed['id'], $focus);
        }
        echo json_encode(array('status' => 'success'));
    });
});