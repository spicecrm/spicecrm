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

namespace SpiceCRM\includes\SpiceDictionary\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinition;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomains;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

/**
 * handles the dictionary domain definitions
 *
 * Class SpiceDictionaryDefinitionsController
 */
class SpiceDictionaryDomainDefinitionsController
{

    /**
     * posts a Domain Definition
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function postDictionaryDomainDefinition(Request $req, Response $res, array $args): Response
    {
        // get the body
        $body = $req->getParsedBody();

        SpiceDictionaryDomains::getInstance()->addDefinition($body);

        return $res->withJson((new SpiceDictionaryDomain($args['id']))->getDefinition());
    }

    /**
     * posts a Domain Definition
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deleteDictionaryDomainDefinition(Request $req, Response $res, array $args): Response
    {

        return $res->withJson((new SpiceDictionaryDomain($args['id']))->delete());
    }

    /**
     * activates a Domain Definition
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function activateDictionaryDomainDefinition(Request $req, Response $res, array $args): Response
    {
        return $res->withJson((new SpiceDictionaryDomain($args['id']))->activate());
    }

    /**
     * deactivates a Domain Definition
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deactivateDictionaryDomainDefinition(Request $req, Response $res, array $args): Response
    {
        $params = $req->getQueryParams();
        return $res->withJson((new SpiceDictionaryDomain($args['id']))->deactivate());
    }

    /**
     * repairs a Dictionary Definition
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function repairDictionaryDefinition(Request $req, Response $res, array $args): Response
    {
        $params = $req->getQueryParams();
        return $res->withJson(['success' => true, 'sql' => (new SpiceDictionaryDefinition($args['id']))->repair()]);
    }

    /**
     * repair domain definition related dictionary items
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function repairDomainDefinitionRelatedDictionaryItems(Request $req, Response $res, array $args): Response
    {
        (new SpiceDictionaryDomain($args['id']))->repairRelatedDictionaryItems();

        return $res->withJson(['success' => true]);
    }
}
