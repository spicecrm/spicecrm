<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSActivityHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSBeanHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSUtils;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class SpiceUIModulesController
{
    function geUnfilteredModules(){
        global $modInvisList;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $modules = [];
        if(!is_array($modInvisList)) $modInvisList = [];

        // select from sysmodules
        $dbresult = $db->query("SELECT * FROM sysmodules");
        while ($m = $db->fetchByAssoc($dbresult)) {
            // check if we have the module or if it has been filtered out
            if (!$m['acl'] || ( isset( $current_user ) and $current_user->is_admin ) || $m['module'] == 'Home' || array_search($m['module'], SpiceModules::getInstance()->getModuleList()) !== false || array_search($m['module'], $modInvisList) !== false)
                $modules[$m['module']] = $m;
        }

        // select from custom modules and also allow override
        $dbresult = $db->query("SELECT * FROM syscustommodules");
        while ($m = $db->fetchByAssoc($dbresult)) {
            // check if we have the module or if it has been filtered out
            if (!$m['acl'] || ( isset( $current_user ) and $current_user->is_admin  ) || $m['module'] == 'Home' || array_search($m['module'], SpiceModules::getInstance()->getModuleList()) !== false || array_search($m['module'], $modInvisList) !== false)
                $modules[$m['module']] = $m;
        }

        return $modules;
    }

    /**
     * returns the complete list of modules
     *
     * @return array|mixed
     * @throws \Exception
     *
     */
    function getModules()
    {
        global $modInvisList;
        $globalModuleList = SpiceModules::getInstance()->getModuleList();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if(isset($_SESSION['SpiceUI']['modules'])){
            $retArray =  $_SESSION['SpiceUI']['modules'];
        } else {

            // if we have no ACL Controller yet .. return an empty array
            if(!SpiceACL::getInstance()) return [];

            // filter the module list
            SpiceACL::getInstance()->filterModuleList($globalModuleList);

            // in case $modInvisList is no longer an array, define as such
            // might happen when a new user has no ACL allocated
            if(!is_array($modInvisList)){
                $modInvisList = [];
            }

            $retArray = [];

            // select from sysmodules
            $dbresult = $db->query("SELECT * FROM sysmodules");
            while ($m = $db->fetchByAssoc($dbresult)) {
                // check if we have the module or if it has been filtered out
                if (!$m['acl'] || $current_user->is_admin || $m['module'] == 'Home' || array_search($m['module'], $globalModuleList) !== false || array_search($m['module'], $modInvisList) !== false)
                    $modules[$m['module']] = $m;
            }

            // select from custom modules and also allow override
            $dbresult = $db->query("SELECT * FROM syscustommodules");
            while ($m = $db->fetchByAssoc($dbresult)) {
                // check if we have the module or if it has been filtered out
                if (!$m['acl'] || $current_user->is_admin || $m['module'] == 'Home' || array_search($m['module'], $globalModuleList) !== false || array_search($m['module'], $modInvisList) !== false)
                    $modules[$m['module']] = $m;
            }


            foreach ($modules as $module) {

                // load custom lists for the module
                $listArray = [];
                $lists = $db->query("SELECT * FROM sysmodulelists WHERE module='" . $module['module'] . "' AND (created_by_id = '$current_user->id' OR global = 1)");
                while ($list = $db->fetchByAssoc($lists)) {
                    $listArray[] = $list;
                }

                // get acls for the module
                $aclArray = [];
                if($module['module'] == 'LandingPages'){
                    $i = 1;
                }
                $seed = BeanFactory::getBean($module['module']);
                if ($seed) {
                    $aclArray = SpiceACL::getInstance()->getModuleAccess($module['module']);
                } else {
                    $aclArray['list'] = true;
                }

                $ftsBeanHandler = new SpiceFTSBeanHandler($seed);
                // check if we have any ACL right
                if ($module['module'] == 'Home' || $aclArray['list'] ||$aclArray['listrelated'] || $aclArray['view'] || $aclArray['edit']) {
                    $retArray[$module['module']] = [
                        'id' => $module['id'],
                        'icon' => $module['icon'],
                        'actionset' => $module['actionset'],
                        'module' => $module['module'],
                        'module_label' => $module['module_label'],
                        'singular' => $module['singular'],
                        'singular_label' => $module['singular_label'],
                        'track' => $module['track'],
                        'visible' => $module['visible'] ? true : false,
                        'visibleaclaction' => $module['visibleaclaction'],
                        'audited' => $seed ? $seed->is_AuditEnabled() : false,
                        'tagging' => $module['tagging'] ? true : false,
                        'workflow' => $module['workflow'] ? true : false,
                        'duplicatecheck' => $module['duplicatecheck'],
                        'favorites' => $module['favorites'],
                        'listtypes' => $listArray,
                        'acl' => $aclArray,
                        'acl_multipleusers' => $module['acl_multipleusers'],
                        'ftsactivities' => SpiceFTSActivityHandler::checkActivities($module['module']),
                        'ftsgeo' => SpiceFTSHandler::checkGeo($module['module']),
                        'ftsaggregates' => $ftsBeanHandler->getAggregates(),
                        'ftsglobalsearch' => SpiceFTSHandler::checkGlobal($module['module']),
                    ];
                }
            }

            // cache in the session to gain performance
            $_SESSION['SpiceUI']['modules'] = $retArray;
        }

        return $retArray;
    }

    /**
     * CR1000453
     * @param $moduleid
     * @return array|false
     */
    public function getModuleDataById($moduleid)
    {
        $db = DBManagerFactory::getInstance();
        $ret = [];
        if(!empty($moduleid)) {
            $dbresult = $db->query("SELECT * FROM sysmodules WHERE id='{$moduleid}' UNION SELECT * FROM syscustommodules WHERE id='{$moduleid}'");
            while ($m = $db->fetchByAssoc($dbresult)) {
                // we should get only 1 record
                $ret = $m;
            }
        }
        return $ret;
    }


    /**
     * loads and returns the field defs of the various modules
     *
     * @return array
     */
    function getFieldDefs()
    {
        $retArray = [];
        $modules = self::getModules();
        foreach ($modules as $module => $moduleDetails) {
            $seed = BeanFactory::getBean($module);
            foreach($seed->field_name_map as $fieldname => $fielddata){
                $retArray[$module][$fieldname] = $fielddata;
                switch($fielddata['type']){
                    case 'parent':
                        $parentmodules = [];
                        $relationships = $seed->db->query("SELECT lhs_module FROM relationships WHERE rhs_module='{$module}' AND rhs_key='{$fielddata['id_name']}' AND deleted=0");
                        while($relationship = $seed->db->fetchByAssoc($relationships)){
                            if(isset($modules[$relationship['lhs_module']])){
                                $parentmodules[] = $relationship['lhs_module'];
                            }
                        }
                        $retArray[$module][$fieldname]['parent_modules'] = $parentmodules;
                        break;
                }
            }

            $indexProperties = SpiceFTSUtils::getBeanIndexProperties($module);
            if ($indexProperties) {
                foreach ($indexProperties as $indexProperty) {
                    // set the info on the duplicate check
                    if ($indexProperty['duplicatecheck'] && isset($retArray[$module][$indexProperty['indexfieldname']])) {
                        $retArray[$module][$indexProperty['indexfieldname']]['duplicatecheck'] = true;
                    }

                    // set the info on the phone search
                    if ($indexProperty['phonesearch'] && isset($retArray[$module][$indexProperty['indexfieldname']])) {
                        $retArray[$module][$indexProperty['indexfieldname']]['phonesearch'] = true;
                    }
                }
            }
        }

        return $retArray;
    }

    /**
     * loads the fieldtype mappings
     *
     * @return array
     * @throws \Exception
     */
    static function getFieldDefMapping()
    {
        $db = DBManagerFactory::getInstance();
        $mappingArray = [];

        $mappings = $db->query("SELECT * FROM sysuifieldtypemapping");
        while ($mapping = $db->fetchByAssoc($mappings)) {
            $mappingArray[$mapping['fieldtype']] = $mapping['component'];
        }

        $mappings = $db->query("SELECT * FROM sysuicustomfieldtypemapping");
        while ($mapping = $db->fetchByAssoc($mappings)) {
            $mappingArray[$mapping['fieldtype']] = $mapping['component'];
        }

        return $mappingArray;
    }

    /**
     * loads the defined status networks
     *
     * @return array
     * @throws \Exception
     */
    static function getModuleStatusNetworks()
    {
        $db = DBManagerFactory::getInstance();
        $retArray = [];
        $statusnetworks = $db->query("SELECT * FROM syststatusnetworks ORDER BY domain, status_priority");
        while ($statusnetwork = $db->fetchByAssoc($statusnetworks)) {
            $retArray[$statusnetwork['domain']][] = $statusnetwork;
        }
        return $retArray;
    }


    /**
     * loadsand combines the sysui roles
     *
     * @return array
     */
    static function getSysRoles()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $retArray = [];

        # Load the roles assigned to the user (custom and global roles):
        $roles = $db->query("SELECT sysuicustomroles.*, sysuiuserroles.defaultrole FROM sysuiuserroles INNER JOIN sysuicustomroles ON sysuicustomroles.id = sysuiuserroles.sysuirole_id WHERE sysuiuserroles.user_id = '$current_user->id' ORDER BY NAME");
        while ( $role = $db->fetchByAssoc( $roles )) $retArray[] = $role;
        $roles = $db->query("SELECT sysuiroles.*, sysuiuserroles.defaultrole FROM sysuiuserroles INNER JOIN sysuiroles ON sysuiroles.id = sysuiuserroles.sysuirole_id WHERE sysuiuserroles.user_id = '$current_user->id' ORDER BY NAME");
        while ( $role = $db->fetchByAssoc( $roles )) {
            if ( !isset( $retArray[$role['id']] )) $retArray[$role['id']] = $role; # In case a custom and a global role have the same ID, don´t load the global role.
        }

        // When there are no to the user assigned roles ...
        if ( count( $retArray ) === 0 ) {

            // ... load all the custom roles:
            $roles = $db->query( 'SELECT sysuicustomroles.*, 0 defaultrole FROM sysuicustomroles WHERE '.( $current_user->portal_only ? 'portaldefault':'systemdefault' ).' = 1 ORDER BY NAME' );
            while ( $role = $db->fetchByAssoc( $roles )) $retArray[] = $role;

            # ... or when there are no custom roles, load all the global roles:
            if ( count( $retArray ) === 0 ) {
                $roles = $db->query( 'SELECT sysuiroles.*, 0 defaultrole FROM sysuiroles WHERE '.( $current_user->portal_only ? 'portaldefault':'systemdefault' ).' = 1 ORDER BY NAME' );
                while ( $role = $db->fetchByAssoc( $roles )) $retArray[] = $role;
            }

        }

        return array_values( $retArray );
    }


    static function getSysRoleModules()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $retArray = [];
        $modules = [];
        if ($current_user->portal_only)
            $sysuiroles = $db->query("select * from (SELECT sysuiroles.*, sysuiuserroles.defaultrole FROM sysuiroles, sysuiuserroles WHERE sysuiroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION ALL SELECT sysuiroles.*, 0 defaultrole FROM sysuiroles WHERE sysuiroles.portaldefault = 1) roles order by name");
        else
            $sysuiroles = $db->query("select * from (SELECT sysuiroles.*, sysuiuserroles.defaultrole FROM sysuiroles, sysuiuserroles WHERE sysuiroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION ALL SELECT sysuiroles.*, 0 defaultrole FROM sysuiroles WHERE sysuiroles.systemdefault = 1) roles order by name");
        while ($sysuirole = $db->fetchByAssoc($sysuiroles)) {
            if (isset($retArray[$sysuirole['id']])) continue;
            $sysuirolemodules = $db->query("SELECT * FROM sysuirolemodules WHERE sysuirole_id in ('*', '" . $sysuirole['id'] . "') ORDER BY sequence");
            while ($sysuirolemodule = $db->fetchByAssoc($sysuirolemodules)) {
                $retArray[$sysuirole['id']][] = $sysuirolemodule;
            }

            // get potential custom modules added to the role
            $sysuirolemodules = $db->query("SELECT * FROM sysuicustomrolemodules WHERE sysuirole_id in ('*', '" . $sysuirole['id'] . "') ORDER BY sequence");
            while ($sysuirolemodule = $db->fetchByAssoc($sysuirolemodules)) {
                $retArray[$sysuirole['id']][] = $sysuirolemodule;
            }
        }

        // same for custom
        if ($current_user->portal_only)
            $sysuiroles = $db->query("select id from (SELECT sysuicustomroles.*, sysuiuserroles.defaultrole FROM sysuicustomroles, sysuiuserroles WHERE sysuicustomroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION ALL SELECT sysuicustomroles.*, 0 defaultrole FROM sysuicustomroles WHERE sysuicustomroles.portaldefault = 1) roles group by id,name order by name");
        else
            $sysuiroles = $db->query("select id from (SELECT sysuicustomroles.*, sysuiuserroles.defaultrole FROM sysuicustomroles, sysuiuserroles WHERE sysuicustomroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION ALL SELECT sysuicustomroles.*, 0 defaultrole FROM sysuicustomroles WHERE sysuicustomroles.systemdefault = 1) roles group by id,name order by name");
        while ($sysuirole = $db->fetchByAssoc($sysuiroles)) {
            // if (isset($retArray[$sysuirole['id']])) continue;
            $sysuirolemodules = $db->query("SELECT * FROM sysuicustomrolemodules WHERE sysuirole_id in ('*', '" . $sysuirole['id'] . "') ORDER BY sequence");
            while ($sysuirolemodule = $db->fetchByAssoc($sysuirolemodules)) {
                $retArray[$sysuirole['id']][] = $sysuirolemodule;
            }
        }

        return $retArray;
    }


    function getSysCopyRules()
    {
        $db = DBManagerFactory::getInstance();

        $retArray = [];
        $sysuirules = $db->query("SELECT * FROM sysuicopyrules");
        while ($sysuirule = $db->fetchByAssoc($sysuirules)) {
            $retArray[$sysuirule['frommodule']][$sysuirule['tomodule']][] = [
                'fromfield' => $sysuirule['fromfield'],
                'tofield' => $sysuirule['tofield'],
                'fixedvalue' => $sysuirule['fixedvalue'],
                'calculatedvalue' => $sysuirule['calculatedvalue'],
                'params' => $sysuirule['params']
            ];
        }

        $sysuirules = $db->query("SELECT * FROM sysuicustomcopyrules");
        while ($sysuirule = $db->fetchByAssoc($sysuirules)) {
            $retArray[$sysuirule['frommodule']][$sysuirule['tomodule']][] = [
                'fromfield' => $sysuirule['fromfield'],
                'tofield' => $sysuirule['tofield'],
                'fixedvalue' => $sysuirule['fixedvalue'],
                'calculatedvalue' => $sysuirule['calculatedvalue'],
                'params' => $sysuirule['params']
            ];
        }

        return $retArray;
    }

    /**
     * CR1000453
     * getReassignModules
     * retrieves a list of modules to consider in reassignment process
     * @param $req
     * @param $res
     * @param $args
     */
    public function getReassignModules($moduleids = [] ){
        $modules = [];
        $addWhere = "";
        if(!empty($moduleids)){
            $addWhere.= " AND id IN('".implode("', '", $moduleids )."')";
        }

        $q = "SELECT id, module, reassign_modulefilter_id  FROM sysmodules WHERE reassignable = 1 {$addWhere} UNION SELECT id, module, reassign_modulefilter_id FROM syscustommodules WHERE reassignable = 1 {$addWhere}";

        if ($results = DBManagerFactory::getInstance()->query($q)) {
            while($row = DBManagerFactory::getInstance()->fetchByAssoc($results)){
                $modules[$row['id']] = ['id' => $row['id'], 'module' => $row['module'], 'filterid' => $row['reassign_modulefilter_id']];
            }
        }

        return $modules;
    }

}
