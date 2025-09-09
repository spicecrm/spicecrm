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
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\SpiceBeans\SpiceModules;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinition;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinitions;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomainFields;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomains;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomainValidations;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryIndexes;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItems;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationships;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceUI\Loaders\SpiceUIWordsLoader;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;

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
        [$validations, $validationValues] = SpiceDictionaryDomainValidations::getInstance()->retrieveValidationsAndValues();
        $results = [
            'domaindefinitions' => array_values(SpiceDictionaryDomains::getInstance()->retrieveDomains()),
            'domainfields' => array_values(SpiceDictionaryDomainFields::getInstance()->retrieveFields()),
            'domainfieldvalidations' => array_values($validations),
            'domainfieldvalidationvalues' => array_values($validationValues)
        ];
        return $res->withJson($results);
    }

    public function getDefinitions(Request $req, Response $res, array $args): Response
    {
        $results = [
            'domaindefinitions' => array_values(SpiceDictionaryDomains::getInstance()->retrieveDomains()),
            'domainfields' => array_values(SpiceDictionaryDomainFields::getInstance()->retrieveFields()),
            'dictionarydefinitions' => array_values(SpiceDictionaryDefinitions::getInstance()->retrieveDefinitions()),
            'dictionaryitems' => array_values(SpiceDictionaryItems::getInstance()->retrieveItems()),
            'dictionaryrelationshiptypes' => array_values(SpiceDictionaryRelationships::getInstance()->retrieveRelationshipTypes()),
            'dictionaryrelationships' => array_values(SpiceDictionaryRelationships::getInstance()->retrieveRelationships()),
            'dictionaryrelationshippolymorphs' => array_values(SpiceDictionaryRelationships::getInstance()->retrievePolymorphRelationships()),
            'dictionaryrelationshipfields' => array_values(SpiceDictionaryRelationships::getInstance()->retrieveRelationshipFields()),
            'dictionaryindexes' => array_values(SpiceDictionaryIndexes::getInstance()->retrieveIndexes()),
            'dictionaryindexitems' => array_values(SpiceDictionaryIndexes::getInstance()->retrieveIndexItems()),
            'settings' => [
                'migration_enabled' => SpiceConfig::getInstance()->get('systemvardefs.migration_enabled') == 1,
                'create_system_file_enabled' => SpiceConfig::getInstance()->get('systemvardefs.create_system_file_enabled') == 1,
                ],
            'vardefFields' => SpiceDictionaryHandler::getInstance()->dictionary,
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
            $retArray[$language['language_code']]['global'] = SpiceUtils::returnAppListStringsLanguage('en_us', 'global');
            $retArray[$language['language_code']]['custom'] = SpiceUtils::returnAppListStringsLanguage('en_us', 'custom');


            foreach($retArray[$language['language_code']]['custom'] as $dom => $values){
                if(isset($retArray[$language['language_code']]['global'][$dom])){
                    unset($retArray[$language['language_code']]['global'][$dom]);
                }
            }

        }

        return $res->withJson($retArray);
    }


    /**
     * list all vardefs named after a reserved word
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function getSpiceWords(Request $req, Response $res, array $args): Response{
        $wording = new SpiceUIWordsLoader();
        return $res->withJson($wording->getWords());
    }
    /**
     * list all vardefs named after a reserved word
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function checkSpiceWordsInVardefs(Request $req, Response $res, array $args): Response{
        $retArray = [];
        $reservedWords = SpiceUIWordsLoader::getWords('db', null);
        $db = DBManagerFactory::getInstance();
        $tables = $db->getTablesArray();
        foreach($tables as $table) {
            $columns = $db->get_columns($table);
            foreach($columns as $columnName => $column) {
                if(in_array(strtoupper($column['name']), $reservedWords['reservedwords'])){
                    $retArray[$table][] = $column['name'];
                }
            }
        }
        return $res->withJson($retArray);
    }


    /**
     * list all defined dictionaryfeirlds entries
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function getDictionaryFields(Request $req, Response $res, array $args): Response
    {
        $definitionNames = [];

        # extract vardef definition names
        foreach (SpiceDictionaryHandler::getInstance()->dictionary as $name => $dictionary) {
            $definitionNames[] = $name;
        }


        foreach (SpiceDictionaryDefinitions::getInstance()->getAllDefinitions() as $definition) {
            $definitionNames[] = $definition['name'];
        }

        $definitions = [];

        foreach ($definitionNames as $name) {

            $def = SpiceDictionary::getInstance()->getDefs($name);

            $definitions[] = [
                'sysdictionarytablename' => $def['table'],
                'sysdictionarydefinition_id' => $def['id'],
                'sysdictionaryname' => $def['name'],
                'sysdictionarytableaudited' => $def['audited'],
                'sysdictionarytablecontenttype' => $def['contenttype'],
                'fields' => $def['fields']
            ];
        }

        return $res->withJson($definitions);
    }


    /**
     * loads the vardefs including legacy files and returns them
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function getDictionaryVardefs(Request $req, Response $res, array $args): Response{
        return $res->withJson(SpiceDictionaryVardefs::loadVardefs([$args['dictionaryname']]));
    }

    /**
     * get all columns from the module-table in the database
     * allowed as admin
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getDBColumns(Request $req, Response $res, array $args): Response {
        return $res->withJson(array_values(DBManagerFactory::getInstance()->get_columns($args['dictionaryname'])));
    }

    /**
     * deletes DB Columns
     * allowed as admin
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function deleteDBColumns(Request $req, Response $res, array $args): Response {
        $params = $req->getQueryParams();
        $fields = json_decode($params['fields'], true);
        if(!is_array($fields) || count($fields) == 0){
            throw new BadRequestException('no fields supplied');
        }
        return $res->withJson(['success' => DBManagerFactory::getInstance()->delete_columns($args['dictionaryname'], $fields)]);
    }

    /**
     * gets all definitions for a repair
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getRepairDefinitions(Request $req, Response $res, array $args): Response {
        // get all active that are not templates
        $spiceDictionaryDefinitions = [];
        $allSpiceDictionaryDefinitions = array_filter(
            SpiceDictionaryDefinitions::getInstance()->getDefinitions('a'), fn($d) => $d['sysdictionary_type'] != 'template'
        );

        foreach ($allSpiceDictionaryDefinitions as $spiceDictionaryDefinition){

            # add all but the module definitions
            if($spiceDictionaryDefinition['sysdictionary_type'] != 'module') {
                $spiceDictionaryDefinitions[] = $spiceDictionaryDefinition;

            # add only modules that have an entry in sysmodules
            } else if (SpiceModules::getInstance()->getModuleByDictionaryDefinitionId($spiceDictionaryDefinition['id'])) {
                $spiceDictionaryDefinitions[] = $spiceDictionaryDefinition;
            }
        }

        // get vardefs
        $vardefDictionaryDefinitions = [];

        foreach(SpiceDictionaryHandler::getInstance()->dictionary as $vardefName => $vardefDefinition){

            if (!$vardefDefinition['table']) continue;

            // check that this is not defined in the dictionary already
            $isDuplicate = false;
            foreach ($spiceDictionaryDefinitions as $spiceDictionaryDefinition) {
                if ($spiceDictionaryDefinition['tablename'] == $vardefDefinition['table']) {
                    $isDuplicate = true;
                    break;
                }
            }

            // if we are here add it
            if (!$isDuplicate) {
                $vardefDictionaryDefinitions[] = [
                    'dictionaryname' => $vardefName,
                    'table' => $vardefDefinition['table']
                ];
            }
        }

        // return all values
        return $res->withJson([
            'SpiceDictionaryDefinitions' => array_values($spiceDictionaryDefinitions),
            'VardefDictionaryDefinitions' => array_values($vardefDictionaryDefinitions),
        ]);

    }

    /**
     * does a dictionary repair
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function repair(Request $req, Response $res, array $args): Response {
        $params = $req->getQueryParams();

        $sql = SpiceDictionaryDefinitions::getInstance()->repair($args['id'] ,true, $params['execute'] == 1);

        if($params['execute'] == 1 && $sql){
            try {
                DBManagerFactory::getInstance()->query($sql);
            } catch (\Exception $exception){
                $error = DBManagerFactory::getInstance()->lastDbError();
            }
        }

        return $res->withJson(['sql' => $sql, 'sqlerror' => $error]);
    }

    /**
     * does a dictionary repair
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function repairVardef(Request $req, Response $res, array $args): Response {
        $params = $req->getQueryParams();

        $sql = SpiceDictionaryDefinitions::getInstance()->repairVardefDefinition($args['name'] ,true);

        if($params['execute'] && $sql){
            try {
                DBManagerFactory::getInstance()->query($sql, true);
            } catch (Exception $exception){

                $result = ['sql' => $sql, 'sqlerror' => $exception->getMessage()];
                $fields = SpiceDictionaryHandler::getInstance()->dictionary[$args['name']]['fields'];
                $mismatch = SpiceDictionaryDefinition::getDBColumnsMismatch($args['name'], $fields);

                if ($mismatch) {
                    $result['errorDetails'] = [$args['name'] => $mismatch];
                    $result['errorCode'] = "columnsMismatch";
                }

                return $res->withJson($result);
            }
        }

        return $res->withJson(['sql' => $sql, 'sqlerror' => null]);
    }

    /**
     * does a complete repair
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function reset(Request $req, Response $res, array $args): Response {
        unset($_SESSION['sysdictionary']['sqls']);
        return $res->withJson(['success' => true]);
    }


    /**
     * executes a statement based on the given hash
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function executeSQL(Request $req, Response $res, array $args): Response {
        if(!isset($_SESSION['sysdictionary']['sqls'][$args['hash']])){
            throw new NotFoundException('SQL statement with the given hash not found');
        }

        try {
            DBManagerFactory::getInstance()->query($_SESSION['sysdictionary']['sqls'][$args['hash']]);
        } catch (\Exception $exception){
            $error = DBManagerFactory::getInstance()->lastDbError();
        }

        return $res->withJson(['error' => $error]);
    }

    /**
     * truncate db column
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     * @throws DatabaseException | \Exception
     */
    public function truncateDBColumn(Request $req, Response $res, array $args): Response
    {
        $definition = (object) SpiceDictionary::getInstance()->getDefs($args['dictionaryName']);

        $db = DBManagerFactory::getInstance();
        $column = $db->quote($req->getParsedBody()['column']);
        $fieldDef = $definition->fields[$column];

        $substringSql = $db->convert($column, 'substring', ['from' => 1, 'to' => $fieldDef['len']]);
        $lengthSql = $db->convert($column, 'length');
        $db->query("UPDATE $definition->table SET $column = $substringSql WHERE $lengthSql > {$fieldDef['len']}");

        return $res->withJson(['success' => true]);
    }

    /**
     * set db column null rows
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     * @throws DatabaseException | \Exception
     */
    public function setDBColumnNullRows(Request $req, Response $res, array $args): Response
    {
        $definition = (object) SpiceDictionary::getInstance()->getDefs($args['dictionaryName']);

        $body = $req->getParsedBody();
        $db = DBManagerFactory::getInstance();
        $column = $db->quote($body['column']);
        $value = $db->quote($body['value']);

        $db->query("UPDATE $definition->table SET $column = '$value' WHERE $column IS NULL", true);

        return $res->withJson(['success' => true]);
    }

    /**
     * delete db column null rows
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     * @throws DatabaseException | \Exception
     */
    public function deleteDBColumnNullRows(Request $req, Response $res, array $args): Response
    {
        $definition = (object) SpiceDictionary::getInstance()->getDefs($args['dictionaryName']);

        $db = DBManagerFactory::getInstance();
        $column = $db->quote($args['column']);

        $db->deleteQuery($definition->table, "$column IS NULL");

        return $res->withJson(['success' => true]);
    }

    /**
     * export dictionary definition as json
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function exportDictionaryDefinitionJson(Request $req, Response $res, array $args): Response
    {
        $definition = new SpiceDictionaryDefinition($args['id']);
        $res->getBody()->write(json_encode($definition->exportFields()));
        return $res->withHeader('Content-Type', 'application/json');
    }

    /**
     * get dictionary item build field
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function getDictionaryItemBuild(Request $request, Response $response, array $args): Response
    {
        $field = SpiceDictionary::getInstance()->getFieldByDefinitionIdAndItemId($args['defId'], $args['itemId']);

        return $response->withJson($field);
    }

}
