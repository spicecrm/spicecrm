<?php
namespace SpiceCRM\modules\SpiceACLProfiles\api\controllers;

use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\SpiceACLProfiles\SpiceACLProfilesRESTHandler;


class SpiceACLProfilesController
{
    /**
     * Spice ACL Profile Activate
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return Response
     */
    public function activateProfile(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->activateProfile($args['id']));
    }

    /**
     * Spice ACL Profile Deactivate
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return Response
     */
    public function deactivateProfile(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->deactivateProfile($args['id']));
    }

    /**
     * Spice ACL Profile Objects
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function getProfileObjects(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->getProfileObjects($args['id']));
    }

    /**
     * Spice ACL Profile Object
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function addProfileObject(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->addProfileObject($args['id'], $args['objectid']));
    }


    /**
     * Spice ACL Profile Object Delete
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function deleteProfileObject(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->deleteProfileObject($args['id'], $args['objectid']));
    }


    /**
     * Spice ACL Auth Types
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return SpiceResponse
     * @throws \Exception
     */
    public function getACLProfilesForUser(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->getUserProfiles($args['id']));
    }

    /**
     * Spice ACL Profile Users
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function getUsersHavingProfile(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->getProfileUsers($args['id']));
    }


    /**
     * Spice ACL Add Profile Users
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function addProfileUsers(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        $postBody = $req->getParsedBody();
        return $res->withJson($spiceACLProfilesRESTHandler->addProfileUsers($args['id'], $postBody['userids']));
    }


    /**
     * allocate a profile to specified user
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function addProfileUser(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->addProfileUsers($args['id'], [$args['userid']]));
    }

    /**
     * remove a profile to specified user
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function deleteProfileUser(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->deleteProfileUser($args['id'], $args['userid']));
    }


}
