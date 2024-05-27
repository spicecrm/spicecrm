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
        $body = $req->getParsedBody();
        return $res->withJson($spiceACLObjectsRESTHandler->addACLModuleAction($args['moduleid'], $args['action'], $body['description']));
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
