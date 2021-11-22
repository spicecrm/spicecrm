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

$dictionary['queues_beans'] = ['table' => 'queues_beans',
	'fields' => [
		'id' => [
			'name' => 'id',
			'vname' => 'LBL_ID',
			'type' => 'id',
			'required' => true,
			'reportable'=>false,
        ],
		'deleted' => [
			'name' => 'deleted',
			'vname' => 'LBL_DELETED',
			'type' => 'bool',
			'required' => true,
			'default' => '0',
			'reportable'=>false,
        ],
		'date_entered' => [
			'name' => 'date_entered',
			'vname' => 'LBL_DATE_ENTERED',
			'type' => 'datetime',
			'required' => true,
        ],
		'date_modified' => [
			'name' => 'date_modified',
			'vname' => 'LBL_DATE_MODIFIED',
			'type' => 'datetime',
			'required' => true,
        ],
		'queue_id' => [
			'name' => 'queue_id',
			'vname' => 'LBL_QUEUE_ID',
			'type' => 'id',
			'required' => true,
			'reportable'=>false,
        ],
		'module_dir' => [
			'name' => 'module_dir',
			'vname' => 'LBL_MODULE_DIR',
			'type' => 'varchar',
			'len'	=> '30',
			'required' => true,
			'reportable'=>false,
        ],
		'object_id' => [
			'name' => 'object_id',
			'vname' => 'LBL_OBJECT_ID',
			'type' => 'id',
			'required' => true,
			'reportable'=>false,
        ],
    ],
	'relationships' => [
		'queues_emails_rel' => [
			'lhs_module'					=> 'Queues',
			'lhs_table'						=> 'queues',
			'lhs_key' 						=> 'id',
			'rhs_module'					=> 'Emails',
			'rhs_table'						=> 'emails',
			'rhs_key' 						=> 'id',
			'relationship_type' 			=> 'many-to-many',
			'join_table'					=> 'queues_beans', 
			'join_key_rhs'					=> 'object_id', 
			'join_key_lhs'					=> 'queue_id',
			'relationship_role_column'		=> 'module_dir',
			'relationship_role_column_value'=> 'Emails'
        ],
    ], /* end relationship definitions */
	'indices' => [
		[
			'name' => 'queues_itemspk',
			'type' =>'primary',
			'fields' => [
				'id'
            ]
        ],
		[
		'name' =>'idx_queue_id',
		'type'=>'index',
		'fields' => [
			'queue_id'
        ]
        ],
		[
		'name' =>'idx_object_id',
		'type'=>'index',
		'fields' => [
			'object_id'
        ]
        ],
    ], /* end indices */
];

?>
