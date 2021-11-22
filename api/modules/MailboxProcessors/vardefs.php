<?php

//dictionary global variable => class name als key
use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['MailboxProcessor'] = [
    'table' => 'mailbox_processors',
    'comment' => 'Mailbox Processor Module',
    'audited' =>  true,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

    'fields' => [
        'mailbox_id' => [
            'name'			=> 'mailbox_id',
            'type'			=> 'id',
            'vname'         => 'LBL_MAILBOX_ID',
            'length'		=> 36,
            'required'		=> true,
        ],
        'mailbox_name' => [
            'name' => 'mailbox_name',
            'type' => 'relate',
            'source' => 'non-db',
            'module' => 'Mailboxes',
            'link' => 'mailboxes',
            'id_name' => 'mailbox_id',
            'rname' => 'name',
            'vname' => 'LBL_MAILBOX'
        ],
        'processor_file' => [
            'name'			=> 'processor_file',
            'type'			=> 'varchar',
            'vname'         => 'LBL_FILE',
            'length'		=> 255,
            'required'		=> false,
        ],
        'processor_class' => [
            'name'			=> 'processor_class',
            'type'			=> 'varchar',
            'length'		=> 255,
            'vname'         => 'LBL_CLASS',
            'required'		=> true,
        ],
        'processor_method' => [
            'name'			=> 'processor_method',
            'type'			=> 'varchar',
            'length'		=> 255,
            'vname'         => 'LBL_METHOD',
            'required'		=> true,
        ],
        'priority' => [
            'name'			=> 'priority',
            'type'			=> 'int',
            'length'        => 8,
            'vname'         => 'LBL_PRIORITY',
            'required'		=> true,
        ],
        'stop_on_success' => [
            'name'			=> 'stop_on_success',
            'type'			=> 'bool',
            'default'       => 0,
            'vname'         => 'LBL_STOP_ON_SUCCESS',
        ],
        'mailboxes' => [
            'name' => 'mailboxes',
            'type' => 'link',
            'relationship' => 'mailboxes_mailbox_processors',
            'source' => 'non-db',
            'default' => true
        ],
    ],
    'relationships' => [],
    'indices' => [
        [
            'name'   => 'idx_mailbox_processors_mailboxid',
            'type'   => 'index',
            'fields' => ['mailbox_id'],
        ],
    ]
];

VardefManager::createVardef('MailboxProcessors', 'MailboxProcessor', ['default']);
