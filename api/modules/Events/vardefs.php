<?php


use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['Event'] = [
    'table' => 'events',
    'comment' => 'Events Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

    'fields' => [
        'date_start' => [
            'name' => 'date_start',
            'vname' => 'LBL_DATE_START',
            'type' => 'datetimecombo',
            'dbType' => 'datetime',
            'required' => true,
            'enable_range_search' => true,
            'options' => 'date_range_search_dom',
            'validation' => [
                'type' => 'isbefore',
                'compareto' => 'date_end',
                'blank' => false
            ]
        ],
        'date_end' => [
            'name' => 'date_end',
            'vname' => 'LBL_DATE_END',
            'type' => 'datetimecombo',
            'dbType' => 'datetime',
            'enable_range_search' => true,
            'options' => 'date_range_search_dom',
        ],
        'status' => [
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'options' => 'event_status_dom',
            'required' => true
        ],
        'category' => [
            'name' => 'category',
            'vname' => 'LBL_CATEGORY',
            'type' => 'enum',
            'options' => 'event_category_dom',
            'required' => true
        ],
        'capacity_participants' => [
            'name' => 'capacity_participants',
            'vname' => 'LBL_CAPACITY_PARTICIPANTS',
            'type' => 'int'
        ],
        'capacity_meeting_room' => [
            'name' => 'capacity_meeting_room',
            'vname' => 'LBL_CAPACITY_MEETING_ROOM',
            'type' => 'varchar'
        ],
        'capacity_accommodation' => [
            'name' => 'capacity_accommodation',
            'vname' => 'LBL_CAPACITY_ACCOMMODATION',
            'type' => 'varchar'
        ],
        'url' => [
            'name' => 'url',
            'vname' => 'LBL_URL',
            'type' => 'varchar',
            'len' => 400,
        ],
        'location_type' => [
            'name' => 'location_type',
            'vname' => 'LBL_LOCATION_TYPE',
            'type' => 'parent_type',
            'dbType' => 'varchar',
            'len' => 100,
            'group' => 'location_name',
            'options' => 'parent_type_display',
        ],
        'location_id' => [
            'name' => 'location_id',
            'vname' => 'LBL_LOCATION_ID',
            'type' => 'id',
            'group' => 'location_name',
            'reportable' => false,
        ],
        'location_name' => [
            'name' => 'location_name',
            'parent_type' => 'record_type_display',
            'type_name' => 'location_type',
            'id_name' => 'location_id',
            'vname' => 'LBL_LOCATION',
            'type' => 'parent',
            'group' => 'location_name',
            'source' => 'non-db'
        ],
        'location_accounts' => [
            'name' => 'location_accounts',
            'type' => 'link',
            'relationship' => 'account_events',
            'module' => 'Accounts',
            'bean_name' => 'Account',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNT',
        ],
        'eventblueprint_id' => [
            'name' => 'eventblueprint_id',
            'vname' => 'LBL_EVENTBLUEPRINT_ID',
            'type' => 'varchar',
            'len' => 36,
            'reportable' => false,
        ],
        'eventblueprint_name' => [
            'name' => 'eventblueprint_name',
            'rname' => 'name',
            'id_name' => 'eventblueprint_id',
            'vname' => 'LBL_EVENTBLUEPRINT',
            'type' => 'relate',
            'table' => 'eventblueprints',
            'isnull' => 'true',
            'module' => 'EventBlueprints',
            'dbType' => 'varchar',
            'link' => 'eventblueprints',
            'len' => '255',
            'source' => 'non-db',
        ],
        'eventblueprints' => [
            'name' => 'eventblueprints',
            'vname' => 'LBL_EVENTBLUEPRINTS',
            'type' => 'link',
            'relationship' => 'eventblueprint_events',
            'source' => 'non-db',
        ],
        'events_account_role' => [
            'name' => 'events_account_role',
            'vname' => 'LBL_ROLE',
            'type' => 'enum',
            'source' => 'non-db',
            'options' => 'events_account_roles_dom'
        ],
        'events_contact_role' => [
            'name' => 'events_contact_role',
            'vname' => 'LBL_ROLE',
            'type' => 'enum',
            'source' => 'non-db',
            'options' => 'events_contact_roles_dom'
        ],
        'events_consumer_role' => [
            'name' => 'events_consumer_role',
            'vname' => 'LBL_ROLE',
            'type' => 'enum',
            'source' => 'non-db',
            'options' => 'events_consumer_roles_dom'
        ],
        'accounts' => [
            'name' => 'accounts',
            'type' => 'link',
            'relationship' => 'events_accounts',
            'module' => 'Accounts',
            'bean_name' => 'Account',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNTS',
            'rel_fields' => [
                'account_role' => [
                    'map' => 'events_account_role'
                ]
            ]
        ],
        'contacts' => [
            'name' => 'contacts',
            'type' => 'link',
            'relationship' => 'events_contacts',
            'module' => 'Contacts',
            'bean_name' => 'Contact',
            'source' => 'non-db',
            'vname' => 'LBL_CONTACTS',
            'rel_fields' => [
                'contact_role' => [
                    'map' => 'events_contact_role'
                ]
            ]
        ],
        'consumers' => [
            'name' => 'consumers',
            'type' => 'link',
            'relationship' => 'events_consumers',
            'module' => 'Consumers',
            'bean_name' => 'Consumer',
            'source' => 'non-db',
            'vname' => 'LBL_CONSUMERS',
            'rel_fields' => [
                'consumer_role' => [
                    'map' => 'events_consumer_role'
                ]
            ]
        ],
        'eventregistrations' => [
            'name' => 'eventregistrations',
            'type' => 'link',
            'relationship' => 'events_eventregistrations',
            'module' => 'EventRegistrations',
            'bean_name' => 'EventRegistration',
            'source' => 'non-db',
            'vname' => 'LBL_EVENTREGISTRATIONS',
        ],
        'campaigns' => [
            'name' => 'campaigns',
            'type' => 'link',
            'relationship' => 'events_campaigns',
            'module' => 'Campaigns',
            'bean_name' => 'Campaign',
            'source' => 'non-db',
            'vname' => 'LBL_CAMPAIGNS',
        ]
    ],
    'relationships' => [
        'events_campaigns' => [
            'lhs_module' => 'Events',
            'lhs_table' => 'events',
            'lhs_key' => 'id',
            'rhs_module' => 'Campaigns',
            'rhs_table' => 'campaigns',
            'rhs_key' => 'event_id',
            'relationship_type' => 'one-to-many',
        ],
    ],
    'indices' => [
        [
            'name'   => 'idx_event_location_del',
            'type'   => 'index',
            'fields' => ['location_id', 'location_type', 'deleted']
        ]
    ]
];

VardefManager::createVardef('Events', 'Event', ['default', 'assignable', 'activities']);
