<?php
$dictionary['users_qualifications'] = [
    'table' => 'users_qualifications',
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
        'qualification_id' => [
            'name' => 'qualification_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'qualification_start_date' => [
            'name' => 'qualification_start_date',
            'type' => 'date',
        ],
        'qualification_end_date' => [
            'name' => 'qualification_end_date',
            'type' => 'date',
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0
        ]
    ],
    'indices' => [
        'users_qualifications_pk' => [
            'name' => 'users_qualifications_pk',
            'type' => 'primary',
            'fields' => array('id')
        ]
    ],
    'relationships' => [
        'users_qualifications' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'Qualifications',
            'rhs_table' => 'qualifications',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'users_qualifications',
            'join_key_lhs' => 'user_id',
            'join_key_rhs' => 'qualification_id'
        ]
    ]
];
