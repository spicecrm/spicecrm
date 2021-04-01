<?php
/**
 * Created by PhpStorm.
 * User: maretval
 * Date: 20.02.2019
 * Time: 09:20
 */

namespace SpiceCRM\modules\ACL;

interface ACLControllerInterface {

    public function checkAccess($category, $action, $is_owner = false, $type = 'module');

    public function checkModuleAllowed($module, $actions = []);

    public function disabledModuleList($moduleList, $by_value = true, $view = 'list');

    public function displayNoAccess($redirect_home = false);

    public function filterModuleList(&$moduleList, $by_value = true);

    public function getFTSQuery($module);

    public function getFieldAccess($bean, $view);

    public function moduleSupportsACL($module);

    public function requireOwner($category, $value, $type = 'module');
}