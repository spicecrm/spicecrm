<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['calls_users'] = [
    'table' => 'calls_users',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'call_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'user_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'required', 'type' => 'varchar', 'len' => '1', 'default' => '1'],
        ['name' => 'accept_status', 'type' => 'varchar', 'len' => '25', 'default' => 'none'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false]
    ],
    'indices' => [
        ['name' => 'calls_userspk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'idx_usr_call_call', 'type' => 'index', 'fields' => ['call_id']],
        ['name' => 'idx_usr_call_usr', 'type' => 'index', 'fields' => ['user_id']],
        ['name' => 'idx_call_users', 'type' => 'alternate_key', 'fields' => ['call_id', 'user_id']]
    ],
    'relationships' => [
        'calls_users' => [
            'lhs_module' => 'Calls',
            'lhs_table' => 'calls',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'calls_users',
            'join_key_lhs' => 'call_id',
            'join_key_rhs' => 'user_id',
        ],
        // CR1000356
        'calls_users_status_accept' => [
            'lhs_module'		=> 'Calls',
            'lhs_table'			=> 'calls',
            'lhs_key'			=> 'id',
            'rhs_module'		=> 'Users',
            'rhs_table'			=> 'users',
            'rhs_key'			=> 'id',
            'relationship_type'	=> 'many-to-many',
            'relationship_role_column'	=> 'accept_status',
            'relationship_role_column_value'	=> 'accept',
            'join_table'		=> 'calls_users',
            'join_key_lhs'		=> 'call_id',
            'join_key_rhs'		=> 'user_id'
        ],
        'calls_users_status_decline' => [
            'lhs_module'		=> 'Calls',
            'lhs_table'			=> 'calls',
            'lhs_key'			=> 'id',
            'rhs_module'		=> 'Users',
            'rhs_table'			=> 'users',
            'rhs_key'			=> 'id',
            'relationship_type'	=> 'many-to-many',
            'relationship_role_column'	=> 'accept_status',
            'relationship_role_column_value'	=> 'decline',
            'join_table'		=> 'calls_users',
            'join_key_lhs'		=> 'call_id',
            'join_key_rhs'		=> 'user_id'
        ],
        'calls_users_status_tentative' => [
            'lhs_module'		=> 'Calls',
            'lhs_table'			=> 'calls',
            'lhs_key'			=> 'id',
            'rhs_module'		=> 'Users',
            'rhs_table'			=> 'users',
            'rhs_key'			=> 'id',
            'relationship_type'	=> 'many-to-many',
            'relationship_role_column'	=> 'accept_status',
            'relationship_role_column_value'	=> 'tentative',
            'join_table'		=> 'calls_users',
            'join_key_lhs'		=> 'call_id',
            'join_key_rhs'		=> 'user_id'
        ],
    ],
];
?>
