<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['sysnumberranges'] = [
    'table' => 'sysnumberranges',
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
        'prefix' => [
            'name' => 'prefix',
            'type' => 'varchar',
            'len' => 10
        ],
        'length' => [
            'name' => 'length',
            'type' => 'int',
            'isnull' => true
        ],
        'range_from' => [
            'name' => 'range_from',
            'type' => 'double'
        ],
        'range_to' => [
            'name' => 'range_to',
            'type' => 'double'
        ],
        'next_number' => [
            'name' => 'next_number',
            'type' => 'double'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_sysnumberranges',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['sysnumberrangeallocation'] = [
    'table' => 'sysnumberrangeallocation',
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
        'field' => [
            'name' => 'field',
            'type' => 'varchar',
            'len' => 50
        ],
        'numberrange' => [
            'name' => 'numberrange',
            'type' => 'varchar',
            'len' => 36,
        ],
        'valid_from' => [
            'name' => 'valid_from',
            'type' => 'date',
            'required' => true
        ],
        'valid_to' => [
            'name' => 'valid_to',
            'type' => 'date',
            'required' => true
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_sysnumberrangeallocation',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];
