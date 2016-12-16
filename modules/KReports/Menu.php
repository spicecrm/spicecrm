<?php
/* * *******************************************************************************
* This file is part of KReporter. KReporter is an enhancement developed
* by aac services k.s.. All rights are (c) 2016 by aac services k.s.
*
* This Version of the KReporter is licensed software and may only be used in
* alignment with the License Agreement received with this Software.
* This Software is copyrighted and may not be further distributed without
* witten consent of aac services k.s.
*
* You can contact us at info@kreporter.org
******************************************************************************* */




if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

global $mod_strings,$app_strings;
if(ACLController::checkAccess('KReports', 'edit', true))$module_menu[]=Array("index.php?module=KReports&action=EditView&return_module=KReports&return_action=DetailView", $mod_strings['LNK_NEW_REPORT'],"CreateReport");
if(ACLController::checkAccess('KReports', 'list', true))$module_menu[]=Array("index.php?module=KReports&action=index&return_module=KReports&return_action=DetailView", $mod_strings['LNK_REPORT_LIST'],"Reports");

if(ACLController::checkAccess('KReports', 'edit', true) && file_exists('modules/KReports/views/view.bucketmanager.php'))
    $module_menu[]=Array("index.php?module=KReports&action=BucketmanagerView", $mod_strings['LNK_MANAGE_BUCKETS'],"ManageBuckets");
if(ACLController::checkAccess('KReports', 'edit', true) && file_exists('modules/KReports/views/view.dlistmanager.php'))
    $module_menu[]=Array("index.php?module=KReports&action=DListManagerView", $mod_strings['LNK_MANAGE_DLISTS'],"ManageDLists");


