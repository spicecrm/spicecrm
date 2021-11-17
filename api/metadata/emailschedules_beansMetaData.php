<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['emailschedules_beans'] = [
// TODO: EMAIL ID
    'table' => 'emailschedules_beans',
    'fields' => [
        [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36',
        ],
        [
            'name' => 'emailschedule_status',
            'type' => 'enum',
            'options' => 'emailschedule_status_dom',
            'len' => 50,
            'comment' 	=> 'Status of the email schedule',
        ],
        [
            'name'		=> 'emailschedule_id',
            'type'		=> 'varchar',
            'dbType'	=> 'id',
            'len'		=> '36',
            'comment' 	=> 'FK to emailschedules table',
        ],
        [
            'name'		=> 'bean_module',
            'type'		=> 'varchar',
            'len'		=> '100',
            'comment' 	=> 'bean\'s module',
        ],
        [
            'name'		=> 'bean_id',
            'dbType'	=> 'id',
            'type'		=> 'varchar',
            'len'		=> '36',
            'comment' 	=> 'FK to various beans\'s tables',
        ],
        [
            'name'		=> 'email_id',
            'type'		=> 'varchar',
            'dbType'	=> 'id',
            'len'		=> '36',
            'comment' 	=> 'FK to email table',
        ],
        [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        [
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'default' => '0'
        ],

    ],
    'relationships' => [
    ],
    'indices' => [
        [
            'name'		=> 'emailschedules_beanspk',
            'type'		=> 'primary',
            'fields'	=> ['id']
        ],
        [
            'name'		=> 'idx_emailschedules_beans_bean_id',
            'type'		=> 'index',
            'fields'	=> ['bean_id']
        ],
        [
            'name'		=> 'idx_emailschedules_beans_emailschedule_bean',
            'type'		=> 'alternate_key',
            'fields'	=> ['emailschedule_id', 'bean_id', 'deleted']
        ],
    ]
];
