<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Dashboard'] = [
    'table' => 'dashboards',
    'audited' => true,
    'fields' =>
        [
            'global' => [
                'name' => 'global',
                'type' => 'bool',
                'vname' => 'LBL_GLOBAL',
                'default' => 0
            ],
            'dashboardcomponents' =>  [
                'name' => 'dashboardcomponents',
                'type' => 'link',
                'relationship' => 'dashboard_dashboardcomponents',
                'module' => 'DashboardComponents',
                'bean_name' => 'DashboardComponent',
                'source' => 'non-db',
                'vname' => 'LBL_DASHBOARDCOMPONENTS',
            ],
            'components' => [
                'name' => 'components',
                'type' => 'json',
                'vname' => 'LBL_COMPONENTS',
                'source' => 'non-db'
            ],
            'dashboardsets_dashboard_sequence' => [
                'name' => 'dashboardsets_dashboard_sequence',
                'vname' => 'LBL_SEQUENCE',
                'type' => 'integer',
                'source' => 'non-db'
            ],
            'dashboardsets' => [
                'name' => 'dashboardsets',
                'type' => 'link',
                'relationship' => 'dashboards_dashboardsets',
                'module' => 'DashboardSets',
                'source' => 'non-db',
                'vname' => 'LBL_DASHBOARDSETS',
                'rel_fields' => [
                    'dashboard_sequence' => [
                        'map' => 'dashboardsets_dashboard_sequence'
                    ]
                ]
            ],
        ],
    'relationships' => [
        'dashboard_dashboardcomponents' => [
            'lhs_module' => 'Dashboards',
            'lhs_table' => 'dashboards',
            'lhs_key' => 'id',
            'rhs_module' => 'DashboardComponents',
            'rhs_table' => 'dashboardcomponents',
            'rhs_key' => 'dashboard_id',
            'relationship_type' => 'one-to-many']

    ],

    //This enables optimistic locking for Saves From EditView
    'optimistic_locking' => true,
];

VardefManager::createVardef('Dashboards', 'Dashboard', ['default', 'assignable']);
