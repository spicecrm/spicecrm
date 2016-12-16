<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

global $mod_strings;

$popupMeta = array(
	'moduleMain' => 'TRSystems',
	'varName' => 'TRSYSTEMS',
	'orderBy' => 'name',
	'whereClauses' => array(
		'name' => 'trsystems.name',
	),
	'searchInputs' => array('name'),
	'listviewdefs' => array(
		'NAME' => array(
			'width' => '20%', 
			'label' => 'LBL_NAME', 
			'link' => true,	
			'default' => true,								        
		),
		'ACCOUNT_NAME' => array(
				'width' => '20%',
				'label' => 'LBL_LIST_ACCOUNT_NAME',
				'module' => 'Accounts',
				'id' => 'ACCOUNT_ID',
				'link' => true,
				'contextMenu' => array('objectType' => 'sugarAccount',
						'metaData' => array('return_module' => 'Contacts',
						'return_action' => 'ListView',
						'module' => 'Accounts',
						'return_action' => 'ListView',
						'parent_id' => '{$ACCOUNT_ID}',
						'parent_name' => '{$ACCOUNT_NAME}',
						'account_id' => '{$ACCOUNT_ID}',
						'account_name' => '{$ACCOUNT_NAME}'),
			),
			'default' => true,
			'sortable'=> true,
			'ACLTag' => 'ACCOUNT',
			'related_fields' => array('account_id')
		),			
		'SUGAR_EDITION' => array (
			'width' 	=> '8%',
			'label' 	=> 'LBL_LIST_SUGAR_EDITION',
			'link'  	=> false,
			'default'   => true,
		),		
		'SYSTEM_TYPE' => array (
			'width' 	=> '10%',
			'label' 	=> 'LBL_LIST_SYSTEM_TYPE',
			'link'  	=> false,
			'default'   => true,
		),
		'SERVER_STATUS' => array (
			'width' 	=> '8%',
			'label' 	=> 'LBL_LIST_SERVER_STATUS',
			'link'  	=> false,
			'default'   => true,
		),						
		'ASSIGNED_USER_NAME' => array(
	        'width' => '2', 
	        'label' => 'LBL_LIST_ASSIGNED_USER',
	        'default' => true,
		),
	),
	'searchdefs'   => array(
	 	'name',
		'account_name',
		'system_type',
		'sugar_edition',
		'server_status',
		array('name' => 'assigned_user_id','label'=>'LBL_ASSIGNED_TO','type' => 'enum','function' => array('name' => 'get_user_array', 'params' => array(false))),
	)
);
?>
