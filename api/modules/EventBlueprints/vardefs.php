<?php

use SpiceCRM\includes\SugarObjects\VardefManager;

global $dictionary;
$dictionary['EventBlueprint'] = [
    'table' => 'eventblueprints',
    'comment' => 'Event Blueprints Module',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,

    'fields' => [
        'date_start' => [
            'name' => 'date_start',
            'vname' => 'LBL_DATE_START',
            'type' => 'datetimecombo',
            'dbType' => 'datetime',
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
        ],
        'category' => [
            'name' => 'category',
            'vname' => 'LBL_CATEGORY',
            'type' => 'enum',
            'options' => 'event_category_dom',
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
            'relationship' => 'account_eventblueprints',
            'module' => 'Accounts',
            'bean_name' => 'Account',
            'source' => 'non-db',
            'vname' => 'LBL_ACCOUNT',
        ],
        'events' => [
            'name' => 'events',
            'type' => 'link',
            'relationship' => 'eventblueprint_events',
            'module' => 'Events',
            'bean_name' => 'Event',
            'source' => 'non-db',
            'vname' => 'LBL_EVENT',
        ],
    ],
    'relationships' => [
        'account_eventblueprints' => [
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'EventBlueprints',
            'rhs_table' => 'eventblueprints',
            'rhs_key' => 'location_id',
            'relationship_role_column' => 'location_type',
            'relationship_role_column_value' => 'Accounts',
            'relationship_type' => 'one-to-many'
        ],
        'eventblueprint_events' => [
            'lhs_module' => 'EventBlueprints',
            'lhs_table' => 'eventblueprints',
            'lhs_key' => 'id',
            'rhs_module' => 'Events',
            'rhs_table' => 'events',
            'rhs_key' => 'eventblueprint_id',
            'relationship_type' => 'one-to-many'
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_event_location_del',
            'type' => 'index',
            'fields' => ['location_id', 'location_type', 'deleted']
        ]
    ]
];

VardefManager::createVardef('EventBlueprints', 'EventBlueprint', ['default', 'assignable']);
