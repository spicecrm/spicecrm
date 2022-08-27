<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['events_contacts'] = [
    'table' => 'events_contacts',
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
        'contact_id' => [
            'name' => 'contact_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'contact_role' => [
            'name' => 'contact_role',
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
            'name' => 'idx_events_contacts_primary',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_events_contact',
            'type' => 'alternate_key',
            'fields' => ['event_id', 'contact_id']
        ]
    ],
    'relationships' => [
        'events_contacts' => [
            'lhs_module' => 'Events',
            'lhs_table' => 'events',
            'lhs_key' => 'id',
            'rhs_module' => 'Contacts',
            'rhs_table' => 'contacts',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'events_contacts',
            'join_key_lhs' => 'event_id',
            'join_key_rhs' => 'contact_id'
        ]
    ]
];
