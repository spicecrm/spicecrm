<?php
$dictionary['systrashcan'] = [
    'table' => 'systrashcan',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'transactionid' => [
            'name' => 'transactionid',
            'type' => 'id'
        ],
        'date_deleted' => [
            'name' => 'date_deleted',
            'type' => 'datetime'
        ],
        'user_deleted' => [
            'name' => 'user_deleted',
            'type' => 'id'
        ],
        'recordtype' => [
            'name' => 'recordtype',
            'type' => 'varchar',
            'len' => 100
        ],
        'recordmodule' => [
            'name' => 'recordmodule',
            'type' => 'varchar',
            'len' => 100
        ],
        'recordid' => [
            'name' => 'recordid',
            'type' => 'varchar',
            'len' => 36
        ],
        'recordname' => [
            'name' => 'recordname',
            'type' => 'varchar',
            'len' => 255
        ],
        'linkname' => [
            'name' => 'linkname',
            'type' => 'varchar',
            'len' => 100
        ],
        'linkmodule' => [
            'name' => 'linkmodule',
            'type' => 'varchar',
            'len' => 100
        ],
        'linkid' => [
            'name' => 'linkid',
            'type' => 'varchar',
            'len' => 36
        ],
        'recorddata' => [
            'name' => 'recorddata',
            'type' => 'text'
        ],
        'recovered' => [
            'name' => 'recovered',
            'type' => 'bool',
            'default' => 0
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_systrashcan',
            'type' => 'index',
            'fields' => ['id']]
    ]
];

