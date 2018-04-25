<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

global $mod_strings, $app_strings, $sugar_config;
$module_menu = Array();
if(ACLController::checkAccess('CampaignTasks','edit',true)){
    $module_menu[]=	Array("index.php?module=CampaignTasks&action=EditView&return_module=CampaignTasks&return_action=DetailView", $mod_strings['LNK_NEW_CAMPAIGNTASK'],"CreateCampaignTasks");
}
if(ACLController::checkAccess('CampaignTasks','list',true)){
    $module_menu[]=	Array("index.php?module=CampaignTasks&action=index&return_module=CampaignTasks&return_action=DetailView", $mod_strings['LNK_CAMPAIGNTASK_LIST'],"CampaignTasks");
}
if(ACLController::checkAccess('CampaignTasks','import',true)){
    $module_menu[]=  Array("index.php?module=Import&action=Step1&import_module=CampaignTasks&return_module=CampaignTasks&return_action=index", $mod_strings['LNK_IMPORT_CAMPAIGNTASKS'],"Import");
}
