<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['events_consumers'] = [
    'table' => 'events_consumers',
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
        'consumer_id' => [
            'name' => 'consumer_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'consumer_role' => [
            'name' => 'consumer_role',
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
            'name' => 'idx_events_consumers_primary',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_events_consumer',
            'type' => 'alternate_key',
            'fields' => ['event_id', 'consumer_id']
        ]
    ],
    'relationships' => [
        'events_consumers' => [
            'lhs_module' => 'Events',
            'lhs_table' => 'events',
            'lhs_key' => 'id',
            'rhs_module' => 'Consumers',
            'rhs_table' => 'consumers',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'events_consumers',
            'join_key_lhs' => 'event_id',
            'join_key_rhs' => 'consumer_id'
        ]
    ]
];
