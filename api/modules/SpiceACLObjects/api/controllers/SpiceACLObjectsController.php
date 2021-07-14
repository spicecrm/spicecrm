<?php
namespace SpiceCRM\modules\SpiceACLObjects\api\controllers;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
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
     * @return SpiceResponse
     */
    public function getSpiceACLObjects(Request $req, Response $res, array $args): Response {
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
        $getParams = $req->getQueryParams();
        return $res->withJson($spiceACLObjectsRESTHandler->getSpiceACLObjects($getParams));
    }

    /**
     * Create Spice Acl Default Objects
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return SpiceResponse
     */
    public function createDefaultObjects(Request $req, Response $res, array $args): Response {
        /**
         * get a Rest Manager Instance
         */
        $RESTManager = RESTManager::getInstance();

        /**
         * get a Spice ACL Object Handler
         */
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();

        $postParams = $req->getParsedBody();
        return $res->withJson($spiceACLObjectsRESTHandler->createDefaultACLObjectsForModule($RESTManager->app, $postParams));
    }

    /**
     * Spice ACL get usage count of SpiceACLObjects for all modules
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return SpiceResponse
     */
    public function getACLModules(Request $req, Response $res, array $args): Response {
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
        return $res->withJson($spiceACLObjectsRESTHandler->getAuthTypes());
    }

    /**
     * Delete Spice ACL Auth Type
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return SpiceResponse
     */
//    public function deleteAuthType(Request $req, Response $res, array $args): Response {
//        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
//        return $res->withJson($spiceACLObjectsRESTHandler->deleteAuthType($args['id']));
//    }

    /**
     * Get Spice ACL module including fields & actions
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return SpiceResponse
     */
    public function getACLModule(Request $req, Response $res, array $args): Response {
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
        return $res->withJson($spiceACLObjectsRESTHandler->getACLModule($args['moduleid']));
    }

    /**
     * Create Spice ACL Auth Type Field
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return SpiceResponse
     */
    public function addACLModuleField(Request $req, Response $res, array $args): Response {
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
        return $res->withJson($spiceACLObjectsRESTHandler->addACLModuleField($args['moduleid'], $args['field']));
    }

    /**
     * Delete Spice ACL Auth Type Field
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return SpiceResponse
     */
    public function deleteACLModuleField(Request $req, Response $res, array $args): Response {
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
        return $res->withJson($spiceACLObjectsRESTHandler->deleteACLModuleField($args['fieldid']));
    }

    /**
     * Get Spice ACL Auth Type Action
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function getACLModuleActions(Request $req, Response $res, array $args): Response {
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
        return $res->withJson($spiceACLObjectsRESTHandler->getACLModuleActions($args['moduleid']));
    }

    /**
     * Create Spice ACL Auth Type Action
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function addACLModuleAction(Request $req, Response $res, array $args): Response {
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
        return $res->withJson($spiceACLObjectsRESTHandler->addACLModuleAction($args['moduleid'], $args['action']));
    }

    /**
     * Delete Spice ACL Auth Type Action
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function deleteACLModuleAction(Request $req, Response $res, array $args): Response {
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
        return $res->withJson($spiceACLObjectsRESTHandler->deleteACLModuleAction($args['actionid']));
    }

    /**
     * Activate
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return SpiceResponse
     */
    public function activateObject(Request $req, Response $res, array $args): Response {
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
        return $res->withJson($spiceACLObjectsRESTHandler->activateObject($args['id']));
    }

    /**
     * Delete Activation
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return SpiceResponse
     */
    public function deactivateObject(Request $req, Response $res, array $args): Response {
        $spiceACLObjectsRESTHandler = new SpiceACLObjectsRESTHandler();
        return $res->withJson($spiceACLObjectsRESTHandler->deactivateObject($args['id']));
    }


}
