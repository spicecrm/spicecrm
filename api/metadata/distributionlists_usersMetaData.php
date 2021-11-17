<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

$dictionary['distributionlists_users'] = [
    'table' => 'distributionlists_users',
    'fields' => [
        ['name' => 'id', 'type' => 'char', 'len' => '36'],
        ['name' => 'distributionlist_id', 'type' => 'char', 'len' => '36'],
        ['name' => 'user_id', 'type' => 'char', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false]
    ],
    'indices' => [
        ['name' => 'distributionlists_userspk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'idx_distributionlists_users', 'type' => 'alternate_key', 'fields' => ['distributionlist_id', 'user_id']],
        ['name' => 'idx_distributionlists_users_listid', 'type' => 'index', 'fields' => ['distributionlist_id']],
        ['name' => 'idx_distributionlists_users_userid', 'type' => 'index', 'fields' => ['user_id']],
    ],
    'relationships' => [
        'distributionlists_users' => [
            'lhs_module' => 'DistributionLists',
            'lhs_table' => 'distributionlists',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'distributionlists_users',
            'join_key_lhs' => 'distributionlist_id',
            'join_key_rhs' => 'user_id',
        ],
    ],
];
