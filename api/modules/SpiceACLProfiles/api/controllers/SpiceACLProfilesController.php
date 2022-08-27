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
     * get orgunits for a profile
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function getOrgUnitsHavingProfile(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->getProfileOrgUnits($args['id']));
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
     * add orgunits to a profile
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function addProfileOrgUnits(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        $postBody = $req->getParsedBody();
        return $res->withJson($spiceACLProfilesRESTHandler->addProfileOrgUnits($args['id'], $postBody['orgunitids']));
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
     * allocate one orgunit to a profile
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return Response
     * @throws \Exception
     */
    public function addProfileOrgUnit(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->addProfileOrgUnits($args['id'], [$args['orgunitid']]));
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

    /**
     * remove a profile to specified orgunits
     *
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */
    public function deleteProfileOrgUnit(Request $req, Response $res, array $args): Response {
        $spiceACLProfilesRESTHandler = new SpiceACLProfilesRESTHandler();
        return $res->withJson($spiceACLProfilesRESTHandler->deleteProfileOrgUnit($args['id'], $args['orgunitid']));
    }


}
