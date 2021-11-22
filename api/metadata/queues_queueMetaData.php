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

global $dictionary;
$dictionary['queues_queue'] = ['table' => 'queues_queue',
	'fields' => [
		'id' => [
			'name' => 'id',
			'vname' => 'LBL_QUEUES_QUEUE_ID',
			'type' => 'id',
			'required' => true,
			'reportable' => false,
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
		'parent_id' => [
			'name' => 'parent_id',
			'vname' => 'LBL_PARENT_ID',
			'type' => 'id',
			'required' => true,
			'reportable'=>false,
        ],
    ],
	'indices' => [
		[
			'name' => 'queues_queuepk',
			'type' =>'primary',
			'fields' => [
				'id'
            ]
        ],
		[
			'name' => 'idx_queue_child_id',
			'type' => 'index',
			'fields' => [
				'queue_id'
            ]
        ],
		[
		'name' =>'idx_parent_id',
		'type'=>'index',
		'fields' => [
			'parent_id'
        ]
        ],
		[
		'name' => 'compidx_queue_id_parent_id',
		'type' => 'alternate_key',
		'fields' => [
			'queue_id',
			'parent_id'
        ],
        ],
    ], /* end indices */
	'relationships' => [
		'child_queues_rel'	=> [
			'lhs_module'		=> 'Queues',
			'lhs_table'			=> 'queues',
			'lhs_key'			=> 'id',
			'rhs_module'		=> 'Queues',
			'rhs_table'			=> 'queues',
			'rhs_key'			=> 'id',
			'relationship_type' => 'many-to-many',
			'join_table'		=> 'queues_queue', 
			'join_key_lhs'		=> 'queue_id', 
			'join_key_rhs'		=> 'parent_id'
        ],
		'parent_queues_rel' => [
			'lhs_module'		=> 'Queues',
			'lhs_table'			=> 'queues',
			'lhs_key' 			=> 'id',
			'rhs_module'		=> 'Queues',
			'rhs_table'			=> 'queues',
			'rhs_key' 			=> 'id',
			'relationship_type' => 'many-to-many',
			'join_table'		=> 'queues_queue', 
			'join_key_rhs'		=> 'queue_id', 
			'join_key_lhs'		=> 'parent_id'
        ],
    ], /* end relationships */
];

?>
