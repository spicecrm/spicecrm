<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
global $dictionary;
$dictionary['contacts_users'] = [
    'table' => 'contacts_users',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'contact_id' => [
            'name' => 'contact_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'external_data' => [
            'name' => 'external_data',
            'type' => 'text'
        ],
        'external_id' => [
            'name' => 'external_id',
            'type' => 'varchar',
            'len'  => 165,
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'default' => '0',
            'required' => false
        ]
    ],
    'indices' => [
        [
            'name' => 'contacts_userspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_con_users_con',
            'type' => 'index',
            'fields' => ['contact_id']
        ],
        [
            'name' => 'idx_con_users_user',
            'type' => 'index',
            'fields' => ['user_id']
        ],
        [
            'name' => 'idx_contacts_users',
            'type' => 'alternate_key',
            'fields' => ['contact_id', 'user_id']
        ],
        [
            'name'   => 'idx_contacts_users_external_id',
            'type'   => 'index',
            'fields' => ['external_id'],
        ]
    ],
    'relationships' => [
        'contacts_users' => [
            'lhs_module' => 'Contacts',
            'lhs_table' => 'contacts',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'contacts_users',
            'join_key_lhs' => 'contact_id',
            'join_key_rhs' => 'user_id'
        ]
    ]
];
