<?php

namespace SpiceCRM\modules\Campaigns\KREST\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use Psr\Http\Message\RequestInterface;

class SubscriptionController{

    /**
     * get a list of subscriptions
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $res
     * @param $args
     * @return mixed
     */

    public function getSubscriptionList($req,$res,$args){
        $focus = BeanFactory::getBean('Contacts', $args['contactid']);
        $subscription_arrays = get_subscription_lists_query($focus, true);
        return $res->withJson($subscription_arrays);
    }

    /**
     * change the status of a subscription
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function changeSubscriptionType($req,$res,$args){
        $postBody = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        $focus = BeanFactory::getBean('Contacts', $args['contactid']);
        foreach($postBody['subscribed'] as $subscribed){
            subscribe($subscribed['id'], '', $focus, true);
        }
        foreach($postBody['unsubscribed'] as $unsubscribed){
            unsubscribe($unsubscribed['id'], $focus);
        }
        return $res->withJson(['status' => 'success']);
    }
}