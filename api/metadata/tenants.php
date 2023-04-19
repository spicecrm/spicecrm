<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/


use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['tenants_deploymentpackages'] = [
    'table'         => 'tenants_deploymentpackages',
    'fields'        => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'len'  => '36'
        ],
        'tenant_id' => [
            'name' => 'tenant_id',
            'type' => 'varchar',
            'len'  => '36',
        ],
        'deploymentpackage_id' => [
            'name' => 'deploymentpackage_id',
            'type' => 'varchar',
            'len'  => '36',
        ],
        'status' => [
            'name'    => 'status',
            'type'    => 'bool',
            'len'     => '25',
            'default' => '0',
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
    'indices'       => [
        [
            'name'   => 'tenants_deploymentpackagespk',
            'type'   => 'primary',
            'fields' => ['id'],
        ],
        [
            'name'   => 'idx_ten_dpk_ten',
            'type'   => 'index',
            'fields' => ['tenant_id'],
        ],
        [
            'name'   => 'idx_ten_dpk_dpk',
            'type'   => 'index',
            'fields' => ['deploymentpackage_id'],
        ],
        [
            'name'   => 'idx_tenant_deploymentpackage',
            'type'   => 'alternate_key',
            'fields' => ['tenant_id','deploymentpackage_id'],
        ],
    ],
    'relationships' => [
        'tenants_deploymentpackages' => [
            'lhs_module'		=> 'Tenants',
            'lhs_table'			=> 'tenants',
            'lhs_key'			=> 'id',
            'rhs_module'		=> 'SystemDeploymentPackages',
            'rhs_table'			=> 'systemdeploymentpackages',
            'rhs_key'			=> 'id',
            'relationship_type'	=> 'many-to-many',
            'join_table'		=> 'tenants_deploymentpackages',
            'join_key_lhs'		=> 'tenant_id',
            'join_key_rhs'		=> 'deploymentpackage_id',
        ],
    ],
];

SpiceDictionaryHandler::getInstance()->dictionary['tenant_auth_users'] = [
    'table'         => 'tenant_auth_users',
    'fields'        => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'tenant_id' => [
            'name' => 'tenant_id',
            'type' => 'varchar',
            'len'  => '36'
        ],
        'username' => [
            'name' => 'username',
            'type' => 'varchar',
            'len'  => 150
        ],
        'user_hash' => [
            'name' => 'user_hash',
            'type' => 'varchar'
        ],
        'login_blocked' => [
            'name' => 'login_blocked',
            'type' => 'bool',
            'default' => '0',
        ],
        'login_blocked_until' => [
            'name' => 'login_blocked_until',
            'type' => 'datetime',
        ]
    ],
    'indices'       => [
        [
            'name'   => 'tenants_users_pk',
            'type'   => 'primary',
            'fields' => ['id'],
        ],
        [
            'name'   => 'idx_tenant_username',
            'type'   => 'index',
            'fields' => ['username']
        ],
    ]
];
