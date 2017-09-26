<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

global $mod_strings, $app_strings, $sugar_config;
$module_menu = Array();
if(ACLController::checkAccess('CompanyFiscalPeriods','edit',true)){
    $module_menu[]=	Array("index.php?module=CompanyFiscalPeriods&action=EditView&return_module=CompanyFiscalPeriods&return_action=DetailView", $mod_strings['LNK_NEW_COMPANYFISCALPERIOD'],"CreateCompanyFiscalPeriods");
}
if(ACLController::checkAccess('CompanyFiscalPeriods','list',true)){
    $module_menu[]=	Array("index.php?module=CompanyFiscalPeriods&action=index&return_module=CompanyFiscalPeriods&return_action=DetailView", $mod_strings['LNK_COMPANYFISCALPERIOD_LIST'],"CompanyFiscalPeriods");
}
if(ACLController::checkAccess('CompanyFiscalPeriods','import',true)){
    $module_menu[]=  Array("index.php?module=Import&action=Step1&import_module=CompanyFiscalPeriods&return_module=CompanyFiscalPeriods&return_action=index", $mod_strings['LNK_IMPORT_COMPANYFISCALPERIODS'],"Import");
}
