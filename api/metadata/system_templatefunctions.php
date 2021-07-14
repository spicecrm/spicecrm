<?php
$dictionary['systemplatefunctions'] = [
    'table' => 'systemplatefunctions',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'method' => [
            'name' => 'method',
            'type' => 'varchar',
            'len' => 150
        ],
        'no_pipe' => [
            'name' => 'no_pipe',
            'type' => 'bool',
            'default' => '0'
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
            'name' => 'idx_systemplatefunctions',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

$dictionary['syscustomtemplatefunctions'] = [
    'table' => 'syscustomtemplatefunctions',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'method' => [
            'name' => 'method',
            'type' => 'varchar',
            'len' => 150
        ],
        'no_pipe' => [
            'name' => 'no_pipe',
            'type' => 'bool',
            'default' => '0'
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
            'name' => 'idx_syscustomtemplatefunctions',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];
