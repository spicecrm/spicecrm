<?php
if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

global $mod_strings, $app_strings, $db;
$dev = false;
$res2 = $db->query("SELECT * FROM kdeploymentsystems WHERE this_system = 1 AND type = 'dev' AND deleted = 0");
while($row2 = $db->fetchByAssoc($res2)) $dev = true;
$master = false;
$res = $db->query("SELECT * FROM kdeploymentsystems WHERE this_system = 1 AND master_flag = 1 AND deleted = 0");
while($row = $db->fetchByAssoc($res)) $master = true;

if (ACLController::checkAccess('KDeploymentSystems', 'landscapemanager', true) && $master) $module_menu[] = Array("index.php?module=KDeploymentSystems&action=landscapeManager", $mod_strings['LNK_LANDSCAPEMANAGER'], "KDeploymentSystems");
if (ACLController::checkAccess('KDeploymentSystems', 'deploymentmanager', true)) $module_menu[] = Array("index.php?module=KDeploymentSystems&action=deploymentManager", $mod_strings['LNK_DEPLOYMENTMANAGER'], "KDeploymentSystems");

if(file_exists('modules/KDeploymentCRs/KDeploymentCR.php')) {
    if (ACLController::checkAccess('KDeploymentCRs', 'edit', true) && $dev) $module_menu[] = Array("index.php?module=KDeploymentCRs&action=manager", $mod_strings['LNK_KDEPLOYMENTCR_MANAGER'], "KDeploymentSystems");
    if (ACLController::checkAccess('KReleasePackages', 'edit', true) && $dev) $module_menu[] = Array("index.php?module=KReleasePackages&action=manager", $mod_strings['LNK_KRELEASEPACKAGE_MANAGER'], "KDeploymentSystems");
}