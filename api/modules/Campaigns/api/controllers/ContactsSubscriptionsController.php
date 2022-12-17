<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Campaigns\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

require_once 'modules/Campaigns/utils.php';

class ContactsSubscriptionsController {

    /**
     * get a list of subscriptions for specified contact
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $res
     * @param $args
     * @return mixed
     */

    public function getSubscriptionList(Request $req, Response $res, array $args): Response {
        $focus = BeanFactory::getBean('Contacts', $args['id']);
        $subscription_arrays = get_subscription_lists_query($focus, true);
        return $res->withJson($subscription_arrays);
    }

    /**
     * change the status of a subscription for specified user
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function changeSubscriptionType(Request $req, Response $res, array $args): Response {
        $postBody = $req->getParsedBody();
        $focus = BeanFactory::getBean('Contacts', $args['id']);
        if(isset($postBody['subscribed']) && is_array($postBody['subscribed'])){
            foreach($postBody['subscribed'] as $subscribed){
                subscribe($subscribed['id'], '', $focus, true);
            }
        }
        if(isset($postBody['unsubscribed']) && is_array($postBody['unsubscribed'])) {
            foreach ($postBody['unsubscribed'] as $unsubscribed) {
                unsubscribe($unsubscribed['id'], $focus);
            }
        }
        return $res->withJson(['status' => 'success']);
    }
}