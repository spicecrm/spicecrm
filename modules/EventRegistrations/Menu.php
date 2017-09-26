<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

global $mod_strings, $app_strings, $sugar_config;
$module_menu = Array();
if(ACLController::checkAccess('EventRegistrations','edit',true)){
    $module_menu[]=	Array("index.php?module=EventRegistrations&action=EditView&return_module=EventRegistrations&return_action=DetailView", $mod_strings['LNK_NEW_EVENTREGISTRATION'],"CreateEventRegistrations");
}
if(ACLController::checkAccess('EventRegistrations','list',true)){
    $module_menu[]=	Array("index.php?module=EventRegistrations&action=index&return_module=EventRegistrations&return_action=DetailView", $mod_strings['LNK_EVENTREGISTRATION_LIST'],"EventRegistrations");
}
if(ACLController::checkAccess('EventRegistrations','import',true)){
    $module_menu[]=  Array("index.php?module=Import&action=Step1&import_module=EventRegistrations&return_module=EventRegistrations&return_action=index", $mod_strings['LNK_IMPORT_EVENTREGISTRATIONS'],"Import");
}
