<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['meetings_users'] = [
	'table' => 'meetings_users',
	'fields' => [
	    'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len'  => '36',
        ],
        'meeting_id' => [
            'name' => 'meeting_id',
            'type' => 'varchar',
            'len'  => '36',
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'varchar',
            'len'  => '36',
        ],
        'required' => [
            'name'	  => 'required',
            'type'	  => 'varchar',
            'len'	  => '1',
            'default' => '1',
        ],
        'accept_status' => [
            'name'    => 'accept_status',
            'type'    => 'varchar',
            'len'     => '25',
            'default' => 'none',
        ],
        'external_data' => [
            'name' => 'external_data',
            'type' => 'text',
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime',
        ],
        'deleted' => [
            'name'     => 'deleted',
            'type'     => 'bool',
            'len'      => '1',
            'default'  => '0',
            'required' => false,
        ],
    ],
	'indices' => [
		[
		    'name'			=> 'meetings_userspk',
			'type'			=> 'primary',
			'fields'		=> ['id'],
		],
		[
		    'name'			=> 'idx_usr_mtg_mtg',
			'type'			=> 'index',
			'fields'		=> ['meeting_id'],
		],
		[
		    'name'			=> 'idx_usr_mtg_usr',
			'type'			=> 'index',
			'fields'		=> ['user_id'],
		],
		[
		    'name'			=> 'idx_meeting_users',
			'type'			=> 'alternate_key',
			'fields'		=> ['meeting_id', 'user_id'],
		],
	],
	'relationships' => [
		'meetings_users' => [
			'lhs_module'		=> 'Meetings',
			'lhs_table'			=> 'meetings', 
			'lhs_key'			=> 'id',
			'rhs_module'		=> 'Users', 
			'rhs_table'			=> 'users', 
			'rhs_key'			=> 'id',
			'relationship_type'	=> 'many-to-many',
			'join_table'		=> 'meetings_users', 
			'join_key_lhs'		=> 'meeting_id', 
			'join_key_rhs'		=> 'user_id',
		],
        // CR1000356
        'meetings_users_status_accept' => [
            'lhs_module'		=> 'Meetings',
            'lhs_table'			=> 'meetings',
            'lhs_key'			=> 'id',
            'rhs_module'		=> 'Users',
            'rhs_table'			=> 'users',
            'rhs_key'			=> 'id',
            'relationship_type'	=> 'many-to-many',
            'relationship_role_column'	=> 'accept_status',
            'relationship_role_column_value'	=> 'accept',
            'join_table'		=> 'meetings_users',
            'join_key_lhs'		=> 'meeting_id',
            'join_key_rhs'		=> 'user_id'
        ],
        'meetings_users_status_decline' => [
            'lhs_module'		=> 'Meetings',
            'lhs_table'			=> 'meetings',
            'lhs_key'			=> 'id',
            'rhs_module'		=> 'Users',
            'rhs_table'			=> 'users',
            'rhs_key'			=> 'id',
            'relationship_type'	=> 'many-to-many',
            'relationship_role_column'	=> 'accept_status',
            'relationship_role_column_value'	=> 'decline',
            'join_table'		=> 'meetings_users',
            'join_key_lhs'		=> 'meeting_id',
            'join_key_rhs'		=> 'user_id'
        ],
        'meetings_users_status_tentative' => [
            'lhs_module'		=> 'Meetings',
            'lhs_table'			=> 'meetings',
            'lhs_key'			=> 'id',
            'rhs_module'		=> 'Users',
            'rhs_table'			=> 'users',
            'rhs_key'			=> 'id',
            'relationship_type'	=> 'many-to-many',
            'relationship_role_column'	=> 'accept_status',
            'relationship_role_column_value'	=> 'tentative',
            'join_table'		=> 'meetings_users',
            'join_key_lhs'		=> 'meeting_id',
            'join_key_rhs'		=> 'user_id'
        ],
	],
];
