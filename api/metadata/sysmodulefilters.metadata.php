<?php

$dictionary['sysmodulefilters'] = [
    'table' => 'sysmodulefilters',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'created_by_id' => [
            'name' => 'created_by_id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'filterdefs' => [
            'name' => 'filterdefs',
            'type' => 'shorttext',
            'len' => 2000
        ],
        'filtermethod' => [
            'name' => 'filtermethod',
            'type' => 'varchar',
            'len' => 255
        ],
        'version' => [
            'name' => 'version',
            'type' => 'varchar',
            'len' => 16
        ],
        'package' => [
            'name' => 'package',
            'type' => 'varchar',
            'len' => 32
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_sysmodulefilters',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['syscustommodulefilters'] = [
    'table' => 'syscustommodulefilters',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'created_by_id' => [
            'name' => 'created_by_id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 100
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'filterdefs' => [
            'name' => 'filterdefs',
            'type' => 'shorttext',
            'len' => 2000
        ],
        'filtermethod' => [
            'name' => 'filtermethod',
            'type' => 'varchar',
            'len' => 255
        ],
        'version' => [
            'name' => 'version',
            'type' => 'varchar',
            'len' => 16
        ],
        'package' => [
            'name' => 'package',
            'type' => 'varchar',
            'len' => 32
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_syscustommodulefilters',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

