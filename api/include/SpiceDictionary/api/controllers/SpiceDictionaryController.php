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
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

/**
 * handles the dictioonary elements
 *
 * Class SpiceDictionaryKRESTController
 * @package SpiceCRM\includes\SpiceDictionary\api\controllers
 */
class SpiceDictionaryController
{

    /**
     * retrieves the domain definitions
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getDomains(Request $req, Response $res, array $args): Response
    {
        $handler = new SpiceDictionaryHandler();
        $results = [
            'domaindefinitions' => $handler->getDomainDefinitions(),
            'domainfields' => $handler->getDomainFields(),
            'domainfieldvalidations' => $handler->getDomainFieldValidations(),
            'domainfieldvalidationvalues' => $handler->getDomainFieldValidationValues()
        ];
        return $res->withJson($results);
    }

    /**
     * post the domain changes
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function postDomains(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        // check that we are an admin
        if(!$current_user->is_admin){
            throw new UnauthorizedException('Admin Access Only');
        }

        $handler = new SpiceDictionaryHandler();

        // get the body
        $body = $req->getParsedBody();

        $handler->setDomainDefinitions($body['domaindefinitions']);
        $handler->setDomainFields($body['domainfields']);
        $handler->setDomainFieldValidations($body['domainfieldvalidations']);
        $handler->setDomainFieldValidationValues($body['domainfieldvalidationvalues']);

        if($body['languagelabels']){
            $handler->postLanguageLabels($body['languagelabels'], $body['languagetranslations']);
        }

        if($body['languagecustomlabels']){
            $handler->postLanguageCustomLabels($body['languagecustomlabels'], $body['languagecustomtranslations']);
        }

        $results = [
            'domaindefinitions' => $handler->getDomainDefinitions(),
            'domainfields' => $handler->getDomainFields(),
            'domainfieldvalidations' => $handler->getDomainFieldValidations(),
            'domainfieldvalidationvalues' => $handler->getDomainFieldValidationValues()
        ];

        // remove from the session
        unset($_SESSION['systemvardefs']['domains']);

        // return the response
        return $res->withJson($results);
    }

    public function getDefinitions(Request $req, Response $res, array $args): Response
    {
        $handler = new SpiceDictionaryHandler();
        $results = [
            'domaindefinitions' => $handler->getDomainDefinitions(),
            'domainfields' => $handler->getDomainFields(),
            'dictionarydefinitions' => $handler->getDictionaryDefinitions(),
            'dictionaryitems' => $handler->getDictionaryItems(),
            'dictionaryrelationships' => $handler->getDictionaryRelationships(),
            'dictionaryrelationshiprelatefields' => $handler->getDictionaryRelateFields(),
            'dictionaryrelationshipfields' => $handler->getDictionaryRelationshipFields(),
            'dictionaryindexes' => $handler->getDictionaryIndexes(),
            'dictionaryindexitems' => $handler->getDictionaryIndexItems()
        ];
        return $res->withJson($results);
    }


    /**
     * post the domain changes
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function postDefinitions(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

//        // check that we are an admin
//        if(!$current_user->is_admin){
//            throw new UnauthorizedException('Admin Access Only');
//        }

        $handler = new SpiceDictionaryHandler();

        // get the body
        $body = $req->getParsedBody();

        $handler->setDictionaryDefinitions($body['dictionarydefinitions']);
        $handler->setDictionaryItems($body['dictionaryitems']);
        $handler->setDictionaryRelationships($body['dictionaryrelationships']);
        $handler->setDictionaryRelationshipFields($body['dictionaryrelationshipfields']);
        $handler->setDictionaryRelateFields($body['dictionaryrelationshiprelatefields']);
        $handler->setDictionaryIndexes($body['dictionaryindexes']);
        $handler->setDictionaryIndexItems($body['dictionaryindexitems']);

        $results = [
            'domaindefinitions' => $handler->getDomainDefinitions(),
            'domainfields' => $handler->getDomainFields(),
            'dictionarydefinitions' => $handler->getDictionaryDefinitions(),
            'dictionaryitems' => $handler->getDictionaryItems(),
            'dictionaryrelationships' => $handler->getDictionaryRelationships(),
            'dictionaryrelationshiprelatefields' => $handler->getDictionaryRelateFields(),
            'dictionaryrelationshipfields' => $handler->getDictionaryRelationshipFields(),
            'dictionaryindexes' => $handler->getDictionaryIndexes(),
            'dictionaryindexitems' => $handler->getDictionaryIndexItems()
        ];
        return $res->withJson($results);
    }

    /**
     * merge global with custom app list strings
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws UnauthorizedException
     */
    public function getAppListStrings(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        // check that we are an admin
        if(!$current_user->is_admin){
            throw new UnauthorizedException('Admin Access Only');
        }

        $retArray = [];

        $languages = $db->query("SELECT language_code FROM syslangs WHERE system_language = '1'");
        while($language = $db->fetchByAssoc($languages)){
            $retArray[$language['language_code']]['global'] = return_app_list_strings_language('en_us', 'global');
            $retArray[$language['language_code']]['custom'] = return_app_list_strings_language('en_us', 'custom');


            foreach($retArray[$language['language_code']]['custom'] as $dom => $values){
                if(isset($retArray[$language['language_code']]['global'][$dom])){
                    unset($retArray[$language['language_code']]['global'][$dom]);
                }
            }

        }

        return $res->withJson($retArray);
    }



}
