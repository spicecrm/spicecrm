<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

global $mod_strings, $app_strings, $db;

if(ACLController::checkAccess('KReleasePackages', 'edit', true))$module_menu[]=Array("index.php?module=KReleasePackages&action=EditView&return_module=KReleasePackages&return_action=DetailView", $mod_strings['LNK_KRELEASEPACKAGE_NEW'],"KReleasePackages");
if(ACLController::checkAccess('KReleasePackages', 'list', true))$module_menu[]=Array("index.php?module=KReleasePackages&action=index&return_module=KReleasePackages&return_action=DetailView", $mod_strings['LNK_KRELEASEPACKAGE_LIST'],"KReleasePackages");

?>
