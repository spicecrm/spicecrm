<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['EventBooking'] = [
    'table' => 'eventbookings',
    'comment' => 'EventBookings Module',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,
    'fields' => [
        'date_start' => [
            'name' => 'date_start',
            'vname' => 'LBL_DATE_START',
            'type' => 'datetime',
            'required' => true,
            'comment' => 'common calendar date start'
        ],
        'event_capacity_id' => [
            'name' => 'event_capacity_id',
            'vname' => 'LBL_EVENT_CAPACITY_ID',
            'type' => 'varchar',
            'len' => 36,
            'reportable' => false,
            'required' => true,
        ],
        'event_capacity_name' => [
            'name' => 'event_capacity_name',
            'rname' => 'name',
            'id_name' => 'event_capacity_id',
            'vname' => 'LBL_CAPACITY',
            'type' => 'relate',
            'table' => 'eventcapacities',
            'isnull' => 'true',
            'module' => 'EventCapacities',
            'dbType' => 'varchar',
            'link' => 'event_capacity',
            'len' => '255',
            'source' => 'non-db',
            'required' => false
        ],
        'event_capacity' => [
            'name' => 'event_capacity',
            'vname' => 'LBL_EVENT_CAPACITY',
            'type' => 'link',
            'relationship' => 'eventcapacities_eventbookings',
            'source' => 'non-db',
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'vname' => 'LBL_PARTICIPANT_ID',
            'type' => 'id',
            'reportable' => false,
            'comment' => 'ID of parent record'
        ],
        'parent_type' => [
            'name'     => 'parent_type',
            'vname'    => 'LBL_PARTICIPANT_TYPE',
            'type'     => 'parent_type',
            'dbtype'   => 'varchar',
            'len'      => 50,
            'comment'  => 'The module name of participant record',
        ],
        'parent_name' => [
            'name'        => 'parent_name',
            'vname'       => 'LBL_RELATED_TO',
            'type'        => 'parent',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'source'      => 'non-db',
            'required' => true,
            'comment'  => 'The summary of the participant record',
        ],
        'participated' => [
            'name' => 'participated',
            'vname' => 'LBL_PARTICIPATED',
            'type' => 'bool'
        ],
        'contact' => [
            'name' => 'contact',
            'vname' => 'LBL_CONTACT',
            'type' => 'link',
            'relationship' => 'contact_eventbookings',
            'source' => 'non-db',
        ],
        'consumer' => [
            'name' => 'consumer',
            'vname' => 'LBL_CONSUMER',
            'type' => 'link',
            'relationship' => 'consumer_eventbookings',
            'source' => 'non-db',
        ],
        'channel' => [
            'name' => 'channel',
            'vname' => 'LBL_CHANNEL',
            'type' => 'enum',
            'len' => 3,
            'options' => 'eventbooking_channel_dom'
        ],
    ],
    'relationships' => [
        'eventcapacities_eventbookings' => [
            'lhs_module' => 'EventCapacities',
            'lhs_table' => 'eventcapacities',
            'lhs_key' => 'id',
            'rhs_module' => 'EventBookings',
            'rhs_table' => 'eventbookings',
            'rhs_key' => 'event_capacity_id',
            'relationship_type' => 'one-to-many'
        ],
        'contact_eventbookings' => [
            'lhs_module' => 'Contacts',
            'lhs_table' => 'contacts',
            'lhs_key' => 'id',
            'rhs_module' => 'EventBookings',
            'rhs_table' => 'eventbookings',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column'=>'parent_type',
            'relationship_role_column_value' => 'Contacts'
        ],
        'consumer_eventbookings' => [
            'lhs_module' => 'Consumers',
            'lhs_table' => 'consumers',
            'lhs_key' => 'id',
            'rhs_module' => 'EventBookings',
            'rhs_table' => 'eventbookings',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column'=>'parent_type',
            'relationship_role_column_value' => 'Consumers'
        ]
    ],
    'indices' => [
        ['name' => 'idx__eventbookings__regparticipant', 'type' => 'index', 'fields' => ['parent_id', 'parent_type', 'deleted','participated']],
        ['name' => 'idx__eventbookings__event_capacity_id', 'type' => 'index', 'fields' => ['event_capacity_id','deleted']],
        ['name' => 'idx__eventbookings__date_start', 'type' => 'index', 'fields' => ['date_start','deleted'] ],
        ['name' => 'idx__eventbookings__participated', 'type' => 'index', 'fields' => ['participated','deleted'] ]
    ]
];

VardefManager::createVardef('EventBookings', 'EventBooking', ['default', 'assignable']);


SpiceDictionaryHandler::getInstance()->dictionary['EventBooking']['fields']['name'] = [
    'name' => 'name',
    'type' => 'varchar',
    'len' => 50,
    'required' => false,
    'vname' => "LBL_BOOKINGNUMBER"
];