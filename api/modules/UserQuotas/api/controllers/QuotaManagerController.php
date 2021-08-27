<?php
namespace SpiceCRM\modules\UserQuotas\api\controllers;

use SpiceCRM\data\BeanFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class QuotaManagerController{

    /**
     * gets a quota User
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getQuotaUser(Request $req, Response $res, array $args): Response {
        $quota = BeanFactory::getBean('UserQuotas');
        return $res->withJson($quota->get_quotausers());
    }

    /**
     * gets a quota
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getQuota(Request $req, Response $res, array $args): Response {
        $quota = BeanFactory::getBean('UserQuotas');
        return $res->withJson($quota->get_quotas($args['year']));
    }

    /**
     * sets a quota
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function setQuota(Request $req, Response $res, array $args): Response {
        $quota = BeanFactory::getBean('UserQuotas');
        return $res->withJson($quota->set_quota($args['userid'], $args['year'], $args['period'], $args['quota']));
    }

    /**
     * deletes a quota
     * 
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function deleteQuota(Request $req, Response $res, array $args): Response {
        $quota = BeanFactory::getBean('UserQuotas');
        return $res->withJson($quota->delete_quota($args['userid'], $args['year'], $args['period']));
    }
}