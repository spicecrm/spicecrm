<?php


use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['DashboardSet'] = [
    'table' => 'dashboardsets',
    'comment' => 'DashboardSets Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

	'fields' => [
        'dashboardsets_dashboard_sequence' => [
            'name' => 'dashboardsets_dashboard_sequence',
            'vname' => 'LBL_SEQUENCE',
            'type' => 'integer',
            'source' => 'non-db'
        ],
        'dashboards' => [
            'name' => 'dashboards',
            'type' => 'link',
            'relationship' => 'dashboards_dashboardsets',
            'module' => 'Dashboards',
            'source' => 'non-db',
            'vname' => 'LBL_DASHBOARDS',
            'rel_fields' => [
                'dashboard_sequence' => [
                    'map' => 'dashboardsets_dashboard_sequence'
                ]
            ]
        ],
    ],
	'relationships' => [
    ],
	'indices' => [
    ]
];

VardefManager::createVardef('DashboardSets', 'DashboardSet', ['default', 'assignable']);
