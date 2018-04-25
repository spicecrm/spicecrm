<?php
if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
$module_name = 'KDeploymentMWs';
$listViewDefs[$module_name] = array(
    'NAME' => array(
        'width' => '32',
        'label' => 'LBL_NAME',
        'default' => true,
        'link' => true
    ),
    'FROM_DATE' => array(
        'width' => '32',
        'label' => 'LBL_FROM_DATE',
        'default' => true,
        'link' => false
    ),
    'TO_DATE' => array(
        'width' => '32',
        'label' => 'LBL_TO_DATE',
        'default' => true,
        'link' => false
    ),
    'ASSIGNED_USER_NAME' => array(
        'width' => '9',
        'label' => 'LBL_ASSIGNED_TO',
        'module' => 'Employees',
        'id' => 'ASSIGNED_USER_ID',
        'default' => true
    ),
);