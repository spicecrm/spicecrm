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


namespace SpiceCRM\data;

use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\modules\Administration\Administration;
use SpiceCRM\modules\Currencies\Currency;
use SpiceCRM\modules\EmailAddresses\EmailAddress;
use SpiceCRM\modules\SchedulerJobs\SchedulerJob;
use SpiceCRM\modules\SpiceACLObjects\SpiceACLObject;
use SpiceCRM\modules\SystemTenants\SystemTenant;
use SpiceCRM\modules\Trackers\Tracker;
use SpiceCRM\modules\UserAbsences\UserAbsence;
use SpiceCRM\modules\UserAccessLogs\UserAccessLog;
use SpiceCRM\modules\Users\User;

/**
 * Factory to create SugarBeans
 * @api
 */
class BeanFactory
{
    protected static $loadedBeans = [];
    protected static $maxLoaded = 10;
    protected static $total = 0;
    protected static $loadOrder = [];
    protected static $touched = [];
    public static $hits = 0;

    /**
     * define systemmodules that can be loaded before all other modules are loaded from teh database
     *
     * @var string[][]
     */
    protected static $systemModules = [
        'Administration' => ['beanname' => 'Administration'],
        'EmailAddresses' => ['beanname' => 'EmailAddress'],
        'SchedulersJobs' => ['beanname' => 'SchedulerJob'],
        'SpiceACLObjects' => ['beanname' => 'SpiceACLObject'],
        'SpiceACLTerritories' => ['beanname' => 'SpiceACLTerritory'],
        'Trackers' => ['beanname' => 'Tracker'],
        'Users' => ['beanname' => 'User'],
        'UserAbsences' => ['beanname' => 'UserAbsence'],
        'UserAccessLogs' => ['beanname' => 'UserAccessLog'],
        'SystemTenants' => ['beanname' => 'SystemTenant'],
        'Currencies' => ['beanname' => 'Currency'],
    ];

    /**
     * Initializes the class names of the system modules.
     */
    private static function initSystemModules(): void
    {
        foreach (self::$systemModules as $moduleName => $beanInfo) {
            $customClass = "\\SpiceCRM\\custom\\modules\\{$moduleName}\\{$beanInfo['beanname']}";
            $extensionClass = "\\SpiceCRM\\extensions\\modules\\{$moduleName}\\{$beanInfo['beanname']}";
            $moduleClass = "\\SpiceCRM\\modules\\{$moduleName}\\{$beanInfo['beanname']}";
            if (class_exists($customClass)) {
                self::$systemModules[$moduleName]['beanclass'] = $customClass;
            } elseif (class_exists($extensionClass)) {
                self::$systemModules[$moduleName]['beanclass'] = $extensionClass;
            } elseif (class_exists($moduleClass)) {
                self::$systemModules[$moduleName]['beanclass'] = $moduleClass;
            } else {
                unset(self::$systemModules[$moduleClass]);
            }
        }
    }

    /**
     * Returns a SugarBean object by id. The Last 10 loaded beans are cached in memory to prevent multiple retrieves per request.
     * If no id is passed, a new bean is created.
     * @static
     * @param string $module
     * @param string $id
     * @param array $params A name/value array of parameters. Names: encode, deleted,
     *        If $params is boolean we revert to the old arguments (encode, deleted), and use $params as $encode.
     *        This will be changed to using only $params in later versions.
     * @param boolean $deleted @see SugarBean::retrieve
     * @return SugarBean
     */
    public static function getBean($module, $id = null, $params = [], $deleted = true)
    {
        // log when this function is called without
        if (is_array($params) && !key_exists('encode', $params) && !empty($id)) {
            LoggerManager::getLogger()->info(__CLASS__ . "::" . __FUNCTION__ . "() was called for retrieve with id $id without encode value. Back trace:");
            LoggerManager::getLogger()->info(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS));

        }

        // Check if params is an array, if not use old arguments
        if (isset($params) && !is_array($params)) {
            $params = ['encode' => $params];
        }

        // Pull values from $params array
        $encode = isset($params['encode']) ? $params['encode'] : false;
        $deleted = isset($params['deleted']) ? $params['deleted'] : $deleted;
        $relationships = isset($params['relationships']) ? $params['relationships'] : true;
        $forceRetrieve = isset($params['forceRetrieve']) ? $params['forceRetrieve'] : false;

        if (!isset(self::$loadedBeans[$module])) {
            self::$loadedBeans[$module] = [];
            self::$touched[$module] = [];
        }

        $beanClass = self::getBeanClass($module);
        $beanName = self::getBeanName($module);

        // if not found use the ones defined here as systemmodules
        self::initSystemModules();
        if (empty($beanName) && isset(self::$systemModules[$module])) {
            $beanClass = self::$systemModules[$module]['beanclass'];
            $beanName = self::$systemModules[$module]['beanname'];
        };

        // check that we have a bean name .. otherwise the module is unknown
        if (empty($beanName)) {
            LoggerManager::getLogger()->error("Unable to instantiate bean of unknown module \"{$module}\".");
            return false;
        }

        if ($beanClass && class_exists($beanClass)) {
            $bean = new $beanClass();
        } else {
            $bean = new SugarBean();
            $bean->module_dir = $module;
            $bean->object_name = $beanName;
            $bean->table_name = $GLOBALS['dictionary'][$beanName]['table'] ?: strtolower($module);
            $bean->initialize_bean();
        }

        if (!empty($id)) {
            if ($forceRetrieve || empty(self::$loadedBeans[$module][$id])) {

                $result = $bean->retrieve($id, $encode, $deleted, $relationships);
                if ($result == null)
                    return FALSE;
                else
                    self::registerBean($module, $bean, $id);
            } else {
                self::$hits++;
                self::$touched[$module][$id]++;
                $bean = self::$loadedBeans[$module][$id];
            }
        }

        // add the bean module
        $bean->_module = $module;

        return $bean;
    }

    public static function moduleExists($moduleName)
    {
        return (($beanClass = self::getBeanName($moduleName)) !== false); //and class_exists( $beanClass );
    }

    public static function newBean($module)
    {
        return self::getBean($module);
    }

    public static function getBeanName(?string $module): string {
        return SpiceModules::getInstance()->getBeanName($module) ?? false;
    }

    public static function getBeanClass(?string $module): string {
        return SpiceModules::getInstance()->getBeanClassForModule($module) ?? false;
    }

    /**
     * Returns the object name / dictionary key for a given module. This should normally
     * be the same as the bean name, but may not for special case modules (ex. Case vs aCase)
     * @static
     * @param string $module
     * @return bool
     */
    public static function getObjectName($module)
    {
        global $objectList;
        if (empty($objectList[$module]))
            return self::getBeanName($module);

        return $objectList[$module];
    }


    /**
     * @static
     * This function registers a bean with the bean factory so that it can be access from accross the code without doing
     * multiple retrieves. Beans should be registered as soon as they have an id.
     * @param string $module
     * @param SugarBean $bean
     * @param bool|string $id
     * @return bool true if the bean registered successfully.
     */
    public static function registerBean($module, $bean, $id = false)
    {
        $config = SpiceConfig::getInstance()->config;
        $cacheEnabled = ($config['system']['module_cache_enabled'] ?? false) == 1;

        if (!$cacheEnabled || empty(SpiceModules::getInstance()->getBeanName($module))) {
            return false;
        }

        if (!isset(self::$loadedBeans[$module]))
            self::$loadedBeans[$module] = [];

        //Do not double register a bean
        if (!empty($id) && isset(self::$loadedBeans[$module][$id]))
            return true;

        $index = "i" . (self::$total % self::$maxLoaded);
        //We should only hold a limited number of beans in memory at a time.
        //Once we have the max, unload the oldest bean.
        if (count(self::$loadOrder) >= self::$maxLoaded - 1) {
            for ($i = 0; $i < self::$maxLoaded; $i++) {
                if (isset(self::$loadOrder[$index])) {
                    $info = self::$loadOrder[$index];
                    //If a bean isn't in the database yet, we need to hold onto it.
                    if (!empty(self::$loadedBeans[$info['module']][$info['id']]->in_save)) {
                        self::$total++;
                    } //Beans that have been used recently should be held in memory if possible
                    else if (!empty(self::$touched[$info['module']][$info['id']]) && self::$touched[$info['module']][$info['id']] > 0) {
                        self::$touched[$info['module']][$info['id']]--;
                        self::$total++;
                    } else
                        break;
                } else {
                    break;
                }
                $index = "i" . (self::$total % self::$maxLoaded);
            }
            if (isset(self::$loadOrder[$index])) {
                unset(self::$loadedBeans[$info['module']][$info['id']]);
                unset(self::$touched[$info['module']][$info['id']]);
                unset(self::$loadOrder[$index]);
            }
        }

        if (!empty($bean->id))
            $id = $bean->id;

        if ($id) {
            self::$loadedBeans[$module][$id] = $bean;
            self::$total++;
            self::$loadOrder[$index] = ["module" => $module, "id" => $id];
            self::$touched[$module][$id] = 0;
        } else {
            return false;
        }
        return true;
    }
}
