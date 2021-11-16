<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\SugarObjects\VardefManager;

$GLOBALS['dictionary']['UserAccessLog'] = [
    'table' => 'useraccesslogs',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool'
        ],
        'ipaddress' => [
            'name' => 'ipaddress',
            'type' => 'varchar',
            'len' => 15
        ],
        'action' => [
            'name' => 'action',
            'type' => 'varchar',
            'len' => 30
        ],
        'impersonating_user_id' => [
            'name' => 'impersonating_user_id',
            'vname' => 'LBL_IMPERSONATING_USER_ID',
            'type' => 'id',
            'comment' => 'In case of an impersonation login the ID of the impersonating user.'
        ],
        'user' => [
            'name' => 'user',
            'type' => 'link',
            'relationship' => 'users_useraccesslogs',
            'source' => 'non-db',
            'vname' => 'LBL_USER',
        ],
        'impersonating_user' => [
            'name' => 'impersonating_user',
            'type' => 'link',
            'relationship' => 'users_useraccesslogs_impersonation',
            'source' => 'non-db',
            'vname' => 'LBL_IMPERSONATING_USER',
            'comment' => 'In case of an impersonation login the impersonating user.'
        ],
        'login_name' => [
            'name' => 'login_name',
            'type' => 'varchar',
            'len' => 255
        ],
    ],
    'relationships' => [
        'users_useraccesslogs' =>
            [
                'lhs_module' => 'Users',
                'lhs_table' => 'users',
                'lhs_key' => 'id',
                'rhs_module' => 'UserAccessLogs',
                'rhs_table' => 'useraccesslogs',
                'rhs_key' => 'assigned_user_id',
                'relationship_type' => 'one-to-many'
            ],
        'users_useraccesslogs_impersonation' =>
            [
                'lhs_module' => 'Users',
                'lhs_table' => 'users',
                'lhs_key' => 'id',
                'rhs_module' => 'UserAccessLogs',
                'rhs_table' => 'useraccesslogs',
                'rhs_key' => 'impersonating_user_id',
                'relationship_type' => 'one-to-many'
            ]
    ],
    'indices' => [
        [
            'name' => 'idx_useraccesslogsusername',
            'type' => 'index',
            'fields' => ['login_name']
        ]
    ]
];

VardefManager::createVardef('UserAccessLogs', 'UserAccessLog');
