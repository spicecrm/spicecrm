<?php
namespace SpiceCRM\includes\SpiceSubscriptions\KREST\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceSubscriptions\SpiceSubscriptionsLoader;

class SpiceSubscriptionsController
{
    /**
     * Adds a subscription on the requested bean for the current user.
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function addSubscription(Request $req, Response $res, array $args): Response {
        $bean = BeanFactory::getBean($args['beanModule'], $args['beanId']);
        if ($bean) {
            $loader = new SpiceSubscriptionsLoader();
            $loader->addSubscription($bean);
            return $res->withStatus(200);
        }

        return $res->withStatus(404);
    }

    /**
     * Deletes a subscription on a bean for the current user.
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function deleteSubscription(Request $req, Response $res, array $args): Response {
        $loader = new SpiceSubscriptionsLoader();
        $loader->deleteSubscription($args['beanModule'], $args['beanId']);

        return $res->withStatus(200);
    }

    /**
     * Returns all the subscriptions for the current user.
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function getSubscriptions(Request $req, Response $res, array $args): Response {
        $loader = new SpiceSubscriptionsLoader();
        return $res->withJson([
            'records' => $loader->loadSubscriptions(),
        ]);
    }
}