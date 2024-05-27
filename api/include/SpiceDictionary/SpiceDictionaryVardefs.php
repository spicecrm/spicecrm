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

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\Relationships\RelationshipFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceUI\api\controllers\SpiceUIModulesController;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SugarObjects\LanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\SystemStartupMode\SystemStartupMode;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Relationships\Relationship;

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
     * checks if the System is set for database managed vardefs
     * @return false
     */
    public static function isDbManaged(){
        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']){
            return true;
        }
        return false;
    }

    /**
     * checks if the System is set for database managed domains
     * @return false
     */
    public static function isDomainManaged(){
        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['domains']) && SpiceConfig::getInstance()->config['systemvardefs']['domains']){
            return true;
        }
        return false;
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

    /**
     * load legacy vardefs definitions
     * @return void
     * @throws \Exception
     */
    public static function loadLegacyFiles($dictionaryType = 'all'){
        // start with legacy metadata files
        if($dictionaryType == 'all' || $dictionaryType == 'metadata') {
            SpiceDictionaryHandler::loadMetaDataFiles();
        }

        // now load from legacy modules files
        if($dictionaryType == 'all' || $dictionaryType == 'module') {
            foreach(SpiceModules::getInstance()->getModuleList() as $module){
                SpiceDictionaryHandler::loadModuleFiles($module);
            }
        }
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

        // load legacy definitions contained in files
        self::loadLegacyFiles();

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
     * load vardefs for specified module
     * consider BWC definitions
     * @param string $module module name
     * @param string $object object name
     * @return array
     */
    public static function loadVardefsForModule($module, $object){
        $vardefs = [];

        // now load from modules
        SpiceDictionaryHandler::loadModuleFiles($module);

        // store all BWC vardefs in an array
        $vardefs[$object] = SpiceDictionaryHandler::getInstance()->dictionary[$object];

        // get definitions from database
        $dbDict = SpiceDictionaryVardefs::loadDictionaryModule($module);

        // override in/add to $vardefs (only fields defined in dictionary itself)
        if(isset($vardefs[$object])){
            if(!is_array($dbDict['fields'])) $dbDict['fields'] = [];
            $vardefs[$object]['fields'] = array_merge($vardefs[$object]['fields'], $dbDict['fields']);

            if(!is_array($dbDict['indices'])) $dbDict['indices'] = [];
            if(!is_array($vardefs[$object]['indices'])) $vardefs[$object]['indices'] = [];
            $vardefs[$object]['indices'] = SpiceDictionaryVardefs::mergeIndices($vardefs[$object]['indices'], $dbDict['indices']);
        } else{
            $vardefs[$object] = $dbDict;
        }
        $vardefs[$object]['dictionaryname'] = $object;
        $vardefs[$object]['type'] = 'module';

        return $vardefs;
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

        //load legacy
        self::loadLegacyFiles();

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
     * get load all dictionary definitions and populate global SpiceDictionaryHandler::dictionary
     *
     * @param array $dictionaryType
     */
    public static function loadDictionaries(array $dictionaryTypes = ['module', 'metadata']){

        //load templates first
        $dictionaryTemplates = self::loadTemplateDictionaries();

        // get definitions
        $dictionaryDefinitions = self::getDictionaryDefinitions($dictionaryTypes);

        // loop and build raw dictionaries (only fields defined in dictionary itself)
        foreach($dictionaryDefinitions as $dictionaryId => $dictionaryDef){
            SpiceDictionaryHandler::getInstance()->dictionary[$dictionaryDef['dictionaryname']] = self::loadRawDictionary($dictionaryDef['dictionaryid'], $dictionaryTemplates);
        }

        // load relationships
        $relationships = self::loadRelationships();

        // add links
        foreach (SpiceDictionaryHandler::getInstance()->dictionary as $dictionaryName => $definition) {
            if($definition['type'] == 'module'){
                self::loadLinksForDictionary(SpiceDictionaryHandler::getInstance()->dictionary[$dictionaryName], $definition['module'], $relationships);
            }
        }
    }


    /**
     * return module name according to dictionary name (bean name)
     *
     * @param string $dictionaryName
     * @return null
     */
    public static function getModuleByDictionaryName($dictionaryName){
        $db = DBManagerFactory::getInstance();
        $module = null;
        $q = "SELECT module FROM (SELECT * FROM sysmodules UNION SELECT * FROM syscustommodules) as sysmod WHERE sysmod.singular ='{$dictionaryName}'";
        if($res = $db->limitQuery($q, 0, 1)){
            while($row = $db->fetchByAssoc($res)){
                $module = $row['module'];
            }
        }
        return $module;
    }

    /**
     * return module name according to dictionary id
     *
     * @param string $dictionaryId
     * @return null
     */
    public static function getModuleByDictionaryId($dictionaryId){
        $db = DBManagerFactory::getInstance();
        $module = null;
        $q = "SELECT module FROM (SELECT * FROM sysmodules UNION SELECT * FROM syscustommodules) as sysmod WHERE sysmod.sysdictionarydefinition_id ='{$dictionaryId}'";
        if($res = $db->limitQuery($q, 0, 1)){
            while($row = $db->fetchByAssoc($res)){
                $module = $row['module'];
            }
        }
        return $module;
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
     * return module id according to module name
     * @param string $module
     * @return string|boolean
     */
    public static function getModuleIdByModuleName($module){
        $db = DBManagerFactory::getInstance();
        $q = "SELECT id FROM sysmodules WHERE module='{$module}' UNION SELECT id FROM syscustommodules WHERE module='{$module}'";
        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                return $row['id'];
            }
        }
        return false;
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
        sysdi.name itemname, sysdi.id item_id, sysdi.duplicate_merge, sysdi.label itemlabel, sysdi.labelinputhelper itemlabelinputhelper, sysdi.required itemrequired, sysdi.non_db, sysdi.sysdictionary_ref_id, sysdi.status itemstatus, sysdi.deleted itemdeleted, sysdi.exclude_from_audited,
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


    public static function loadDictionariesCacheFromDb($forceReload = false) {
        LoggerManager::getLogger()->debug('loadDictionariesCacheFromDb ');
        return self::getDictionariesCacheFromDb($forceReload);
    }

    public static function loadRelationshipsCacheFromDb($forceReload = false){
        RelationshipFactory::getInstance();
        if($forceReload){
            RelationshipFactory::getInstance()->loadRelationships($forceReload);
        }
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

        // add links
        self::loadLinksForDictionary($dict, $module);

        // add indices
        $dict['indices'] = self::loadDictionaryIndicesByDictionaryId($dictionaryId);
        return $dict;
    }

    /**
     * get dictionary array for passed dictionary id
     *
     * @param string $dictionaryId guid
     * @return array|mixed
     */
    public static function loadDictionary($dictionaryId) {
        $module = self::getModuleByDictionaryId($dictionaryId);
        $dict = self::loadRawDictionary($dictionaryId);

//        // add fields from templates to each dictionary
//        foreach($dict['fields'] as $fieldId => $fieldDef){
//            if(isset($fieldDef['sysdictionary_ref_id'])){
//                // get dictionary for ref
//                $dictRef = self::loadRawDictionary($fieldDef['sysdictionary_ref_id']);
//                if(is_array($dictRef['fields'])){
//                    $dict['fields'] = array_merge($dict['fields'], $dictRef['fields']);
//                }
//                unset($dict['fields'][$fieldDef['sysdictionary_ref_id']]);
////              die(__FUNCTION__.__LINE__.print_r(SpiceDictionaryHandler::getInstance()->dictionary[$dictionaryName]['fields'], true));
//            }
//        }

        // add links
        if($module){
            self::loadLinksForDictionary($dict, $module);
            // @todo: load additional fields from n-2-n relationships
        }
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
                if($row['itemstatus'] !='a' || $row['itemdeleted'] == 1){
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

        /*
        $db = DBManagerFactory::getInstance();
        $indices = [];
        $q = "SELECT sysdx.indexname, sysdx.indextype, sysdi.sysdictionaryitemname indexfield, sysd.tablename
        FROM (select id indexid, name indexname, indextype, sysdictionarydefinition_id from sysdictionaryindexes UNION select id indexid, name indexname, indextype, sysdictionarydefinition_id from syscustomdictionaryindexes) sysdx
        LEFT JOIN (select id indexitemid, sysdictionaryindex_id, sysdictionaryitem_id FROM  sysdictionaryindexitems UNION
		  	select id indexitemi, sysdictionaryindex_id, sysdictionaryitem_id FROM  syscustomdictionaryindexitems
		  ) sysdxi ON sysdxi.sysdictionaryindex_id = sysdx.indexid
		         
		  LEFT JOIN (select id dictionaryid, name dictionaryname, tablename from sysdictionarydefinitions UNION select id dictionaryid, name dictionaryname, tablename from syscustomdictionarydefinitions) sysd ON sysd.dictionaryid = sysdx.sysdictionarydefinition_id     
		   
        LEFT JOIN (select id sysdictionaryitemid, name sysdictionaryitemname, sysdictionary_ref_id from sysdictionaryitems UNION select id sysdictionaryitemid, name sysdictionaryitemname, sysdictionary_ref_id from syscustomdictionaryitems) sysdi on sysdi.sysdictionaryitemid = sysdxi.sysdictionaryitem_id 
        
        LEFT JOIN (select sysdictionarydefinition_id from sysdictionaryitems UNION select sysdictionarydefinition_id from syscustomdictionaryitems) sysdiref on sysdiref.sysdictionarydefinition_id = sysdi.sysdictionary_ref_id
        WHERE sysd.".$checkFieldWhere." = '{$value}'
        ORDER BY sysdx.indexname ASC, sysdx.indextype ASC
";

        // get the indices


        if($res = $db->query($q)){
            // loop a first time to reorganize data(
            while($row = $db->fetchByAssoc($res)){
                if(!isset($tablename)) {
                    $tablename = $row['tablename'];
                }
                $defRows[$row['indexname']][$row['indextype']]['indexfields'][] = $row['indexfield'];
            }

            // loop data to write indices
            $indices = SpiceDictionaryVardefsParser::parseIndexDefinitions($defRows, $tablename);
        }
        return $indices;
        */
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
     * build query to retrieve relationships from new sysdictionaryrelationships
     *
     * @param string $module filter results to a specific module
     * @return string
     */
    public static function getLoadRelationshipsQuery($module = null){
        $addWhere = (!empty($module) ? " AND (lhs_sysm.module='{$module}' OR rhs_sysm.module='{$module}' )" : '');

        $q = "SELECT rel.*, rel.name technicalname, join_dicts.tablename join_table,
lhs_sysm.module lhs_module, lhs_sysm.bean lhs_bean, lhs_dicts.tablename lhs_table, lhs_dicts.sysdictionary_type lhs_dictionary_type, lhs_sysdictitems.name lhs_key, lhs_sysdictitems.id lhs_key_sysdictionaryitem_id, lhs_sysm.module_label lhs_module_label, join_lhs_sysdictitems.name join_key_lhs, join_lhs_sysdictitems.id join_key_lhs_itemid,
rhs_sysm.module rhs_module, rhs_sysm.bean rhs_bean, rhs_dicts.tablename rhs_table, rhs_dicts.sysdictionary_type rhs_dictionary_type, rhs_sysdictitems.name rhs_key, rhs_sysdictitems.id rhs_key_sysdictionaryitem_id, rhs_sysm.module_label rhs_module_label, join_rhs_sysdictitems.name join_key_rhs, join_rhs_sysdictitems.id join_key_rhs_itemid
  
    FROM ( select * from sysdictionaryrelationships union select * from syscustomdictionaryrelationships) rel
   
   LEFT JOIN (select * from sysmodules union select * from syscustommodules) lhs_sysm ON lhs_sysm.sysdictionarydefinition_id = rel.lhs_sysdictionarydefinition_id  
   LEFT JOIN (select * from sysdictionaryitems union select * from syscustomdictionaryitems) lhs_sysdictitems ON lhs_sysdictitems.id = rel.lhs_sysdictionaryitem_id
   LEFT JOIN (select * from sysdictionarydefinitions union select * from syscustomdictionarydefinitions) lhs_dicts ON lhs_dicts.id = rel.lhs_sysdictionarydefinition_id
   LEFT JOIN (select * from sysdictionaryitems union select * from syscustomdictionaryitems) join_lhs_sysdictitems ON join_lhs_sysdictitems.id = rel.join_lhs_sysdictionaryitem_id
   
   LEFT JOIN (select * from sysmodules union select * from syscustommodules) rhs_sysm ON rhs_sysm.sysdictionarydefinition_id = rel.rhs_sysdictionarydefinition_id  
   LEFT JOIN (select * from sysdictionaryitems union select * from syscustomdictionaryitems) rhs_sysdictitems ON rhs_sysdictitems.id = rel.rhs_sysdictionaryitem_id
   LEFT JOIN (select * from sysdictionarydefinitions union select * from syscustomdictionarydefinitions) rhs_dicts ON rhs_dicts.id = rel.rhs_sysdictionarydefinition_id
   LEFT JOIN (select * from sysdictionaryitems union select * from syscustomdictionaryitems) join_rhs_sysdictitems ON join_rhs_sysdictitems.id = rel.join_rhs_sysdictionaryitem_id
      
      LEFT JOIN (select * from sysdictionarydefinitions union select * from syscustomdictionarydefinitions) join_dicts ON join_dicts.id = rel.join_sysdictionarydefinition_id
      
   WHERE rel.deleted=0 ".$addWhere."
	GROUP BY rel.id
";

        return $q;
    }

    /**
     * build query to retrieve relationships from cache table (relationships)
     *
     * @param string $module filter results to a specific module
     * @return string
     */
    public static function getRelationshipsCacheFromDbQuery($module = null){
        $addWhere = (!empty($module) ? " AND (lhs_module='{$module}' OR rhs_module='{$module}' )" : '');
        $q = "SELECT * FROM relationships WHERE deleted=0 ".$addWhere;
        return $q;
    }

    /**
     * @return array|void
     */
    public static function loadRelationshipsFromDictionary(){
        global $buildingRelCache;

        if ($buildingRelCache)
            return;
        $buildingRelCache = true;

        //Reload ALL the module vardefs....
//        foreach (SpiceModules::getInstance()->getBeanList() as $moduleName => $beanName) {
//            VardefManager::loadVardef($moduleName, BeanFactory::getObjectName($moduleName), true, [
//                //If relationships are not yet loaded, we can't figure out the rel_calc_fields.
//                "ignore_rel_calc_fields" => true,
//            ]);
//        }

        $relationships = [];
        //Grab all the relationships from the dictionary.
        foreach (SpiceDictionaryHandler::getInstance()->dictionary as $key => $def)
        {
            if(!empty($dictionaryNames) && !in_array($key, $dictionaryNames)){
                continue;
            }
            if (!empty($def['relationships']))
            {
                foreach($def['relationships'] as $relKey => $relDef)
                {
                    # if ($key == $relKey) // Relationship only entry (metadata), we need to capture everything
                    #     $relationships[$key] = array_merge(['name' => $key], $relDef);
                    # else {  // from  module
                    $relationships[$relKey] = array_merge(['name' => $relKey], $relDef);
                    if(!empty($relationships[$relKey]['join_table']) && empty($relationships[$relKey]['fields'])
                        && isset(SpiceDictionaryHandler::getInstance()->dictionary[$relationships[$relKey]['join_table']]['fields'])) {
                        $relationships[$relKey]['fields'] = SpiceDictionaryHandler::getInstance()->dictionary[$relationships[$relKey]['join_table']]['fields'];
                    }
                    # }

//                    die(print_r($relationships[$relKey], true));
                    $relationships[$relKey]['relationship_name'] = $relKey;
                }
            }
        }

        // enrich with relationships from sysdictionaryrelationships/ syscustomdictionaryrelationships
        if(self::isDbManaged()){
            $sysDictRels = SpiceDictionaryHandler::getInstance()->getDictionaryRelationships('a');
            foreach($sysDictRels as $relDef){
                $relKey = $relDef['relationship_name'];
                $relationships[$relKey] = array_merge(['name' => $relKey], $relDef);
                $relationships[$relKey]['relationship_name'] = $relDef['relationship_name'];
            }
        }

//        die(print_r($relationships, true));
        return $relationships;
    }

    /**
     * load relationships from table relationships
     * @param null $module
     * @return array
     * @throws \Exception
     */
    public static function loadRelationships($module = null){
        $relationships = self::loadRelationshipFromRelationshipsTable($module);
        return $relationships;
    }

    /**
     * BWC mode: relationships stored in relationships table
     * @return array
     * @throws \Exception
     */
    public static function loadRelationshipFromRelationshipsTable($module = null){
        $db = DBManagerFactory::getInstance();
        $relationships = [];

        // load metadatafiles for fields details on relationship tables
        SpiceDictionaryHandler::loadMetaDataFiles();

        $addWhere = (!empty($module) ? " AND (lhs_module='{$module}' OR rhs_module='{$module}' )" : '');
        $q = "SELECT rel.* FROM relationships rel WHERE rel.deleted=0 ".$addWhere;
        if($res = $db->query($q)) {
            while ($row = $db->fetchByAssoc($res)) {
                $relationships[$row['relationship_name']] = $row;
                if($row['relationship_type'] == 'many-to-many' || in_array($row['relationship_type'], ['many-to-many', 'email-address'])) {
                    if(isset(SpiceDictionaryHandler::getInstance()->dictionary[$relationships[$row['relationship_name']]['join_table']]) && !empty(SpiceDictionaryHandler::getInstance()->dictionary[$relationships[$row['relationship_name']]['join_table']]['fields'])){
                        $relationships[$row['relationship_name']]['fields'] = SpiceDictionaryHandler::getInstance()->dictionary[$relationships[$row['relationship_name']]['join_table']]['fields'];
                    }
                }
            }
        }
        return $relationships;
    }




    /**
     * load full relationships from database (sysdictionaryrelationships)
     *
     * @param string $module filter results to a specific module
     * @return array
     * @throws \Exception
     */
    public static function loadRelationshipFromSysDictionaryRelationshipsTable($module = null){
        $db = DBManagerFactory::getInstance();
        $relationships = [];
        $q = self::getLoadRelationshipsQuery($module);
//        die($q);
        if($res = $db->query($q)) {
            while ($row = $db->fetchByAssoc($res)) {

                $rel = [];
                // id
                $rel['id'] = $row['id'];
                // relationship type
                $rel['relationship_type'] = $row['relationship_type'];

                // left side will contain all informations
                $rel['lhs_module'] = $row['lhs_module'];
                $rel['lhs_table'] = $row['lhs_table'];
                $rel['lhs_key'] = self::getRealFieldNameForItem($row['lhs_key_sysdictionaryitem_id']);
                $rel['lhs_key_sysdictionaryitem_id'] = $row['lhs_key_sysdictionaryitem_id'];
                $rel['lhs_sysdictionarydefinition_id'] = $row['lhs_sysdictionarydefinition_id'];
                $rel['lhs_linkname'] = SpiceDictionaryVardefsParser::parseLinkName($row['lhs_linkname'], $row);
                $rel['lhs_linklabel'] = $row['lhs_linklabel'];
                $rel['lhs_linkdefault'] = $row['lhs_linkdefault'];

                // right side may not. We'll have t query up to find module involved
                $rel['rhs_module'] = $row['rhs_module'];
                $rel['rhs_table'] = $row['rhs_table'];
                $rel['rhs_key'] = self::getRealFieldNameForItem($row['rhs_key_sysdictionaryitem_id']);
                $rel['rhs_key_sysdictionaryitem_id'] = $row['rhs_key_sysdictionaryitem_id'];
                $rel['rhs_sysdictionarydefinition_id'] = $row['rhs_sysdictionarydefinition_id'];
                $rel['rhs_linkname'] = SpiceDictionaryVardefsParser::parseLinkName($row['rhs_linkname'], $row);
                $rel['rhs_linklabel'] = $row['rhs_linklabel'];
                $rel['rhs_linkdefault'] = $row['rhs_linkdefault'];
                $rel['rhs_relatename'] = $row['rhs_relatename'];
                $rel['rhs_relatelabel'] = $row['rhs_relatelabel'];

                // join data if present will contain all informations
                if(!empty($row['join_table'])){
                    $rel['join_table'] = $row['join_table'];
                    $rel['join_key_lhs'] = self::getRealFieldNameForItem($row['join_key_lhs_itemid']);
                    $rel['join_key_rhs'] = self::getRealFieldNameForItem($row['join_key_rhs_itemid']);
                }

                // parse relationship name
                $rel['relationship_name'] = SpiceDictionaryVardefsParser::parseRelationshipName($row);

                // additional columns
                if(!empty($row['relationship_role_column'])){
                    $rel['relationship_role_column'] = $row['relationship_role_column'];
                }
                if(!empty($row['relationship_role_column_value'])){
                    $rel['relationship_role_column_value'] = $row['relationship_role_column_value'];
                }

                // rhs is a template. In that case we may have multiple relations
                // typically assigned_user, created_by, modified_by relationships (left side is Users right side is another module)
                if(empty($row['rhs_module'])){
                    // retrieve data based on template dictionary
                    $rhs_rels = self::getRHSByTemplateAllocations($row['rhs_sysdictionarydefinition_id'], $row['rhs_sysdictionaryitem_id'] );
                    foreach($rhs_rels as $rhs_rel){
                        // create multiple entries for relationships. typically assigned_user relationships
                        $rhs_rel['relationship_name'] = $row['relationship_name'];
                        $multi_rel = [
                            'id' => $rel['id'],
                            'relationship_name' => SpiceDictionaryVardefsParser::parseRelationshipName($rhs_rel),
                            'relationship_type' => $rel['relationship_type'],
                            'lhs_module' => $rel['lhs_module'],
                            'lhs_table' => $rel['lhs_table'],
                            'lhs_key' => self::getRealFieldNameForItem($rel['lhs_key_sysdictionaryitem_id']),
                            'lhs_key_sysdictionaryitem_id' => $rel['lhs_key_sysdictionaryitem_id'],
                            'lhs_sysdictionarydefinition_id' => $rel['lhs_sysdictionarydefinition_id'],
                            'rhs_module' =>  $rhs_rel['rhs_module'],
                            'rhs_table' =>  $rhs_rel['rhs_table'],
                            'rhs_key' =>  self::getRealFieldNameForItem($rhs_rel['rhs_key_sysdictionaryitem_id']),
                            'rhs_key_sysdictionaryitem_id' => $rhs_rel['rhs_key_sysdictionaryitem_id'],
                            'rhs_sysdictionarydefinition_id' =>  $rhs_rel['rhs_sysdictionarydefinition_id'],
                            'rhs_relatename' => $rel['rhs_relatename']
                        ];
                        if(!empty($rel['lhs_linkname'])){
                            $multi_rel['lhs_linkname'] = SpiceDictionaryVardefsParser::parseLinkName($rel['lhs_linkname'], $multi_rel);
                        }
                        if(!empty($rel['rhs_linkname'])) {
                            $multi_rel['rhs_linkname'] = SpiceDictionaryVardefsParser::parseLinkName($rel['rhs_linkname'], $multi_rel);
                        }
                        $relationships[$multi_rel['relationship_name']] = $multi_rel;
                    }
                } else{
                    $relationships[$rel['relationship_name']] = $rel;
                }
            }
        }

        // save cache
        // self::saveRelationshipsCacheToDb($relationships);
        return $relationships;
    }


    /**
     * load relationships related to a module
     * @param $module
     * @return array
     */
    public static function loadRelationshipsForModule($module){
        return self::loadRelationships($module);
    }

    /**
     * load relationships related to a module from cache table
     * @param $module
     * @return array
     */
    public static function loadRelationshipsForModuleFromCache($module){
        $cachedValue = SpiceCache::get('relationships'.$module);
        if(!$cachedValue) {
            $cachedValue = self::getRelationshipsCacheFromDb($module);
            SpiceCache::set('relationships'.$module, $cachedValue );
        }
        return $cachedValue;
    }

    /**
     * return the field name for a dictionary item that represents an ID
     *
     * @param string $sysdictionaryItemId
     * @return string
     */
    public static function getRealFieldNameForItem($sysdictionaryItemId){
        $db = DBManagerFactory::getInstance();
        $fields = [];
        $q = "SELECT sysdi.id itemid, sysdi.name itemname, sysdf.name technicalname, sysdf.fieldtype
            FROM (select * from sysdomaindefinitions UNION select * from syscustomdomaindefinitions) sysdom
            INNER JOIN (select * from sysdomainfields UNION select * from syscustomdomainfields) sysdf ON sysdf.sysdomaindefinition_id = sysdom.id
            INNER JOIN (select * from sysdictionaryitems UNION select * from syscustomdictionaryitems) sysdi ON sysdi.sysdomaindefinition_id = sysdom.id
            WHERE sysdom.status='a' AND sysdf.status='a' AND sysdi.id = '{$sysdictionaryItemId}'";

        if($res = $db->query($q)) {
            while ($row = $db->fetchByAssoc($res)) {
                $fields[] = $row;
            }
        }

        return SpiceDictionaryVardefsParser::parseRealFieldNameFromList($fields);
    }



    /**
     * get modules, tables and keys for which template dictionary applies
     * Used to match relationships
     *
     * @param string $sysdictionarydefinitionId
     * @param string $sysdictionaryitemId
     * @return array
     */
    public static function getRHSByTemplateAllocations($sysdictionarydefinitionId, $sysdictionaryitemId){
        $db = DBManagerFactory::getInstance();
        $rhs_rels = [];
        $q = "SELECT sysmod.module rhs_module, sysd.tablename rhs_table, sysditemkeys.name rhs_key, sysd.id rhs_sysdictionarydefinition_id, '{$sysdictionaryitemId}' rhs_key_sysdictionaryitem_id
FROM (select * from sysdictionarydefinitions union select * from sysdictionarydefinitions) sysd 
LEFT JOIN (select * from sysmodules UNION select * from syscustommodules) sysmod on sysmod.sysdictionarydefinition_id = sysd.id
LEFT JOIN (select * from sysdictionaryitems union select * from sysdictionaryitems)  sysditems ON sysditems.sysdictionarydefinition_id = sysd.id
LEFT JOIN (select * from sysdictionaryitems union select * from sysdictionaryitems)  sysditemkeys ON sysditemkeys.id = '{$sysdictionaryitemId}'
where sysditems.sysdictionary_ref_id = '{$sysdictionarydefinitionId}'  AND sysd.deleted=0 AND sysd.status='a' ";

        if($res = $db->query($q)) {
            while ($row = $db->fetchByAssoc($res)) {
                $rhs_rels[] = $row;
            }
        }
        return $rhs_rels;
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
     * create link definitions for dictionary
     *
     * @param array $dictionaryDef
     * @param string $contextModule
     * @return void
     */
    public static function loadLinksForDictionary(&$dictionaryDef, $contextModule, $relationships = []) {
        if(empty($relationships)){
            $relationships = self::loadRelationshipsForModule($contextModule);
        }

        foreach($relationships as $rel_name => $rel_def){

            if($rel_def['lhs_module'] == $contextModule && !empty($rel_def['lhs_linkname'])){
                // set left link
                $dictionaryDef['fields'][$rel_def['lhs_linkname']] = [
                    'name' => $rel_def['lhs_linkname'],
                    'vname' => $rel_def['lhs_linklabel'],
                    'type' => 'link',
                    'source' => 'non-db',
                    'relationship' => $rel_name,
                    'module' => $rel_def['rhs_module'],
                    'default' => empty($rel_def['lhs_linkdefault']) ? false : $rel_def['lhs_linkdefault']
                ];

                // set rel_fields if m-2-m relationship
                if(!empty($rel_def['id']) && $m2m_fields = self::loadM2MRelationshipFields($rel_def['id'], $dictionaryDef['id'])){
                    // set rel_fields property in link
                    self::addM2MRelFields($dictionaryDef['fields'][$rel_def['lhs_linkname']], $m2m_fields['rel_fields']);
                    // set non-db m-2-m fields in dictionary
                    self::addM2MFields($dictionaryDef['fields'], $m2m_fields['fields']);
                }
            }

            if($rel_def['rhs_module'] == $contextModule && !empty($rel_def['rhs_linkname'])){
                // set right link
                $dictionaryDef['fields'][$rel_def['rhs_linkname']] = [
                    'name' => $rel_def['rhs_linkname'],
                    'vname' => $rel_def['rhs_linklabel'],
                    'type' => 'link',
                    'source' => 'non-db',
                    'relationship' => $rel_name,
                    'module' => $rel_def['lhs_module'],
                    'default' => empty($rel_def['rhs_linkdefault']) ? false : $rel_def['rhs_linkdefault']
                ];

                // set rel_fields if m-2-m relationship
                if($m2m_fields = self::loadM2MRelationshipFields($rel_def['id'], $dictionaryDef['id'])){
                    // set rel_fields property in link
                    self::addM2MRelFields($dictionaryDef['fields'][$rel_def['rhs_linkname']], $m2m_fields['rel_fields']);
                    // set non-db m-2-m fields
                    self::addM2MFields($dictionaryDef['fields'], $m2m_fields['fields']);
                }


                // set relate
                if(!empty($rel_def['rhs_relatename']) && $rel_def['relationship_type'] != 'parent'){
                    $dictionaryDef['fields'][$rel_def['rhs_relatename']] = [
                        'name' => $rel_def['rhs_relatename'],
                        'vname' => $rel_def['rhs_relatelabel'],
                        'type' => 'relate',
                        'source' => 'non-db',
                        'link' => $rel_def['rhs_linkname'],
                        'module' => $rel_def['lhs_module'],
                        'id_name' => $rel_def['rhs_key']
                    ];
                    $relateFieldData = self::loadRelationshipRelateFields($rel_def['id']);
                    if(!empty($relateFieldData)){
                        $dictionaryDef['fields'][$rel_def['rhs_relatename']]['rname'] = $relateFieldData[0]['fieldname'];
                        if(count($relateFieldData) > 1) {
                            foreach ($relateFieldData as $idx => $relateField) {
                                $dictionaryDef['fields'][$rel_def['rhs_relatename']]['db_concat_fields'][] = $relateField['fieldname'];
                            }
                        }
                    }
                }

                // set parent
                if(!empty($rel_def['rhs_relatename']) && $rel_def['relationship_type'] == 'parent'){
                    $dictionaryDef['fields'][$rel_def['rhs_relatename']] = [
                        'name' => $rel_def['rhs_relatename'],
                        'vname' => $rel_def['rhs_relatelabel'],
                        'type' => 'parent',
                        'source' => 'non-db',
                        'id_name' => $rel_def['rhs_key']
                    ];
                }
            }
        }
    }


    /**
     * get fields to populate a relate field
     *
     * @param string $relationshipId
     * @return array
     */
    public static function loadRelationshipRelateFields($relationshipId){
        $db = DBManagerFactory::getInstance();
        $relateFields = [];
        $q = "select sysditems.name fieldname, sysditems.label fieldlabel, sysdomfields.fieldtype, sysdomfields.len fieldlen
        FROM (select * from sysdictionaryitems UNION select * from syscustomdictionaryitems) sysditems
        INNER JOIN (select * from sysdomaindefinitions UNION select * from syscustomdomaindefinitions) sysdomns ON sysdomns.id = sysditems.sysdomaindefinition_id
        INNER JOIN (select * from sysdomainfields UNION select * from syscustomdomainfields) sysdomfields ON sysdomfields.sysdomaindefinition_id = sysdomns.id
        INNER JOIN (select * from sysdictionaryrelationshiprelatefields UNION select * from syscustomdictionaryrelationshiprelatefields) sysdrelfields ON sysdrelfields.sysdictionaryitem_id = sysditems.id
        WHERE sysdrelfields.sysdictionaryrelationship_id = '{$relationshipId}'
        ORDER BY sysdrelfields.sequence ASC";

        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                $relateFields[] = [
                    'fieldname' => $row['fieldname'],
                    'fieldtype' => $row['fieldtype'],
                    'fieldlen' => $row['fieldlen'],
                    'fieldlabel' => $row['fieldlabel'],
                ];
            }
        }
        return $relateFields;
    }

    /**
     * get fields to populate a dictionary fields related to a m-2-m relationship and
     * get rel_fields to populate rel_fields property in link pointing to a m-2-m relationship
     *
     * @param string $relationshipId
     * @param string $sysdictionarydefinitionId
     * @return array
     */
    public static function loadM2MRelationshipFields($relationshipId, $sysdictionarydefinitionId){
        $db = DBManagerFactory::getInstance();
        $rel_fields = [];
        $fields[] = [];
        $q = "select sysd.id sysdictionary_id, sysd.name dictionaryname, sysd.tablename, sysd.audited tableaudited, sysd.sysdictionary_type,
         sysdo.name domainname, sysdof.name technicalname,
        sysdi.name itemname, sysdi.label itemlabel, sysdi.required,  sysdi.sysdictionary_ref_id,
        sysdof.*, sysdov.name validationname,
        relfields.map_to_fieldname
        FROM (select * from sysdictionaryrelationshipfields UNION select * from syscustomdictionaryrelationshipfields) relfields
INNER JOIN (select * from sysdictionarydefinitions UNION select * from syscustomdictionarydefinitions) sysd ON sysd.id = relfields.sysdictionarydefinition_id AND sysd.status='a'
INNER JOIN (select * from sysdictionaryitems UNION select * from syscustomdictionaryitems) sysdi ON sysdi.id = relfields.sysdictionaryitem_id
LEFT JOIN (SELECT * from sysdomaindefinitions UNION SELECT * from syscustomdomaindefinitions) sysdo ON sysdi.sysdomaindefinition_id = sysdo.id
LEFT JOIN (SELECT * from sysdomainfields UNION SELECT * from syscustomdomainfields)  sysdof ON sysdof.sysdomaindefinition_id = sysdo.id
LEFT JOIN (SELECT * from sysdomainfieldvalidations UNION SELECT * from syscustomdomainfieldvalidations) sysdov ON sysdov.id = sysdof.sysdomainfieldvalidation_id
 
WHERE relfields.deleted = 0 AND relfields.status = 'a' AND relfields.sysdictionaryrelationship_id = '{$relationshipId}' AND relfields.sysdictionarydefinition_id='{$sysdictionarydefinitionId}'
@152 AND sysdi.status = 'a' 
";

        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                // the field in join table
                $field = SpiceDictionaryVardefsParser::parseRelFieldDefinition($row);
                // join table fieldname
                $joinTableFieldName = $field['name'];
                // now overwrite name using map_to_fieldname
                $field['name'] = $row['map_to_fieldname'];
                $fields[$field['name']] = $field;
                // prepare the rel_fields property
                if(!empty($row['map_to_fieldname']) && !empty($field['name'])){
                    // map join table field name to module non db field
                    $rel_fields[$joinTableFieldName] = ['map' => $row['map_to_fieldname']];
                }
            }
        }
        // remove empty values in $rel_fields and $fields before return
        return ['rel_fields' => array_filter($rel_fields), 'fields' => array_filter($fields)];
    }

    /**
     * add non-db fields representing m-2-m fields to dictionary
     *
     * @param array $dictionaryFields
     * @param array|null $m2m_fields
     * @return void
     */
    public static function addM2MFields(&$dictionaryFields, $m2m_fields){
        if(is_array($m2m_fields) && !empty($m2m_fields)){
            $dictionaryFields = array_merge($dictionaryFields, $m2m_fields);
        }
    }

    /**
     * add property rel_fields to link definition
     *
     * @param array $linkField
     * @param array|null $m2m_relFields
     * @return void
     */
    public static function addM2MRelFields(&$linkField, $m2m_relFields){
        if(is_array($m2m_relFields) && !empty($m2m_relFields)){
            $linkField['rel_fields'] = $m2m_relFields;
        }
    }

    /**
     * retrieve validations for a domain by $sysdomaindefinition_id
     *
     * @param string $sysdomaindefinitionId
     * @return array
     */
    public static function getSysDomainFieldValidationBySysDomainId($sysdomaindefinitionId)
    {
        $db = DBManagerFactory::getInstance();
        $q = "SELECT sysdofv.*
            FROM sysdomainfieldvalidations sysdofv 
            INNER JOIN sysdomainfields sysdof ON sysdof.sysdomainfieldvalidation_id = sysdofv.id
            INNER JOIN sysdomaindefinitions sysdo ON sysdo.id = sysdof.sysdomaindefinition_id
            WHERE sysdo.id='{$sysdomaindefinitionId}'";

        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                return $row;
            }
        }
        return [];
    }

    /**
     * get a validation definition by name
     *
     * @param string $name
     * @return mixed
     */
    public static function getSysDomainFieldValidationByName($name) {
        $db = DBManagerFactory::getInstance();
        $q = "SELECT sysdov.id FROM sysdomainfieldvalidations sysdov 
                        INNER JOIN sysdomainfieldvalidationvalues sysdovv ON sysdov.id = sysdovv.sysdomainfieldvalidation_id
                        WHERE sysdov.name ='{$name}'";
        $row = [];
        if($res = $db->query($q)){
            $row = $db->fetchByAssoc($res);
        }
        return $row;
    }

    /**
     * save sysdomain with sysdomainfield and relate for validation
     * triggered by specific field
     *
     * @param array $field
     * @param string $sysdomainfieldvalidation_id
     * @return string
     */
    public static function createSysDomainForValidation($field, $sysdomainfieldvalidation_id){
        $db = DBManagerFactory::getInstance();
        $qi = [];
        $sysdomaindefinition_id = SpiceUtils::createGuid();
        $qi[] = "INSERT INTO sysdomaindefinitions (id, name, fieldtype, fieldlen) VALUES('{$sysdomaindefinition_id}', '{$field['options']}', '{$field['type']}', '{$field['len']}');";
        $qi[] = "INSERT INTO sysdomainfields (id, name, dbtype, fieldlen, sysdomaindefinition_id, sysdomainfieldvalidation_id, fieldtype, fieldcomment) VALUES(uuid(), '{sysdictionaryitems.name}', '".($field['dbType'] ? $field['dbType'] : 'varchar')."', '{$field['len']}', '{$sysdomaindefinition_id}', '{$sysdomainfieldvalidation_id}', '{$field['type']}', '".$db->quote($field['description'])."');";
        foreach($qi as $q){
            $db->query($q);
        }
        return $sysdomaindefinition_id;
    }

    /**
     * return the id of sysdomain corresponding to vardef['type']
     * Query will deviate when handling enums
     * @param array $field
     * @return mixed
     */
    public static function getSysDomainByFieldType ($field){
        $db = DBManagerFactory::getInstance();
        //handle dbType / dbtype
        if(isset($field['dbtype'])){
            $field['dbType'] = $field['dbtype'];
        }

        // handle enums separately
        switch($field['type']){
            case 'radio':
            case 'enum':
            case 'multienum':
                //@todo: catch error when options is empty
                $q = "SELECT * FROM sysdomaindefinitions WHERE fieldtype='{$field['type']}' AND name='{$field['options']}'";
                $res = $db->query($q);
                $row = $db->fetchByAssoc($res);

                if(empty($row)){
                    // we might have to create the sysdomain. Check if we have a validation entry
                    $row = self::getSysDomainFieldValidationByName($field['options']);
                    if(!empty($row)){
                        return self::createSysDomainForValidation($field, $row['id']);
                    }
                }
                break;
            case 'datetimecombo':
                $field['type'] = 'datetime';
                $q = "SELECT * FROM sysdomaindefinitions WHERE fieldtype='{$field['type']}'";
                $res = $db->query($q);
                $row = $db->fetchByAssoc($res);
                breaK;
            case 'url':
            case 'user_name':
            case 'name':
            case 'phone':
            case 'companies':
            case 'mailbox':
            case 'mailboxtransport':
            case 'email':
            case 'language':
            case 'file':
            case 'actionset':
                $field['type'] = 'varchar';
                $q = "SELECT * FROM sysdomaindefinitions WHERE fieldtype='{$field['type']}'";
                $res = $db->query($q);
                $row = $db->fetchByAssoc($res);
                break;
            case 'tags':
            case 'json':
                $field['type'] = 'text';
                $q = "SELECT * FROM sysdomaindefinitions WHERE fieldtype='{$field['type']}'";
                $res = $db->query($q);
                $row = $db->fetchByAssoc($res);
                break;
            default:
                $q = "SELECT * FROM sysdomaindefinitions WHERE fieldtype='{$field['type']}'";
                $res = $db->query($q);
                $row = $db->fetchByAssoc($res);
        }

        //@todo: catch error when nothing was found

        return $row['id'];
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
     * @param $dict
     * @return void
     */
    public static function unsetDeprecatedFieldProperties(&$fieldDefs){
        foreach($fieldDefs as $property => $fieldDef){
            if(in_array($property, self::$deprecatedProperties)){
                unset($fieldDefs);
            }
        }
    }

    /**
     * save entry to cache table sysdictionaryindices
     * @param array $dict
     * @return void
     */
    public static function saveDictionaryCacheToDb(array $dict, bool $deleteBeforesave = true){
        $sqls = [];
        $db = DBManagerFactory::getInstance();

        // get the dictionary name
        $dictName = !empty($dict['name']) ? $dict['name'] : (!empty($dict['dictionaryname']) ? $dict['dictionaryname'] : $dict['table']);

        // remove exiting entry
        if($deleteBeforesave){
            self::deleteDictionaryCacheFromDb($dictName);
        }

        // We should have a dictionary definition for that dictionary
        // todo: what shall happen if not? It Will be the case hwne updating a SpiceCRM having custom modules
        if(empty($dict['id'])){
            $dict['id'] =SpiceDictionaryDefinitions::getInstance()->getIdByName($dictName);
        }
        foreach($dict['fields'] as $fieldDef){
            if(empty($fieldDef['name'])) continue;
            self::unsetDeprecatedFieldProperties($fieldDef);

            $insertParams = [
                'id' => "'".SpiceUtils::createGuid()."'",
                'sysdictionaryname' => "'".$dictName."'",
                'sysdictionarytablename' => "'".$dict['table']."'",
                'sysdictionarytableaudited' => isset($dict['audited']) ? intval($dict['audited']) : 0,
                'sysdictionarytablecontenttype' => !$dict['contenttype'] ? "''" : "'{$dict['contenttype']}'",
                'sysdictionarydefinition_id' => "'".$dict['id']."'",
                'sysdomainfield_id' => "'".$fieldDef['sysdomainfield_id']."'",
                'fieldname' => "'".$fieldDef['name']."'",
                'fieldtype' => "'".$fieldDef['type']."'",
                'fielddefinition' => "'".$db->quote(json_encode($fieldDef))."'",
                'sysdictionaryitem_id' => "'{$fieldDef['sysdictionaryitem_id']}'"
            ];
            // grab insert columns once
            if(!isset($insertColumns)) $insertColumns = array_keys($insertParams);

            $skipEntry = false;
            if(empty($dictName) && empty($dict['table'])){
                $skipEntry = true;
            }
            if(!$skipEntry) {
                //$db->insertQuery('sysdictionaryfields', $insertParams, true);
                $sqlInserts[] = "(" . implode(",", $insertParams) . ")";
            }
        }

        if(is_array($sqlInserts) && count($sqlInserts) > 0){
            foreach ($sqlInserts as $sqlInsert){
                $sqls[] = "INSERT INTO sysdictionaryfields (" . implode(', ', $insertColumns) . ") VALUES $sqlInsert";
            }
            //$sqls[] = "INSERT INTO sysdictionaryfields (" . implode(', ', $insertColumns) . ") VALUES ".implode(', ', $sqlInserts).";";
        }

        // reset temp arrays
        $sqlInserts = [];
        unset($insertColumns);

        // relationships
//        if(isset($dict['relationships'])){
//            foreach($dict['relationships'] as $relationship_name => $relationship){
//                $relationship['relationship_name'] = $relationship_name;
//                self::saveRelationshipCacheToDb($relationship, true);
//            }
//        }

        // indices
        if(is_array($dict['indices']) && !empty($dict['indices'])) {
            foreach($dict['indices'] as $indexDef){

                $insertParams = [
                    'id' => "'".SpiceUtils::createGuid()."'",
                    'sysdictionaryname' => "'".$dictName."'",
                    'sysdictionarydefinition_id' => "'".$dict['id']."'",
                    'indexname' => "'".$indexDef['name']."'",
                    'indextype' => "'".$indexDef['type']."'",
                    'indexdefinition' => "'".$db->quote(json_encode($indexDef))."'"
                ];
                // grab insert columns once
                if(!isset($insertColumns)) $insertColumns = array_keys($insertParams);

                $skipEntry = false;
                if(empty($dictName) && empty($dict['table'])){
                    $skipEntry = true;
                }
                if(!$skipEntry) {
                    //$db->insertQuery('sysdictionaryindices', $insertParams, true);
                    $sqlInserts[] = "(" . implode(",", $insertParams) . ")";
                }
            }

            foreach($sqlInserts as $sqlInsert){
                $sqls[] = "INSERT INTO sysdictionaryindices (" . implode(', ', $insertColumns) . ") VALUES $sqlInsert";
            }

            // $sqls[] = "INSERT INTO sysdictionaryindices (" . implode(', ', $insertColumns) . ") VALUES ".implode(', ', $sqlInserts).";";
        }

        // process slqs
        foreach($sqls as $sql){
            if(!$db->query($sql, true)){
                //@todo: see if anything shall be logged somewhere
            }
        }

        // clear the cache
        SpiceCache::clear('dictionaries');
    }

    /**
     * remove entry in sysdictionaryfields
     *
     * @param string $dictName dictionary name
     * @return bool
     */
    public static function deleteDictionaryCacheFromDb($dictName){
        if(empty($dictName)) return false;
        $db = DBManagerFactory::getInstance();
        // remove from table
        $delWhere = ['sysdictionaryname' => $dictName];
        if(!$db->deleteQuery('sysdictionaryfields', $delWhere)){
            LoggerManager::getLogger()->fatal('error dictionary cached entry in sysdictionaryfields with dictionary name '.$dictName.' '.$db->lastError());
            return false;
        }
        if(!$db->deleteQuery('sysdictionaryindices', $delWhere)){
            LoggerManager::getLogger()->fatal('error dictionary cached entry in sysdictionaryindices with dictionary name '.$dictName.' '.$db->lastError());
            return false;
        }
        return true;
    }

    /**
     * get dictionary from cache table
     *
     * @param string $dictionaryId
     * @return array
     */
    public static function getDictionaryCacheFromDb($dictionaryId){
        if(empty($dictionaryId)){
            return [];
        }
        $db = DBManagerFactory::getInstance();
        $dict = [];

        // get fields
        $q = "SELECT sysfields.*, sysmod.module sysmodule, sysdefinitions.name dictionaryname, sysdefinitions.tablename dictionarytablename, sysdefinitions.audited dictionaryaudited
            FROM sysdictionaryfields sysfields 
            INNER JOIN (select * from sysdictionarydefinitions UNION select * from syscustomdictionarydefinitions) sysdefinitions ON sysdefinitions.id = sysfields.sysdictionarydefinition_id 
            LEFT JOIN (select * from sysmodules UNION select * from syscustommodules) sysmod ON sysmod.sysdictionarydefinition_id = sysdefinitions.id 
            WHERE sysfields.sysdictionarydefinition_id = '".$dictionaryId."' AND sysdefinitions.status='a' AND sysdefinitions.deleted=0";

        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                $dict['id'] = $row['sysdictionarydefinition_id'];
                $dict['table'] = $row['dictionarytablename'];
                $dict['audited'] = $row['dictionaryaudited'];
                if(!empty($row['sysmodule'])){
                    $dict['module'] = $row['sysmodule'];
                }
                $dict['fields'][$row['fieldname']] = json_decode(html_entity_decode($row['fielddefinition'], ENT_QUOTES), true);
            }
        }

        // get indices
        $dict['indices'] = self::getDictionaryIndexCacheFromDb($dictionaryId);

        return $dict;
    }

    /**
     * get cached indices for specified dictionaryId
     * @param string $dictionaryId
     * @return array
     * @throws \Exception
     */
    public static function getDictionaryIndexCacheFromDb($dictionaryId){
        if(empty($dictionaryId)){
            return [];
        }

        $db = DBManagerFactory::getInstance();
        $indices = [];

        // get indices
        $q = "SELECT sysindices.*
            FROM sysdictionaryindices sysindices 
               WHERE sysindices.sysdictionarydefinition_id = '".$dictionaryId."'";

        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                $indices[] = json_decode(html_entity_decode($row['indexdefinition'], ENT_QUOTES), true);
            }
        }
        return $indices;
    }


    /**
     * get dictionary from cache table
     *
     * @param array $dictionaryId
     * @return array
     */
    public function getDictionaryCacheFromDbByObject($object, $forceReload = false){
        if(empty($object)){
            return [];
        }

        $cached = SpiceCache::get('dictionaryfields');

        // check if dictionary is present in session and return right away
        if(!$forceReload && $cached &&  isset($cached[$object])){
            return $cached[$object];
        }

        $db = DBManagerFactory::getInstance();
        $dict = [];
        $q = "SELECT sysfields.sysdictionarydefinition_id sysdictionaryid, sysfields.sysdictionaryname, sysfields.sysdictionarytablename, sysfields.sysdictionarytableaudited, 
       sysfields.fieldname, sysfields.fieldtype, sysfields.fielddefinition, sysfields.sysdictionarytablecontenttype
            FROM sysdictionaryfields sysfields 
            WHERE sysfields.sysdictionaryname = '".$object."'";

        if($res = $db->query($q)){
            $setDictInfo = true;
            while($row = $db->fetchByAssoc($res)){
                if($setDictInfo) {
                    $dict['id'] = $row['sysdictionaryid'];
                    $dict['name'] = $row['sysdictionaryname'];
                    $dict['dictionaryname'] = $row['sysdictionaryname'];
                    $dict['table'] = $row['sysdictionarytablename'];
                    $dict['audited'] = $row['sysdictionarytableaudited'];
                    $dict['contenttype'] = $row['sysdictionarytablecontenttype'];
                    $dict['module'] = SpiceModules::getInstance()->getModuleName($object);
                    $setDictInfo = false;
                }
                $dict['fields'][$row['fieldname']] = json_decode(html_entity_decode($row['fielddefinition'], ENT_QUOTES), true);
            }
        }


        // load indices
        if (!empty($dict['fields'])) {
            $dict['indices'] = self::getDictionaryIndexCacheFromDb($dict['id']);
        }

        // enrich and write the cache
        if(!$cached) $cached = [];
        $cached[$object] = $dict;
        SpiceCache::set('dictionaryfields', $cached);

        return $dict;
    }

    /**
     * read all consolidated field definitions from sysdictionaryfields
     * @return void
     * @throws \Exception
     */
    public static function getDictionariesCacheFromDb($forceReload = false){

        // get the cached value
        $cached = SpiceCache::get('dictionaries');

        // already loaded & in session
        if(!$forceReload && $cached){
            //die('getDictionariesCacheFromDb'.print_r($_SESSION['dictionaries'], true));
            SpiceDictionaryHandler::getInstance()->dictionary = $cached;
            return;
        }

        // create an empty dict array
        $dict = [];

        // else first load from sysdictionaryfields
        $db = DBManagerFactory::getInstance();
        $q = "SELECT sysfields.sysdictionarydefinition_id sysdictionaryid, sysfields.sysdictionaryname, sysfields.sysdictionarytablename, sysfields.sysdictionarytableaudited, 
        sysfields.fieldname, sysfields.fieldtype, sysfields.fielddefinition, sysfields.sysdictionarytablecontenttype
            FROM sysdictionaryfields sysfields ORDER BY sysdictionarytablename ASC";

        if($result = $db->query($q)){
            while($row = $db->fetchByAssoc($result)){
                SpiceDictionaryHandler::getInstance()->dictionary[$row['sysdictionaryname']]['id'] = $row['sysdictionaryid'];
                SpiceDictionaryHandler::getInstance()->dictionary[$row['sysdictionaryname']]['dictionaryname'] = $row['sysdictionaryname'];
                SpiceDictionaryHandler::getInstance()->dictionary[$row['sysdictionaryname']]['name'] = $row['sysdictionaryname'];
                SpiceDictionaryHandler::getInstance()->dictionary[$row['sysdictionaryname']]['table'] = $row['sysdictionarytablename'];
                SpiceDictionaryHandler::getInstance()->dictionary[$row['sysdictionaryname']]['audited'] = $row['sysdictionarytableaudited'];
                SpiceDictionaryHandler::getInstance()->dictionary[$row['sysdictionaryname']]['contenttype'] = $row['sysdictionarytablecontenttype'];
                SpiceDictionaryHandler::getInstance()->dictionary[$row['sysdictionaryname']]['fields'][$row['fieldname']] = json_decode(html_entity_decode($row['fielddefinition'], ENT_QUOTES), true);
            }
        }

        SpiceCache::set('dictionaries', SpiceDictionaryHandler::getInstance()->dictionary);
    }

    /**
     * read validations and create app_list_strings doms
     *
     * @return array
     */
    public static function loadDictionaryValidations(){
        $db = DBManagerFactory::getInstance();

        // try to get the cached values
        $cached = SpiceCache::get('domains');

        // already loaded
        if($cached){
            return $cached;
        }

        // load first time
        $retArray = [];
        // core values
        $coreEnums = $db->query("SELECT id, name FROM sysdomainfieldvalidations WHERE (validation_type = 'enum' OR validation_type = 'options') AND status='a' AND deleted = 0");

        while($coreEnum = $db->fetchByAssoc($coreEnums)){
            $retArray[$coreEnum['name']]['name'] = $coreEnum['name'];
            $retArray[$coreEnum['name']]['values'] = [];
            $enumValues = $db->query("SELECT enumvalue, sequence, label FROM sysdomainfieldvalidationvalues WHERE sysdomainfieldvalidation_id = '{$coreEnum['id']}' AND status = 'a' AND deleted = 0");
            while($enumValue = $db->fetchByAssoc($enumValues)){
                $retArray[$coreEnum['name']]['values'][$enumValue['enumvalue']] = [
                    'enumvalue' => $enumValue['enumvalue'],
                    'label' => $enumValue['label'],
                    'sequence' => $enumValue['sequence']
                ];
            }

            // load custom enum values added to original dom
            $cenumValues = $db->query("SELECT enumvalue, sequence, label FROM syscustomdomainfieldvalidationvalues WHERE sysdomainfieldvalidation_id = '{$coreEnum['id']}' AND status = 'a' AND deleted = 0");
            while($cenumValue = $db->fetchByAssoc($cenumValues)){
                $retArray[$coreEnum['name']]['values'][$cenumValue['enumvalue']] = [
                    'enumvalue' => $cenumValue['enumvalue'],
                    'label' => $cenumValue['label'],
                    'sequence' => $cenumValue['sequence']
                ];
            }
        }

        // custom values
        $coreEnums = $db->query("SELECT id, name FROM syscustomdomainfieldvalidations WHERE validation_type = 'enum' AND status='a' AND deleted = 0");
        while($coreEnum = $db->fetchByAssoc($coreEnums)){
            $retArray[$coreEnum['name']]['name'] = $coreEnum['name'];
            $retArray[$coreEnum['name']]['values'] = [];

            // load custom enum values
            $cenumValues = $db->query("SELECT enumvalue, sequence, label FROM syscustomdomainfieldvalidationvalues WHERE sysdomainfieldvalidation_id = '{$coreEnum['id']}' AND status = 'a' AND deleted = 0");
            while($cenumValue = $db->fetchByAssoc($cenumValues)){
                $retArray[$coreEnum['name']]['values'][$cenumValue['enumvalue']] = [
                    'enumvalue' => $cenumValue['enumvalue'],
                    'label' => $cenumValue['label'],
                    'sequence' => $cenumValue['sequence']
                ];
            }
        }

        // save to the session
        SpiceCache::set('domains', $retArray);

        return $retArray;
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

    /**
     * build an array containing doms for each language
     *
     * @param string $language
     * @return array
     */
    public static function createDictionaryValidationDoms($language = null){
        if(empty($language)){
            $language = $GLOBALS['current_language'];
            if(empty($language)){
                $language = LanguageManager::getDefaultLanguage();
            }
        }

        $sys_app_list_strings = [];
        $validations = self::loadDictionaryValidations();
        $syslanguagelabels[$language] = LanguageManager::loadDatabaseLanguage($language);

        foreach($validations as $dom => $definition){
            // re-organize and add translation
            foreach($definition['values'] as $enumvalue => $def){
                $translation = (!empty($syslanguagelabels[$language][$def['label']]['default']) ? $syslanguagelabels[$language][$def['label']]['default'] : $enumvalue);
                $sys_app_list_strings[$dom][$language]['values'][$enumvalue]['enumvalue'] = $enumvalue;
                $sys_app_list_strings[$dom][$language]['values'][$enumvalue]['translation'] = $translation;
                $sys_app_list_strings[$dom][$language]['values'][$enumvalue]['sequence'] = $def['sequence'];
            }

            // sort by the sequence
            if(is_array($sys_app_list_strings[$dom][$language]['values'])){
                $arrmap = array_map(function($element) {
                    return $element['sequence'];
                }, $sys_app_list_strings[$dom][$language]['values']);
                array_multisort($arrmap, ($definition['sort_flag'] == 'desc' ? SORT_DESC : SORT_ASC), $sys_app_list_strings[$dom][$language]['values']);
            }
        }

        return $sys_app_list_strings;
    }


    /**
     * delete a relationship entry from cache table by relationship name
     *
     * @param string $relName
     * @return boolean
     */
    public static function deleteRelationshipCacheFromDb($relName){
        $db = DBManagerFactory::getInstance();
        $delWhere = ['relationship_name' => $relName];
        if(!$db->deleteQuery('relationships', $delWhere)){
            LoggerManager::getLogger()->fatal('error relationship cached entry with name id {$relName} '.$db->lastError());
            return false;
        }
        return true;
    }

    /**
     * delete all relationship entries from cache table
     *
     * @return boolean
     */
    public static function deleteAllRelationshipsCacheFromDb(){
        $tableName = 'relationships';
//        if (SpiceDictionaryVardefs::isDbManaged()) {
//            $tableName = 'sysdictionaryrelationships';
//        }
        $db = DBManagerFactory::getInstance();
        // use deleteAll to ensure rollback functionality. It would not work with a truncate table
        if(!$db->deleteAll($tableName, true)){
            LoggerManager::getLogger()->fatal('error truncating '.$tableName.' table '.$db->lastError());
            return false;
        }
        return true;
    }

    /**
     * get relationships from cache table relationships
     *
     * @return array
     */
    public static function getRelationshipsCacheFromDb($module = null){
        $db = DBManagerFactory::getInstance();
        $q = self::getRelationshipsCacheFromDbQuery($module);

        $relationships = [];
        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                $relationships[$row['relationship_name']] = $row;
            }
        }
        return $relationships;
    }

    /**
     * Save a relationship definition to the cache table
     * table used is former relationships table
     *
     * @param array $relationship
     * @param bool $removeFirst
     */
    public static function saveRelationshipCacheToDb($relationship, $removeFirst = true ){
        $db = DBManagerFactory::getInstance();

        // first remove from table
        if($removeFirst){
            self::deleteRelationshipCacheFromDb($relationship['relationship_name']);
        }

        $insertParams = [
            'id' => SpiceUtils::createGuid(),
            'relationship_name' => $relationship['relationship_name'],
            'lhs_module' => $relationship['lhs_module'],
            'lhs_table' => $relationship['lhs_table'],
            'lhs_key' => $relationship['lhs_key'],
            'lhs_linkname' => $relationship['lhs_linkname'], // preparing future relationship table from sysdictionary
            'lhs_linklabel' => $relationship['lhs_linklabel'], // preparing future relationship table from sysdictionary
            'rhs_module' => $relationship['rhs_module'],
            'rhs_table' => $relationship['rhs_table'],
            'rhs_key' => $relationship['rhs_key'],
            'rhs_linkname' => $relationship['rhs_linkname'], // preparing future relationship table from sysdictionary
            'rhs_linklabel' => $relationship['rhs_linklabel'], // preparing future relationship table from sysdictionary
            'rhs_relatename' => $relationship['rhs_relatename'], // preparing future relationship table from sysdictionary
            'rhs_relatelabel' => $relationship['rhs_relatelabel'], // preparing future relationship table from sysdictionary
            'join_table' => $relationship['join_table'],
            'join_key_lhs' => $relationship['join_key_lhs'],
            'join_key_rhs' => $relationship['join_key_rhs'],
            'relationship_type' => $relationship['relationship_type'],
            'relationship_role_column' => $relationship['relationship_role_column'],
            'relationship_role_column_value' => $relationship['relationship_role_column_value'],
            'reverse' => $relationship['reverse'],
        ];
        //echo '$insertParams '.print_r($insertParams, true);
        if(!$db->insertQuery('relationships', $insertParams, true)){
            LoggerManager::getLogger()->fatal('error insert to relationships cached entry with name '.$relationship['relationship_name'].' '.$db->lastError());
        }
    }

    /**
     * Save the relationship definitions to the cache table 'relationships'
     *
     * @param array $relationships
     */
    public static function saveRelationshipsCacheToDb($relationships){
        // insert 1 record per relationship
        foreach($relationships as $relKey => $relationship){
            self::saveRelationshipCacheToDb($relationship, false);
        }
    }

    /**
     * delete content and refill 'sysdictionaryfields' table
     * truncate and refill 'relationships' table
     * @param array $dictionaryNames
     * @return array
     * @throws \Exception
     */
    public function repairDictionaries($dictionaryNames = []){
        $returnArray = [];

        // load Vardefs
        $vardefs = SpiceDictionaryVardefs::loadVardefs($dictionaryNames);

        $db = DBManagerFactory::getInstance();
        $db->transactionCommit(); // end any other transaction
        $db->transactionStart(); // start here
        // declare the function for the scope so that rollback can be triggered
        // might not be necessary BUT doing so we ensure a rollback after any kind of error
        register_shutdown_function(function(){
            DBManagerFactory::getInstance()->transactionRollback();
        });

        // removed records from cache table sysdictionaryfields.
        if(empty($dictionaryNames)){
            //Use deleteAll to enable a rollback!
            $db->deleteAll('sysdictionaryfields', true);
        } else {
            $table = 'sysdictionaryfields';
            $where = "sysdictionaryname IN('".implode("', '", $dictionaryNames)."')";
            $db->deleteQuery($table, $where, true);
        }

        // save to db
        foreach($vardefs as $dictName => $dict){
            if($dict['type'] == 'template'|| empty($dictName)) continue;
            $returnArray[] = $dictName;
            // save to db
            SpiceDictionaryVardefs::saveDictionaryCacheToDb($dict);
        }
        $db->transactionCommit(); // stop here

        $db->transactionStart(); // start to continue

        // repair relationships and reset the session variable 'relationships'
        SpiceDictionaryVardefs::build_relationship_cache();

        SystemStartupMode::setRecoveryMode(false);

        // save full cached vardefs
//        $cachedVardefs = SpiceDictionaryHandler::getInstance()->dictionary;
//        self::saveDictionariesCache($cachedVardefs);

        // load dictionaries to reset the session variable 'dictionaries'
        //self::loadDictionariesCacheFromDb(true);

        // start for middleware
        $db->transactionStart();
        return $returnArray;
    }

    /**
     * prepare the query for the table
     * @param array $dict
     * @param bool $execute
     * @return string
     * @throws \Exception
     */
    public static function repairTable(array $dict, bool $execute = false){
        $indices   = $dict['indices'];
        $fieldDefs = $dict['fields'];
        $tableName = $dict['table'];

        //Clean the indexes to prevent duplicate definitions
        $newIndex = [];
        foreach($indices as $indexDef){
            $newIndex[$indexDef['name']] = $indexDef;
        }
        return DBManagerFactory::getInstance()->repairTableParams($tableName, $fieldDefs,$newIndex, $execute);
    }

    /**
     * prepare the query for the audit table
     * @param array $dict
     * @param bool $execute
     * @return string
     * @throws \Exception
     */
    public static function repairAuditTable(array $dict, bool $execute = false){
        $tableName = self::getAuditTableName($dict['table']);

        if (file_exists('metadata/audit_templateMetaData.php')) {
            require('metadata/audit_templateMetaData.php');
        }

        // Bug: 52583 Need ability to customize template for audit tables
        $custom = 'custom/metadata/audit_templateMetaData_' . $tableName . '.php';
        if (file_exists($custom)) {
            require($custom);
        }

        $fieldDefs = SpiceDictionaryHandler::getInstance()->dictionary['audit']['fields'];
        $indices   = SpiceDictionaryHandler::getInstance()->dictionary['audit']['indices'];

        // Renaming template indexes to fit the particular audit table (removed the brittle hard coding)
        foreach ($indices as $nr => $properties) {
            $indices[$nr]['name'] = 'idx_' . strtolower($dict['table'] . '_audit_' . $properties['name']);
        }

        return DBManagerFactory::getInstance()->repairTableParams($tableName, $fieldDefs, $indices, $execute);
    }


    /**
     * generates the table name for the audit counterpart
     * @param string $tableName
     * @return string
     */
    public static function getAuditTableName(string $tableName){
        return $tableName.'_audit';
    }

    /**
     * rebuild content for relationships table
     * @return void
     */
    public static function build_relationship_cache() {
        SpiceDictionaryVardefs::deleteAllRelationshipsCacheFromDb();
        $relationships = SpiceDictionaryVardefs::loadRelationshipsFromDictionary();
        SpiceDictionaryVardefs::saveRelationshipsCacheToDb($relationships);
        $_SESSION['relationships'] = $relationships;
    }
}
