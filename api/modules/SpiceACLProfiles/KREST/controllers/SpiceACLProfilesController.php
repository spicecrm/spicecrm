<?php
namespace SpiceCRM\modules\SpiceACLProfiles\KREST\controllers;

use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use SpiceCRM\modules\SpiceACLProfiles\SpiceACLProfilesRESTHandler;


class SpiceACLProfilesController
{

    /**
     * Spice ACL Auth Types
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function spiceAclProfilesForUser($req, $res, $args)
    {
        /**
         * get a Spice ACL Profile Handler
         */
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();

        return $res->withJson($spiceACLProfilesRESTHandler->getUserProfiles($args['userrid']));
    }


    /**
     * Spice ACL Profile Activate
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function spiceAclProfilesActivate($req, $res, $args)
    {
        /**
         * get a Spice ACL Profile Handler
         */
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();

        return $res->withJson($spiceACLProfilesRESTHandler->activateProfile($args['id']));
    }

    /**
     * Spice ACL Profile Deactivate
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function spiceAclProfilesDeactivate($req, $res, $args)
    {
        /**
         * get a Spice ACL Profile Handler
         */
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();

        return $res->withJson($spiceACLProfilesRESTHandler->deactivateProfile($args['id']));
    }

    /**
     * Spice ACL Profile Objects
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function spiceAclProfilesObjects($req, $res, $args)
    {
        /**
         * get a Spice ACL Profile Handler
         */
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();

        return $res->withJson($spiceACLProfilesRESTHandler->getProfileObjects($args['id']));
    }

    /**
     * Spice ACL Profile Object
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function spiceAclProfilesObject($req, $res, $args)
    {
        /**
         * get a Spice ACL Profile Handler
         */
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();

        $postParams = $req->getParsedBody();
        return $res->withJson($spiceACLProfilesRESTHandler->addProfileObject($args['id'], $args['objectid']));
    }


    /**
     * Spice ACL Profile Object Delete
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function spiceAclProfilesObjectDelete($req, $res, $args)
    {
        /**
         * get a Spice ACL Profile Handler
         */
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();

        $postParams = $req->getParsedBody();
        return $res->withJson($spiceACLProfilesRESTHandler->deleteProfileObject($args['id'], $args['objectid']));
    }

    /**
     * Spice ACL Profile Users
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function spiceAclProfilesUsers($req, $res, $args)
    {
        /**
         * get a Spice ACL Profile Handler
         */
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();

        return $res->withJson($spiceACLProfilesRESTHandler->getProfileUsers($args['id']));
    }


    /**
     * Spice ACL Add Profile Users
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function spiceAclAddProfilesUsers($req, $res, $args)
    {
        /**
         * get a Spice ACL Profile Handler
         */
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();

        $postBody = $req->getParsedBody();
        return $res->withJson($spiceACLProfilesRESTHandler->addProfileUsers($args['id'], $postBody['userids']));
    }


    /**
     * Spice ACL Add Profile User
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function spiceAclAddProfilesUser($req, $res, $args)
    {
        /**
         * get a Spice ACL Profile Handler
         */
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();

        $postParams = $req->getParsedBody();
        return $res->withJson($spiceACLProfilesRESTHandler->addProfileUser($args['id'], $args['userid']));
    }

    /**
     * Spice ACL Delete Profile User
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function spiceAclDeleteProfilesUser($req, $res, $args)
    {

        /**
         * get a Spice ACL Profile Handler
         */
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();

        $postParams = $req->getParsedBody();
        return $res->withJson($spiceACLProfilesRESTHandler->deleteProfileUser($args['id'], $args['userid']));
    }


}
