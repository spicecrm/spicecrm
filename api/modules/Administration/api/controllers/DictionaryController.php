<?php
namespace SpiceCRM\modules\Administration\api\controllers;

use Exception;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SugarCache\SugarCache;
use SpiceCRM\includes\SugarObjects\LanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\includes\SpiceDictionary\api\controllers\MigrateController;

class DictionaryController
{

    /**
     * uilds a note array
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function getNodes(Request $req, Response $res, array $args): Response {
        return $res->withJson($this->buildNodeArray($args['module']));
    }

    /**
     * repair custom enum
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return mixed
     * @throws Exception
     */

    public function repairCustomEnum(Request $req, Response $res, array $args): Response
    {
        // use MigrateController
        $mig = new MigrateController();

        $db = DBManagerFactory::getInstance();
        $languages = LanguageManager::getLanguages()['available'];
        $defaultLanguage = LanguageManager::getDefaultLanguage();

        $db->query("DELETE FROM syscustomdomainfieldvalidations WHERE package = 'legacy'");
        $db->query("DELETE FROM syscustomdomainfieldvalidationvalues WHERE package = 'legacy'");
        $db->query("DELETE FROM syscustomdomainfields WHERE package = 'legacy'");
        $db->query("DELETE FROM syscustomdomaindefinitions WHERE package = 'legacy'");

        // make sure default language is on top
        // default language shall contain all dom definitions
        $rLanguages = [];
        $rCounter = 1;
        foreach ($languages as $language){
            if($language['language_code'] == $defaultLanguage){
                $rLanguages[0] = $language;
                $rLanguages[0]['is_default'] = true;
            } else{
                $rLanguages[$rCounter] = $language;
                $rLanguages[$rCounter]['is_default'] = false;
                $rCounter++;
            }
        }
        ksort($rLanguages, SORT_NUMERIC );
        $languages = $rLanguages;

        // loop through languages
        foreach ($languages as $language) {

            $sysLanguageLabels = [];

            $appStrings = $this->returnApplicationLanguage($language['language_code']);
            if(empty($appStrings)) continue;

            // retrieve all custom labels
//            $query = $db->query("SELECT lbl.name FROM syslanguagecustomlabels lbl ORDER BY name ASC");
//            while ($row = $db->fetchByAssoc($query)) $sysLanguageLabels[$row['name']] = 1;

            foreach ($appStrings as $name => $values) {
                if($language['is_default']){
                    // get the original field configuration - guess on first field found
                    $dictField = $mig->getVardefsUsingDom($name);
                    $dictFieldType = 'enum';
                    $dictFieldDbType = 'varchar';
                    $dictFieldLen = "null";
                    $dictFieldDefaultValue = "null";
                    if(is_array($dictField[0]) && count($dictField[0]) > 0)  {
                        $dictFieldType = $dictField[0]['type'];
                        $dictFieldDbType = (!empty($dictField[0]['dbtype']) ? $dictField[0]['dbtype'] : $db->getColumnType($dictField[0]['type']));
                        $dictFieldLen = (isset($dictField[0]['len'] ) ? intval($dictField[0]['len']) : $dictFieldLen);
                        $dictFieldDefaultValue = (isset($dictField[0]['default'] ) ? "'".$dictField[0]['default']."'" : $dictFieldDefaultValue);
                    }

                    // create entry for syscustomdomainfieldvalidations - name of the dom
                    $valId = SpiceUtils::createGuid();
                    $query = "INSERT INTO syscustomdomainfieldvalidations (id, name, validation_type, order_by, sort_flag, status, package,deleted) VALUES ('$valId', '$name', 'enum', 'sequence', 'asc', 'a', 'legacy', 0)";
                    $db->query($query);

                    // customise the domaindefinitions & domainfields to make sure that the validation values are overwritten (custom)
                    $domainId = SpiceUtils::createGuid();
                    $query = "INSERT INTO syscustomdomaindefinitions (id, name, fieldtype, package, status, deleted) VALUES ('$domainId', '$name' ,'$dictFieldType', 'legacy', 'a', 0)";
                    $db->query($query);

                    $domainFieldId = SpiceUtils::createGuid();
                    $query = "INSERT INTO syscustomdomainfields (id, name, dbtype, fieldtype, len, sysdomaindefinition_id, sysdomainfieldvalidation_id, sequence, defaultvalue, package, status, deleted) VALUES ('$domainFieldId', '{sysdictionaryitems.name}' ,'$dictFieldDbType', '$dictFieldType', $dictFieldLen , '$domainId', '$valId', 1, ".$dictFieldDefaultValue.", 'legacy', 'a', '0')";
                    $db->query($query);
                }

                // handle dom values
                $counter = 0;
                foreach ($values as $valKey => $valDisplay) {

                    $label = ($valDisplay === '') ? 'LBL_BLANK' : strtoupper('DOMLBL_' . preg_replace("/[^A-Za-z0-9]/", '', trim($valDisplay)));

                    $valItemId = SpiceUtils::createGuid();
                    $valueType = (gettype($valKey) == 'integer' ? 'integer' : 'string');
                    $query = "INSERT INTO syscustomdomainfieldvalidationvalues (id, sysdomainfieldvalidation_id, enumvalue, sequence, label, valuetype, status, package, deleted) VALUES ('$valItemId', '$valId', '$valKey', $counter, '$label', '$valueType', 'a', 'legacy' , 0)";
                    $db->query($query);

//                    if (isset($sysLanguageLabels[$label]) || empty($valDisplay)) continue;

                    // a custom label might have been created during this process. Check if exists.
                    $existingLabel = LanguageManager::checkLabelExists($label);
                    if(!$existingLabel) {
                        $labelId = SpiceUtils::createGuid();
                        $query = "INSERT INTO syslanguagecustomlabels (id, name) VALUES ('$labelId', '$label')";
                        $db->query($query);
                    } else{
                        $labelId = $existingLabel;
                    }

                    // a translation could have been created during this process
                    $existingTrans = $db->getOne("SELECT id FROM syslanguagecustomtranslations WHERE syslanguagelabel_id='$labelId' AND syslanguage='{$language['language_code']}'");
                    if(!$existingTrans){
                        $transId = SpiceUtils::createGuid();
                        $query = "INSERT INTO syslanguagecustomtranslations (id, syslanguagelabel_id, syslanguage, translation_default) VALUES ('$transId', '$labelId', '{$language['language_code']}', '".$db->quote($valDisplay)."')";
                        $db->query($query);
                    }

                    $counter++;
                }
            }
        }

        return $res->withJson(true);
    }

    public static function returnApplicationLanguage($language): ?array
    {
        $app_list_strings = [];

        foreach (scandir('custom/Extension/application/Ext/Language') as $item) {
            if (!str_starts_with($item, $language) || !str_ends_with($item, '.php')) continue;
            include("custom/Extension/application/Ext/Language/$item");
        }

        return $app_list_strings;
    }

    /*
     * Helper function to get the Fields for a module
     */
    private function buildNodeArray($module) {
        $returnArray = [];

        $nodeModule = BeanFactory::getBean($module);
        // $nodeModule->load_relationships();
        if ($nodeModule) {

            foreach ($nodeModule->field_defs as $field_name => $field_defs) {
                // 2011-03-23 also exculde the excluded modules from the config in the Module Tree
                //if ($field_defs['type'] == 'link' && (!isset($field_defs['module']) || (isset($field_defs['module']) && array_search($field_defs['module'], $excludedModules) == false))) {
                if ($field_defs['type'] == 'link') {
                    if($nodeModule->load_relationship($field_name)) {
                        //BUGFIX 2010/07/13 to display alternative module name if vname is not maintained
                        $returnArray[] = [
                            'path' => 'link:' . $module . ':' . $field_name,
                            'module' => $nodeModule->$field_name->getRelatedModuleName(),
                            'bean' => $nodeModule->$field_name->focus->_objectname,
                            'leaf' => false,
                            'label' => $field_defs['vname']
                        ];
                    }
                }
            }

            //2013-01-09 add support for Studio Relate Fields
            // get all relate fields where the link is empty ... those with link we get via the link anyway properly
            if ($field_defs['type'] == 'relate') {
                if (isset($field_defs['module']))
                    $returnArray[] = [
                        'path' => 'relate:' . $module . ':' . $field_name,
                        'module' => SpiceUtils::translate($field_defs['module'], $module),
                        'bean' => $field_defs['module'],
                        'leaf' => false,
                        'label' => $field_defs['vname']
                    ];
                else
                    $returnArray[] = [
                        'path' => 'relate:' . $module . ':' . $field_name,
                        'module' => $field_defs['name'],
                        'bean' => $field_defs['module'],
                        'leaf' => false,
                        'label' => $field_defs['vname']
                    ];
            }
        }

        // 2013-08-21 BUG #492 added sorting for the module tree
        usort($returnArray, function ($a, $b) {
            if (strtolower($a['module']) > strtolower($b['module']))
                return 1;
            elseif (strtolower($a['module']) == strtolower($b['module']))
                return 0;
            else
                return -1;
        });

        // 2013-08-21 BUG #492 merge with the basic functional elements
        return $returnArray;
    }

    /**
     * builds a field array
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getFields(Request $req, Response $res, array $args): Response {
        return $res->withJson($this->buildFieldArray($args['module']));
    }

    /**
     * get module relationship definitions
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return mixed
     * @throws Exception
     */
    public function getModuleRelationships(Request $req, Response $res, array $args): Response {
        $relationships = SpiceDictionaryVardefs::loadRelationships($args['module']);
        return $res->withJson($this->buildFieldArray($args['module']));
    }

    private function buildFieldArray($module)
    {
        $returnArray = [];

        $nodeModule = BeanFactory::getBean($module);

        foreach ($nodeModule->field_defs as $field_name => $field_defs) {
            if ($field_defs['type'] != 'link') {
                $returnArray[] = [
                    'id' => 'field:' . $field_defs['name'],
                    'name' => $field_defs['name'],
                    // in case of a kreporter field return the report_data_type so operators ar processed properly
                    // 2011-05-31 changed to kreporttype returned if fieldttype is kreporter
                    // 2011-10-15 if the kreporttype is set return it
                    //'type' => ($field_defs['type'] == 'kreporter') ? $field_defs['kreporttype'] :  $field_defs['type'],
                    'type' => (isset($field_defs['kreporttype'])) ? $field_defs['kreporttype'] : $field_defs['type'],
                    'text' => (SpiceUtils::translate($field_defs['vname'], $module) != '') ? SpiceUtils::translate($field_defs['vname'], $module) : $field_defs['name'],
                    'leaf' => true,
                    'options' => $field_defs['options'],
                    'label' => $field_defs['vname']
                ];
            }
        }

        // 2013-08-21 Bug#493 sorting name for the fields
        usort($returnArray, "arraySortByName");

        return $returnArray;
    }


    /**
     *
     * legacy & cache table
     */
    public function repairCacheDb(Request $req, Response $res, array $args): Response {

        $returnArray = SpiceDictionaryVardefs::getInstance()->repairDictionaries();

        return $res->withJson($returnArray);
    }
}
