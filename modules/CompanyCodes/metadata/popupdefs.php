<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

global $mod_strings;

$popupMeta = array(
	'moduleMain' => 'CompanyCodes',
	'varName' => 'COMPANYCODES',
	'orderBy' => 'name',
	'whereClauses' => array(
		'name' => 'companycodes.name',
	),
	'searchInputs' => array('name'),
	'listviewdefs' => array(
		'NAME' => array(
			'width' => '20%', 
			'label' => 'LBL_NAME', 
			'link' => true,	
			'default' => true,								        
		),
		'ASSIGNED_USER_NAME' => array(
	        'width' => '2', 
	        'label' => 'LBL_LIST_ASSIGNED_USER',
	        'default' => true,
		),
	),
	'searchdefs'   => array(
	 	'name',
		array('name' => 'assigned_user_id','label'=>'LBL_ASSIGNED_TO','type' => 'enum','function' => array('name' => 'get_user_array', 'params' => array(false))),
	)
);

