<?php
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['sysipclients'] = [
    'table' => 'sysipclients',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 255
        ],
        'address' => [
            'name' => 'address',
            'type' => 'char',
            'len' => 15,
            'required' => true
        ],
        'address_range_end' => [
            'name' => 'address_range_end',
            'type' => 'char',
            'len' => 15
        ],
        'description' => [
            'name' => 'description',
            'type' => 'varchar',
            'len' => 255
        ],
        'active' => [
            'name' => 'active',
            'type' => 'bool',
            'default' => 0,
            'isnull' => false,
            'required' => true
        ]
    ],
    'indices' => [
        [
            'name' => 'idx__sysipclients__pk',
            'type' => 'primary',
            'fields' => ['id'],
        ],
        [
            'name' => 'idx__sysipclients__name',
            'type' => 'index',
            'fields' => ['name','active']
        ]
    ]
];
