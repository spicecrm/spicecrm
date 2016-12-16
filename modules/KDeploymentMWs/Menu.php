<?php
global $mod_strings, $app_strings, $db, $app_list_strings;

if (ACLController::checkAccess('KDeploymentMWs', 'edit', true)) $module_menu[] = Array("index.php?module=KDeploymentMWs&action=EditView&return_module=KDeploymentMWs&return_action=DetailView", $mod_strings['LBL_NEW_FORM_TITLE'], "CreateKDeploymentMW", 'KDeploymentMWs');
if (ACLController::checkAccess('KDeploymentMWs', 'list', true)) $module_menu[] = Array("index.php?module=KDeploymentMWs&action=index", $mod_strings['LBL_VIEW_FORM_TITLE'], "KDeploymentMWs", 'KDeploymentMWs');
