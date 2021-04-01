<?php
namespace SpiceCRM\modules\UserQuotas\KREST\controllers;

use SpiceCRM\data\BeanFactory;
use Slim\Routing\RouteCollectorProxy;
use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;

class QuotaManagerController{

    /**
     * gets a quota User
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     */

    public function GetQuotaUser($req,$res,$args){
        $quota = BeanFactory::getBean('UserQuotas');
        return $res->withJson($quota->get_quotausers());
    }

    /**
     * gets a quota
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function GetQuota($req,$res,$args){
        $quota = BeanFactory::getBean('UserQuotas');
        return $res->withJson($quota->get_quotas($args['year']));
    }

    /**
     * sets a quota
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function SetQuota($req,$res,$args){
        $quota = BeanFactory::getBean('UserQuotas');
        return $res->withJson($quota->set_quota($args['userid'], $args['year'], $args['period'], $args['quota']));
    }

    /**
     * deletes a quota
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function DeleteQuota($req,$res,$args){
        $quota = BeanFactory::getBean('UserQuotas');
        return $res->withJson($quota->delete_quota($args['userid'], $args['year'], $args['period']));
    }
}