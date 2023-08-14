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
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\utils\SpiceUtils;


class MigrateController
{

    /**
     * move dom keys to table, create corresponding labels
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function migrateLegacyDoms(Request $req, Response $res, array $args): Response
    {
        ini_set('max_execution_time', 300);
        $appListStrings = SpiceUtils::returnAppListStringsLanguage('en_us');
        $db = DBManagerFactory::getInstance();

        $doms = [];
        $sqls = [];
        // loop through array and only consider associative arrays
        foreach ($appListStrings as $listName => $stringValues) {
            if (is_array($stringValues)) {
                $sysdomainfieldvalidation_id = SpiceUtils::createGuid();
                // check if entry is already present in the table
                $checkInsert = true;
                $checkQ = "SELECT * FROM sysdomainfieldvalidations WHERE name ='{$listName}' AND deleted=0";
                if ($checkRow = $db->fetchOne($checkQ)) {
                    $checkInsert = false;
                    $sysdomainfieldvalidation_id = $checkRow['id'];
                }

                $sequence = 0;
                $doms[$listName]['id'] = $sysdomainfieldvalidation_id;
                $doms[$listName]['name'] = $listName;
                $doms[$listName]['order_by'] = 'sequence';
                $doms[$listName]['sort_flag'] = 'asc';
                $doms[$listName]['status'] = 'a';
                $doms[$listName]['deleted'] = 0;

                if ($checkInsert) {
                    $insertData = [
                        'id' => $sysdomainfieldvalidation_id,
                        'name' => $doms[$listName]['name'],
                        'validation_type' => 'options',
                        'order_by' => $doms[$listName]['order_by'],
                        'sort_flag' => $doms[$listName]['sort_flag'],
                        'status' => $doms[$listName]['status'],
                        'deleted' => $doms[$listName]['deleted'],
                    ];
//                    $sqls[] = $db->insertQuery('sysdomainfieldvalidations', $insertData, false);
                    $sqls[] = $db->query("INSERT INTO sysdomainfieldvalidations (" . implode(',', array_keys($insertData)) . ") VALUES('" . implode("','", $insertData) . "')");

                    // create sysdomaindefinition
                    $sysdomaindefinition_id = SpiceUtils::createGuid();
                    $insertData = [
                        'id' => $sysdomaindefinition_id,
                        'name' => self::cleanNameForDomainDefinition($doms[$listName]['name']),
                        'fieldtype' => 'enum',
                        'status' => $doms[$listName]['status'],
                        'deleted' => $doms[$listName]['deleted'],
                    ];
                    $sqls[] = $db->query("INSERT INTO sysdomaindefinitions (" . implode(',', array_keys($insertData)) . ") VALUES('" . implode("','", $insertData) . "')");

                    // create sysdomainfields
                    $parentVardefs = self::getVardefsUsingDom($doms[$listName]['name']);
                    $insertData = [
                        'id' => SpiceUtils::createGuid(),
                        'name' => '{sysdictionaryitems.name}',
                        'sysdomaindefinition_id' => $sysdomaindefinition_id,
                        'sysdomainfieldvalidation_id' => $sysdomainfieldvalidation_id,
                        'sequence' => 0,
                        'dbtype' => ($parentVardefs[0]['dbtype'] ?: 'varchar'),
                        'fieldtype' => ($parentVardefs[0]['type'] ?: 'enum'),
                        'len' => ($parentVardefs[0]['len'] ?: 99),
                        'label' => ($parentVardefs[0]['vname'] ?: ''),
                        'status' => $doms[$listName]['status'],
                        'deleted' => $doms[$listName]['deleted'],
                    ];
                    if (isset($parentVardefs[0]['default'])) {
                        $insertData['defaultvalue'] = $parentVardefs[0]['default'];
                    }
                    if (isset($parentVardefs[0]['required'])) {
                        $insertData['required'] = $parentVardefs[0]['required'];
                    }
                    $sqls[] = $db->query("INSERT INTO sysdomainfields (" . implode(',', array_keys($insertData)) . ") VALUES('" . implode("','", $insertData) . "')");

                }

                foreach ($stringValues as $key => $value) {
                    $doms[$listName]['validations'][$key]['id'] = SpiceUtils::createGuid();
                    $doms[$listName]['validations'][$key]['valuetype'] = (is_string($value) ? 'string' : 'integer');
                    $doms[$listName]['validations'][$key]['enumvalue'] = $key;
                    $doms[$listName]['validations'][$key]['label'] = 'LBL_' . ($value === '' ? 'BLANK' : strtoupper(str_replace([' / ', '/ ', '/', ' ', '-', '&', '(', ')'], ['_', '_', '_', '_', '_', '', '', ''], $value)));
                    $doms[$listName]['validations'][$key]['status'] = 'a';
                    $doms[$listName]['validations'][$key]['deleted'] = 0;
                    $doms[$listName]['validations'][$key]['sequence'] = $sequence;
                    $doms[$listName]['validations'][$key]['sysdomainfieldvalidation_id'] = $sysdomainfieldvalidation_id;
                    $sequence++;

                    // check if entry is already present in the table
                    $checkInsertV = true;
                    if (!empty($checkCurrentId)) {
                        $checkQV = "SELECT * FROM sysdomainfieldvalidationvalues WHERE sysdomainfieldvalidation_id ='{$checkCurrentValidationId}' AND label = '{$doms[$listName]['validations'][$key]['label']}' AND deleted=0";
                        $checkCurrentIdV = null;
                        if ($checkRowV = $db->fetchOne($checkQ)) {
                            $checkInsertV = false;
                        }
                    }

                    if ($checkInsertV) {
                        $sysdomainfieldvalidationvalue_id = SpiceUtils::createGuid();
                        $insertData = [
                            'id' => $sysdomainfieldvalidationvalue_id,
                            'sysdomainfieldvalidation_id' => $sysdomainfieldvalidation_id,
                            'enumvalue' => $doms[$listName]['validations'][$key]['enumvalue'],
                            'sequence' => $doms[$listName]['validations'][$key]['sequence'],
                            'label' => $doms[$listName]['validations'][$key]['label'],
                            'status' => $doms[$listName]['validations'][$key]['status'],
                            'deleted' => $doms[$listName]['validations'][$key]['deleted'],
                            'valuetype' => $doms[$listName]['validations'][$key]['valuetype']
                        ];
//                        $sqls[] = $db->insertQuery('sysdomainfieldvalidationvalues', $insertData, false);
                        $sqls[] = "INSERT INTO sysdomainfieldvalidationvalues (" . implode(',', array_keys($insertData)) . ") VALUES('" . implode("','", $insertData) . "')";
                    }
                }

            }
        }

        // do inserts
        foreach ($sqls as $sql) {
            if (!empty($sql))
                $db->query($sql);
        }
        return $res->withJson($sqls);
    }

    public function migrateLegacyDomTranslations(Request $req, Response $res, array $args): Response
    {
        $sqls = [];
        $storedLabels = [];
        $db = DBManagerFactory::getInstance();
        $baseLanguage = 'en_us';
        $languages[$baseLanguage] = SpiceUtils::returnAppListStringsLanguage($baseLanguage);
        $originalLanguages = ['ar_sy', 'de_DE', 'es_es', 'fr_FR', 'pl_PL'];
        foreach ($originalLanguages as $originalLanguage) {
            $languages[$originalLanguage] = SpiceUtils::returnAppListStringsLanguage($originalLanguage);
        }

        foreach ($languages[$baseLanguage] as $dropDownName => $stringValues) {

            if (is_array($stringValues)) {

                foreach ($stringValues as $key => $value) {
                    $label = 'LBL_' . ($value === '' ? 'BLANK' : strtoupper(str_replace([' / ', '/ ', '/', ' ', '-', '&', '(', ')'], ['_', '_', '_', '_', '_', '', '', ''], $value)));
                    // check if entry is already present in the table
                    $q = "SELECT id FROM syslanguagelabels WHERE name='{$label}'";
                    if ($rowLabel = $db->fetchOne($q)) {
                        $label_id = $rowLabel['id'];
                    } else {
                        $labelData = [
                            'id' => SpiceUtils::createGuid(),
                            'name' => $label
                        ];
                        $label_id = $labelData['id'];
                        if (!in_array($label, $storedLabels)) {
                            $sql = "INSERT INTO syslanguagelabels (" . implode(',', array_keys($labelData)) . ") VALUES('" . implode("','", $labelData) . "')";
                            $db->query($sql);
                            $storedLabels[] = $label;
                        }
                    }


                    // check if entry is already present in the table
                    $q = "SELECT id FROM syslanguagetranslations WHERE syslanguagelabel_id='{$label_id}' AND syslanguage = '{$baseLanguage}'";

                    if ($rowTrans = $db->fetchOne($q)) {
                            $translation_id = $rowTrans['id'];
                    } else {
                        $translationData = [
                            'id' => SpiceUtils::createGuid(),
                            'syslanguagelabel_id' => $label_id,
                            'syslanguage' => $baseLanguage,
                            'translation_default' => str_replace("'", "\'", $value)
                        ];
                        $sql = "INSERT INTO syslanguagetranslations (" . implode(',', array_keys($translationData)) . ") VALUES('" . implode("','", $translationData) . "')";
                        $db->query($sql);
                    }

                    // now check on other languages and add translation
                    //die(print_r($languages, true));
                    foreach ($originalLanguages as $originalLanguage) {

                        if (isset($languages[$originalLanguage][$dropDownName][$key])) {
                            file_put_contents('vardef.log', $originalLanguage . ' ' . $key . ' ' . print_r($languages[$originalLanguage][$dropDownName][$key], true) . "\n", FILE_APPEND);

                            // check if entry is already present in the table
                            $q = "SELECT id FROM syslanguagetranslations WHERE syslanguagelabel_id='{$label_id}' AND syslanguage = '{$originalLanguage}'";
                            if ($rowOrigTrans = $db->fetchOne($q)) {
                                $translation_id = $rowOrigTrans['id'];
                            } else {
                                $translationData = [
                                    'id' => SpiceUtils::createGuid(),
                                    'syslanguagelabel_id' => $label_id,
                                    'syslanguage' => $originalLanguage,
                                    'translation_default' => str_replace("'", "\'", $languages[$originalLanguage][$dropDownName][$key])
                                ];
                                $sql = "INSERT INTO syslanguagetranslations (" . implode(',', array_keys($translationData)) . ") VALUES('" . implode("','", $translationData) . "')";
                                $db->query($sql);
                            }
                        }
                    }

                }

                // do inserts
//                    foreach ($sqls as $sql){
//                        file_put_contents('vardefs.log', $sql."\n", FILE_APPEND);
//                        $db->query($sql);
//
//                    }
            }

        }
        return $res->withJson([]);

    }

    /**
     * migrate all vardefs id fieldefinitions to table
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function migrateIdFields(Request $req, Response $res, array $args): Response
    {
        $vardefs = SpiceDictionaryVardefs::getInstance()->loadVardefs();
        $typeCheck = ['id', 'char', 'varchar'];
        $storeDictionaryNameId = [];
        $sqls = [];
        foreach($vardefs as $dictionaryName => $vardef){
            if(preg_match('/^sys/', $dictionaryName) ){
                continue;
            }


            // store dictionary id
            if(!in_array($dictionaryName, array_keys($storeDictionaryNameId))){
                $storeDictionaryNameId[$dictionaryName] = SpiceDictionaryVardefs::getInstance()->getDictionaryIdByName($dictionaryName);
            }
            if(!$vardef['fields']){
                continue;
            }
            $allFieldItems = array_keys($vardef['fields'] );
            foreach($vardef['fields'] as $fieldName => $fieldDef){
                if(in_array($fieldDef['type'], $typeCheck)){
                    switch($fieldDef['type']){
                        case 'id':
                            if($fieldDef['name'] == 'id'){
                                if(is_array($allFieldItems) && in_array('name', $allFieldItems) &&
                                    in_array('deleted', $allFieldItems) &&
                                    in_array('date_entered', $allFieldItems) &&
                                    in_array('date_modified', $allFieldItems) &&
                                    in_array('date_indexed', $allFieldItems) &&
                                    in_array('tags', $allFieldItems) &&
                                    in_array('description', $allFieldItems) &&
                                    in_array('created_by', $allFieldItems) &&
                                    in_array('modified_user_id', $allFieldItems)
                                ) {
                                    // save the default dictionary template
                                    $sqls[$dictionaryName][] = "INSERT INTO sysdictionaryitems (id, name, sysdictionarydefinition_id, sysdictionary_ref_id, status, version, package) VALUES(uuid(), 'default', '{$storeDictionaryNameId[$dictionaryName]}', 'a738ceee-6853-44dc-bb74-dd1530d3d1fe', 'a', '2022.02.001', 'coreid');";
                                } elseif(is_array($allFieldItems) &&
                                    !in_array('name', $allFieldItems) &&
                                    in_array('deleted', $allFieldItems) &&
                                    in_array('date_entered', $allFieldItems) &&
                                    in_array('date_modified', $allFieldItems) &&
                                    in_array('date_indexed', $allFieldItems) &&
                                    in_array('tags', $allFieldItems) &&
                                    in_array('description', $allFieldItems) &&
                                    in_array('created_by', $allFieldItems) &&
                                    in_array('modified_user_id', $allFieldItems)
                                ) {
                                    // save the default dictionary without name template
                                    $sqls[$dictionaryName][] = "INSERT INTO sysdictionaryitems (id, name, sysdictionarydefinition_id, sysdictionary_ref_id, status, version, package) VALUES(uuid(), 'default without name', '{$storeDictionaryNameId[$dictionaryName]}', '1ca4c87d-c36d-c4f9-2e23-19c8e4b85de6', 'a', '2022.02.001', 'coreid');";
                                } else {
                                    // save item entry
                                    $sqls[$dictionaryName][] = "INSERT INTO sysdictionaryitems (id, name, sysdictionarydefinition_id, sysdomaindefinition_id, status, version, package) VALUES(uuid(), '{$fieldDef['name']}', '{$storeDictionaryNameId[$dictionaryName]}', 'a4fa167b-8922-5924-ac9b-03cdca41c044', 'a', '2022.02.001', 'coreid');";
                                }

                            } elseif($fieldDef['name'] == 'assigned_user_id'){
                                // save the assignable dictionary template
                                $sqls[$dictionaryName][] = "INSERT INTO sysdictionaryitems (id, name, sysdictionarydefinition_id, sysdictionary_ref_id, status, version, package) VALUES(uuid(), 'assignable', '{$storeDictionaryNameId[$dictionaryName]}', '6fed999b-1cb8-8af5-58c1-acf5bd047c2a', 'a', '2022.02.001', 'coreid');";

                            } else {
                                // save item entry
                                $sqls[$dictionaryName][] = "INSERT INTO sysdictionaryitems (id, name, sysdictionarydefinition_id, sysdomaindefinition_id, status, version, package) VALUES(uuid(), '{$fieldDef['name']}', '{$storeDictionaryNameId[$dictionaryName]}', 'a4fa167b-8922-5924-ac9b-03cdca41c044', 'a', '2022.02.001', 'coreid');";
                            }
                            break;
                        case 'char':
                        case 'varchar':
                            if($fieldDef['len'] == 36 || $fieldDef['len'] == '36' ){
                                if($fieldDef['name'] == 'id'){
                                    if(is_array($allFieldItems) && in_array('name', $allFieldItems) &&
                                        in_array('deleted', $allFieldItems) &&
                                        in_array('date_entered', $allFieldItems) &&
                                        in_array('date_modified', $allFieldItems) &&
                                        in_array('date_indexed', $allFieldItems) &&
                                        in_array('tags', $allFieldItems) &&
                                        in_array('description', $allFieldItems) &&
                                        in_array('created_by', $allFieldItems) &&
                                        in_array('modified_user_id', $allFieldItems)
                                    ) {
                                        // save the default dictionary template
                                        $sqls[$dictionaryName][] = "INSERT INTO sysdictionaryitems (id, name, sysdictionarydefinition_id, sysdictionary_ref_id, status, version, package) VALUES(uuid(), 'default', '{$storeDictionaryNameId[$dictionaryName]}', 'a738ceee-6853-44dc-bb74-dd1530d3d1fe', 'a', '2022.02.001', 'coreid');";
                                    } elseif(is_array($allFieldItems) &&
                                        !in_array('name', $allFieldItems) &&
                                        in_array('deleted', $allFieldItems) &&
                                        in_array('date_entered', $allFieldItems) &&
                                        in_array('date_modified', $allFieldItems) &&
                                        in_array('date_indexed', $allFieldItems) &&
                                        in_array('tags', $allFieldItems) &&
                                        in_array('description', $allFieldItems) &&
                                        in_array('created_by', $allFieldItems) &&
                                        in_array('modified_user_id', $allFieldItems)
                                    ) {
                                        // save the default dictionary without name template
                                        $sqls[$dictionaryName][] = "INSERT INTO sysdictionaryitems (id, name, sysdictionarydefinition_id, sysdictionary_ref_id, status, version, package) VALUES(uuid(), 'default without name', '{$storeDictionaryNameId[$dictionaryName]}', '1ca4c87d-c36d-c4f9-2e23-19c8e4b85de6', 'a', '2022.02.001', 'coreid');";

                                    }

                                } elseif($fieldDef['name'] == 'assigned_user_id'){
                                    // save the assignable dictionary template
                                    $sqls[$dictionaryName][] = "INSERT INTO sysdictionaryitems (id, name, sysdictionarydefinition_id, sysdictionary_ref_id, status, version, package) VALUES(uuid(), 'assignable', '{$storeDictionaryNameId[$dictionaryName]}', '6fed999b-1cb8-8af5-58c1-acf5bd047c2a', 'a', '2022.02.001', 'coreid');";

                                } else {
                                    // save item entry
                                    $sqls[$dictionaryName][] = "INSERT INTO sysdictionaryitems (id, name, sysdictionarydefinition_id, sysdomaindefinition_id, status, version, package) VALUES(uuid(), '{$fieldDef['name']}', '{$storeDictionaryNameId[$dictionaryName]}', 'a4fa167b-8922-5924-ac9b-03cdca41c044', 'a', '2022.02.001', 'coreid');";
                                }

                            }
                            break;

                    }
                }

            }


        }

        foreach($sqls as $dictName => $sql){
            foreach ($sql as $sqlQuery)
                $sqlList[] = $sqlQuery;
        }
die(print_r(implode("\n", $sqlList), true));
        return $res->withJson($sqlList);
    }


    public function repairCache(Request $req, Response $res, array $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $execute = false;
        VardefManager::clearVardef();
        if (SpiceDictionaryVardefs::isDbManaged()) {
            SpiceDictionaryVardefs::loadDictionaries('all');
            // store processed dictionaries
            $storedDicts = [];
            // save cache to DB
            foreach (SpiceDictionaryHandler::getInstance()->dictionary as $dict) {
                if (!in_array($dict['id'], $storedDicts)) {
                    SpiceDictionaryVardefs::saveDictionaryCacheToDb($dict);
                    $storedDicts[] = $dict['id'];
                }
            }
        }
        return $res->withJson([]);
    }

    public function getDictionary(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(SpiceDictionaryVardefs::loadDictionaryModule($args['module']));

    }

    public function migrateMetadata(Request $req, Response $res, array $args): Response
    {
        $sqls = [];
        return $res->withJson($sqls);

    }

    /**
     * return first encountered use of the dom
     * @param $dom
     * @return array
     */
    public function getVardefsUsingDom($dom)
    {
        $vardefs = [];
        $db = DBManagerFactory::getInstance();
        $q = "SELECT * FROM sysdictionaryfields WHERE fielddefinition like '%{$dom}%'";
        if ($results = $db->limitQuery($q, 0, 1)) {
            while ($row = $db->fetchByAssoc($results)) {
                $vardefs[] = json_decode(html_entity_decode($row['fielddefinition']), true);
            }
        }
        return $vardefs;
    }

    public static function cleanNameForDomainDefinition($dom)
    {
        $patterns = ['/^dom_/', '/_dom$/'];
        $replacements = ['', ''];
        return preg_replace($patterns, $replacements, $dom);
    }
}
