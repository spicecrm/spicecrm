<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

$listViewDefs['EventRegistrations'] = array(
//    'NAME' => array(
//        'width' => '30',
//        'label' => 'LBL_NAME',
//        'link' => true,
//        'default' => true
//	),
    'CAMPAIGN_NAME' => array(
        'width' => '10%',
        'label' => 'LBL_CAMPAIGN_NAME',
        'module' => 'Campaigns',
        'id' => 'CAMPAIGN_ID',
        'default' => true
    ),
    'CONTACT_NAME' => array(
        'width' => '10%',
        'label' => 'LBL_CONTACT_NAME',
        'module' => 'Contacts',
        'id' => 'CONTACT_ID',
        'default' => true
    ),
    'REGISTRATION_STATUS' => array(
        'width' => '10%',
        'label' => 'LBL_REGISTRATION_STATUS',
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
