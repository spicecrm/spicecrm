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
        ],
        'prospectlists' => [
            'name' => 'prospectlists',
            'vname' => 'LBL_PROSPECTLISTS',
            'type' => 'link',
            'relationship' => 'prospectlist_emailschedules',
            'source' => 'non-db',
            'module' => 'ProspectLists'
        ],
        'parent_name' => [
            'name'       => 'parent_name',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'type'       => 'parent',
            'vname'      => 'LBL_RELATED_TO',
            'source'     => 'non-db',
        ],
        'parent_type' => [
            'name'       => 'parent_type',
            'type'       => 'varchar',
            'len'        => 100,
            'comment'    => 'Identifier of Sugar module to which this email schedule is associated',
        ],
        'parent_id' => [
            'name'       => 'parent_id',
            'type'       => 'id',
            'comment'    => 'ID of Sugar object referenced by parent_type',
        ],
    ],
    'relationships' => [
        'prospectlist_emailschedules' =>
            [
                'lhs_module' => 'ProspectLists',
                'lhs_table' => 'prospect_lists',
                'lhs_key' => 'id',
                'rhs_module' => 'EmailSchedules',
                'rhs_table' => 'emailschedules',
                'rhs_key' => 'parent_id',
                'relationship_type' => 'one-to-many',
                'relationship_role_column' => 'parent_type',
                'relationship_role_column_value' => 'ProspectLists'
            ]
    ],
    'indices' => [],
];

VardefManager::createVardef('EmailSchedules', 'EmailSchedule', ['default', 'assignable']);
