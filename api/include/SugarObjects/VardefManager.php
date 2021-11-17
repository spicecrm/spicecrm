<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
********************************************************************************/

namespace SpiceCRM\includes\SugarObjects;

use FilesystemIterator;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;
use SpiceCRM\includes\SugarCache\SugarCache;

/**
 * Vardefs management
 * @api
 */
class VardefManager{
    static $custom_disabled_modules = [];
    static $linkFields;

    /**
     * this method is called within a vardefs.php file which extends from a SugarObject.
     * It is meant to load the vardefs from the SugarObject.
     */
    static function createVardef($module, $object, $templates = ['default'], $object_name = false)
    {
        global $dictionary;

        // BEGIN CR1000108: check system usage and overwrite vardefs
        if(isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) {
            //if(!is_array($GLOBALS['relationships'])) $GLOBALS['relationships'] = SpiceDictionaryVardefs::loadRelationships();
            $GLOBALS['dictionary'][$object] = SpiceDictionaryVardefs::loadDictionaryModule($module);
        }
        // END
        else{
            //reverse the sort order so priority goes highest to lowest;
            $templates = array_reverse($templates);
            foreach ($templates as $template)
            {
                self::addTemplate($module, $object, $template, $object_name);
            }

            // @deprecated - no language files crated any longer
            // LanguageManager::createLanguageFile($module, $templates);

            if (isset(self::$custom_disabled_modules[$module]))
            {
                $vardef_paths = [
                    'custom/modules/' . $module . '/Ext/Vardefs/vardefs.ext.php',
                    'custom/Extension/modules/' . $module . '/Ext/Vardefs/vardefs.php'
                ];

                //search a predefined set of locations for the vardef files
                foreach ($vardef_paths as $path)
                {
                    if (file_exists($path)) {
                        require($path);
                    }
                }
            }
        }
    }

    /**
     * Enables/Disables the loading of custom vardefs for a module.
     * @param String $module Module to be enabled/disabled
     * @param Boolean $enable true to enable, false to disable
     * @return  null
     */
    public static function setCustomAllowedForModule($module, $enable) {
        if ($enable && isset($custom_disabled_modules[$module])) {
              unset($custom_disabled_modules[$module]);
        } else if (!$enable) {
              $custom_disabled_modules[$module] = true;
        }
    }

    static function addTemplate($module, $object, $template, $object_name=false){
        global $vardefs;
        if($template == 'default')$template = 'basic';
        $templates = [];
        $fields = [];
        if(empty($object_name))$object_name = $object;
        $_object_name = strtolower($object_name);
        if(!empty($GLOBALS['dictionary'][$object]['table'])){
            $table_name = $GLOBALS['dictionary'][$object]['table'];
        }else{
            $table_name = strtolower($module);
        }

        if(empty($templates[$template])){
            $path = get_custom_file_if_exists('include/SugarObjects/templates/' . $template . '/vardefs.php');
            if(file_exists($path)){
                require($path);
                $templates[$template] = $vardefs;
            }else{
                $path = get_custom_file_if_exists('include/SugarObjects/implements/' . $template . '/vardefs.php');
                if(file_exists($path)){
                    require($path);
                    $templates[$template] = $vardefs;
                }
            }
        }
       
        if(!empty($templates[$template])){
            if(empty($GLOBALS['dictionary'][$object]['fields']))$GLOBALS['dictionary'][$object]['fields'] = [];
            if(empty($GLOBALS['dictionary'][$object]['relationships']))$GLOBALS['dictionary'][$object]['relationships'] = [];
            if(empty($GLOBALS['dictionary'][$object]['indices']))$GLOBALS['dictionary'][$object]['indices'] = [];
            $GLOBALS['dictionary'][$object]['fields'] = array_merge($templates[$template]['fields'], $GLOBALS['dictionary'][$object]['fields']);
            if(!empty($templates[$template]['relationships']))$GLOBALS['dictionary'][$object]['relationships'] = array_merge($templates[$template]['relationships'], $GLOBALS['dictionary'][$object]['relationships']);
            if(!empty($templates[$template]['indices']))$GLOBALS['dictionary'][$object]['indices'] = array_merge($templates[$template]['indices'], $GLOBALS['dictionary'][$object]['indices']);
            // maintain a record of this objects inheritance from the SugarObject templates...
            $GLOBALS['dictionary'][$object]['templates'][ $template ] = $template ;
        }
    }


    /**
     * Remove invalid field definitions
     * @static
     * @param Array $fieldDefs
     * @return  Array
     */
    static function cleanVardefs($fieldDefs)
    {
        foreach($fieldDefs as $field => $defs)
        {
            if (empty($def['name']) || empty($def['type']))
            {
                unset($fieldDefs[$field]);
            }
        }

        return $fieldDefs;
    }

    /**
     * Save the dictionary object to the cache
     * @param string $module the name of the module
     * @param string $object the name of the object
     */
    static function saveCache($module,$object, $additonal_objects= []){

        if (empty($GLOBALS['dictionary'][$object]))
            $object = BeanFactory::getObjectName($module);
        $file = create_cache_directory('modules/' . $module . '/' . $object . 'vardefs.php');

        $out="<?php \n \$GLOBALS[\"dictionary\"][\"". $object . "\"]=" . var_export($GLOBALS['dictionary'][$object], true) .";";
        sugar_file_put_contents_atomic($file, $out);
        if ( sugar_is_file($file) && is_readable($file)) {
            include($file);
        }

        // put the item in the sugar cache.
        $key = "VardefManager.$module.$object";
        //Sometimes bad definitions can get in from left over extensions or file system lag(caching). We need to clean those.
        $data = self::cleanVardefs($GLOBALS['dictionary'][$object]);
        SugarCache::sugar_cache_put($key,$data);
    }

    /**
     * clear out the vardef cache. If we receive a module name then just clear the vardef cache for that module
     * otherwise clear out the cache for every module
     * @param string module_dir the module_dir to clear, if not specified then clear
     *                      clear vardef cache for all modules.
     * @param string object_name the name of the object we are clearing this is for sugar_cache
     */
    static function clearVardef($module_dir = '', $object_name = ''){
        //if we have a module name specified then just remove that vardef file
        //otherwise go through each module and remove the vardefs.php
        if (!empty($module_dir) && !empty($object_name)) {
            self::_clearCache($module_dir, $object_name);
        } else {
            foreach (SpiceModules::getInstance()->getBeanList() as $module_dir => $object_name) {
                self::_clearCache($module_dir, $object_name);
            }
        }
    }

    /**
     * PRIVATE function used within clearVardefCache so we do not repeat logic
     * @param string module_dir the module_dir to clear
     * @param string object_name the name of the object we are clearing this is for sugar_cache
     */
    static function _clearCache($module_dir = '', $object_name = ''){
        if(!empty($module_dir) && !empty($object_name)){

            //Some modules like cases have a bean name that doesn't match the object name
            if (empty($GLOBALS['dictionary'][$object_name])) {
                $newName = BeanFactory::getObjectName($module_dir);
                $object_name = $newName != false ? $newName : $object_name;
            }

            $file = sugar_cached('modules/').$module_dir.'/' . $object_name . 'vardefs.php';

            if(file_exists($file)){
                unlink($file);
                $key = "VardefManager.$module_dir.$object_name";
                SugarCache::sugar_cache_clear($key);
            }
        }
    }

    /**
     * Given a module, search all of the specified locations, and any others as specified
     * in order to refresh the cache file
     *
     * @param string $module the given module we want to load the vardefs for
     * @param string $object the given object we wish to load the vardefs for
     * @param array $additional_search_paths an array which allows a consumer to pass in additional vardef locations to search
     */
    static function refreshVardefs($module, $object, $additional_search_paths = null, $cacheCustom = false, $params = []){
        // Some of the vardefs do not correctly define dictionary as global.  Declare it first.
        global $dictionary;
        $vardef_paths = [
                    'modules/'.$module.'/vardefs.php',
                    'extensions/modules/'.$module.'/vardefs.php',
                    'custom/modules/'.$module.'/Ext/Vardefs/vardefs.ext.php',
                    'custom/modules/'.$module.'/vardefs.php',
                    'custom/Extension/modules/'.$module.'/Ext/Vardefs/vardefs.php'
        ];

        //custom module: add all files located in custom/Extension/modules/$module/Ext/Vardefs to support Extension Vardefs
        if(is_dir('custom/Extension/modules/'.$module.'/Ext/Vardefs')) {
            $fileSystemIterator = new FilesystemIterator('custom/Extension/modules/' . $module . '/Ext/Vardefs');
            foreach ($fileSystemIterator as $fileInfo){
                $additional_search_paths[] = 'custom/Extension/modules/' . $module . '/Ext/Vardefs/'.$fileInfo->getFilename();
            }
        }

        // Add in additional search paths if they were provided.
        if(!empty($additional_search_paths) && is_array($additional_search_paths))
        {
            $vardef_paths = array_merge($vardef_paths, $additional_search_paths);
        }
        $found = false;
        //search a predefined set of locations for the vardef files
        foreach($vardef_paths as $path){
            if(file_exists($path)){
                require($path);
                $found = true;
            }
        }
        //Some modules have multiple beans, we need to see if this object has a module_dir that is different from its module_name
        /*
        if(!$found){
            $temp = \SpiceCRM\data\BeanFactory::newBean($module);
            if ($temp)
            {
                $object_name = \SpiceCRM\data\BeanFactory::getObjectName($temp->module_dir);
                if ($temp && $temp->module_dir != $temp->module_name && !empty($object_name))
                {
                    self::refreshVardefs($temp->module_dir, $object_name, $additional_search_paths, $cacheCustom);
                }
            }
        }
        */

        //Some modules like cases have a bean name that doesn't match the object name
        if (empty($dictionary[$object])) {
            $newName = BeanFactory::getObjectName($module);
            $object = $newName != false ? $newName : $object;
        }

        //load custom fields into the vardef cache
        /*
        if($cacheCustom){
            require_once("modules/DynamicFields/DynamicField.php");
            $df = new DynamicField ($module) ;
            $df->buildCache($module, false);
        }
        */

        //great! now that we have loaded all of our vardefs.
        //let's go save them to the cache file.
        if(!empty($dictionary[$object])) {
            self::saveCache($module, $object);
        }
    }

    /**
     * @static
     * @param  $module
     * @param  $object
     * @return array|bool  returns a list of all fields in the module of type 'link'.
     */
    protected static function getLinkFieldsForModule($module, $object)
    {
        global $dictionary;
        //Some modules like cases have a bean name that doesn't match the object name
        if (empty($dictionary[$object])) {
            $newName = BeanFactory::getObjectName($module);
            $object = $newName != false ? $newName : $object;
        }
        if (empty($dictionary[$object])) {
            self::loadVardef($module, $object, false, ['ignore_rel_calc_fields' => true]);
        }
        if (empty($dictionary[$object]))
        {
            LoggerManager::getLogger()->debug("Failed to load vardefs for $module:$object in linkFieldsForModule<br/>");
            return false;
        }

        //Cache link fields for this call in a static variable
        if (!isset(self::$linkFields))
            self::$linkFields = [];

        if (isset(self::$linkFields[$object]))
            return self::$linkFields[$object];

        $vardef = $dictionary[$object];
        $links = [];
        foreach($vardef['fields'] as $name => $def)
        {
            //Look through all link fields for related modules that have calculated fields that use that relationship
            if(!empty($def['type']) && $def['type'] == 'link' && !empty($def['relationship']))
            {
                $links[$name] = $def;
            }
        }

        self::$linkFields[$object] = $links;

        return $links;
    }


    public static function getLinkFieldForRelationship($module, $object, $relName)
    {
        // load relationship from database cache table when turned on
        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) {
            $cachedRel = SpiceDictionaryVardefs::loadRelationshipsForModuleFromCache($module);
            if(!empty($cachedRel)) {
                LoggerManager::getLogger()->debug('Loading {$object} from DB cache table');
                return $cachedRel;
            }
            return false;
        }


        $cacheKey = "LFR{$module}{$object}{$relName}";
        $cacheValue = SugarCache::sugar_cache_retrieve($cacheKey);
        if(!empty($cacheValue))
            return $cacheValue;

        $relLinkFields = self::getLinkFieldsForModule($module, $object);
        $matches = [];
        if (!empty($relLinkFields))
        {
            foreach($relLinkFields as $rfName => $rfDef)
            {
                if ($rfDef['relationship'] == $relName)
                {
                    $matches[] = $rfDef;
                }
            }
        }
        if (empty($matches))
            return false;
        if (sizeof($matches) == 1)
            $results = $matches[0];
        else
            //For relationships where both sides are the same module, more than one link will be returned
            $results = $matches;

        SugarCache::sugar_cache_put($cacheKey, $results);
        return $results ;
    }



    /**
     * applyGlobalAccountRequirements
     *
     * This method ensures that the account_name relationships are set to always be required if the configuration file specifies
     * so.  For more information on this require_accounts parameter, please see the administrators guide or go to the
     * developers.sugarcrm.com website to find articles relating to the use of this field.
     *
     * @param Array $vardef The vardefs of the module to apply the account_name field requirement to
     * @return Array $vardef The vardefs of the module with the updated required setting based on the system configuration
     */
    static function applyGlobalAccountRequirements($vardef)
    {
        if (isset(SpiceConfig::getInstance()->config['require_accounts']))
        {
            if (isset($vardef['fields'])
                && isset($vardef['fields']['account_name'])
                && isset($vardef['fields']['account_name']['type'])
                && $vardef['fields']['account_name']['type'] == 'relate'
                && isset($vardef['fields']['account_name']['required']))
            {
                $vardef['fields']['account_name']['required'] = SpiceConfig::getInstance()->config['require_accounts'];
            }

        }
        return $vardef;
    }


    /**
     * load the vardefs for a given module and object
     * @param string $module the given module we want to load the vardefs for
     * @param string $object the given object we wish to load the vardefs for
     * @param bool   $refresh whether or not we wish to refresh the cache file.
     */
    static function loadVardef($module, $object, $refresh=false, $params = []){
        if(empty($module) || empty($object)) return;

        // load dictionary from database cache table when turned on
        if (isset(SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) && SpiceConfig::getInstance()->config['systemvardefs']['dictionary']) {
            // LoggerManager::getLogger()->debug("Try Loading $object $module from DB cache table");
            $cachedDict = SpiceDictionaryVardefs::loadDictionaryModuleCacheFromDb($module);
            if(!empty($cachedDict)) {
                $GLOBALS['dictionary'][$object] = $cachedDict;
                // LoggerManager::getLogger()->debug("Loaded $object from DB cache table ");
            }
            return;
        }

        // --- LEGACY LOGIC: Retrieve the vardefs from cache or reload on refresh=true --- //
        //here check if the cache file exists, if it does then load it, if it doesn't
        //then call refreshVardef
        //if either our session or the system is set to developerMode then refresh is set to true
        if(inDeveloperMode() || !empty($_SESSION['developerMode'])){
            $refresh = true;
        }

        // legacy logic: Retrieve the vardefs from cache or reload on refresh=true
        if(!$refresh)
        {
            $key = "VardefManager.$module.$object";
            $return_result = SugarCache::sugar_cache_retrieve($key);
            $return_result = self::applyGlobalAccountRequirements($return_result);

            if(!empty($return_result))
            {
                $GLOBALS['dictionary'][$object] = $return_result;
                return;
            }
        }

        // Some of the vardefs do not correctly define dictionary as global.  Declare it first.
        global $dictionary;
        if(empty($GLOBALS['dictionary'][$object]) || $refresh){

            //if the consumer has demanded a refresh or the cache/modules... file
            //does not exist, then we should do out and try to reload things

            $cachedfile = sugar_cached('modules/'). $module . '/' . $object . 'vardefs.php';
            if($refresh || !file_exists($cachedfile)){
                self::refreshVardefs($module, $object, null, false, $params);
            }

            //at this point we should have the cache/modules/... file
            //which was created from the refreshVardefs so let's try to load it.
            if(file_exists($cachedfile))
            {
                if (is_readable($cachedfile))
                {
                    include($cachedfile);
                }
                // now that we hae loaded the data from disk, put it in the cache.
                if(!empty($GLOBALS['dictionary'][$object]))
                {
                    $GLOBALS['dictionary'][$object] = self::applyGlobalAccountRequirements($GLOBALS['dictionary'][$object]);
                    SugarCache::sugar_cache_put($key,$GLOBALS['dictionary'][$object]);
                }
            }
        }
    }

}
