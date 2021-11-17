<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['accounts_users'] = [
    'table' => 'accounts_users',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'account_id' => [
            'name' => 'account_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'user_role' => [
            'name' => 'user_role',
            'type' => 'varchar',
            'len' => '36'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'required' => false,
            'default' => '0'
        ]
    ],
    'indices' => [
        [
            'name' => 'accounts_userspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_account_user',
            'type' => 'alternate_key',
            'fields' => ['account_id', 'user_id']
        ]
    ],
    'relationships' => [
        'accounts_users' => [
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'accounts_users',
            'join_key_lhs' => 'account_id',
            'join_key_rhs' => 'user_id'
        ]
    ]
];
