<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['tenants_deploymentpackages'] = [
    'table'         => 'tenants_deploymentpackages',
    'fields'        => [
        [
            'name' => 'id',
            'type' => 'id',
            'len'  => '36'
        ],
        [
            'name' => 'tenant_id',
            'type' => 'varchar',
            'len'  => '36',
        ],
        [
            'name' => 'deploymentpackage_id',
            'type' => 'varchar',
            'len'  => '36',
        ],
        [
            'name'    => 'status',
            'type'    => 'bool',
            'len'     => '25',
            'default' => '0',
        ],
        [
            'name' => 'date_modified',
            'type' => 'datetime',
        ],
        [
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
