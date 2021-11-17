<?php

namespace SpiceCRM\includes\SpiceUI;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SpiceFavorites\SpiceFavorites;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSActivityHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSUtils;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use stdClass;

class SpiceUIRESTHandler
{
    var $db;

    function __construct()
    {
        $db = DBManagerFactory::getInstance();
        $this->db = $db;
    }

    function checkAdmin()
    {
        if (!AuthenticationController::getInstance()->getCurrentUser()->is_admin)
            // set for cors
            // header("Access-Control-Allow-Origin: *");
            throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
    }

    /**
     * @deprected move to controller
     */
    function getModuleRepository()
    {
        $retArray = [];
        $modules = $this->db->query("SELECT * FROM sysuimodulerepository UNION ALL SELECT * FROM sysuicustommodulerepository");
        while ($module = $this->db->fetchByAssoc($modules)) {
            $retArray[$module['id']] = [
                'id' => $module['id'],
                'path' => $module['path'],
                'module' => $module['module']
            ];
        }

        return $retArray;
    }

    /**
     * @deprectaed moved to controller
     *
     * @return array
     */
    function getComponents()
    {
        $retArray = [];
        $components = $this->db->query("SELECT * FROM sysuiobjectrepository UNION ALL SELECT * FROM sysuicustomobjectrepository");
        while ($component = $this->db->fetchByAssoc($components)) {
            $retArray[$component['object']] = [
                'path' => $component['path'],
                'component' => $component['component'],
                'module' => $component['module'],
                'componentconfig' => json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"', '"'], html_entity_decode($component['componentconfig'])), true) ?: []
            ];
        }

        return $retArray;
    }

    /**
     * @deprectaed ... moved to modulesController
     *
     * @return array
     */
    function getModules()
    {
        global $modInvisList;
        $globalModuleList = SpiceModules::getInstance()->getModuleList();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        SpiceACL::getInstance()->filterModuleList($globalModuleList);
        SpiceACL::getInstance()->filterModuleList($modInvisList);

        $retArray = [];

        $dbresult = $this->db->query("SELECT * FROM sysmodules UNION SELECT * FROM syscustommodules");
        while ( $m = $this->db->fetchByAssoc( $dbresult )){
            // check if we have the module or if it has been filtered out
            if(!$m['acl'] || $current_user->is_admin || array_search($m['module'], $globalModuleList) !== false || array_search($m['module'], $modInvisList) !== false)
                $modules[$m['module']] = $m;
        }

        foreach ( $modules as $module ) {

            // load custom lists for the module
            $listArray = [];
            $lists = $this->db->query("SELECT * FROM sysmodulelists WHERE module='" . $module['module'] . "' AND (created_by_id = '$current_user->id' OR global = 1)");
            while ($list = $this->db->fetchByAssoc($lists))
                $listArray[] = $list;

            // get acls for the module
            $aclArray = [];
            $seed = BeanFactory::getBean($module['module']);
            if ($seed) {
                $aclActions = ['list', 'listrelated', 'view', 'delete', 'edit', 'create', 'export', 'import'];
                foreach ($aclActions as $aclAction) {
                    // $aclArray[$aclAction] = $seed->ACLAccess($aclAction);
                    $aclArray[$aclAction] = SpiceACL::getInstance()->checkAccess($module['module'], $aclAction, true);
                }
            } else {
                $aclArray['list'] = true;
            }

            // check if we have any ACL right
            if ($aclArray['list'] || $aclArray['view'] || $aclArray['edit']) {
                $retArray[$module['module']] = [
                    'icon' => $module['icon'],
                    'actionset' => $module['actionset'],
                    'module' => $module['module'],
                    'module_label' => $module['module_label'],
                    'singular' => $module['singular'],
                    'singular_label' => $module['singular_label'],
                    'track' => $module['track'],
                    'visible' => $module['visible'] ? true : false,
                    'audited' => $seed ? $seed->is_AuditEnabled() : false,
                    'tagging' => $module['tagging'] ? true : false,
                    'workflow' => $module['workflow'] ? true : false,
                    'duplicatecheck' => $module['duplicatecheck'],
                    'favorites' => $module['favorites'],
                    'listtypes' => $listArray,
                    'acl' => $aclArray,
                    'ftsactivities' => SpiceFTSActivityHandler::checkActivities($module['module']),
                    'ftsgeo' => SpiceFTSHandler::checkGeo($module['module'])
                ];
            }
        }

        return $retArray;
    }

    /**
     * @deprectaed .. moved to controller
     *
     * http://localhost/spicecrm_dev/KREST/spiceui/core/components
     * @return array
     */
    function getComponentSets()
    {
        $retArray = [];
        $componentsets = $this->db->query("SELECT sysuicomponentsetscomponents.*, sysuicomponentsets.id cid, sysuicomponentsets.name, sysuicomponentsets.module, sysuicomponentsets.package componentsetpackage FROM sysuicomponentsets LEFT JOIN sysuicomponentsetscomponents ON sysuicomponentsetscomponents.componentset_id = sysuicomponentsets.id ORDER BY componentset_id, sequence");

        while ($componentset = $this->db->fetchByAssoc($componentsets)) {

            if (!isset($retArray[$componentset['cid']])) {
                $retArray[$componentset['cid']] = [
                    'id' => $componentset['cid'],
                    'name' => $componentset['name'],
                    'package' => $componentset['componentsetpackage'],
                    'module' => $componentset['module'] ?: '*',
                    'type' => 'global',
                    'items' => []
                ];
            }

            $retArray[$componentset['componentset_id']]['items'][] = [
                'id' => $componentset['id'],
                'sequence' => $componentset['sequence'],
                'component' => $componentset['component'],
                'package' => $componentset['package'],
                //'componentconfig' => json_decode(str_replace(array("\r", "\n", "&#039;"), array('', '', '"'), html_entity_decode($componentset['componentconfig'], ENT_QUOTES)), true) ?: new \stdClass()
                'componentconfig' => json_decode(str_replace(["\r", "\n", "&#039;", "'"], ['', '', '"', '"'], $componentset['componentconfig']), true) ?: new stdClass()
            ];
        }

        $componentsets = $this->db->query("SELECT sysuicustomcomponentsetscomponents.*, sysuicustomcomponentsets.id cid, sysuicustomcomponentsets.name, sysuicustomcomponentsets.module, sysuicustomcomponentsets.package componentsetpackage FROM sysuicustomcomponentsets LEFT JOIN sysuicustomcomponentsetscomponents ON sysuicustomcomponentsetscomponents.componentset_id = sysuicustomcomponentsets.id ORDER BY componentset_id, sequence");

        while ($componentset = $this->db->fetchByAssoc($componentsets)) {

            if (!isset($retArray[$componentset['cid']])) {
                $retArray[$componentset['cid']] = [
                    'id' => $componentset['cid'],
                    'name' => $componentset['name'],
                    'package' => $componentset['componentsetpackage'],
                    'module' => $componentset['module'] ?: '*',
                    'type' => 'custom',
                    'items' => []
                ];
            }

            $retArray[$componentset['cid']]['items'][] = [
                'id' => $componentset['id'],
                'sequence' => $componentset['sequence'],
                'component' => $componentset['component'],
                'package' => $componentset['package'],
                'componentconfig' => json_decode(str_replace(["\r", "\n", "&#039;", "'"], ['', '', '"', '"'], $componentset['componentconfig']), true) ?: new stdClass()
            ];
        }
        return $retArray;
    }

    function setComponentSets($data)
    {

$db = DBManagerFactory::getInstance();

        $this->checkAdmin();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        foreach ($data['add'] as $componentsetid => $componentsetdata) {

            $componentsettable = $componentsetdata['type'] == 'custom' ? 'sysuicustomcomponentsets' : 'sysuicomponentsets';

            $db->query("INSERT INTO sysui".($componentsetdata['type'] == 'custom' ? 'custom' : '')."componentsets (id, module, name, package) VALUES('$componentsetid', '" . $componentsetdata['module'] . "', '" . $componentsetdata['name'] . "', '" . $componentsetdata['package'] . "')");

            // add to the CR
            if($cr) $cr->addDBEntry("sysui".($componentsetdata['type'] == 'custom' ? 'custom' : '')."componentsets", $componentsetid, 'I',  $componentsetdata['module'] . "/" . $componentsetdata['name']);


            foreach ($componentsetdata['items'] as $componentsetitem) {
                $db->query("INSERT INTO sysui" . ($componentsetdata['type'] == 'custom' ? 'custom' : '') . "componentsetscomponents (id, componentset_id, component, sequence, componentconfig, package, version) VALUES('" . $componentsetitem['id'] . "','$componentsetid','" . $componentsetitem['component'] . "','" . $componentsetitem['sequence'] . "','" . json_encode($componentsetitem['componentconfig']) . "','" . $componentsetitem['pakage'] . "', '{$_SESSION['confversion']}')");

                // add to the CR
                if($cr) $cr->addDBEntry(" sysui" . ($componentsetdata['type'] == 'custom' ? 'custom' : '') . "componentsetscomponents", $componentsetitem['id'], 'I',  $componentsetdata['module'] . "/" . $componentsetdata['name'] . '/' . $componentsetitem['component']);

            }
        }

        // handle the update
        foreach ($data['update'] as $componentsetid => $componentsetdata) {

            $record = $db->fetchByAssoc($db->query("SELECT * FROM sysui".($componentsetdata['type'] == 'custom' ? 'custom' : '')."componentsets WHERE id='$componentsetid'"));
            if($record['name'] != $componentsetdata['name'] || $record['package'] != $componentsetdata['package']) {
                $db->query("UPDATE sysui" . ($componentsetdata['type'] == 'custom' ? 'custom' : '') . "componentsets SET name='" . $componentsetdata['name'] . "',  package='" . $componentsetdata['package'] . "', version = '{$_SESSION['confversion']}' WHERE id='$componentsetid'");

                // add to the CR
                if ($cr) $cr->addDBEntry("sysui" . ($componentsetdata['type'] == 'custom' ? 'custom' : '') . "componentsets", $componentsetid, 'U', $componentsetdata['module'] . "/" . $componentsetdata['name']);
            }

            // delete all current items
            // $db->query("DELETE FROM sysui".($componentsetdata['type'] == 'custom' ? 'custom' : '')."componentsetscomponents WHERE componentset_id = '$componentsetid'");

            // get all componentset components
            $items = $db->query("SELECT * FROM sysui".($componentsetdata['type'] == 'custom' ? 'custom' : '')."componentsetscomponents WHERE componentset_id = '$componentsetid'");
            while($item = $db->fetchByAssoc($items)){
                $i = 0;$itemIndex = false;
                foreach ($componentsetdata['items'] as $index => $componentsetitem) {
                    if($componentsetitem['id'] == $item['id']){
                        unset($componentsetdata['items'][$index]);
                        $itemIndex = true;
                        break;
                    }
                }

                // if we have the entry
                if($itemIndex !== false){
                    if($item['sequence'] != $componentsetitem['sequence'] ||
                        $item['package'] != $componentsetitem['package'] ||
                        md5($item['componentconfig']) != md5(json_encode($componentsetitem['componentconfig']))){
                        $db->query("UPDATE sysui" . ($componentsetdata['type'] == 'custom' ? 'custom' : '') . "componentsetscomponents  SET package = '" . $componentsetitem['package'] . "', sequence = '" . $componentsetitem['sequence'] . "', componentconfig = '" . json_encode($componentsetitem['componentconfig']) . "', version = '{$_SESSION['confversion']}' WHERE id='{$item['id']}'");

                        // add to the CR
                        if($cr) $cr->addDBEntry("sysui" . ($componentsetdata['type'] == 'custom' ? 'custom' : '') . "componentsetscomponents", $componentsetitem['id'], 'U',  $componentsetdata['module'] . "/" . $componentsetdata['name'] . '/' . $componentsetitem['component']);
                    }

                } else {
                    // remove it
                    $db->query("DELETE FROM sysui" . ($componentsetdata['type'] == 'custom' ? 'custom' : '') . "componentsetscomponents WHERE id='{$item['id']}'");
                    // add to the CR
                    if($cr) $cr->addDBEntry("sysui" . ($componentsetdata['type'] == 'custom' ? 'custom' : '') . "componentsetscomponents", $componentsetitem['id'], 'D',  $componentsetdata['module'] . "/" . $componentsetdata['name'] . '/' . $componentsetitem['component']);

                }
            }

            // add all items
            foreach ($componentsetdata['items'] as $componentsetitem) {
                $db->query("INSERT INTO sysui" . ($componentsetdata['type'] == 'custom' ? 'custom' : '') . "componentsetscomponents (id, componentset_id, component, sequence, componentconfig, package, version) VALUES('" . $componentsetitem['id'] . "','$componentsetid','" . $componentsetitem['component'] . "','" . $componentsetitem['sequence'] . "','" . json_encode($componentsetitem['componentconfig']) . "','" . $componentsetitem['package'] . "', '{$_SESSION['confversion']}')");

                // add to the CR
                if($cr) $cr->addDBEntry(" sysui" . ($componentsetdata['type'] == 'custom' ? 'custom' : '') . "componentsetscomponents", $componentsetitem['id'], 'I',  $componentsetdata['module'] . "/" . $componentsetdata['name'] . '/' . $componentsetitem['component']);
            }
        }

        return true;

    }

    /**
     * @deprected .. moved to controller
     *
     * @return array
     */
    function getActionSets()
    {
        $retArray = [];
        $actionsets = $this->db->query("SELECT sysuiactionsetitems.*, sysuiactionsets.module, sysuiactionsets.name  FROM sysuiactionsetitems, sysuiactionsets WHERE sysuiactionsets.id = sysuiactionsetitems.actionset_id ORDER BY actionset_id, sequence");
        while ($actionset = $this->db->fetchByAssoc($actionsets)) {

            if (!isset($retArray[$actionset['actionset_id']])) {
                $retArray[$actionset['actionset_id']] = [
                    'id' => $actionset['actionset_id'],
                    'name' => $actionset['name'],
                    'module' => $actionset['module'],
                    'type' => 'global',
                    'actions' => []
                ];
            }


            $retArray[$actionset['actionset_id']]['actions'][] = [
                'id' => $actionset['id'],
                'action' => $actionset['action'],
                'component' => $actionset['component'],
                'singlebutton' => $actionset['singlebutton'],
                'actionconfig' => json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"','"'], html_entity_decode($actionset['actionconfig'])), true) ?: new stdClass()
            ];
        }

        $actionsets = $this->db->query("SELECT sysuicustomactionsetitems.*, sysuicustomactionsets.module, sysuicustomactionsets.name  FROM sysuicustomactionsetitems, sysuicustomactionsets WHERE sysuicustomactionsets.id = sysuicustomactionsetitems.actionset_id ORDER BY actionset_id, sequence");
        while ($actionset = $this->db->fetchByAssoc($actionsets)) {

            if (!isset($retArray[$actionset['actionset_id']])) {
                $retArray[$actionset['actionset_id']] = [
                    'id' => $actionset['actionset_id'],
                    'name' => $actionset['name'],
                    'module' => $actionset['module'],
                    'type' => 'custom',
                    'actions' => []
                ];
            }


            $retArray[$actionset['actionset_id']]['actions'][] = [
                'id' => $actionset['id'],
                'action' => $actionset['action'],
                'component' => $actionset['component'],
                'singlebutton' => $actionset['singlebutton'],
                'actionconfig' => json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"','"'], html_entity_decode($actionset['actionconfig'])), true) ?: new stdClass()
            ];
        }

        return $retArray;
    }

    /**
     *
     * @deprectaed .. moved to controller
     *
     * @return array
     */
    function getSysRoles()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $roleids = [];
        $retArray = [];
        if ($current_user->portal_only)
            $sysuiroles = $this->db->query("select * from (SELECT sysuiroles.*, sysuiuserroles.defaultrole FROM sysuiroles, sysuiuserroles WHERE sysuiroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION ALL SELECT sysuiroles.*, 0 defaultrole FROM sysuiroles WHERE sysuiroles.portaldefault = 1) roles order by name");
        else
            $sysuiroles = $this->db->query("select * from (SELECT sysuiroles.*, sysuiuserroles.defaultrole FROM sysuiroles, sysuiuserroles WHERE sysuiroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION ALL SELECT sysuiroles.*, 0 defaultrole FROM sysuiroles WHERE sysuiroles.systemdefault = 1) roles order by name");
        while ($sysuirole = $this->db->fetchByAssoc($sysuiroles)) {
            if (array_search($sysuirole['id'], $roleids) === false) {
                $retArray[] = $sysuirole;
                $roleids[] = $sysuirole['id'];
            }
        }

        // same for custom
        if ($current_user->portal_only)
            $sysuiroles = $this->db->query("select * from (SELECT sysuicustomroles.*, sysuiuserroles.defaultrole FROM sysuicustomroles, sysuiuserroles WHERE sysuicustomroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION ALL SELECT sysuicustomroles.*, 0 defaultrole FROM sysuicustomroles WHERE sysuicustomroles.portaldefault = 1) roles order by name");
        else
            $sysuiroles = $this->db->query("select * from (SELECT sysuicustomroles.*, sysuiuserroles.defaultrole FROM sysuicustomroles, sysuiuserroles WHERE sysuicustomroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION ALL SELECT sysuicustomroles.*, 0 defaultrole FROM sysuicustomroles WHERE sysuicustomroles.systemdefault = 1) roles order by name");
        while ($sysuirole = $this->db->fetchByAssoc($sysuiroles)) {
            if (array_search($sysuirole['id'], $roleids) === false) {
                $retArray[] = $sysuirole;
                $roleids[] = $sysuirole['id'];
            }
        }

        return $retArray;
    }

    function getAllRoles($userId)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $roleids = [];
        $allRoles = [];
        $userRoles = [];

        $userroles = $this->db->query("SELECT user_id, sysuirole_id, defaultrole FROM sysuiuserroles WHERE user_id = '$userId'");
        while ($userrole = $this->db->fetchByAssoc($userroles))
            $userRoles[] = $userrole;

        if ($current_user->portal_only)
            $sysuiroles = $this->db->query("SELECT * FROM sysuiroles WHERE portaldefault = 1 ORDER BY name");
        else
            $sysuiroles = $this->db->query("SELECT * FROM sysuiroles ORDER BY name");

        while ($sysuirole = $this->db->fetchByAssoc($sysuiroles)) {
            if (array_search($sysuirole['id'], $roleids) === false) {
                $allRoles[] = $sysuirole;
                $roleids[] = $sysuirole['id'];
            }
        }

        // same for custom
        if ($current_user->portal_only)
            $sysuiroles = $this->db->query("SELECT * FROM sysuicustomroles WHERE portaldefault = 1 ORDER BY name");
        else
            $sysuiroles = $this->db->query("SELECT * FROM sysuicustomroles ORDER BY name");

        while ($sysuirole = $this->db->fetchByAssoc($sysuiroles)) {
            if (array_search($sysuirole['id'], $roleids) === false) {
                $allRoles[] = array_merge( $sysuirole, [ 'custom' => true ]);
                $roleids[] = $sysuirole['id'];
            }
        }

        return ['userRoles' => $userRoles, 'allRoles' => $allRoles];
    }

    function setUserRole($args)
    {
        $user_id = $args['userid'];
        $sysuirole_id = $args['roleid'];
        $retArray = [];

        switch ($args['action']) {
            case 'new':
                $guid = create_guid();
                $entry = $this->db->fetchByAssoc($this->db->query("SELECT * FROM sysuiuserroles WHERE sysuirole_id = '$sysuirole_id' AND user_id = '$user_id'"));
                if (!$entry) {
                    $insertData = [
                        'id' => $guid,
                        'user_id' => $user_id,
                        'sysuirole_id' => $sysuirole_id,
                        'defaultrole' => 0
                    ];
                    $this->db->insertQuery('sysuiuserroles', $insertData);
                    $retArray = ['status' => 'success', 'roleId' => $sysuirole_id];
                } else
                    $retArray = ['status' => 'error', 'message' => 'Role already assigned.'];
                break;
            case 'default':
                $this->db->updateQuery('sysuiuserroles', ['user_id' => $user_id], ['defaultrole' => 0]);
                $this->db->updateQuery('sysuiuserroles', ['user_id' => $user_id, 'sysuirole_id' => $sysuirole_id], ['defaultrole' => 1]);
                $retArray = ['status' => 'success'];
                break;
        }

        return $retArray;
    }

    function deleteUserRole($args)
    {
        $user_id = $args['userid'];
        $sysuirole_id = $args['roleid'];
        $entry = $this->db->fetchByAssoc($this->db->query("SELECT * FROM sysuiuserroles WHERE sysuirole_id = '$sysuirole_id' AND user_id = '$user_id'"));
        if (!$entry)
            return ['status' => 'error', 'message' => 'Role not found'];
        $delPks = ['user_id' => $user_id, 'sysuirole_id' => $sysuirole_id];
        $this->db->deleteQuery('sysuiuserroles',  $delPks);
        return ['status' => 'success'];

    }

    /**
     * @deprectaed ... moved to controller
     * @return array
     */
    function getSysRoleModules()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $retArray = [];
        $modules = [];
        if ($current_user->portal_only)
            $sysuiroles = $this->db->query("select * from (SELECT sysuiroles.*, sysuiuserroles.defaultrole FROM sysuiroles, sysuiuserroles WHERE sysuiroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION ALL SELECT sysuiroles.*, 0 defaultrole FROM sysuiroles WHERE sysuiroles.portaldefault = 1) roles order by name");
        else
            $sysuiroles = $this->db->query("select * from (SELECT sysuiroles.*, sysuiuserroles.defaultrole FROM sysuiroles, sysuiuserroles WHERE sysuiroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION ALL SELECT sysuiroles.*, 0 defaultrole FROM sysuiroles WHERE sysuiroles.systemdefault = 1) roles order by name");
        while ($sysuirole = $this->db->fetchByAssoc($sysuiroles)) {
            if (isset($retArray[$sysuirole['id']])) continue;
            $sysuirolemodules = $this->db->query("SELECT * FROM sysuirolemodules WHERE sysuirole_id in ('*', '" . $sysuirole['id'] . "') ORDER BY sequence");
            while ($sysuirolemodule = $this->db->fetchByAssoc($sysuirolemodules)) {
                $retArray[$sysuirole['id']][] = $sysuirolemodule;
            }

            // get potential custom modules added to the role
            $sysuirolemodules = $this->db->query("SELECT * FROM sysuicustomrolemodules WHERE sysuirole_id in ('*', '" . $sysuirole['id'] . "') ORDER BY sequence");
            while ($sysuirolemodule = $this->db->fetchByAssoc($sysuirolemodules)) {
                $retArray[$sysuirole['id']][] = $sysuirolemodule;
            }
        }

        // same for custom
        if ($current_user->portal_only)
            $sysuiroles = $this->db->query("select * from (SELECT sysuicustomroles.*, sysuiuserroles.defaultrole FROM sysuicustomroles, sysuiuserroles WHERE sysuicustomroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION SELECT sysuicustomroles.*, 0 defaultrole FROM sysuicustomroles WHERE sysuicustomroles.portaldefault = 1) roles order by name");
        else
            $sysuiroles = $this->db->query("select * from (SELECT sysuicustomroles.*, sysuiuserroles.defaultrole FROM sysuicustomroles, sysuiuserroles WHERE sysuicustomroles.id = sysuiuserroles.sysuirole_id AND sysuiuserroles.user_id = '$current_user->id' UNION SELECT sysuicustomroles.*, 0 defaultrole FROM sysuicustomroles WHERE sysuicustomroles.systemdefault = 1) roles order by name");
        while ($sysuirole = $this->db->fetchByAssoc($sysuiroles)) {
            // if (isset($retArray[$sysuirole['id']])) continue;
            $sysuirolemodules = $this->db->query("SELECT * FROM sysuicustomrolemodules WHERE sysuirole_id in ('*', '" . $sysuirole['id'] . "') ORDER BY sequence");
            while ($sysuirolemodule = $this->db->fetchByAssoc($sysuirolemodules)) {
                $retArray[$sysuirole['id']][] = $sysuirolemodule;
            }
        }

        return $retArray;
    }


    /**
     * @deprecated moved to controller
     *
     * @return array
     */
    function getSysCopyRules()
    {
        $retArray = [];
        $sysuirules = $this->db->query("SELECT * FROM sysuicopyrules");
        while ($sysuirule = $this->db->fetchByAssoc($sysuirules)) {
            $retArray[$sysuirule['frommodule']][$sysuirule['tomodule']][] = [
                'fromfield' => $sysuirule['fromfield'],
                'tofield' => $sysuirule['tofield'],
                'fixedvalue' => $sysuirule['fixedvalue'],
                'calculatedvalue' => $sysuirule['calculatedvalue'],
                'params' => $sysuirule['params']
            ];
        }

        $sysuirules = $this->db->query("SELECT * FROM sysuicustomcopyrules");
        while ($sysuirule = $this->db->fetchByAssoc($sysuirules)) {
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
     * @deprectaed moved to controller
     *
     * @return array
     */
    function getComponentDefaultConfigs()
    {
        $retArray = [];
        $componentconfigs = $this->db->query("SELECT * FROM sysuicomponentdefaultconf");
        while ($componentconfig = $this->db->fetchByAssoc($componentconfigs)) {
            $retArray[$componentconfig['component']][trim($componentconfig['role_id'])] = json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"','"'], html_entity_decode($componentconfig['componentconfig'])), true) ?: new stdClass();
        }

        $componentconfigs = $this->db->query("SELECT * FROM sysuicustomcomponentdefaultconf");
        while ($componentconfig = $this->db->fetchByAssoc($componentconfigs)) {
            $retArray[$componentconfig['component']][trim($componentconfig['role_id'])] = json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"','"'], html_entity_decode($componentconfig['componentconfig'])), true) ?: new stdClass();
        }

        return $retArray;
    }

    /**
     * @deprectaed moved to controller
     *
     * @return array
     */
    function getComponentModuleConfigs()
    {
        $retArray = [];
        $componentconfigs = $this->db->query("SELECT * FROM sysuicomponentmoduleconf");
        while ($componentconfig = $this->db->fetchByAssoc($componentconfigs)) {
            $retArray[$componentconfig['module']][$componentconfig['component']][trim($componentconfig['role_id'])] = json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"','"'], html_entity_decode($componentconfig['componentconfig'])), true) ?: new stdClass();
        }

        $componentconfigs = $this->db->query("SELECT * FROM sysuicustomcomponentmoduleconf");
        while ($componentconfig = $this->db->fetchByAssoc($componentconfigs)) {
            $retArray[$componentconfig['module']][$componentconfig['component']][trim($componentconfig['role_id'])] = json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"','"'], html_entity_decode($componentconfig['componentconfig'])), true) ?: new stdClass();
        }

        return $retArray;
    }

    function checkComponentModuleAlreadyExists($params){

        if ($params['type'] == "custom") {
            $sysuiconfigs = $this->db->query("SELECT * FROM sysuicustomcomponentmoduleconf WHERE component = '" . $params['component'] . "' AND role_id = '" . $params['role_id'] . "' AND module = '" . $params['module'] . "'");
        }else {
            $sysuiconfigs = $this->db->query("SELECT * FROM sysuicomponentmoduleconf WHERE component = '" . $params['component'] . "' AND role_id = '" . $params['role_id'] . "' AND module = '" . $params['module'] . "'");
        }
        $result = $this->db->fetchByAssoc($sysuiconfigs);

        return $result;
    }

    function checkComponentDefaultAlreadyExists($params){
        if ($params['type'] == "custom") {
            $sysuiconfigs = $this->db->query("SELECT * FROM sysuicustomcomponentdefaultconf WHERE component = '" . $params['component'] . "' AND role_id = '" . $params['role_id'] . "'");
        }else {
            $sysuiconfigs = $this->db->query("SELECT * FROM sysuicomponentdefaultconf WHERE component = '" . $params['component'] . "' AND role_id = '" . $params['role_id'] . "'");
        }
        $result = $this->db->fetchByAssoc($sysuiconfigs);

        return $result;
    }



    function checkFieldSetAlreadyExists($params){

        if($params['module'] == 'global'){
            $params['module'] = "*";
        }

        if ($params['type'] == "custom") {
            $sysuiconfigs = $this->db->query("SELECT * FROM sysuicustomfieldsets WHERE module = '" . $params['module'] . "' AND name = '" . $params['name'] . "'");
        }else {
            $sysuiconfigs = $this->db->query("SELECT * FROM sysuifieldsets WHERE module = '" . $params['module'] . "' AND name = '" . $params['name'] . "'");
        }
        $result = $this->db->fetchByAssoc($sysuiconfigs);
        return $result;
    }
    /**
     * @deprecated moved to controller
     *
     * @return mixed
     */
    function getFieldDefs($modules)
    {
        $retArray = [
            'fielddefs' => [],
            'fieldtypemappings' => $this->getFieldDefMapping(),
            'fieldstatusnetworks' => $this->getStatusNetworks()
        ];
        foreach ($modules as $module) {
            $seed = BeanFactory::getBean($module);
            $retArray['fielddefs'][$module] = $seed->field_name_map;
            $indexProperties = SpiceFTSUtils::getBeanIndexProperties($module);
            if($indexProperties) {
                foreach ($indexProperties as $indexProperty) {
                    if ($indexProperty['index'] == 'analyzed' && $indexProperty['duplicatecheck'] && isset($retArray['fielddefs'][$module][$indexProperty['indexfieldname']])) {
                        $retArray['fielddefs'][$module][$indexProperty['indexfieldname']]['duplicatecheck'] = true;
                    }
                }
            }
        }

        return $retArray;
    }

    /**
     * @deprecated moved to controller
     *
     * @return array
     */
    private function getStatusNetworks(){
        $db = DBManagerFactory::getInstance();
        $retArray = [];
        $statusnetworks = $db->query("SELECT * FROM syststatusnetworks ORDER BY domain, status_priority");
        while($statusnetwork = $db->fetchByAssoc($statusnetworks)){
            $retArray[$statusnetwork['domain']][] = $statusnetwork;
        }
        return $retArray;
    }

    /**
     * VALIDATIONs
     */

    public function setModelValidation(array $data)
    {
        $failed = false;

        $sql = "INSERT IGNORE INTO sysuimodelvalidations SET
                  id = '{$data['id']}',
                  name = '{$data['name']}',
                  module = '{$data['module']}',
                  onevents = '".$this->db->quote($data['onevents'])."',
                  active = ".(int)$data['active'].",
                  logicoperator = '{$data['logicoperator']}',
                  priority = ".(int)$data['priority'].",
                  deleted = ".(int)$data['deleted']."
                ON DUPLICATE KEY UPDATE
                  name = '{$data['name']}',
                  module = '{$data['module']}',
                  onevents = '".$this->db->quote($data['onevents'])."',
                  active = ".(int)$data['active'].",
                  logicoperator = '{$data['logicoperator']}',
                  priority = ".(int)$data['priority'].",
                  deleted = ".(int)$data['deleted'];
        if( !$this->db->query($sql) ){  $failed = true; $error = 'INSERT INTO sysuimodelvalidations failed!';   }

        if( !$failed ) {
            foreach ($data['conditions'] as $con) {
                $sql = "INSERT IGNORE INTO sysuimodelvalidationconditions SET
                      id = '{$con['id']}',
                      sysuimodelvalidation_id = '{$con['sysuimodelvalidation_id']}',
                      fieldname = '{$con['fieldname']}',
                      comparator = '{$con['comparator']}',
                      valuations = '".$this->db->quote($con['valuations'])."',
                      onchange = '{$con['onchange']}',
                      deleted = ".(int)$con['deleted']."
                    ON DUPLICATE KEY UPDATE
                      sysuimodelvalidation_id = '{$con['sysuimodelvalidation_id']}',
                      fieldname = '{$con['fieldname']}',
                      comparator = '{$con['comparator']}',
                      valuations = '".$this->db->quote($con['valuations'])."',
                      onchange = '{$con['onchange']}',
                      deleted = ".(int)$con['deleted'];
                if (!$this->db->query($sql)) {
                    $failed = true;
                    $error = 'INSERT INTO sysuimodelvalidationconditions failed!';
                }
            }

            foreach ($data['actions'] as $act)
            {
                $sql = "INSERT IGNORE INTO sysuimodelvalidationactions SET
                      id = '{$act['id']}',
                      sysuimodelvalidation_id = '{$act['sysuimodelvalidation_id']}',
                      fieldname = '{$act['fieldname']}',
                      action = '{$act['action']}',
                      params = '".$this->db->quote(is_array($act['params']) ? json_encode($act['params']) : $act['params'])."',
                      priority = ".(int)$act['priority'].",
                      deleted = ".(int)$act['deleted']."
                    ON DUPLICATE KEY UPDATE
                      sysuimodelvalidation_id = '{$act['sysuimodelvalidation_id']}',
                      fieldname = '{$act['fieldname']}',
                      action = '{$act['action']}',
                      params = '".$this->db->quote(is_array($act['params']) ? json_encode($act['params']) : $act['params'])."',
                      priority = ".(int)$act['priority'].",
                      deleted = ".(int)$act['deleted'];
                if (!$this->db->query($sql)) {
                    $failed = true;
                    $error = 'INSERT INTO sysuimodelvalidationactions failed!';
                }
            }
        }

        if( $failed ) {
            var_dump($error);
            throw ( new Exception($error))->setFatal(true);
        }

        return true;
    }

    /**
     * @deprecated can be deleted with next cleanup
     *
     * @return mixed
     */
    public function getAllModelValidations()
    {
        $sql = "SELECT id, module 
                FROM sysuimodelvalidations 
                WHERE deleted = 0 AND active = 1
                ORDER BY priority ASC";
        $res = $this->db->query($sql);
        while($row = $this->db->fetchByAssoc($res))
        {
            $return[$row['module']]['validations'][] = $this->getModelValidations($row['id']);
        }
        return $return;
    }

    public function getModuleModelValidations($module)
    {
        $sql = "SELECT id FROM sysuimodelvalidations 
                WHERE `module` = '{$module}' AND deleted = 0 AND active = 1
                ORDER BY priority ASC";
        $res = $this->db->query($sql);
        while($row = $this->db->fetchByAssoc($res))
        {
            $return['validations'] = $this->getModelValidations($row['id']);
        }
        return $return;
    }

    public function getModelValidations($id)
    {
        $sql = "SELECT * FROM sysuimodelvalidations WHERE id = '{$id}'";
        $res = $this->db->query($sql);
        $return = $this->db->fetchByAssoc($res);
        if( !$return['logicoperator'] ){    $return['logicoperator'] = 'and';   }
        if( json_decode($return['onevents']) ){$return['onevents'] = json_decode($return['onevents']);}

        $return['conditions'] = $return['actions'] = [];

        $sql = "SELECT * FROM sysuimodelvalidationconditions 
                WHERE sysuimodelvalidation_id = '{$return['id']}' AND deleted = 0";
        $res = $this->db->query($sql);
        while($row = $this->db->fetchByAssoc($res))
        {
            if( json_decode($row['valuations']) ){$row['valuations'] = json_decode($row['valuations']);}
            $return['conditions'][] = $row;
        }

        $sql = "SELECT * FROM sysuimodelvalidationactions 
                WHERE sysuimodelvalidation_id = '{$return['id']}' AND deleted = 0
                ORDER BY priority ASC";
        $res = $this->db->query($sql);
        while($row = $this->db->fetchByAssoc($res))  // <--- fucking dont encode html entities...!!!
        {
            if( json_decode($row['params']) ){$row['params'] = json_decode($row['params']);}
            $return['actions'][] = $row;
        }

        return $return;
    }

    public function deleteModelValidation($id)
    {
        $sql = "UPDATE sysuimodelvalidations SET deleted = 1 WHERE id = '$id'";
        //$sql = "DELETE FROM sysuimodelvalidations WHERE id = '$id'";
        $res = $this->db->query($sql);

        $sql = "UPDATE sysuimodelvalidationconditions SET deleted = 1 WHERE sysuimodelvalidation_id = '$id'";
        //$sql = "DELETE FROM sysuimodelvalidationconditions WHERE sysuimodelvalidation_id = '$id'";
        $res = $this->db->query($sql);

        $sql = "UPDATE sysuimodelvalidationactions SET deleted = 1 WHERE sysuimodelvalidation_id = '$id'";
        //$sql = "DELETE FROM sysuimodelvalidationactions WHERE sysuimodelvalidation_id = '$id'";
        $res = $this->db->query($sql);

        return true;
    }

    /**
     * @deprectaed .. moved to controllers
     *
     * @return array
     *
     */
    public function getLibraries()
    {
        $return = [];
        $sql = "SELECT * FROM (SELECT * FROM sysuilibs UNION SELECT * FROM sysuicustomlibs) libs ORDER BY libs.rank ASC";
        $res = $this->db->query($sql);
        while ($row = $this->db->fetchByAssoc($res)) {
            $return[$row['name']][] = ['loaded' => false, 'src' => $row['src']];
        }

        return $return;
    }

    public function getServiceCategories()
    {
        $return = [];
        $sql = "SELECT * FROM sysservicecategories ORDER BY keyname ASC, name ASC";
        $res = $this->db->query($sql);
        while ($row = $this->db->fetchByAssoc($res)) {
            $return[$row['id']] = $row;
        }
        return $return;
    }

    public function getServiceCategoryTree()
    {
        $return = [];
        $sql = "SELECT cat.*, queue.name AS servicequeue_name 
                FROM sysservicecategories AS cat 
                LEFT JOIN servicequeues AS queue ON(queue.id = cat.servicequeue_id) 
                WHERE IFNULL(parent_id,'') = ''
                ORDER BY keyname ASC, cat.name ASC";
        $res = $this->db->query($sql);
        while ($row = $this->db->fetchByAssoc($res)) {
            $row['level'] = 0;
            $return[] = $this->getServiceCategoryChilds($row);
        }
        return $return;
    }

    private function getServiceCategoryChilds(&$cat)
    {
        $sql = "SELECT cat.*, queue.name AS servicequeue_name 
                FROM sysservicecategories AS cat 
                LEFT JOIN servicequeues AS queue ON(queue.id = cat.servicequeue_id) 
                WHERE parent_id = '" . $cat['id'] . "' 
                ORDER BY keyname ASC, cat.name ASC";
        $res = $this->db->query($sql);
        while($row = $this->db->fetchByAssoc($res))
        {
            $row['level'] = $cat['level'] + 1;
            $cat['categories'][] = $this->getServiceCategoryChilds($row);
        }
        return $cat;
    }

    public function setServiceCategoryTree($tree)
    {
        $sql = "TRUNCATE TABLE sysservicecategories";
        $this->db->query($sql);

        $categories = $this->flattenOutServiceCategoryTree($tree);
        //var_dump($tree, $categories);

        # start rewriting by looping through the tree...
        foreach ($categories as $cat) {
            $sql = "INSERT INTO sysservicecategories SET 
                      id = '" . $cat['id'] . "',
                      name = '" . $cat['name'] . "',
                      keyname = '" . $cat['keyname'] . "',
                      selectable = '" . $cat['selectable'] . "',
                      favorite = '" . $cat['favorite'] . "',
                      parent_id = '" . $cat['parent_id'] . "',
                      servicequeue_id = '" . $cat['servicequeue_id'] . "'";
            $this->db->query($sql);
        }
    }

    private function flattenOutServiceCategoryTree($tree)
    {
        $cats = [];
        foreach ($tree as $cat) {
            $cats[] = $cat;
            if ($cat['categories']) {
                $this->flattenOutServiceCategoryChildren($cat['categories'], $cats);
            }
        }
        return $cats;
    }

    private function flattenOutServiceCategoryChildren($childs, &$cats)
    {
        foreach ($childs as $cat) {
            $cats[] = $cat;
            if ($cat['categories']) {
                $this->flattenOutServiceCategoryChildren($cat['categories'], $cats);
            }
        }
    }

    public function getSelectTrees()
    {
        $return = [];
        $sql = "SELECT * FROM sysselecttree_tree ORDER BY name ASC";
        $res = $this->db->query($sql);
        while ($row = $this->db->fetchByAssoc($res)) {
//           /* $return[$row['id']] = $row;*/
            array_push($return, $row);
        }
        return $return;
    }

    public function getSelectTreeList($id)
    {
        $return = [];
        $sql = "SELECT * FROM sysselecttree_fields 
                WHERE tree = '" . $id . "'
                ORDER BY keyname ASC, name ASC";
        $res = $this->db->query($sql);
        while ($row = $this->db->fetchByAssoc($res)) {
            $return[$row['id']] = $row;
        }
        return $return;
    }

    public function getSelectTree($id)
    {
        $return = [];
        $sql = "SELECT * FROM sysselecttree_fields 
                WHERE tree = '" . $id . "' 
                AND IFNULL(parent_id,'') = '' 
                ORDER BY name ASC";
        $res = $this->db->query($sql);
        while ($row = $this->db->fetchByAssoc($res)) {
            $row['level'] = 0;
            $return[] = $this->getSelectTreeChilds($row);
        }
        return $return;
    }

    private function getSelectTreeChilds(&$cat)
    {
        $sql = "SELECT * FROM sysselecttree_fields 
                WHERE parent_id = '" . $cat['id'] . "' 
                ORDER BY keyname ASC, name ASC";
        $res = $this->db->query($sql);
        while ($row = $this->db->fetchByAssoc($res)) {
            $row['level'] = $cat['level'] + 1;
            $cat['childs'][] = $this->getSelectTreeChilds($row);
        }
        return $cat;
    }

    public function setSelectTree($selecttree)
    {
        $this->checkAdmin();
        $table = 'sysselecttree_fields';
        $sql = "DELETE FROM {$table} WHERE tree = '" . $selecttree[0]['tree'] . "'";
        $this->db->query($sql);
        $categories = $this->flattenOutSelectTree($selecttree);
        //var_dump($tree, $categories);
        # start rewriting by looping through the tree...
        foreach ($categories as $cat) {
            $insertData = [
                'id' => $cat['id'],
                'name' => $cat['name'],
                'keyname' => $cat['keyname'],
                'selectable' => $cat['selectable'],
                'favorite' => $cat['favorite'],
                'parent_id' => $cat['parent_id'],
                'tree' => $cat['tree']
            ];
            $this->db->insertQuery($table, $insertData);
        }
        return true;
    }

    private function flattenOutSelectTree($selecttree)
    {
        $cats = [];
        foreach ($selecttree as $cat) {
            $cats[] = $cat;
            if ($cat['childs']) {
                $this->flattenOutSelectTreeChildren($cat['childs'], $cats);
            }
        }
        return $cats;
    }
    private function flattenOutSelectTreeChildren($childs, &$cats)
    {
        foreach ($childs as $cat) {
            $cats[] = $cat;
            if ($cat['childs']) {
                $this->flattenOutSelectTreeChildren($cat['childs'], $cats);
            }
        }
    }

    public function setTree($tree)
    {
        $this->checkAdmin();
        $insertData = [
            'id' => $tree['id'],
            'name' => $tree['name'] ,
        ];
        $this->db->insertQuery('sysselecttree_tree', $insertData);
        return true;
    }


    function getFieldDefMapping()
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
     * @deprectaed .. moved to trackers controller and loader
     *
     * @param string $module
     * @param int $limit
     * @return array
     */
    function getRecent($module = '', $limit = 5)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $tracker = BeanFactory::getBean('Trackers');
        $history = $tracker->get_recently_viewed($current_user->id, $module ? [$module] : '', $limit);
        $recentItems = [];
        foreach ($history as $key => $row) {
            if (empty($history[$key]['module_name']) || empty($row['item_summary'])) {
                unset($history[$key]);
                continue;
            }

            $recentItems[] = $row;
        }
        return $recentItems;
    }

    /**
     * @return array
     * @deprecated
     *
     */
    function getFavorites()
    {
        return SpiceFavorites::getFavoritesRaw('', 0);
    }

    // for the listtypes
    function addListType($module, $params)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $newGuid = create_guid();
        $insertData = array_merge([
            'id' => $newGuid,
            'created_by_id' => $current_user->id,
            'module' => $module,
        ],
            $params
        );
        $this->db->insertQuery('sysmodulelists', $insertData);
        return $insertData;
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
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();
        $navElements = [];

        // admin only
        if ($current_user->is_admin) {
            // load all groups sorted
            $groups = $db->query("SELECT * FROM (SELECT id, name, label, sequence FROM sysuiadmingroups UNION ALL SELECT id, name, label, sequence FROM sysuicustomadmingroups) us ORDER by sequence");
            while ($group = $db->fetchByAssoc($groups)) {
                // get the components for the group
                $groupComponents = [];
                $groupComponentsObjects = $db->query("SELECT * FROM (SELECT id, adminaction, sequence, component, componentconfig, admin_label, icon FROM sysuiadmincomponents WHERE admingroup='{$group['name']}' UNION ALL SELECT id, adminaction, sequence, component, componentconfig, admin_label, icon FROM sysuicustomadmincomponents  WHERE admingroup='{$group['name']}') gc ORDER BY sequence");
                while ($groupComponent = $db->fetchByAssoc($groupComponentsObjects)) {
                    // ugly but effective
                    // ToDo: find a nice way to handle that
                    $groupComponent['componentconfig'] = json_decode(str_replace(["\r", "\n", "\t", "&#039;", "'"], ['', '', '', '"', '"'], html_entity_decode($groupComponent['componentconfig'])), true) ?: new stdClass();
                    $groupComponents[] = $groupComponent;
                }
                // only add if we have any component
                if(count($groupComponents) > 0){
                    $navElements[] = array_merge($group, ['groupcomponents' => $groupComponents]);
                }
            }
        }

        return $navElements;
    }

    function getAllModules()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();

        $modules = [];
        $modulestmp = []; // CR1000442

        if ($current_user->is_admin) {
            $sysmodules = $db->query("SELECT * FROM sysmodules");
            while ($sysmodule = $db->fetchByAssoc($sysmodules)) {
                // CR1000442 enable custom data to override a core module definition
                // $modules[] = $sysmodule;
                $modulestmp[$sysmodule['module']] = $sysmodule;
            }
            $sysmodules = $db->query("SELECT * FROM syscustommodules");
            while ($sysmodule = $db->fetchByAssoc($sysmodules)) {
                // CR1000442 enable custom data to override a core module definition
                // $modules[] = $sysmodule;
                $modulestmp[$sysmodule['module']] = $sysmodule;
            }
        };

        // CR1000442 make $modulestmp to numeric array
        foreach($modulestmp as $module => $moduledata){
            $modules[] = $moduledata;
        }

        usort($modules, function ($a, $b) {
            return strcasecmp($a['module'], $b['module']);
        });

        return $modules;
    }


    public function getHtmlStyling()
    {
        $db = DBManagerFactory::getInstance();
        $response = ['stylesheets' => []];

        $dbResult = $db->query('SELECT id, name, csscode FROM sysuihtmlstylesheets WHERE inactive <> 1');
        while ($row = $db->fetchByAssoc($dbResult)) {
            $response['stylesheets'][$row['id']] = $row;
        }

        $dbResult = $db->query('SELECT id, name, inline, block, classes, styles, stylesheet_id, wrapper FROM sysuihtmlformats WHERE inactive <> 1 ORDER BY name');
        while ($row = $db->fetchByAssoc($dbResult)) {
            if (isset($response['stylesheets'][$row['stylesheet_id']])) {
                $response['stylesheets'][$row['stylesheet_id']]['formats'][] = $row;
            }
        }

        $response['stylesheetsToUse'] = isset(SpiceConfig::getInstance()->config['htmlStylesheetsToUse']) ? SpiceConfig::getInstance()->config['htmlStylesheetsToUse'] : (object)[];

        return $response;
    }
}
