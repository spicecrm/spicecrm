<?php

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['Resource'] = [
    'table' => 'resources',
    'audited' => true,
    'comments' => 'generic module for Ressoruces like Rooms, shared Equipment etc',
    'fields' => [
        'resource_number' => [
            'name'  => 'resource_number',
            'vname' => 'LBL_RESOURCE_NUMBER',
            'type'  => 'varchar',
            'len'   => 36,
        ],
        'resource_status' => [
            'name'    => 'resource_status',
            'vname'   => 'LBL_RESOURCE_STATUS',
            'type'    => 'enum',
            'options' => 'resource_status_dom',
        ],
        'resource_type' => [
            'name'    => 'resource_type',
            'vname'   => 'LBL_RESOURCE_TYPE',
            'type'    => 'enum',
            'options' => 'resource_type_dom',
        ],
        'costcenter_id' => [
            'name'  => 'costcenter_id',
            'vname' => 'LBL_COSTCENTER_ID',
            'type'  => 'id',
        ],
        'costcenter' => [
            'name'         => 'costcenter',
            'type'         => 'link',
            'module'       => 'CostCenters',
            'relationship' => 'resource_costcenter',
            'source'       => 'non-db',
        ],
    ],
    'indices'         => [],
    'relationships'   => [
        'resource_costcenter' => [
            'lhs_module' => 'CostCenters',
            'lhs_table' => 'costcenters',
            'lhs_key' => 'id',
            'rhs_module' => 'Resources',
            'rhs_table' => 'resources',
            'rhs_key' => 'resource_id',
            'relationship_type' => 'one-to-many'
        ],
    ],
    'optimistic_lock' => true,
];



VardefManager::createVardef('Resources', 'Resource', ['default', 'assignable']);
