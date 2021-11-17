<?php

$dictionary['ipaddresses'] = [
    'table' => 'ipaddresses',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'address' => [
            'name' => 'address',
            'type' => 'char',
            'len' => 15,
            'required' => true
        ],
        'color' => [
            'name' => 'color',
            'type' => 'char',
            'len' => 1,
            'required' => true
        ],
        'description' => [
            'name' => 'description',
            'type' => 'varchar',
            'len' => 255
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'type' => 'datetime',
            'required' => true
        ],
        'created_by' => [
            'name' => 'created_by',
            'type' => 'id',
        ],
        'date_deleted' => [
            'name' => 'date_deleted',
            'type' => 'datetime',
        ],
        'deleted_by' => [
            'name' => 'deleted_by',
            'type' => 'id',
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_ipaddresses_pk',
            'type' => 'primary',
            'fields' => ['id'],
        ],
        [
            'name' => 'idx_ipaddresses_address',
            'type' => 'index',
            'fields' => ['address']
        ],
        [
            'name' => 'idx_ipaddresses_color',
            'type' => 'index',
            'fields' => ['color']
        ]
    ]
];
