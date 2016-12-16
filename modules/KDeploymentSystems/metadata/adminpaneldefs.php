<?php
global $db;
$master = false;
$res = $db->query("SELECT * FROM kdeploymentsystems WHERE this_system = 1 AND master_flag = 1 AND deleted = 0");
while($row = $db->fetchByAssoc($res)) $master = true;

$systems = false;
$res3 = $db->query("SELECT * FROM kdeploymentsystems WHERE deleted = 0");
while($row3 = $db->fetchByAssoc($res3)) $systems = true;

$dev = false;
$res2 = $db->query("SELECT * FROM kdeploymentsystems WHERE this_system = 1 AND type = 'dev' AND deleted = 0");
while($row2 = $db->fetchByAssoc($res2)) $dev = true;

$links = array();
if($master || !$systems) {
    $links['KDeployment']['landscapemanager'] = array(
        'KDeploymentSystems',
        'LBL_KDEPLOYMENT_LANDSCAPE',
        'LBL_KDEPLOYMENT_LANDSCAPE_DESCRIPTION',
        'index.php?module=KDeploymentSystems&action=LandscapeManager',
    );
}
$links['KDeployment']['deploymentmanager'] = array(
    'ModuleLoader',
    'LBL_KDEPLOYMENT_DEPLOYMENTMANAGER',
    'LBL_KDEPLOYMENT_DEPLOYMENTMANAGER_DESCRIPTION',
    'index.php?module=KDeploymentSystems&action=DeploymentManager',
);
if($dev && file_exists('modules/KDeploymentCRs/KDeploymentCR.php')) {
    $links['KDeployment']['kreleasepackages'] = array(
        'KReleasePackages',
        'LBL_KDEPLOYMENT_KRELEASEPACKAGES',
        'LBL_KDEPLOYMENT_KRELEASEPACKAGES_DESCRIPTION',
        'index.php?module=KReleasePackages&action=manager',
    );
    $links['KDeployment']['kchangerequests'] = array(
        'Repair',
        'LBL_KDEPLOYMENT_KCHANGEREQUESTS',
        'LBL_KDEPLOYMENT_KCHANGEREQUESTS_DESCRIPTION',
        'index.php?module=KDeploymentCRs&action=manager',
    );
}
$links['KDeployment']['maintenancewindows'] = array(
    'Schedulers',
    'LBL_KDEPLOYMENT_MAINTENANCEWINDOWS',
    'LBL_KDEPLOYMENT_MAINTENANCEWINDOWS_DESCRIPTION',
    'index.php?module=KDeploymentMWs',
);
$admin_group_header [] = array(
    'Deployment Management',
    '',
    false,
    $links,
    'Manage Enterprise Level Deployments with the Deployment Manager in the defined System Landscape'
);
