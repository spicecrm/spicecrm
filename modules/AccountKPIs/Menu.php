<?php
global $mod_strings, $app_strings, $db, $app_list_strings;

if (ACLController::checkAccess('AccountKPIs', 'edit', true)) $module_menu[] = Array("index.php?module=AccountKPIs&action=EditView&return_module=AccountKPIs&return_action=DetailView", $mod_strings['LBL_NEW_FORM_TITLE'], "CreateAccountKPI", 'AccountKPIs');
if (ACLController::checkAccess('AccountKPIs', 'list', true)) $module_menu[] = Array("index.php?module=AccountKPIs&action=index", $mod_strings['LBL_VIEW_FORM_TITLE'], "AccountKPIs", 'AccountKPIs');
