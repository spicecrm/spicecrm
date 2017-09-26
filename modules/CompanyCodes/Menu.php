<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

global $mod_strings, $app_strings;

if(ACLController::checkAccess('CompanyCodes', 'edit', true))$module_menu[]=Array("index.php?module=CompanyCodes&action=EditView&return_module=CompanyCodes&return_action=DetailView", $mod_strings['LNK_COMPANYCODE_NEW'],"CreateCompanyCode");
if(ACLController::checkAccess('CompanyCodes', 'list', true))$module_menu[]=Array("index.php?module=CompanyCodes&action=index&return_module=CompanyCodes&return_action=DetailView", $mod_strings['LNK_COMPANYCODE_LIST'],"CompanyCodes");

?>
