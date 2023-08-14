<?php
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['sysipclientroutes'] = [
    'table' => 'sysipclientroutes',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'route_pattern' => [
            'name' => 'route_pattern',
            'type' => 'varchar',
            'len' => 255,
            'isnull' => false,
            'required' => true
        ],
        'request_method' => [
            'name' => 'request_method',
            'type' => 'char',
            'len' => 10,
            'isnull' => false,
            'required' => true
        ],
        'description' => [
            'name' => 'description',
            'type' => 'varchar',
            'len' => 255
        ],
        'ip_client_name' => [
            'name' => 'ip_client_name',
            'type' => 'varchar',
            'len' => 255,
            'isnull' => false,
            'required' => true
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
            'name' => 'idx__sysipclientroutes__pk',
            'type' => 'primary',
            'fields' => ['id'],
        ],
        [
            'name' => 'idx__sysipclientroutes__route_pattern__method__active',
            'type' => 'index',
            'fields' => ['route_pattern','request_method','active']
        ],
        [
            'name' => 'idx__sysipclientroutes__active',
            'type' => 'index',
            'fields' => ['active']
        ]
    ]
];
