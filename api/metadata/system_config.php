<?php

$dictionary['Administration'] = [
    'table' => 'config',
    'comment' => 'System table containing system-wide definitions',
    'fields' => [
        'category' =>
            [
                'name' => 'category',
                'vname' => 'LBL_LIST_SYMBOL',
                'type' => 'varchar',
                'len' => '100',
                'comment' => 'Settings are grouped under this category; arbitraily defined based on requirements'
            ],
        'name' =>
            [
                'name' => 'name',
                'vname' => 'LBL_LIST_NAME',
                'type' => 'varchar',
                'len' => '100',
                'comment' => 'The name given to the setting'
            ],
        'value' =>
            [
                'name' => 'value',
                'vname' => 'LBL_LIST_RATE',
                'type' => 'longtext',
                'comment' => 'The value given to the setting'
            ],

    ], 'indices' => [['name' => 'idx_config_cat', 'type' => 'index', 'fields' => ['category']],]
];
