<?php

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['EmailSchedule'] = [
    'table' => 'emailschedules',
    'comment' => 'Email Schedules Module',
    'audited' =>  true,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

    'fields' => [
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => '100',
            'vname' => 'LBL_NAME',
        ],
        'email_schedule_status' => [
            'name' => 'email_schedule_status',
            'type' => 'enum',
            'options' => 'email_schedule_status_dom',
            'len' => 50,
            'vname' => 'LBL_STATUS',
        ],
        'email_subject' => [
        'name' => 'email_subject',
        'vname' => 'LBL_SUBJECT',
        'type' => 'varchar',
        'len' => '255',
        ],
        'email_body' => [
            'name' => 'email_body',
            'vname' => 'LBL_EMAIL_BODY_PLAIN',
            'type' => 'text',
        ],
        'mailbox_id' => [
            'name' => 'mailbox_id',
            'vname' => 'LBL_MAILBOX',
            'type' => 'mailbox',
            'dbtype' => 'varchar',
            'len' => 36
        ],
        'email_stylesheet_id' => [
            'name' => 'email_stylesheet_id',
            'vname' => 'LBL_STYLESHEET',
            'type' => 'varchar',
            'len' => 36
        ]
    ],
    'relationships' => [],
    'indices' => [],
];

VardefManager::createVardef('EmailSchedules', 'EmailSchedule', ['default', 'assignable']);
