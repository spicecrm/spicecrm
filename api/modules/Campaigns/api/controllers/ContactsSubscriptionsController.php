<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

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