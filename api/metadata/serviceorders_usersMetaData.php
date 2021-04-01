<?php

$dictionary['serviceorders_users'] = [
    'table' => 'serviceorders_users',
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
        'user_role' => [
            'name' => 'user_role',
            'type' => 'enum',
            'options' => 'serviceorder_user_role_dom',
            'len' => '30'
        ],
        'serviceorder_id' => [
            'name' => 'serviceorder_id',
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
    'relationships' => [
        'serviceorders_users' => [
            'lhs_module' => 'ServiceOrders',
            'lhs_table' => 'serviceorders',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'serviceorders_users',
            'join_key_lhs' => 'serviceorder_id',
            'join_key_rhs' => 'user_id'
        ]
    ]
];
