<?php
$dictionary['sysfts'] = [
    'table' => 'sysfts',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'char',
            'len' => 36,
            'required' => true,
            'isnull' => false,
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 255,
            'required' => true,
            'isnull' => false
        ],
        'index_priority' => [
            'name' => 'index_priority',
            'type' => 'int'
        ],
        'ftsfields' => [
            'name' => 'ftsfields',
            'type' => 'text'
        ],
        'activated_date' => [
            'name' => 'activated_date',
            'type' => 'date'
        ],
        'activated_fields' => [
            'name' => 'activated_fields',
            'type' => 'text'
        ],
        'settings' => [
            'name' => 'settings',
            'type' => 'text'
        ]
    ],
    'indices' => [
        ['name' => 'sysftspk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'sysftsmodule', 'type' => 'unique', 'fields' => ['module']],
    ]
];

$dictionary['sysftslog'] = [
    'table' => 'sysftslog',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'date_created' => [
            'name' => 'date_created',
            'type' => 'datetime'
        ],
        'response_status' => [
            'name' => 'response_status',
            'type' => 'varchar',
            'len' => 10
        ],'request_method' => [
            'name' => 'request_method',
            'type' => 'varchar',
            'len' => 10
        ],
        'request_url' => [
            'name' => 'request_url',
            'type' => 'longtext' # todo: MSSQL doesn´t know "longtext"
        ],
        'index_request' => [
            'name' => 'index_request',
            'type' => 'text'
        ],
        'index_response' => [
            'name' => 'index_response',
            'type' => 'longtext' # todo: MSSQL doesn´t know "longtext"
        ],
        'rt_local' => [
            'name' => 'rt_local',
            'type' => 'double'
        ],
        'rt_remote' => [
            'name' => 'rt_remote',
            'type' => 'double'
        ]

    ],
    'indices' => [
        [
            'name' => 'sysftslogpk',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];