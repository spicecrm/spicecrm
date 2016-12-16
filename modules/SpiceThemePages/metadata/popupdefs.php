<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
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
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

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
