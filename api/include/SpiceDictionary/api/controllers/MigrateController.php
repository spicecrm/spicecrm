<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceDictionary\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;


class MigrateController
{
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
     * @throws \Exception
     */
    public function getVardefsUsingDom($dom): array
    {
        foreach (SpiceDictionaryHandler::getInstance()->dictionary as $dictionary) {
            foreach ($dictionary['fields'] as $field) {
                if ($field['options'] != $dom) continue;
                return $field;
            }
        }

        return [];
    }

    public static function cleanNameForDomainDefinition($dom)
    {
        $patterns = ['/^dom_/', '/_dom$/'];
        $replacements = ['', ''];
        return preg_replace($patterns, $replacements, $dom);
    }
}
