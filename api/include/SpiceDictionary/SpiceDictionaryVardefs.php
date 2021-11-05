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
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\LanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceDictionaryVardefs  {

    /**
     * build the query to get dictionary definitions
     *
     * @param string $dictionaryType all | metadata | module | template
     * @return string
     */
    public static function getDictionaryDefinitionsQuery($dictionaryType = 'all'){
        $q = "SELECT sysd.id dictionaryid, sysd.name dictionaryname, sysd.sysdictionary_type dictionarytype FROM sysdictionarydefinitions sysd WHERE sysd.deleted = 0 AND sysd.status = 'a' ".($dictionaryType != 'all' ? "  AND sysd.sysdictionary_type='".$dictionaryType."'" : "");
        $q.= " UNION ";
        $q.= "SELECT sysd.id dictionaryid, sysd.name dictionaryname, sysd.sysdictionary_type dictionarytype FROM syscustomdictionarydefinitions sysd WHERE sysd.deleted = 0 AND sysd.status = 'a' ".($dictionaryType != 'all' ? " AND sysd.sysdictionary_type='".$dictionaryType."'" : "");

        return $q;
    }

    /**
     * get dictionary definitions
     *
     * @param string $dictionaryType possible values all | metadata | module | template
     * @return array
     */
    public static function getDictionaryDefinitions($dictionaryType = 'all'){
        $db = DBManagerFactory::getInstance();
        $definitions = [];
        // get query
        $q = self::getDictionaryDefinitionsQuery($dictionaryType);

        // process
        if($res = $db->query($q)) {
            while ($row = $db->fetchByAssoc($res)) {
                $definitions[$row['dictionaryid']] = $row;
            }
        }

        return $definitions;
    }


    /**
     * get load all dictionary definitions and populate global $dictionary
     *
     * @param array $dictionary
     * @param string $dictionaryType all | metadata | module | template
     */
    public static function loadDictionaries($dictionaryType = 'all'){
        global $dictionary;

        // get definitions
        $dictionaryDefinitions = self::getDictionaryDefinitions($dictionaryType);

        // loop and build raw dictionaries (only fields defined in dictionary itself)
        foreach($dictionaryDefinitions as $dictionaryId => $row){
            $dictionary[$row['dictionaryname']] = self::loadRawDictionary($row['dictionaryid']);
        }

        // add fields from templates to each dictionary
        foreach($dictionary as $dictionaryName => $definition){
            if(in_array($definition['type'], ['module', 'metadata'])){
                foreach($definition['fields'] as $fieldId => $fieldDef){
                    if(isset($fieldDef['sysdictionary_ref_id']) && isset($dictionaryDefinitions[$fieldDef['sysdictionary_ref_id']])){
                        $dictionary[$dictionaryName]['fields'] = array_merge($dictionary[$dictionaryName]['fields'], $dictionary[$dictionaryDefinitions[$fieldDef['sysdictionary_ref_id']]['dictionaryname']]['fields']);
                        unset($dictionary[$dictionaryName]['fields'][$fieldDef['sysdictionary_ref_id']]);
                    }
                }
            }
        }

        // remove non module and non metadata dictionaries
        foreach($dictionary as $dictionaryName => $definition){
            if(!in_array($definition['type'], ['module', 'metadata'])){
                unset($dictionary[$dictionaryName]);
            }
        }

        // load relationships
        $relationships = self::loadRelationships();

        // add links
        foreach($dictionary as $dictionaryName => $definition){
            if($definition['type'] == 'module'){
                self::loadLinksForDictionary($dictionary[$dictionaryName], $definition['module'], $relationships);
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
        $q = "SELECT module FROM (SELECT * FROM sysmodules UNION SELECT * FROM syscustommodules) as sysmod WHERE sysmod.singular ='{$dictionaryName}' LIMIT 1";
        if($res = $db->query($q)){
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
        $q = "SELECT module FROM (SELECT * FROM sysmodules UNION SELECT * FROM syscustommodules) as sysmod WHERE sysmod.sysdictionarydefinition_id ='{$dictionaryId}' LIMIT 1";
        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                $module = $row['module'];
            }
        }
        return $module;
    }

    /**
     * return dictionary_id for specified module
     *
     * @param string $module
     * @return mixed
     */
    public static function getDictionaryIdByModule($module){
        $db = DBManagerFactory::getInstance();
        $q = "SELECT sysdictionarydefinition_id FROM syscustommodules sysmod WHERE sysmod.module ='{$module}' LIMIT 1";
        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                return $row['sysdictionarydefinition_id'];
            }
        }
        $q = "SELECT sysdictionarydefinition_id FROM sysmodules sysmod WHERE sysmod.module ='{$module}' LIMIT 1";
        if($res = $db->query($q)){
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
        return "SELECT sysd.id sysdictionary_id, sysd.name dictionaryname, sysd.tablename, sysd.audited tableaudited, sysd.sysdictionary_type,
       sysmod.module sysmodule, sysmod.id sysmoduleid,
         sysdo.name domainname, sysdof.name technicalname, 
        sysdi.name itemname, sysdi.label itemlabel, sysdi.required,  sysdi.sysdictionary_ref_id,
        sysdof.*, sysdof.id sysdomainfield_id, sysdov.name validationame
        FROM (SELECT * from sysdictionarydefinitions UNION SELECT * from syscustomdictionarydefinitions) sysd
        LEFT JOIN (SELECT * from sysmodules UNION SELECT * from syscustommodules) sysmod ON sysmod.sysdictionarydefinition_id = sysd.id
        LEFT JOIN (SELECT * from sysdictionaryitems UNION SELECT * from syscustomdictionaryitems) sysdi ON sysdi.sysdictionarydefinition_id = sysd.id
        LEFT JOIN (SELECT * from sysdictionaryitems UNION SELECT * from syscustomdictionaryitems) sysdiref ON sysdiref.sysdictionary_ref_id = sysd.id
        LEFT JOIN (SELECT * from sysdomaindefinitions UNION SELECT * from syscustomdomaindefinitions) sysdo ON sysdi.sysdomaindefinition_id = sysdo.id
        LEFT JOIN (SELECT * from sysdomainfields UNION SELECT * from syscustomdomainfields)  sysdof ON sysdof.sysdomaindefinition_id = sysdo.id
        LEFT JOIN (SELECT * from sysdomainfieldvalidations UNION SELECT * from syscustomdomainfieldvalidations) sysdov ON sysdov.id = sysdof.sysdomainfieldvalidation_id
        WHERE sysd.id = '{$dictionaryId}'
        ORDER BY sysdi.sequence ASC
       ";

    }


    /**
     * get dictionary array for passed module from cache table
     *
     * @param string $module
     * @return array|bool
     */
    public static function loadDictionaryModuleCacheFromDb($module) {
        LoggerManager::getLogger()->debug('loadDictionaryModuleCacheFromDb '.$module);
        $dictionaryId = self::getDictionaryIdByModule($module);
        return self::getDictionaryCacheFromDb($dictionaryId);
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
//if($module == 'Relationships'){
//    die(print_r($dict, true));
//}

        // add fields from templates to each dictionary
        foreach($dict['fields'] as $fieldId => $fieldDef){
            if(isset($fieldDef['sysdictionary_ref_id'])){
                // get dictionary for ref
                $dictRef = self::loadRawDictionary($fieldDef['sysdictionary_ref_id']);
                if(is_array($dictRef['fields'])){
                    $dict['fields'] = array_merge($dict['fields'], $dictRef['fields']);
                }
                unset($dict['fields'][$fieldDef['sysdictionary_ref_id']]);
//              die(__FUNCTION__.__LINE__.print_r($dictionary[$dictionaryName]['fields'], true));
            }
        }

        // add links
        self::loadLinksForDictionary($dict, $module);

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

        // add fields from templates to each dictionary
        foreach($dict['fields'] as $fieldId => $fieldDef){
            if(isset($fieldDef['sysdictionary_ref_id'])){
                // get dictionary for ref
                $dictRef = self::loadRawDictionary($fieldDef['sysdictionary_ref_id']);
                if(is_array($dictRef['fields'])){
                    $dict['fields'] = array_merge($dict['fields'], $dictRef['fields']);
                }
                unset($dict['fields'][$fieldDef['sysdictionary_ref_id']]);
//              die(__FUNCTION__.__LINE__.print_r($dictionary[$dictionaryName]['fields'], true));
            }
        }

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
    public static function loadRawDictionary($dictionaryId): array
    {
        $db = DBManagerFactory::getInstance();
        $dict = [];
        $q = self::getDictionaryQuery($dictionaryId);
        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                $dict['id'] = $row['sysdictionary_id'];
                $dict['name'] = $row['dictionaryname'];
                $dict['type'] = $row['sysdictionary_type'];
                $dict['table'] = $row['tablename'];
                if(!empty($row['sysmodule'])){
                    $dict['module'] = $row['sysmodule'];
                }

                $dict['audited'] = (bool)$row['tableaudited'];

                if(empty($row['sysdictionary_ref_id'])){
                    $fieldname = SpiceDictionaryVardefsParser::parseFieldName($row);
                    $dict['fields'][$fieldname] = SpiceDictionaryVardefsParser::parseFieldDefinition($row);
                }
                else {
                    $dict['fields'][$row['sysdictionary_ref_id']] = ['sysdictionary_ref_id' => $row['sysdictionary_ref_id']];
                }
            }
        }
        return $dict;
    }

    /**
     * create full indices for a dictionary
     *
     * @param string $dictionaryId
     * @param string $tablename
     * @return array
     */
    public static function loadDictionaryIndices($dictionaryId, $tablename){
        $db = DBManagerFactory::getInstance();
        $indices = [];
        $q = "SELECT sysdx.name, sysdx.indextype, GROUP_CONCAT(sysdi.name) indexfields
        FROM sysdictionaryindexes sysdx
        LEFT JOIN sysdictionaryindexitems sysdxi ON sysdxi.sysdictionaryindex_id = sysdx.id
        LEFT JOIN sysdictionarydefinitions sysd ON sysd.id = sysdx.sysdictionarydefinition_id      
        LEFT JOIN sysdictionaryitems sysdi on sysdi.id = sysdxi.sysdictionaryitem_id 
        LEFT JOIN sysdictionaryitems sysdiref on sysdiref.sysdictionarydefinition_id = sysdi.sysdictionary_ref_id
        WHERE sysdx.sysdictionarydefinition_id = '{$dictionaryId}'
        GROUP BY sysdx.id
        ORDER BY sysdx.name ASC
";

        if($res = $db->query($q)){
            while($row = $db->fetchByAssoc($res)){
                $indices[] = SpiceDictionaryVardefsParser::parseIndexDefinition($row, $tablename);
            }
        }
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
        global $dictionary, $buildingRelCache;

        if ($buildingRelCache)
            return;
        $buildingRelCache = true;

        //Reload ALL the module vardefs....
        foreach (SpiceModules::getInstance()->getBeanList() as $moduleName => $beanName) {
            VardefManager::loadVardef($moduleName, BeanFactory::getObjectName($moduleName), false, [
                //If relationships are not yet loaded, we can't figure out the rel_calc_fields.
                "ignore_rel_calc_fields" => true,
            ]);
        }

        $relationships = [];

        //Grab all the relationships from the dictionary.
        foreach ($dictionary as $key => $def)
        {
            if (!empty($def['relationships']))
            {
                foreach($def['relationships'] as $relKey => $relDef)
                {
                    if ($key == $relKey) // Relationship only entry, we need to capture everything
                        $relationships[$key] = array_merge(['name' => $key], $def, $relDef);
                    else {
                        $relationships[$relKey] = array_merge(['name' => $relKey], $relDef);
                        if(!empty($relationships[$relKey]['join_table']) && empty($relationships[$relKey]['fields'])
                            && isset($dictionary[$relationships[$relKey]['join_table']]['fields'])) {
                            $relationships[$relKey]['fields'] = $dictionary[$relationships[$relKey]['join_table']]['fields'];
                        }
                    }
                    $relationships[$relKey]['relationship_name'] = $relKey;
                }
            }
        }

        return $relationships;
    }

    /**
     * load relationships from table relationships
     * @param null $module
     * @return array
     * @throws \Exception
     */
    public static function loadRelationships($module = null){
        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']){
            $relationships = self::loadRelationshipFromSysDictionaryRelationshipsTable($module);
        } else{
            $relationships = self::loadRelationshipFromRelationshipsTable($module);
        }
        return $relationships;
    }

    /**
     * BWC mode: relationships stored in relationships table
     * @return array
     * @throws \Exception
     */
    public static function loadRelationshipFromRelationshipsTable($module = null){
        global $dictionary;
        $db = DBManagerFactory::getInstance();
        $relationships = [];

        // load metadatafiles for fields details on relationship tables
        SpiceDictionaryHandler::loadMetaDataFiles();

        $addWhere = (!empty($module) ? " AND (lhs_module='{$module}' OR rhs_module='{$module}' )" : '');
        $q = "SELECT rel.* FROM relationships rel WHERE rel.deleted=0 ".$addWhere;
        if($res = $db->query($q)) {
            while ($row = $db->fetchByAssoc($res)) {
                $relationships[$row['relationship_name']] = $row;
                if($row['relationship_type'] == 'many-to-many'){
                    if(isset($dictionary[$relationships[$row['relationship_name']]['join_table']]) && !empty($dictionary[$relationships[$row['relationship_name']]['join_table']]['fields'])){
                        $relationships[$row['relationship_name']]['fields'] = $dictionary[$relationships[$row['relationship_name']]['join_table']]['fields'];
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
        return self::getRelationshipsCacheFromDb($module);
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
        sysdof.*, sysdov.name validationame,
        relfields.map_to_fieldname
        FROM (select * from sysdictionaryrelationshipfields UNION select * from syscustomdictionaryrelationshipfields) relfields
INNER JOIN (select * from sysdictionarydefinitions UNION select * from syscustomdictionarydefinitions) sysd ON sysd.id = relfields.sysdictionarydefinition_id AND sysd.status='a'
INNER JOIN (select * from sysdictionaryitems UNION select * from syscustomdictionaryitems) sysdi ON sysdi.id = relfields.sysdictionaryitem_id
LEFT JOIN (SELECT * from sysdomaindefinitions UNION SELECT * from syscustomdomaindefinitions) sysdo ON sysdi.sysdomaindefinition_id = sysdo.id
LEFT JOIN (SELECT * from sysdomainfields UNION SELECT * from syscustomdomainfields)  sysdof ON sysdof.sysdomaindefinition_id = sysdo.id
LEFT JOIN (SELECT * from sysdomainfieldvalidations UNION SELECT * from syscustomdomainfieldvalidations) sysdov ON sysdov.id = sysdof.sysdomainfieldvalidation_id
 
WHERE relfields.deleted = 0 AND relfields.status = 'a' AND relfields.sysdictionaryrelationship_id = '{$relationshipId}' AND relfields.sysdictionarydefinition_id='{$sysdictionarydefinitionId}'
AND sysdi.deleted = 0 AND sysdi.status = 'a' 
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
        $sysdomaindefinition_id = create_guid();
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
     * save entry to cache table sysdictionaryfields
     *
     * @param array $dict
     * @return void
     */
    public static function saveDictionaryCacheToDb($dict){
        $db = DBManagerFactory::getInstance();

        // first remove from table
        self::deleteDictionaryCacheFromDb($dict);

        // insert 1 record per field
        foreach($dict['fields'] as $field => $fieldDef){
            $insertParams = [
                'id' => SpiceUtils::createGuid(),
                'sysdictionarydefinition_id' => $dict['id'],
                'sysdomainfield_id' => $fieldDef['sysdomainfield_id'],
                'fieldname' => $fieldDef['name'],
                'fieldtype' => $fieldDef['type'],
                'fielddefinition' => json_encode($fieldDef)
            ];
            //file_put_contents('spicecrm.log', 'calling '.__FUNCTION__.print_r($GLOBALS['dictionary']['name'], true)."\n", FILE_APPEND);

            if(!$db->insertQuery('sysdictionaryfields', $insertParams, true)){
                $GLOBALS['log']->fatal('error insert to sysdictionaryfields cached entry with dictionary id '.$dict['id'].' '.$db->lastError());
            }
        }
    }

    /**
     * remove entry in sysdictionaryfields
     *
     * @param array $dict
     * @return bool
     */
    public static function deleteDictionaryCacheFromDb($dict){
        $db = DBManagerFactory::getInstance();
        // remove from table
        $delWhere = ['sysdictionarydefinition_id' => $dict['id']];
        if(!$db->deleteQuery('sysdictionaryfields', $delWhere)){
            $GLOBALS['log']->fatal('error dictionary cached entry with dictionary id '.$dict['id'].' '.$db->lastError());
            return false;
        }
        return true;
    }

    /**
     * get dictionary from cache table
     *
     * @param array $dictionaryId
     * @return array
     */
    public static function getDictionaryCacheFromDb($dictionaryId){
        if(empty($dictionaryId)){
            return [];
        }

        $db = DBManagerFactory::getInstance();
        $dict = [];
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
        return $dict;
    }

    /**
     * read validations and create app_list_strings doms
     *
     * @return array
     */
    public static function loadDictionaryValidations(){
        $db = DBManagerFactory::getInstance();

        if($_SESSION['systemvardefs']['domains']){
            return $_SESSION['systemvardefs']['domains'];
        }

        $retArray = [];
        // core values
        $coreEnums = $db->query("SELECT id, name FROM sysdomainfieldvalidations WHERE validation_type = 'enum' AND deleted = 0");
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

        // custom values
        $coreEnums = $db->query("SELECT id, name FROM syscustomdomainfieldvalidations WHERE validation_type = 'enum' AND deleted = 0");
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
        $_SESSION['systemvardefs']['domains'] = $retArray;

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
        }
        $sys_app_list_strings = [];
        $validations = self::loadDictionaryValidations();
        $syslanguagelabels[$language] = LanguageManager::loadDatabaseLanguage($language);
        foreach($validations as $dom => $definition){

            // re-organize and add translation
            foreach($definition['values'] as $minvalue => $def){
                $translation = (!empty($syslanguagelabels[$language][$def['label']]['default']) ? $syslanguagelabels[$language][$def['label']]['default'] : $minvalue);
                $sys_app_list_strings[$dom][$language]['values'][$minvalue]['minvalue'] = $minvalue;
                $sys_app_list_strings[$dom][$language]['values'][$minvalue]['translation'] = $translation;
                $sys_app_list_strings[$dom][$language]['values'][$minvalue]['sequence'] = $def['sequence'];
            }

            // sort by the sequence
            $arrmap = array_map(function($element) {
                return $element['sequence'];
            }, $sys_app_list_strings[$dom][$language]['values']);
            array_multisort($arrmap, ($definition['sort_flag'] == 'desc' ? SORT_DESC : SORT_ASC), $sys_app_list_strings[$dom][$language]['values']);
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
            $GLOBALS['log']->fatal('error relationship cached entry with name id {$relName} '.$db->lastError());
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
        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) {
            $tableName = 'sysdictionaryrelationships';
        }
        $db = DBManagerFactory::getInstance();
        if(!$db->truncateQuery($tableName)){
            $GLOBALS['log']->fatal('error truncating '.$tableName.' table '.$db->lastError());
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

        if(!$db->insertQuery('relationships', $insertParams, true)){
            $GLOBALS['log']->fatal('error insert to relationships cached entry with name '.$relationship['relationship_name'].' '.$db->lastError());
        }
    }

    /**
     * Save the relationship definitions to the cache table
     * table used is former relationships table
     *
     * @param array $relationships
     */
    public static function saveRelationshipsCacheToDb($relationships){
        // insert 1 record per relationship
        foreach($relationships as $relKey => $relationship){
            self::saveRelationshipCacheToDb($relationship, false);
        }
    }

}
