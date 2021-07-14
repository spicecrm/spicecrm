<?php
$dictionary['syshooks'] = [
    'table' => 'syshooks',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 50
        ],
        'event' => [
            'name' => 'event',
            'type' => 'varchar',
            'len' => 50
        ],
        'hook_index' => [
            'name' => 'hook_index',
            'type' => 'int',
        ],
        'hook_include' => [
            'name' => 'hook_include',
            'type' => 'varchar',
            'len' => 100
        ],
        'hook_class' => [
            'name' => 'hook_class',
            'type' => 'varchar',
            'len' =>  100
        ],
        'hook_method' => [
            'name' => 'hook_method',
            'type' => 'varchar',
            'len' => 50
        ],
        'hook_active' => [
            'name' => 'hook_active',
            'type' => 'bool',
            'default' => 0
        ],
        'description' => [
            'name' => 'description',
            'type' => 'shorttext',
            'len' => 1000
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
            'name' => 'syshookspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_syshooks_module',
            'type' => 'index',
            'fields' => ['module']
        ]
    ]
];

$dictionary['syscustomhooks'] = [
    'table' => 'syscustomhooks',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 50
        ],
        'event' => [
            'name' => 'event',
            'type' => 'varchar',
            'len' => 50
        ],
        'hook_index' => [
            'name' => 'hook_index',
            'type' => 'int',
        ],
        'hook_include' => [
            'name' => 'hook_include',
            'type' => 'varchar',
            'len' => 100
        ],
        'hook_class' => [
            'name' => 'hook_class',
            'type' => 'varchar',
            'len' =>  100
        ],
        'hook_method' => [
            'name' => 'hook_method',
            'type' => 'varchar',
            'len' => 50
        ],
        'hook_active' => [
            'name' => 'hook_active',
            'type' => 'bool',
            'default' => 0
        ],
        'description' => [
            'name' => 'description',
            'type' => 'shorttext',
            'len' => 1000
        ]
    ],
    'indices' => [
        [
            'name' => 'syshookspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_syscustomhooks_module',
            'type' => 'index',
            'fields' => ['module']
        ]
    ]
];
