<?php
global $mod_strings, $app_strings, $db, $app_list_strings;

if (ACLController::checkAccess('SpiceImports', 'edit', true)) $module_menu[] = Array("index.php?module=SpiceImports&action=EditView&return_module=SpiceImports&return_action=DetailView", $mod_strings['LBL_NEW_FORM_TITLE'], "CreateSpiceImport", 'SpiceImports');
if (ACLController::checkAccess('SpiceImports', 'list', true)) $module_menu[] = Array("index.php?module=SpiceImports&action=index", $mod_strings['LBL_VIEW_FORM_TITLE'], "SpiceImports", 'SpiceImports');
