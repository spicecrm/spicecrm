<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

$listViewDefs['CampaignTasks'] = array(
    'NAME' => array(
        'width' => '30',
        'label' => 'LBL_NAME',
        'link' => true,
        'default' => true
	),
    'ASSIGNED_USER_NAME' => array(
        'width' => '5',
        'label' => 'LBL_LIST_ASSIGNED_USER',
        'module' => 'Employees',
        'id' => 'ASSIGNED_USER_ID',
        'default' => true
	),
    'CREATED_BY_NAME' => array(
        'width' => '10',
        'label' => 'LBL_CREATED',
        'default' => false
	),
    'MODIFIED_BY_NAME' => array(
        'width' => '5',
        'label' => 'LBL_MODIFIED',
        'default' => true
	),
    'DATE_MODIFIED' => array(
        'width' => '10',
        'label' => 'LBL_DATE_MODIFIED',
        'default' => true
	),
    'DATE_ENTERED' => array(
        'width' => '10',
        'label' => 'LBL_DATE_ENTERED',
        'default' => false
	)
);
