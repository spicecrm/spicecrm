<?php

//dictionary global variable => class name als key
use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['CostCenter'] = [
    'table' => 'costcenters',
    'comment' => 'Cost Center Module',
    'audited' =>  true,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

    'fields' => [
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => '100',
            'vname' => 'LBL_NAME',
        ],
        'costcenter_number' => [
            'name' => 'costcenter_number',
            'type' => 'varchar',
            'len' => '255',
            'vname' => 'LBL_COSTCENTER_NUMBER',
            'comment' => ''
        ],
        'costcenter_status' => [
            'name' => 'costcenter_status',
            'type' => 'enum',
            'options' => 'costcenter_status_dom',
            'len' => '10',
            'vname' => 'LBL_STATUS'
        ],
        'users' => [
            'name' => 'users',
            'type' => 'link',
            'relationship' => 'costcenter_users',
            'rname' => 'user_name',
            'source' => 'non-db',
            'module' => 'Users'
        ],
        'resources' => [
            'name'         => 'resources',
            'type'         => 'link',
            'module'       => 'Resources',
            'relationship' => 'resource_costcenter',
            'source'       => 'non-db',
        ],
    ],
    'relationships' => [

    ],

    'indices' => [
    ],
];
// default (Basic) fields & assignable (implements->assigned fields)
VardefManager::createVardef('CostCenters', 'CostCenter', ['default', 'assignable']);


