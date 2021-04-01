<?php
namespace SpiceCRM\modules\SpiceACLObjects\KREST\controllers;

use Psr\Http\Message\RequestInterface;
use SpiceCRM\modules\SpiceACLObjects\SpiceACLObjectsRESTHandler;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;


class SpiceACLObjectsController
{


    /**
     * Spice Acl Object
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function spiceAclObjects($req, $res, $args)
    {
        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        $getParams = $req->getQueryParams();
        return $res->withJson($spiceACLObjectsRESTHandler->getAuthObjects($getParams));
    }

    /**
     * Create Spice Acl Default Objects
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function createDefaultObjects($req, $res, $args)
    {
        /**
         * get a Rest Manager Instance
         */
        $RESTManager = RESTManager::getInstance();

        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        $getParams = $req->getQueryParams();
        return $res->withJson($spiceACLObjectsRESTHandler->createDefaultACLObjectsForModule($RESTManager->app, $getParams));
    }

    /**
     * Spice ACL Auth Types
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function authTypes($req, $res, $args)
    {
        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        return $res->withJson($spiceACLObjectsRESTHandler->getAuthTypes());
    }

    /**
     * Delete Spice ACL Auth Type
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function deleteAuthType($req, $res, $args)
    {
        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        return $res->withJson($spiceACLObjectsRESTHandler->deleteAuthType($args['id']));

    }

    /**
     * Get Spice ACL Auth Type
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function getAuthType($req, $res, $args)
    {
        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        return $res->withJson($spiceACLObjectsRESTHandler->getAuthType($args['id']));
    }

    /**
     * Create Spice ACL Auth Type Field
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function createAuthTypeField($req, $res, $args)
    {
        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        return $res->withJson($spiceACLObjectsRESTHandler->addAuthTypeField($args['id'], $args['field']));
    }

    /**
     * Delete Spice ACL Auth Type Field
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function deleteAuthTypeField($req, $res, $args)
    {
        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        return $res->withJson($spiceACLObjectsRESTHandler->deleteAuthTypeField($args['fieldid']));
    }

    /**
     * Get Spice ACL Auth Type Action
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function getAuthTypeAction($req, $res, $args)
    {
        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        return $res->withJson($spiceACLObjectsRESTHandler->getAuthTypeAction($args['id']));
    }

    /**
     * Create Spice ACL Auth Type Action
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function createAuthTypeAction($req, $res, $args)
    {
        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        $postParams = $req->getParsedBody();
        return $res->withJson($spiceACLObjectsRESTHandler->addAuthTypeAction($args['id'], $args['action']));
    }

    /**
     * Delete Spice ACL Auth Type Action
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function deleteAuthTypeAction($req, $res, $args)
    {
        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        return $res->withJson($spiceACLObjectsRESTHandler->deleteAuthTypeAction($args['actionid']));
    }

    /**
     * Activate
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function activate($req, $res, $args)
    {
        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        return $res->withJson($spiceACLObjectsRESTHandler->activateObject($args['id']));
    }

    /**
     * Delete Activation
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function deleteActivation($req, $res, $args)
    {
        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
        return $res->withJson($spiceACLObjectsRESTHandler->deactivateObject($args['id']));
    }




}