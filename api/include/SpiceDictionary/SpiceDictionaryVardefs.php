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

namespace SpiceCRM\includes\SpiceDictionary;

use SpiceCRM\includes\SpiceBeans\SpiceModules;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceUI\api\controllers\SpiceUIModulesController;
use SpiceCRM\includes\SugarObjects\VardefManager;

class SpiceDictionaryVardefs  {

    public static $deprecatedProperties = ['unified_search', 'unified_search_default_enabled', 'full_text_search'];

    /**
     * the instance for the singelton
     *
     * @var
     */
    private static $instance;

    // private $dictionary = [];

    public final function __construct()
    {
    }

    private function __clone()
    {
    }

    private function __wakeup()
    {
    }

    /**
     * @return SpiceDictionaryVardefs
     */
    static function getInstance()
    {
        if (self::$instance === null) {

            //set instance
            self::$instance = new self;
        }
        return self::$instance;
    }



    /**
     * @deprecated
     * checks if the System is set for database managed vardefs
     * @return false
     */
    public static function isDbManaged(){
//        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']){
//            return true;
//        }
        return true;
    }

    /**
     * @deprecated
     * checks if the System is set for database managed domains
     * @return false
     */
    public static function isDomainManaged(){
//        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['domains']) && SpiceConfig::getInstance()->config['systemvardefs']['domains']){
//            return true;
//        }
        return true;
    }


    /**
     * build the query to get dictionary definitions
     * Add where clause to get only specified dictionaries
     * @param string $dictionaryType all | metadata | module | template
     * @param array $dictionaryNames a list of dictionaries by name
     * @return string
     */
    public static function getDictionaryDefinitionsQuery($dictionaryType = 'all', $dictionaryNames = []){
        $where = "";
        if(!empty($dictionaryNames)){
            $where = " AND sysd.name IN('".implode("', '", $dictionaryNames)."')";
        }

        $q = "SELECT sysd.id dictionaryid, sysd.name dictionaryname, sysd.sysdictionary_type dictionarytype, sysd.sysdictionary_contenttype contenttype, 'g' scope, status  FROM sysdictionarydefinitions sysd WHERE sysd.status = 'a' ".($dictionaryType != 'all' ? "  AND sysd.sysdictionary_type='".$dictionaryType."'" : ""). $where;
        $q.= " UNION ";
        $q.= "SELECT sysd.id dictionaryid, sysd.name dictionaryname, sysd.sysdictionary_type dictionarytype, sysd.sysdictionary_contenttype contenttype, 'c' scope, status FROM syscustomdictionarydefinitions sysd WHERE sysd.status = 'a' ".($dictionaryType != 'all' ? " AND sysd.sysdictionary_type='".$dictionaryType."'" : "").$where;

        return $q;
    }

    public static function loadTemplateVardefs()
    {
        $vardefs = [];
        $dictionaryDefinitions = self::getDictionaryDefinitions(['template']);

        // override in/add to $vardefs (only fields defined in dictionary itself)
        if (count($dictionaryDefinitions) > 0) {
            foreach ($dictionaryDefinitions as $row) {
                $dbDict = SpiceDictionaryVardefs::loadRawDictionary($row['dictionaryid']);
                if(empty($dbDict['name'])) continue;

                if (isset($vardefs[$dbDict['name']])) {
                    if (is_array($vardefs[$dbDict['name']]['fields'])) {
                        $vardefs[$dbDict['name']]['fields'] = array_merge($vardefs[$dbDict['name']]['fields'], $dbDict['fields']);
                    }
                } else {
                    $vardefs[$dbDict['name']] = $dbDict;
                }
                $vardefs[$dbDict['name']]['dictionaryname'] = $dbDict['name'];
                $vardefs[$dbDict['name']]['contenttype'] = $dbDict['name'];

                // load indices
                if (!is_array($vardefs[$dbDict['name']]['indices'])) $vardefs[$dbDict['name']]['indices'] = [];
                if (is_array($dbDict['indices'])) {
                    $vardefs[$dbDict['name']]['indices'] = SpiceDictionaryVardefs::mergeIndices($vardefs[$dbDict['name']]['indices'], $dbDict['indices']);
                }

                // load relationships
                if (!is_array($vardefs[$dbDict['name']]['relationships'])) $vardefs[$dbDict['name']]['relationships'] = [];
                if (is_array($dbDict['relationships'])) {
                    $vardefs[$dbDict['name']]['relationships'] = array_merge($vardefs[$dbDict['name']]['relationships'], $dbDict['relationships']);
                }
            }
        }

        return $vardefs;
    }


    /**
     * load the dictionary templates from database
     * @return array
     */
    public static function loadTemplateDictionaries(){
        $vardefs = self::loadTemplateVardefs();
        return self::switchKeyNameToId($vardefs);
    }

    /**
     * switch the dictionary key from name to id
     * @param array $vardefs
     * @return array
     */
    public static function switchKeyNameToId(array $vardefs){
        $dictDefs = [];
        foreach($vardefs as $dictName => $dictDef){
            $dictDefs[$dictDef['id']] = $dictDef;
        }
        return $dictDefs;
    }

    /**
     * get all vardefs definitions from legacy files & from db
     * @param array $dictionaryNames a list of dictionaries to handle
     * @return array
     */
    public static function loadVardefs($dictionaryNames = []){
        $vardefs = [];

        self::addACLFields();
        self::addACLTerritoryFields();

        // store all legacy vardefs in an array
        foreach(SpiceDictionaryHandler::getInstance()->dictionary as $dictName => $dict){
            // keep only passed dictionaries
            if(!empty($dictionaryNames) && !in_array($dictName, $dictionaryNames)){
                continue;
            }

            self::cleanLegacyDictionary($dict);
            if(empty($dictName)) continue;
            $vardefs[$dictName] = $dict;
            $vardefs[$dictName]['dictionaryname'] = $dictName;
        }

        // load dictionary templates
        $templateDictionaries = self::loadTemplateDictionaries();

        // get active definitions from database
        $dictionaryDefinitions = SpiceDictionaryVardefs::getDictionaryDefinitions(['module','metadata'], $dictionaryNames);

        // override in/add to $vardefs (only fields defined in sysdictionary tables)
        if(count($dictionaryDefinitions) > 0 && SpiceDictionaryVardefs::isDbManaged()){
            foreach($dictionaryDefinitions as $row) {
                $dbDict = SpiceDictionaryVardefs::loadRawDictionary($row['dictionaryid'], $templateDictionaries);

                if(isset($vardefs[$dbDict['name']])){
                    if(is_array($vardefs[$dbDict['name']]['fields'])){
                        if(is_array($dbDict['fields']) && count($dbDict['fields']) > 0){
                            $vardefs[$dbDict['name']]['fields'] = array_merge($vardefs[$dbDict['name']]['fields'], $dbDict['fields']);
                        }
                    }
                } else{
                    $vardefs[$dbDict['name']] = $dbDict;
                }
                $vardefs[$dbDict['name']]['dictionaryname'] = $dbDict['name'];
                $vardefs[$dbDict['name']]['type'] = $dbDict['type'];
                $vardefs[$dbDict['name']]['required'] = $dbDict['required'];
                $vardefs[$dbDict['name']]['contenttype'] = $dbDict['contenttype'];

                // load indices
                if(!is_array($vardefs[$dbDict['name']]['indices'])) $vardefs[$dbDict['name']]['indices'] = [];
                if(is_array($dbDict['indices']) && !empty($dbDict['indices'])){
                    $vardefs[$dbDict['name']]['indices'] = SpiceDictionaryVardefs::mergeIndices($vardefs[$dbDict['name']]['indices'], $dbDict['indices']);
                }

                // load relationships
                if(!is_array($vardefs[$dbDict['name']]['relationships'])) $vardefs[$dbDict['name']]['relationships'] = [];
                if(is_array($dbDict['relationships'])){
                    $vardefs[$dbDict['name']]['relationships'] = array_merge($vardefs[$dbDict['name']]['relationships'], $dbDict['relationships']);
                }
            }
        }

        unset($dictionaryDefinitions);

        return $vardefs;
    }

    /**
     * legacy code
     *
     * add acl fields to the loaded dictionary items
     * @return void
     */
    public static function addACLFields()
    {
        $loader = new SpiceUIModulesController();
        $modules = $loader->geUnfilteredModules();

        foreach ($modules as $module) {

            if ($module['acl_multipleusers'] != 1 || empty($module['bean'])) continue;

            VardefManager::addTemplate($module['module'], $module['bean'], 'spiceaclusers');
        }
    }

    /**
     * legacy code
     *
     * add acl territory fields to the loaded dictionary items
     * @return void
     * @throws \Exception
     */
    public static function addACLTerritoryFields()
    {
        $db = DBManagerFactory::getInstance();
        if($db->tableExists('spiceaclterritories_modules')) {
            $query = $db->query("SELECT * FROM spiceaclterritories_modules");

            while ($row = $db->fetchByAssoc($query)) {

                if (!empty($row['relatefrom']) || empty($row['module'])) continue;

                $bean = SpiceModules::getInstance()->getBeanName($row['module']);

                VardefManager::addTemplate($row['module'], $bean, 'spiceaclterritories');
            }
        }
    }

    /**
     * merge legacy indices with db indices
     * @param array $leftIndices
     * @param array $rightIndices
     * @return array
     */
    public static function mergeIndices(array $leftIndices, array $rightIndices): array
    {
        if (count($leftIndices) == 0) return $rightIndices;

        if (count($rightIndices) == 0) return $leftIndices;

        $resultIndices = $leftIndices;

        foreach ($rightIndices as $rightIndex) {

            $exists = false;

            foreach ($resultIndices as $resultIndex) {
                if ($resultIndex['fields'] != $rightIndex['fields'] || $resultIndex['type'] != $rightIndex['type']) continue;
                $exists = true;
                break;
            }

            if (!$exists) $resultIndices[$rightIndex['name']] = $rightIndex;
        }

        return $resultIndices;
    }

    /**
     * get dictionary definitions
     *
     * @param string $dictionaryType possible values all | metadata | module | template
     * @return array
     */
    public static function getDictionaryDefinitions($dictionaryTypes = [], $dictionaryNames = []){
        $db = DBManagerFactory::getInstance();
        $definitions = [];

        if(empty($dictionaryTypes)){
            $dictionaryTypes[] = 'all';
        }

        foreach($dictionaryTypes as $dictionaryType){
            // get query
            $q = self::getDictionaryDefinitionsQuery($dictionaryType, $dictionaryNames);

            // process
            if($res = $db->query($q)) {
                while ($row = $db->fetchByAssoc($res)) {
                    $definitions[$row['dictionaryid']] = $row;
                }
            }
        }

        return $definitions;
    }

    /**
     * return dictionary_id for specified dictionary name
     *
     * @param string $module
     * @return mixed
     */
    public static function getDictionaryIdByName($dictionaryName){
        $db = DBManagerFactory::getInstance();
        $q = "SELECT sysdictdef.id sysdictionarydefinition_id FROM syscustomdictionarydefinitions sysdictdef WHERE sysdictdef.name ='{$dictionaryName}'";
        if($res = $db->limitQuery($q, 0, 1)){
            while($row = $db->fetchByAssoc($res)){
                return $row['sysdictionarydefinition_id'];
            }
        }
        $q = "SELECT sysdictdef.id sysdictionarydefinition_id FROM sysdictionarydefinitions sysdictdef WHERE sysdictdef.name ='{$dictionaryName}'";
        if($res = $db->limitQuery($q, 0, 1)){
            while($row = $db->fetchByAssoc($res)){
                return $row['sysdictionarydefinition_id'];
            }
        }
        return null;
    }

    /**
     * return dictionary_id for specified module
     *
     * @param string $module
     * @return mixed
     */
    public static function getDictionaryIdByModule($module){
        $db = DBManagerFactory::getInstance();
        $q = "SELECT sysdictionarydefinition_id FROM syscustommodules sysmod WHERE sysmod.module ='{$module}'";
        if($res = $db->limitQuery($q, 0, 1)){
            while($row = $db->fetchByAssoc($res)){
                return $row['sysdictionarydefinition_id'];
            }
        }
        $q = "SELECT sysdictionarydefinition_id FROM sysmodules sysmod WHERE sysmod.module ='{$module}'";
        if($res = $db->limitQuery($q, 0, 1)){
            while($row = $db->fetchByAssoc($res)){
                return $row['sysdictionarydefinition_id'];
            }
        }
        return null;
    }


    /**
     * return module name according to module id
     *
     * @param string $moduleId
     * @return string|boolean
     */
    public static function getModuleNameByModuleId($moduleId){
        $db = DBManagerFactory::getInstance();
        $q = "SELECT module FROM sysmodules WHERE id='{$moduleId}' UNION SELECT module FROM syscustommodules WHERE id='{$moduleId}'";
        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                return $row['module'];
            }
        }
        return false;
    }

    /**
     * build query to get a dictionary by ID
     *
     * @param string $dictionaryId
     * @return mixed
     */
    public static function getDictionaryQuery($dictionaryId)
    {
        return "SELECT sysd.id dictionaryid, sysd.name dictionaryname, sysd.tablename, sysd.audited tableaudited, sysd.sysdictionary_type dictionarytype, sysd.sysdictionary_contenttype contenttype,
       sysmod.module sysmodule, sysmod.id sysmoduleid,
         sysdo.name domainname, sysdof.name technicalname,
        sysdi.name itemname, sysdi.id item_id, sysdi.duplicate_merge, sysdi.label itemlabel, sysdi.labelinputhelper itemlabelinputhelper, sysdi.required itemrequired, sysdi.non_db, sysdi.sysdictionary_ref_id, sysdi.status itemstatus, sysdi.exclude_from_audited,
        sysdof.*, sysdof.id sysdomainfield_id, sysdov.name validationname
        FROM (SELECT * from sysdictionarydefinitions UNION SELECT * from syscustomdictionarydefinitions) sysd
        LEFT JOIN (SELECT * from sysmodules UNION SELECT * from syscustommodules) sysmod ON sysmod.sysdictionarydefinition_id = sysd.id
        LEFT JOIN (SELECT * from sysdictionaryitems UNION SELECT * from syscustomdictionaryitems) sysdi ON sysdi.sysdictionarydefinition_id = sysd.id
/**        LEFT JOIN (SELECT * from sysdictionaryitems UNION SELECT * from syscustomdictionaryitems) sysdiref ON sysdiref.sysdictionary_ref_id = sysd.id **/
        LEFT JOIN (SELECT * from sysdomaindefinitions UNION SELECT * from syscustomdomaindefinitions) sysdo ON sysdi.sysdomaindefinition_id = sysdo.id
        LEFT JOIN (SELECT * from sysdomainfields UNION SELECT * from syscustomdomainfields)  sysdof ON sysdof.sysdomaindefinition_id = sysdo.id
        LEFT JOIN (SELECT * from sysdomainfieldvalidations UNION SELECT * from syscustomdomainfieldvalidations) sysdov ON sysdov.id = sysdof.sysdomainfieldvalidation_id
        WHERE sysd.id = '{$dictionaryId}'
        ORDER BY sysdi.sequence ASC
       ";

    }

    /**
     * get dictionary array for passed module
     *
     * @param string $module
     * @return array|mixed
     */
    public static function loadDictionaryModule($module) {

        $dictionaryId = self::getDictionaryIdByModule($module);
        $dict = self::loadRawDictionary($dictionaryId);

        // add fields from templates to each dictionary
        foreach($dict['fields'] as $fieldId => $fieldDef){
            if(isset($fieldDef['sysdictionary_ref_id'])){
                // get dictionary for ref
                $dictRef = self::loadRawDictionary($fieldDef['sysdictionary_ref_id']);
                if(is_array($dictRef['fields'])){
                    $dict['fields'] = array_merge($dict['fields'], $dictRef['fields']);
                }
                unset($dict['fields'][$fieldDef['sysdictionary_ref_id']]);
//              die(__FUNCTION__.__LINE__.print_r(SpiceDictionaryHandler::getInstance()->dictionary[$dictionaryName]['fields'], true));
            }
        }

        // add indices
        $dict['indices'] = self::loadDictionaryIndicesByDictionaryId($dictionaryId);
        return $dict;
    }

    /**
     * load field definitions for selected dictionary
     * only fields defined directly in dictionary (no templates!)
     *
     * @param string $dictionaryId
     * @return array
     */
    public static function loadRawDictionary($dictionaryId, &$templateDictionaries = []): array
    {
        $db = DBManagerFactory::getInstance();
        $dict = [];
        $q = self::getDictionaryQuery($dictionaryId);

        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                if($row['itemstatus'] !='a'){
                    continue;
                }

                $dict['id'] = $row['dictionaryid'];
                $dict['name'] = $row['dictionaryname'];
                $dict['dictionaryname'] = $row['dictionaryname'];
                $dict['sysdictionaryitem_id'] = $row['item_id'];
                $dict['dictionarytype'] = $row['dictionarytype'];
                $dict['type'] = $row['dictionarytype'];
                $dict['table'] = $row['tablename'];
                $dict['contenttype'] = $row['contenttype'];

                if(!empty($row['sysmodule'])){
                    $dict['module'] = $row['sysmodule'];
                }

                $dict['audited'] = (bool)$row['tableaudited'];

                if(empty($row['sysdictionary_ref_id']) && !empty($row['itemname'])){
                    $fieldname = SpiceDictionaryVardefsParser::parseFieldName($row);
                    $dict['fields'][$fieldname] = SpiceDictionaryVardefsParser::parseFieldDefinition($row);
                }
                else {
                    if(!empty($templateDictionaries)){
                        if(!empty($templateDictionaries[$row['sysdictionary_ref_id']])){
                            if(!is_array($dict['fields'])) $dict['fields'] = [];
                            if(!empty($templateDictionaries[$row['sysdictionary_ref_id']]['fields'])){
//                                foreach($templateDictionaries[$row['sysdictionary_ref_id']]['fields'] as $tplfieldName => $tplFieldName)
//                                    $dict['fields'][$tplfieldName] = $tplFieldName;
                                $dict['templates'][] = $templateDictionaries[$row['sysdictionary_ref_id']]['name'];
                                $dict['fields'] = array_merge($dict['fields'], $templateDictionaries[$row['sysdictionary_ref_id']]['fields']);
                            }
                        }
                    }
                }
            }
        }

        // load links generated by relationship definitions for BWC architecture in dictionary
        if($dict['type'] == 'module'){
            self::loadLHSLinks($dict);
            self::loadRHSLinks($dict);
        }
        // load indices for BWC architecture in dictionary
        $dict['indices'] = self::loadDictionaryIndicesByDictionaryId($dictionaryId);
        return $dict;
    }

    /**
     * create full indices for a dictionary using dictionaryid
     * @param string $dictionaryId
     * @return array
     */
    public static function loadDictionaryIndicesByDictionaryId($dictionaryId){
        return self::loadDictionaryIndicesByDictionary('dictionaryid', $dictionaryId);
    }


    /**
     * load indices from dictionary
     * using either dictionaryname or dictionaryid
     * @param string $checkFieldWhere dictionaryname | dictionaryid
     * @param string $value
     * @return array|void
     * @throws \Exception
     */
    public static function loadDictionaryIndicesByDictionary($checkFieldWhere, $value){
        $indices = SpiceDictionaryIndexes::getInstance()->getDictionaryIndexes($value, []);
        return $indices;
    }

    /**
     * determines whether origin module is left or right side in relationship
     *
     * @param string $origin_module
     * @param array $row
     * @return string
     */
    public static function getSide($origin_module, $row){
        if($row['rhs_module'] == $origin_module){
            return REL_RHS;
        }
        return REL_LHS;
    }

    /**
     * creates the link definition for left side
     * @param $dict
     * @return void
     */
    public static function loadLHSLinks(&$dict)
    {
        $q = "SELECT sysmods.module, rels.lhs_linkname, rels.lhs_linklabel, rels.relationship_name
FROM (SELECT * from sysdictionaryrelationships UNION SELECT * from syscustomdictionaryrelationships) rels 
INNER JOIN (SELECT * from sysmodules UNION SELECT * from syscustommodules) sysmods ON sysmods.sysdictionarydefinition_id = rels.rhs_sysdictionarydefinition_id
WHERE rels.lhs_sysdictionarydefinition_id = '{$dict['id']}' AND rels.status='a' AND rels.deleted=0";

        if ($res = DBManagerFactory::getInstance()->query($q)) {
            while ($row = DBManagerFactory::getInstance()->fetchByAssoc($res)) {
                $dict['fields'][$row['lhs_linkname']] = [
                    'name' => $row['lhs_linkname'],
                    'vname' => $row['lhs_linklabel'],
                    'type' => 'link',
                    'module' => $row['module'],
                    'relationship' => $row['relationship_name'],
                    'source' => 'non-db',
                    'side' => 'left'
                ];
            }
        }
    }

    /**
     * creates the link definition for left side
     * @param $dict
     * @return void
     */
    public static function loadRHSLinks(&$dict) {
        $q = "SELECT sysmods.module, rels.rhs_linkname, rels.rhs_linklabel, rels.rhs_relatename, rels.rhs_relatelabel, rels.rhs_sysdictionaryitem_name, rels.relationship_name, dictitems.name id_name, rels.rhs_duplicatemerge
FROM (SELECT * from sysdictionaryrelationships UNION SELECT * from syscustomdictionaryrelationships) rels 
INNER JOIN (SELECT * from sysmodules UNION SELECT * from syscustommodules) sysmods ON sysmods.sysdictionarydefinition_id = rels.lhs_sysdictionarydefinition_id
INNER JOIN (SELECT * from sysdictionaryitems UNION SELECT * from syscustomdictionaryitems) dictitems ON dictitems.id = rels.rhs_sysdictionaryitem_id
WHERE rels.rhs_sysdictionarydefinition_id = '{$dict['id']}' AND rels.status='a' AND rels.deleted=0";
//        file_put_contents('vardefs.log', $q."\n", FILE_APPEND);
//        file_put_contents('vardefs.log', "----------------------------\n", FILE_APPEND);

        if ($res = DBManagerFactory::getInstance()->query($q)) {
            while ($row = DBManagerFactory::getInstance()->fetchByAssoc($res)) {
                $dict['fields'][$row['rhs_linkname']] = [
                    'name' => $row['rhs_linkname'],
                    'vname' => $row['rhs_linklabel'],
                    'type' => 'link',
                    'module' => $row['module'],
                    'relationship' => $row['relationship_name'],
                    'source' => 'non-db',
                    'side' => 'right'
                ];
                if(!empty($row['rhs_relatename'])){
                    $dict['fields'][$row['rhs_relatename']] = [
                        'name' => $row['rhs_relatename'],
                        'vname' => $row['rhs_relatelabel'],
                        'type' => 'relate',
                        'source' => 'non-db',
                        'link' => $row['rhs_linkname'],
                        'id_name' => $row['id_name'],
                        'rname' => ($row['rhs_sysdictionaryitem_name'] ?: 'name'),
                        'module' => $row['module']
                    ];
                }
            }
        }
    }

    /**
     * clean dictionary structure
     * @param $dict
     * @return void
     */
    public static function cleanLegacyDictionary(&$dict){
        self::unsetDeprecatedDictionaryProperties($dict);
        self::reindexDictionaryProperties($dict);
    }

    /**
     * remove deprecated properties from field definition
     * @param $dict
     * @return void
     */
    public static function unsetDeprecatedDictionaryProperties(&$dict){
        foreach($dict as $property => $dictDef){
            if(in_array($property, self::$deprecatedProperties)){
                unset($dictDef);
            }
        }
    }

    /**
     * metadata vardefs might have a numeric fields array
     * Make it associative
     * @param $dict
     * @return void
     */
    public static  function reindexDictionaryProperties(&$dict){
        foreach($dict['fields'] as $key => $fieldDef){
            if(is_integer($key)){
                $dict['fields'][$fieldDef['name']] = $fieldDef;
                unset($dict['fields'][$key]);
            }
        }
    }

    /**
     * get system languages
     *
     * @param bool $sysonly
     * @return array
     */
    public static function getLanguages($sysonly = true){
        $db = DBManagerFactory::getInstance();
        $languages = [];
        $results = $db->query("SELECT language_code FROM syslangs " . ($sysonly ? "WHERE system_language = 1" : ""). " ORDER BY sort_sequence, language_name");
        while($row = $db->fetchByAssoc($results)){
            $languages[] = $row['language_code'];
        }
        return $languages;
    }
}
