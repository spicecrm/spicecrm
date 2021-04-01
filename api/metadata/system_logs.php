<?php
/**
 * Created by PhpStorm.
 * User: maretval
 * Date: 06.06.2018
 * Time: 18:30
 */
$dictionary['syslogs'] = [
    'table' => 'syslogs',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'type' => 'datetime',
        ],
        'microtime' => [
            'name' => 'microtime',
            'type' => 'varchar',
            'len' => 50
        ],
        'created_by' => [
            'name' => 'created_by',
            'type' => 'id',
        ],
        'pid' => [
            'name' => 'pid',
            'type' => 'int'
        ],
        'log_level' => [
            'name' => 'log_level',
            'type' => 'varchar',
        ],
        'level_value' => [
            'name' => 'level_value',
            'type' => 'tinyint'
        ],
        'description' => [
            'name' => 'description',
            'type' => 'text',
        ],
        'transaction_id' => [
            'name' => 'transaction_id',
            'type' => 'varchar',
            'len' => 36
        ]
    ],
    'indices' => [
        [
            'name' => 'syslogspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_syslogslevel',
            'type' => 'index',
            'fields' => ['log_level']
        ],
        [
            'name' => 'idx_syslogscreatedby',
            'type' => 'index',
            'fields' => ['created_by']
        ],
        [
            'name' => 'idx_syslogslogcreatedbylevel',
            'type' => 'index',
            'fields' => ['created_by', 'log_level']
        ],
        [
            'name' => 'idx_syslogs_microtime',
            'type' => 'index',
            'fields' => ['microtime']
        ],
        [
            'name' => 'idx_syslogs_pid',
            'type' => 'index',
            'fields' => ['pid']
        ],
        [
            'name' => 'idx_syslogs_level_value',
            'type' => 'index',
            'fields' => ['level_value']
        ],
        [
            'name' => 'idx_syslogs_transaction_id',
            'type' => 'index',
            'fields' => ['transaction_id']
        ]
    ]
];


$dictionary['syslogusers'] = [
    'table' => 'syslogusers',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'id',
        ],
        'log_level' => [
            'name' => 'log_level',
            'type' => 'varchar',
        ],
        'logstatus' => [
            'name' => 'logstatus',
            'type' => 'bool',
            'default' => 0
        ]
    ],
    'indices' => [
        [
            'name' => 'sysloguserspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_sysloguserslevel',
            'type' => 'index',
            'fields' => ['log_level']
        ],
        [
            'name' => 'idx_syslogsuseridstatus',
            'type' => 'index',
            'fields' => ['user_id', 'logstatus']
        ],
        [
            'name' => 'idx_syslogsuseridlevelstatus',
            'type' => 'index',
            'fields' => ['user_id', 'log_level', 'logstatus']
        ]
    ]
];
