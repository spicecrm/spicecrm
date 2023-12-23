<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['DashboardComponent'] = [
    'table' => 'dashboardcomponents',
    'fields' =>
        [
            'dashboard_id' => [
                'name' => 'dashboard_id',
                'type' => 'id'
            ],
            'dashlet_id' => [
                'name' => 'dashlet_id',
                'type' => 'varchar',
                'len' => 36
            ],
            'component' => [
                'name' => 'component',
                'type' => 'varchar',
                'len' => 100
            ],
            'componentconfig' => [
                'name' => 'componentconfig',
                'type' => 'text'
            ],
            'position' => [
                'name' => 'position',
                'type' => 'text'
            ]
        ],
    'indices' => [
        ['name' => 'idx_dashboardcomponents_dashboid', 'type' => 'index', 'fields' => ['dashboard_id']],
        ['name' => 'idx_dashboardcomponents_dashleid', 'type' => 'index', 'fields' => ['dashlet_id']],
    ]
];

VardefManager::createVardef('DashboardComponents', 'DashboardComponent', ['default']);
