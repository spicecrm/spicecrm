<?php

namespace SpiceCRM\modules\SpiceACL;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\modules\SpiceACL\SpiceACLUsers;
use SpiceCRM\includes\authentication\AuthenticationController;

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
class SpiceACL
{


    var $useraclobjects = [];

    /**
     * caches the modules actions so they are not loaded repeatedly
     *
     * @var array
     */
    var $moduleActions = [];

    var $aclObject = null;
    var $territory = null;

    private static $instance;

    private function __construct() {}
    private function __clone() {}
    private function __wakeup() {}
    /**
     * @return SpiceACL
     */
    static function getInstance()
    {
        if (self::$instance === null) {

            //set instance
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function createVardefs($module)
    {
        if (!$this->territory) {
            $this->territory = BeanFactory::getBean('SpiceACLTerritories');
        }

        if ($this->territory) {
            $this->territory->createVardefs($module);
        }
    }

    public function addFTSData($bean)
    {
        $addData = SpiceACLUsers::addFTSData($bean);

        if(file_exists('extensions/modules/SpiceACLTerritories')) {
            $territory = BeanFactory::getBean('SpiceACLTerritories');
            if ($territory) {
                $territoryData = $territory->addFTSData($bean);
                $addData = array_merge($addData, $territoryData);
            }
        }

        return $addData;
    }

    public function getFTSQuery($module)
    {

        $FTSFilters = [];
        $shoudlAll = false;

        $aclObject = BeanFactory::getBean('SpiceACLObjects');
        $userObjects = $aclObject->getUserACLObjects($module);
        foreach ($userObjects as $userObjectId => $userObjectData) {
            $aclObject = BeanFactory::getBean('SpiceACLObjects', $userObjectId);

            $objectQuery = $aclObject->getFTSObjectQuery();
            if (count($objectQuery) > 0) {
                switch ($aclObject->spiceaclobjecttype) {
                    case '0':
                        $FTSFilters['should'][] = $objectQuery;
                        break;
                    case '1':
                        $FTSFilters['must'][] = $objectQuery;
                        break;
                    case '2':
                        $FTSFilters['must_not'][] = $objectQuery;
                        break;
                }
            } else {
                if ($aclObject->spiceaclobjecttype == '0') {
                    // found at least one object that has no restrictions .. so view all is granted
                    $shoudlAll = true;
                }
            }
        }

        // if we have a should all .. remove all shoudl criteria
        if ($shoudlAll) $FTSFilters['should'] = [];

        return $FTSFilters;

    }

    /*
     * adds the object specific Where Clause to the where array
     * called in data/SugarBean.php in function create_new_list_query
     */
    public function addACLAccessToListArray(&$selectArray, $bean, $tableName = '', $retArray = false)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        // admin sees everything
        if ($current_user->is_admin)
            return '';

        if (!$this->aclObject)
            $this->aclObject = BeanFactory::getBean('SpiceACLObjects');

        $userObjects = $this->aclObject->getUserACLObjects($bean->_module ?: $bean->module_dir);
        foreach ($userObjects as $userObjectId => $userObjectData) {
            $aclObject = BeanFactory::getBean('SpiceACLObjects', $userObjectId);
            $filters = $aclObject->getListObjectQuery($tableName ?: $bean->table_name, $bean);
            if ($filters != '') {
                switch ($aclObject->spiceaclobjecttype) {
                    case '0':
                        $shouldFilters[] = $filters;
                        break;
                    case '1':
                        $mustFilters[] = $filters;
                        break;
                    case '2':
                        $mustnotFilters[] = $filters;
                        break;
                };
            }
        }

        // build Filter
        if ($shouldFilters) $listFilters[] = ' ((' . implode(') OR (', $shouldFilters) . ')) ';
        if ($mustFilters) $listFilters[] = ' ((' . implode(') AND (', $mustFilters) . ')) ';
        if ($mustnotFilters) $listFilters[] = ' NOT ((' . implode(') AND (', $mustnotFilters) . ')) ';

        // concatenate the where string
        if (!empty($listFilters)) {
            if ($selectArray['where'] != '')
                $selectArray['where'] .= ' AND ';

            $selectArray['where'] .= ' (( ' . implode(' ) AND ( ', $listFilters) . ' )) ';
        }
    }

    /*
     * updated and checked
     */

    public function filterModuleList(&$moduleList, $by_value = true)
    {

        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if (!$current_user->is_admin && $current_user->id) {

            $spiceACLObject = BeanFactory::getBean('SpiceACLObjects');
            $this->useraclobjects = $spiceACLObject->getUserACLObjects();

            $authModules = [];
            foreach ($this->useraclobjects as $useraclobjectId => $useraclobjectData) {
                $authModules[$useraclobjectData['module']] = true;
            }

            foreach ($moduleList as $moduleindex => $modulename) {
                if (!$authModules[$modulename]) {
                    SpiceModules::getInstance()->unsetModule($moduleindex);
                }
            }
        }

    }

    /**
     * Check to see if the module is available for this user.
     *
     * @param String $module_name
     * @param $actions Array only place holder for ACLController compatibility
     * @return true if they are allowed.  false otherwise.
     */
    public function checkModuleAllowed($module, $actions = [])
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if (!$current_user->is_admin && $current_user->id) {

            $spiceACLObject = BeanFactory::getBean('SpiceACLObjects');
            $this->useraclobjects = $spiceACLObject->getUserACLObjects();

            $authModules = [];
            foreach ($this->useraclobjects as $useraclobjectId => $useraclobjectData) {
                $authModules[$useraclobjectData['module']] = true;
            }

            if (!$authModules[$module])
                return false;
        }
        return true;
    }

    public function disabledModuleList($moduleList, $by_value = true, $view = 'list')
    {
        return [];
    }

    /**
     * @param $bean SugarBean or String module name
     * @param $action
     * @param bool $is_owner
     * @param string $type
     * @return mixed
     */
    public function checkAccess($bean, $action, $is_owner = false, $type = 'module')
    {
        return $this->checkACLAccess($bean, $action);
    }


    public function requireOwner($category, $value, $type = 'module')
    {
        return false;

    }

    public function getOwnerWhereClause($bean, $table_name = '')
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        return SpiceACLUsers::generateCurrentUserWhereClause($table_name, $bean);
    }

    public function orgManaged($module)
    {
        // return true;
        return $this->moduleSupportsACL($module);
    }

    public function moduleSupportsACL($module)
    {
        if (empty($module)) {
            return false;
        }
        if (!isset($_SESSION['spiceaclaccess']['aclmoduleactions'][$module])) {
            //check acl support on sysmodules table
            if (DBManagerFactory::getInstance()) {
                $dbresult = DBManagerFactory::getInstance()->query("SELECT acl FROM sysmodules WHERE module='" . $module . "' UNION SELECT acl FROM syscustommodules WHERE module='" . $module . "'");
                while ($row = DBManagerFactory::getInstance()->fetchByAssoc($dbresult)) {
                    $_SESSION['spiceaclaccess']['aclmoduleactions'][$module] = (boolean)$row['acl'];
                }
            }
            //check acl support on bean
            if (!isset($_SESSION['spiceaclaccess']['aclmoduleactions'][$module])) {
                $seed = BeanFactory::getBean($module);
                if (!$seed) {
                    $_SESSION['spiceaclaccess']['aclmoduleactions'][$module] = false;
                } else {
                    $_SESSION['spiceaclaccess']['aclmoduleactions'][$module] = $seed->bean_implements('ACL');
                }
            }
        }

        return $_SESSION['spiceaclaccess']['aclmoduleactions'][$module];
    }


    /*
     *
     * our own functions
     */
    private function getActivityValueByAction($action)
    {
        switch ($action) {
            case 'index':
            case 'listview':
            case 'popup':
            case 'loadtabsubpanels':
                return 'list';
            case 'detail':
            case 'display':
            case 'detailview':
                return 'view';
            case 'save':
            case 'popupeditview':
            case 'editview':
                return 'edit';
            default:
                return $action;
            /*
        default:
            if (\SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['acl']['disable_cache'] || !isset($_SESSION['spiceaclaccess']['aclmoduleactions'][$module][$action])) {
                $actionRecord = $db->fetchByAssoc($db->query("SELECT spiceacltypeactions.id FROM spiceacltypeactions, spiceacltypes WHERE spiceacltypes.id = spiceacltypeactions.sysmodule_id AND sysmodule_id.action='$action'"));
                $_SESSION['spiceaclaccess']['aclmoduleactions'][$module][$action] = $actionRecord && $actionRecord['id'] ? $actionRecord['id'] : false;
            }
            return $_SESSION['spiceaclaccess']['aclmoduleactions'][$module][$action];
            */
        }
    }

    /**
     * returns an array with all access right per module
     *
     * @param $module
     *
     * @return array
     */
    function getModuleAccess($module)
    {
        $db = DBManagerFactory::getInstance();

        $aclArray = [];

        $aclActionsObject = $db->query("SELECT action FROM spiceaclstandardactions UNION SELECT action FROM spiceaclmoduleactions, sysmodules WHERE spiceaclmoduleactions.sysmodule_id = sysmodules.id AND sysmodules.module = '$module' UNION SELECT action FROM spiceaclmoduleactions, syscustommodules WHERE spiceaclmoduleactions.sysmodule_id = syscustommodules.id AND syscustommodules.module = '$module'");

        while ($aclAction = $db->fetchByAssoc($aclActionsObject)) {
            // $aclArray[$aclAction] = $seed->ACLAccess($aclAction);
            $aclArray[$aclAction['action']] = $this->checkAccess($module, $aclAction['action'], true);
        }
        return $aclArray;
    }

    /*
     * function to check the ACL Access
     * called in data/SugarBean.php in function ACLAccess
     */
    public function checkACLAccess($bean, $view)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if (!$this->aclObject)
            $this->aclObject = BeanFactory::getBean('SpiceACLObjects');

        // admins have access
        if (AuthenticationController::getInstance()->getCurrentUser()->is_admin)
            return true;

        // 2013-05-08 save is allowed
        // 2013-10-14 empty view can happen in Subpanel Reload case
        if ($view == '' || $view == 'save')
            return true;

        // flag that we do not have a custom activity
        // required for later processing
        $isCustomActivity = false;

        // get the activitiy
        $thisActivity = $this->getActivityValueByAction($view);
        // if activitiy is not found return false
        if ($thisActivity === false) {
            return false;
        }

        //by default no access;
        $allowAccess = false;

        if (is_object($bean)) {

            // check if we did the check already
            if (isset($this->checkedBeans[$bean->id][$thisActivity]))
                return $this->checkedBeans[$bean->id][$thisActivity];

            // get a territory Object
            if (!$this->territory)
                $this->territory = BeanFactory::getBean('SpiceACLTerritories');

            foreach ($this->aclObject->getUserACLObjects($bean->_module ?: $bean->module_dir) as $aclObjectId => $aclObjectData) {
                // only check type 0
                if ($aclObjectData['spiceaclobjecttype'] != 0)
                    continue;

                if (!$this->aclObject->matchBean2Object($bean, $thisActivity, $aclObjectData))
                    continue;

                $allowAccess = true;
                break;
            }

            // check if we shodul limit
            if ($allowAccess) {
                foreach ($this->aclObject->getUserACLObjects($bean->_module ?: $bean->module_dir) as $aclObjectId => $aclObjectData) {
                    // only check type 0
                    if ($aclObjectData['spiceaclobjecttype'] != 3)
                        continue;

                    // match the object without activitiy
                    if ($this->aclObject->matchBean2Object($bean, '', $aclObjectData) && !$this->aclObject->matchObject2Activity($thisActivity, $aclObjectData)) {
                        $allowAccess = false;
                        break;
                    }
                }
            }

            // memorize the bean and also the min activititylevel
            if (!empty($bean->id))
                $this->checkedBeans[$bean->id][$thisActivity] = $allowAccess;

            // return the value
            return $allowAccess;
        } else {
            //check if module is under ACL. Useful for modules like Activities, History, Calendar
            //and corresponding subpanel display
            if (!SpiceACL::getInstance()->moduleSupportsACL($bean))
                return true;

            foreach ($this->aclObject->getUserACLObjects($bean) as $aclObjectId => $aclObjectData) {
                // check the activity .. if it is noit found .. cointinue
                if (array_search($thisActivity, $aclObjectData['objectactions']) === false)
                    continue;

                $allowAccess = true;
                break;
            }

            // return the value
            return $allowAccess;
        }
    }

    /**
     * returns all actions (Standatd & Custom) defined for the module
     *
     * @param $module
     */
    private function getModuleActions($module)
    {
        if(!isset($this->moduleActions[$module])){
            $db = DBManagerFactory::getInstance();
            $actions = [];

            // get the Actions
            $actionsObj = $db->query("SELECT action id, action FROM spiceaclstandardactions UNION SELECT spiceaclmoduleactions.id, action FROM spiceaclmoduleactions, sysmodules WHERE spiceaclmoduleactions.sysmodule_id = sysmodules.id AND sysmodules.module = '$module' UNION SELECT spiceaclmoduleactions.id, action FROM spiceaclmoduleactions, syscustommodules WHERE spiceaclmoduleactions.sysmodule_id = syscustommodules.id AND syscustommodules.module = '$module'");
            while ($action = $db->fetchByAssoc($actionsObj)) {
                $actions[$action['id']] = $action['action'];
            }
            $this->moduleActions[$module] = $actions;
        }

        return $this->moduleActions[$module];
    }

    /**
     * returns all ACL Actions the user is allowed to do on the bean
     *
     * returns an array with the actionname and true or false
     *
     * @param $bean
     * @return array
     */
    public function getBeanActions($bean)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if (!$this->aclObject)
            $this->aclObject = BeanFactory::getBean('SpiceACLObjects');

        // get the actions
        $actions = $this->getModuleActions($bean->_module ?: $bean->module_dir);

        // array for actions with status true or false
        $aArray = [];
        // admins have access to all
        if (AuthenticationController::getInstance()->getCurrentUser()->is_admin) {
            foreach ($actions as $actionid => $actionname) {
                $aArray[$actionname] = true;
            }
            return $aArray;
        }

        $activitiesAllowed = [];
        if (is_object($bean)) {

            // get a territory Object
            if (!$this->territory)
                $this->territory = BeanFactory::getBean('SpiceACLTerritories');

            $userObjects = $this->aclObject->getUserACLObjects($bean->_module ?: $bean->module_dir);
            foreach ($userObjects as $aclObjectId => $aclObjectData) {
                // only check type 0
                if ($aclObjectData['spiceaclobjecttype'] != 0)
                    continue;

                $activitiesAllowed = array_merge($activitiesAllowed, $this->aclObject->getObjectActivities($bean, $aclObjectData));
            }

            // only unique values
            $activitiesAllowed = array_unique($activitiesAllowed);

            // check if we shodul limit
            if (count($activitiesAllowed) > 0) {
                foreach ($userObjects as $aclObjectId => $aclObjectData) {
                    // only check type 0
                    if ($aclObjectData['spiceaclobjecttype'] != 3)
                        continue;

                    // match the object without activitiy
                    $activities = $this->aclObject->getObjectActivities($bean, $aclObjectData);
                    foreach ($activitiesAllowed as $allowedid => $allwoedaction) {
                        if (!isset($activities[$allowedid])) {
                            unset($activitiesAllowed['$allowedid']);
                        }
                    }

                }
            }

            // build the access array
            foreach ($actions as $actionid => $actionname) {
                $aArray[$actionname] = array_search($actionname, $activitiesAllowed) !== false;
            }
        } else {
            //check if module is under ACL. Useful for modules like Activities, History, Calendar
            //and corresponding subpanel display
            if (!SpiceACL::getInstance()->moduleSupportsACL($bean))
                return true;

            foreach ($this->aclObject->getUserACLObjects($bean) as $aclObjectId => $aclObjectData) {
                $activitiesAllowed = array_merge($activitiesAllowed, $aclObjectData['objectactions']);
            }

            // only unique values
            $activitiesAllowed = array_unique($activitiesAllowed);
            // build the access array
            foreach ($actions as $actionid => $actionname) {
                $aArray[$actionname] = array_search($actionid, $activitiesAllowed) !== false;
            }
        }

        return $aArray;
    }

    /*
     * function to get the field config
     */
    public function getFieldAccess($bean, $view)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $aclObject = BeanFactory::getBean('SpiceACLObjects');

        // admins have access
        if (AuthenticationController::getInstance()->getCurrentUser()->is_admin)
            return [];

        // get the activitiy
        $thisActivity = $this->getActivityValueByAction($view);
        // if activitiy is not found return false
        if ($thisActivity === false) {
            return false;
        }

        $fieldControlArray = [];

        if (!$this->territory)
            $this->territory = BeanFactory::getBean('SpiceACLTerritories');

        if (is_object($bean)) {
            foreach ($aclObject->getUserACLObjects($bean->_module ?: $bean->module_dir) as $aclObjectId => $aclObjectData) {

                if ($aclObjectData['spiceaclobjecttype'] != '0' && $aclObjectData['spiceaclobjecttype'] != '3')
                    continue;

                if ($this->aclObject->matchBean2Object($bean, $thisActivity, $aclObjectData)) {
                    foreach ($aclObjectData['objectfieldcontrols'] as $fieldName => $fieldControl) {
                        if ($fieldControl > $fieldControlArray[$fieldName]) {
                            $fieldControlArray[$fieldName] = $fieldControl;
                        }
                    }
                }
            }
        } else {
            foreach ($aclObject->getUserACLObjects($bean->_module ?: $bean->module_dir) as $aclObjectId => $aclObjectData) {
                if (array_search($thisActivity, $aclObjectData['objectactions']) === false)
                    continue;

                foreach ($aclObjectData['objectfieldcontrols'] as $fieldName => $fieldControl) {
                    $fieldControlArray[$fieldName] = $fieldControl;
                }
            }
        }

        return $fieldControlArray;
    }
}
