<?php

class SystemUIRESTHandler
{
    var $db;

    function __construct()
    {
        global $db;
        $this->db = $db;
    }

    function checkAdmin()
    {
        global $current_user;

        if (!$current_user->is_admin) {
            http_response_code(401);
            header('HTTP/1.0 401', true, 401);
            // set for cors
            header("Access-Control-Allow-Origin: *");
            HttpResponse::send('no admin privileges');
            exit;
        }
    }

    function getModuleRepository()
    {
        $retArray = array();
        $modules = $this->db->query("SELECT * FROM sysuimodulerepository");
        while ($module = $this->db->fetchByAssoc($modules)) {
            $retArray[$module['id']] = array(
                'id' => $module['id'],
                'path' => $module['path'],
                'module' => $module['module']
            );
        }

        return $retArray;
    }

    function getComponents()
    {
        $retArray = array();
        $components = $this->db->query("SELECT * FROM sysuiobjectrepository");
        while ($component = $this->db->fetchByAssoc($components)) {
            $retArray[$component['object']] = array(
                'path' => $component['path'],
                'component' => $component['component'],
                'module' => $component['module'],
                'componentconfig' => json_decode(str_replace(array("\r", "\n", "&#039;"), array('', '', '"'), html_entity_decode($component['componentconfig'])), true) ?: array()
            );
        }

        return $retArray;
    }

    function getModules()
    {
        global $current_user, $moduleList;

        $GLOBALS['ACLController']->filterModuleList($moduleList);

        $retArray = array();
        $modules = $this->db->query("SELECT * FROM sysmodules");
        while ($module = $this->db->fetchByAssoc($modules)) {
            // load menu items
            $menuItemsArray = [];
            $menuItems = $this->db->query("SELECT * FROM sysmodulemenus WHERE module='" . $module['module'] . "'");
            while ($menuItem = $this->db->fetchByAssoc($menuItems))
                $menuItemsArray[] = $menuItem;

            // load custom lists for the module
            $listArray = [];
            $lists = $this->db->query("SELECT * FROM sysmodulelists WHERE module='" . $module['module'] . "' AND (created_by_id = '$current_user->id' OR global = 1)");
            while ($list = $this->db->fetchByAssoc($lists))
                $listArray[] = $list;



            // get acls for the module
            $aclArray = [];
            $seed = BeanFactory::getBean($module['module']);
            if ($seed) {
                $aclActions = ['list', 'view', 'delete', 'edit', 'export', 'import'];
                foreach ($aclActions as $aclAction) {
                    // $aclArray[$aclAction] = $seed->ACLAccess($aclAction);
                    $aclArray[$aclAction] = ACLController::checkAccess($module['module'], $aclAction, true);
                }
            } else {
                $aclArray['list'] = true;
            }

            // check if we have any ACL right
            if ($aclArray['list'] || $aclArray['view'] || $aclArray['edit']) {
                $retArray[$module['module']] = array(
                    'icon' => $module['icon'],
                    'actionset' => $module['actionset'],
                    'singular' => $module['singular'],
                    'menu' => $menuItemsArray,
                    'track' => $module['track'],
                    'visible' => $module['visible'] ? true : false,
                    'duplicatecheck' => $module['duplicatecheck'],
                    'favorites' => $module['favorites'],
                    'listtypes' => $listArray,
                    'acl' => $aclArray
                );
            }
        }

        return $retArray;
    }

    function getComponentSets()
    {
        $retArray = array();
        $componentsets = $this->db->query("SELECT sysuicomponentsets.name, sysuicomponentsets.module, sysuicomponentsetscomponents.* FROM sysuicomponentsetscomponents, sysuicomponentsets WHERE sysuicomponentsets.id = sysuicomponentsetscomponents.componentset_id  ORDER BY componentset_id, sequence");
        while ($componentset = $this->db->fetchByAssoc($componentsets)) {

            if (!isset($retArray[$componentset['componentset_id']])) {
                $retArray[$componentset['componentset_id']] = array(
                    'id' => $componentset['componentset_id'],
                    'name' => $componentset['name'],
                    'module' => $componentset['module'] ?: '*',
                    'items' => []
                );
            }

            $retArray[$componentset['componentset_id']]['items'][] = array(
                'id' => $componentset['id'],
                'sequence' => $componentset['sequence'],
                'component' => $componentset['component'],
                'componentConfig' => json_decode(str_replace(array("\r", "\n", "&#039;"), array('', '', '"'), html_entity_decode($componentset['componentConfig'])), true) ?: new stdClass()
            );
        }

        return $retArray;
    }

    function setComponentSets($data)
    {
        global $db;

        $this->checkAdmin();

        // add items
        foreach ($data['add'] as $componentsetid => $componentsetdata) {
            $db->query("INSERT INTO sysuicomponentsets (id, module, name) VALUES('$componentsetid', '" . $componentsetdata['module'] . "', '" . $componentsetdata['name'] . "')");
            foreach ($componentsetdata['items'] as $componentsetitem) {
                $db->query("INSERT INTO sysuicomponentsetscomponents (id, componentset_id, component, sequence, componentconfig) VALUES('" . $componentsetitem['id'] . "','$componentsetid','" . $componentsetitem['component'] . "','" . $componentsetitem['sequence'] . "','" . json_encode($componentsetitem['componentConfig']) . "')");
            }
        }

        // handle the update
        foreach ($data['update'] as $componentsetid => $componentsetdata) {
            $db->query("UPDATE sysuicomponentsets SET name='" . $componentsetdata['name'] . "' WHERE id='$componentsetid'");
            // delete all current items
            $db->query("DELETE FROM sysuicomponentsetscomponents WHERE componentset_id = '$componentsetid'");
            // add all items
            foreach ($componentsetdata['items'] as $componentsetitem) {
                $db->query("INSERT INTO sysuicomponentsetscomponents (id, componentset_id, component, sequence, componentconfig) VALUES('" . $componentsetitem['id'] . "','$componentsetid','" . $componentsetitem['component'] . "','" . $componentsetitem['sequence'] . "','" . json_encode($componentsetitem['componentConfig']) . "')");
            }
        }

        return true;

    }

    function getActionSets()
    {
        $retArray = array();
        $actionsets = $this->db->query("SELECT sysuiactionsetitems.*, sysuiactionsets.module, sysuiactionsets.name  FROM sysuiactionsetitems, sysuiactionsets WHERE sysuiactionsets.id = sysuiactionsetitems.actionset_id ORDER BY actionset_id, sequence");
        while ($actionset = $this->db->fetchByAssoc($actionsets)) {

            if (!isset($retArray[$actionset['actionset_id']])) {
                $retArray[$actionset['actionset_id']] = array(
                    'id' => $actionset['actionset_id'],
                    'name' => $actionset['name'],
                    'module' => $actionset['module'],
                    'actions' => array()
                );
            }


            $retArray[$actionset['actionset_id']]['actions'][] = array(
                'action' => $actionset['action'],
                'component' => $actionset['component'],
                'actionconfig' => json_decode(str_replace(array("\r", "\n", "&#039;"), array('', '', '"'), html_entity_decode($actionset['actionconfig'])), true) ?: new stdClass()
            );
        }

        return $retArray;
    }

    function getSysRoles()
    {
        global $current_user;

        $roleids = [];
        $retArray = array();
        if ($current_user->portal_only)
            $sysuiroles = $this->db->query("select * from (SELECT sysuiroles.*, sysuiuserroles.defaultrole FROM sysuiroles, sysuiuserroles WHERE sysuiroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION SELECT sysuiroles.*, 0 defaultrole FROM sysuiroles WHERE sysuiroles.portaldefault = 1) roles order by name");
        else
            $sysuiroles = $this->db->query("select * from (SELECT sysuiroles.*, sysuiuserroles.defaultrole FROM sysuiroles, sysuiuserroles WHERE sysuiroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION SELECT sysuiroles.*, 0 defaultrole FROM sysuiroles WHERE sysuiroles.systemdefault = 1) roles order by name");
        while ($sysuirole = $this->db->fetchByAssoc($sysuiroles)) {
            if (array_search($sysuirole['id'], $roleids) === false) {
                $retArray[] = $sysuirole;
                $roleids[] = $sysuirole['id'];
            }
        }

        return $retArray;
    }

    function getSysRoleModules()
    {
        global $current_user;

        $retArray = array();
        $sysuiroles = $this->db->query("select * from (SELECT sysuiroles.*, sysuiuserroles.defaultrole FROM sysuiroles, sysuiuserroles WHERE sysuiroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION SELECT sysuiroles.*, 0 defaultrole FROM sysuiroles WHERE sysuiroles.systemdefault = 1) roles order by name");
        while ($sysuirole = $this->db->fetchByAssoc($sysuiroles)) {
            if (isset($retArray[$sysuirole['id']])) continue;
            $sysuirolemodules = $this->db->query("SELECT * FROM sysuirolemodules WHERE sysuirole_id in ('*', '" . $sysuirole['id'] . "') ORDER BY sequence");
            while ($sysuirolemodule = $this->db->fetchByAssoc($sysuirolemodules)) {
                $retArray[$sysuirole['id']][] = $sysuirolemodule;
            }
        }
        return $retArray;
    }

    function getSysCopyRules()
    {
        $retArray = array();
        $sysuirules = $this->db->query("SELECT * FROM sysuicopyrules");
        while ($sysuirule = $this->db->fetchByAssoc($sysuirules)) {
            $retArray[$sysuirule['frommodule']][$sysuirule['tomodule']][] = array(
                'fromfield' => $sysuirule['fromfield'],
                'tofield' => $sysuirule['tofield'],
                'fixedvalue' => $sysuirule['fixedvalue'],
                'calculatedvalue' => $sysuirule['calculatedvalue']
            );
        }

        return $retArray;
    }

    function getComponentDefaultConfigs()
    {
        $retArray = array();
        $componentconfigs = $this->db->query("SELECT * FROM sysuicomponentdefaultconf");
        while ($componentconfig = $this->db->fetchByAssoc($componentconfigs)) {
            $retArray[$componentconfig['component']][$componentconfig['role_id']] = json_decode(str_replace(array("\r", "\n", "\t", "&#039;"), array('', '', '', '"'), html_entity_decode($componentconfig['componentconfig'])), true) ?: array();
        }

        return $retArray;
    }

    function getComponentModuleConfigs()
    {
        $retArray = array();
        $componentconfigs = $this->db->query("SELECT * FROM sysuicomponentmoduleconf");
        while ($componentconfig = $this->db->fetchByAssoc($componentconfigs)) {
            $retArray[$componentconfig['module']][$componentconfig['component']][$componentconfig['role_id']] = json_decode(str_replace(array("\r", "\n", "\t", "&#039;"), array('', '', '', '"'), html_entity_decode($componentconfig['componentconfig'])), true) ?: new stdClass();
        }

        return $retArray;
    }

    function getFieldSets()
    {
        $retArray = array();
        $fieldsets = $this->db->query("SELECT sysuifieldsetsitems.*, sysuifieldsets.module, sysuifieldsets.name FROM sysuifieldsetsitems, sysuifieldsets WHERE sysuifieldsetsitems.fieldset_id = sysuifieldsets.id ORDER BY fieldset_id, sequence");
        while ($fieldset = $this->db->fetchByAssoc($fieldsets)) {

            if (!isset($retArray[$fieldset['fieldset_id']])) {
                $retArray[$fieldset['fieldset_id']] = array(
                    'name' => $fieldset['name'],
                    'module' => $fieldset['module'] ?: '*',
                    'items' => []
                );
            }

            if (!empty($fieldset['field']))
                $retArray[$fieldset['fieldset_id']]['items'][] = array(
                    'id' => $fieldset['id'],
                    'field' => $fieldset['field'],
                    'fieldconfig' => json_decode(str_replace(array("\r", "\n", "&#039;"), array('', '', '"'), html_entity_decode($fieldset['fieldconfig'])), true) ?: new stdClass(),
                    'sequence' => $fieldset['sequence']
                );
            elseif (!empty($fieldset['fieldset']))
                $retArray[$fieldset['fieldset_id']]['items'][] = array(
                    'id' => $fieldset['id'],
                    'fieldset' => $fieldset['fieldset'],
                    'fieldconfig' => json_decode(str_replace(array("\r", "\n", "&#039;"), array('', '', '"'), html_entity_decode($fieldset['fieldconfig'])), true) ?: new stdClass(),
                    'sequence' => $fieldset['sequence']
                );
        }

        return $retArray;
    }

    function setFieldSets($data)
    {
        global $current_user, $db;

        $this->checkAdmin();

        // add items
        foreach ($data['add'] as $fieldsetid => $fieldsetdata) {
            $db->query("INSERT INTO sysuifieldsets (id, module, name) VALUES('$fieldsetid', '" . $fieldsetdata['module'] . "', '" . $fieldsetdata['name'] . "')");
            foreach ($fieldsetdata['items'] as $fieldsetitem) {
                $db->query("INSERT INTO sysuifieldsetsitems (id, fieldset_id, field, fieldset, sequence, fieldconfig) VALUES('" . $fieldsetitem['id'] . "','$fieldsetid','" . $fieldsetitem['field'] . "','" . $fieldsetitem['fieldset'] . "','" . $fieldsetitem['sequence'] . "','" . json_encode($fieldsetitem['fieldconfig']) . "')");
            }
        }

        // handle the update
        foreach ($data['update'] as $fieldsetid => $fieldsetdata) {
            $db->query("UPDATE sysuifieldsets SET name='" . $fieldsetdata['name'] . "' WHERE id='$fieldsetid'");
            // delete all current items
            $db->query("DELETE FROM sysuifieldsetsitems WHERE fieldset_id = '$fieldsetid'");
            // add all items
            foreach ($fieldsetdata['items'] as $fieldsetitem) {
                $db->query("INSERT INTO sysuifieldsetsitems (id, fieldset_id, field, fieldset, sequence, fieldconfig) VALUES('" . $fieldsetitem['id'] . "','$fieldsetid','" . $fieldsetitem['field'] . "','" . $fieldsetitem['fieldset'] . "','" . $fieldsetitem['sequence'] . "','" . json_encode($fieldsetitem['fieldconfig']) . "')");
            }
        }

        return true;

    }

    function getFieldDefs($modules)
    {
        $retArray = array(
            'fielddefs' => [],
            'fieldtypemappings' => $this->getFieldDefMapping()
        );
        foreach ($modules as $module) {
            $seed = BeanFactory::getBean($module);
            $retArray['fielddefs'][$module] = $seed->field_name_map;
        }
        return $retArray;
    }

    function getFieldDefMapping()
    {
        global $db;
        $mappingArray = [];

        $mappings = $db->query("SELECT * FROM sysuifieldtypemapping");
        while ($mapping = $db->fetchByAssoc($mappings)) {
            $mappingArray[$mapping['fieldtype']] = $mapping['component'];
        }

        return $mappingArray;
    }

    function getRoutes()
    {
        $routeArray = array();
        $routes = $this->db->query("SELECT * FROM sysuiroutes");
        while ($route = $this->db->fetchByAssoc($routes)) {
            $routeItem = array(
                'path' => $route['path']
            );

            if ($route['component'])
                $routeItem['component'] = $route['component'];

            if ($route['redirectto'])
                $routeItem['redirectTo'] = $route['redirectto'];

            if ($route['pathmatch'])
                $routeItem['pathMatch'] = $route['pathmatch'];

            if ($route['loginrequired'])
                $routeItem['canActivate'] = array('loginCheck');

            $routeArray[] = $routeItem;

        }
        return json_encode($routeArray);
    }

    function getRecent($module = '', $limit = 5)
    {
        global $current_user;
        require_once('modules/Trackers/Tracker.php');
        $tracker = new Tracker();
        $history = $tracker->get_recently_viewed($current_user->id, $module ? array($module) : '', $limit);
        $recentItems = Array();
        foreach ($history as $key => $row) {
            if (empty($history[$key]['module_name']) || empty($row['item_summary'])) {
                unset($history[$key]);
                continue;
            }

            $recentItems[] = $row;
        }
        return $recentItems;
    }

    function getFavorites()
    {
        require_once('include/SpiceFavorites/SpiceFavorites.php');
        return SpiceFavorites::getFavoritesRaw('', 0);
    }

    function setFavorite($module, $id)
    {

    }

    function deleteFavorite($module, $id)
    {

    }

    function getReminders()
    {
        require_once('include/SpiceReminders/SpiceReminders.php');
        return SpiceReminders::getRemindersRaw('', 0);
    }

    // for the listtypes
    function addListType($module, $list, $global)
    {
        global $current_user;
        $newGuid = create_guid();
        $this->db->query("INSERT INTO sysmodulelists (id, created_by_id, module, name, global) values('$newGuid', '$current_user->id', '$module', '$list', " . ($global ? 1 : 0) . ")");
        return array(
            'id' => $newGuid,
            'module' => $module,
            'list' => $list,
            'basefilter' => 'all',
            'global' => $global
        );
    }

    function setListType($id, $params)
    {
        $updArray = [];
        foreach ($params as $paramkey => $paramvalue)
            $updArray[] = "$paramkey = '$paramvalue'";

        $this->db->query("UPDATE sysmodulelists SET " . implode(', ', $updArray) . " WHERE id = '$id'");
        return true;
    }

    function deleteListType($id)
    {
        $this->db->query("DELETE FROM sysmodulelists WHERE id = '$id'");
        return true;
    }

    function getAdminNavigation()
    {
        global $current_user, $db;

        $navElements = [];

        if ($current_user->is_admin) {
            $admincomponents = $db->query("SELECT * FROM sysuiadmincomponents ORDER BY sequence");
            while ($admincomponent = $db->fetchByAssoc($admincomponents)) {
                $navElements[$admincomponent['admingroup']][] = array(
                    'adminaction' => $admincomponent['adminaction'],
                    'component' => $admincomponent['component'],
                    'componentconfig' => json_decode(str_replace(array("\r", "\n", "\t", "&#039;"), array('', '', '', '"'), html_entity_decode($admincomponent['componentconfig'])), true) ?: new stdClass()
                );
            }
        }

        return $navElements;
    }

    function getAllModules()
    {
        global $current_user, $db;

        $modules = [];

        if ($current_user->is_admin) {
            $sysmodules = $db->query("SELECT * FROM sysmodules ORDER BY module");
            while ($sysmodule = $db->fetchByAssoc($sysmodules)) {
                $modules[] = $sysmodule;
            }
        }

        return $modules;
    }
}