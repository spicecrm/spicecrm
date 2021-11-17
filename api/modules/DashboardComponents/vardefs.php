<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['DashboardComponent'] = [
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
        ]
];


VardefManager::createVardef('DashboardComponents', 'DashboardComponent', ['default']);

