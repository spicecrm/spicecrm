<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
* 
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
********************************************************************************/
global $db;
$dev = false;
$res2 = $db->query("SELECT * FROM kdeploymentsystems WHERE this_system = 1 AND type = 'dev' AND deleted = 0");
while($row2 = $db->fetchByAssoc($res2)) $dev = true;
if (ACLController::checkAccess('KDeploymentCRs', 'edit', true) && $dev) $module_menu[] = Array("index.php?module=KDeploymentCRs&action=manager", $mod_strings['LNK_KDEPLOYMENTCR_MANAGER'], "Administration");
if (ACLController::checkAccess('KReleasePackages', 'edit', true) && $dev)$module_menu[]=Array("index.php?module=KReleasePackages&action=manager", $mod_strings['LNK_KRELEASEPACKAGE_MANAGER'],"Administration");
if (ACLController::checkAccess('KDeploymentSystems', 'deploymentmanager', true)) $module_menu[] = Array("index.php?module=KDeploymentSystems&action=deploymentManager", $mod_strings['LNK_DEPLOYMENTMANAGER'], "Administration");
if (ACLController::checkAccess('KDeploymentMWs', 'edit', true))$module_menu[]=Array("index.php?module=KDeploymentMWs", $mod_strings['LNK_KDEPLOYMENTMWS'],"Administration");

