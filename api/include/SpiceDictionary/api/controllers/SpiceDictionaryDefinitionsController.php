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

use Exception;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinition;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinitions;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

/**
 * handles the dictioonary definitions
 *
 * Class SpiceDictionaryDefinitionsController
 */
class SpiceDictionaryDefinitionsController
{

    /**
     * posts a Dictionary Definition
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function postDictionaryDefinition(Request $req, Response $res, array $args): Response
    {
        // get the body
        $body = $req->getParsedBody();

        SpiceDictionaryDefinitions::getInstance()->addDefinition($body);

        return $res->withJson((new SpiceDictionaryDefinition($args['id']))->getDefinition());
    }

    /**
     * posts a Dictionary Definition
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deleteDictionaryDefinition(Request $req, Response $res, array $args): Response
    {
        $params = $req->getQueryParams();

        return $res->withJson((new SpiceDictionaryDefinition($args['id']))->delete($params['drop'] == '1'));
    }

    /**
     * activates a Dictionary Definition
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function activateDictionaryDefinition(Request $req, Response $res, array $args): Response
    {
        $success = (new SpiceDictionaryDefinition($args['id']))->activate();
        SpiceDictionary::getInstance()->loadDictionary();

        return $res->withJson($success);
    }

    /**
     * deactivates a Dictionary Definition
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deactivateDictionaryDefinition(Request $req, Response $res, array $args): Response
    {
        $params = $req->getQueryParams();

        $success = (new SpiceDictionaryDefinition($args['id']))->deactivate($params['drop'] == '1' ? true : false);
        SpiceDictionary::getInstance()->loadDictionary();

        return $res->withJson($success);
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
        $sql = (new SpiceDictionaryDefinition($args['id']))->repair();

        SpiceDictionary::getInstance()->loadDictionary();

        return $res->withJson(['success' => true, 'sql' => $sql]);
    }

    /**
     * reshuffles a Dictionary Definition
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function reshuffleDictionaryDefinition(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(['success' => (new SpiceDictionaryDefinition($args['id']))->reshuffle($req->getParsedBody())]);
    }

    /**
     * repair template related dictionaries
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     * @throws
     */
    public function repairTemplateRelatedDictionaries(Request $req, Response $res, array $args): Response
    {
        $sql = (new SpiceDictionaryDefinition($args['id']))->repairRelatedDictionaries();

        SpiceDictionary::getInstance()->loadDictionary();

        return $res->withJson(['success' => true, 'sql' => $sql]);
    }
}
