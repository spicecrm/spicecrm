<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['events_accounts'] = [
    'table' => 'events_accounts',
    'contenttype'   => 'relationdata',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'event_id' => [
            'name' => 'event_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'account_id' => [
            'name' => 'account_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'account_role' => [
            'name' => 'account_role',
            'type' => 'varchar',
            'len' => '36'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'required' => false,
            'default' => '0'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_events_accounts_primary',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_events_account',
            'type' => 'alternate_key',
            'fields' => ['event_id', 'account_id']
        ]
    ],
    'relationships' => [
        'events_accounts' => [
            'lhs_module' => 'Events',
            'lhs_table' => 'events',
            'lhs_key' => 'id',
            'rhs_module' => 'Accounts',
            'rhs_table' => 'accounts',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'events_accounts',
            'join_key_lhs' => 'event_id',
            'join_key_rhs' => 'account_id'
        ]
    ]
];
