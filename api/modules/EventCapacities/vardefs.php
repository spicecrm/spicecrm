<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['EventCapacity'] = [
    'table' => 'eventcapacities',
    'comment' => 'EventCapacities Module',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,

    'fields' => [
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 50,
            'required' => false
        ],
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
        'event_id' => [
            'name' => 'event_id',
            'vname' => 'LBL_EVENT_ID',
            'type' => 'varchar',
            'len' => 36,
            'reportable' => false,
            'required' => true,
        ],
        'event_name' => [
            'name' => 'event_name',
            'rname' => 'name',
            'id_name' => 'event_id',
            'vname' => 'LBL_EVENT',
            'type' => 'relate',
            'table' => 'events',
            'isnull' => 'true',
            'module' => 'Events',
            'dbType' => 'varchar',
            'link' => 'events',
            'len' => '255',
            'source' => 'non-db',
            'required' => true
        ],
        'event' => [
            'name' => 'event',
            'vname' => 'LBL_EVENT',
            'type' => 'link',
            'relationship' => 'event_eventcapacities',
            'source' => 'non-db',
        ],
        'eventcapacitytype_id' => [
            'name' => 'eventcapacitytype_id',
            'vname' => 'LBL_EVENTCAPACITYTYPE_ID',
            'type' => 'varchar',
            'len' => 36,
            'reportable' => false,
            'required' => true,
        ],
        'eventcapacitytype_name' => [
            'name' => 'eventcapacitytype_name',
            'rname' => 'name',
            'id_name' => 'eventcapacitytype_id',
            'vname' => 'LBL_EVENTCAPACITYTYPE',
            'type' => 'relate',
            'table' => 'eventcapacitytypes',
            'isnull' => 'true',
            'module' => 'EventCapacityTypes',
            'dbType' => 'varchar',
            'link' => 'eventcapacitytype',
            'len' => '255',
            'source' => 'non-db',
            'required' => true
        ],
        'eventcapacitytype' => [
            'name' => 'eventcapacitytype',
            'vname' => 'LBL_EVENTCAPACITYTYPE',
            'type' => 'link',
            'relationship' => 'eventcapacitytype_eventcapacities',
            'source' => 'non-db',
        ],
        'number_places' => [
            'name' => 'number_places',
            'type' => 'int',
            'vname' => 'LBL_NUMBER_PLACES',
            'required' => true
        ],
        'eventbookings' => [
            'name' => 'eventbookings',
            'type' => 'link',
            'relationship' => 'eventcapacities_eventbookings',
            'module' => 'EventBookings',
            'bean_name' => 'EventBooking',
            'source' => 'non-db',
            'vname' => 'LBL_EVENTBOOKINGS',
        ],
    ],
    'relationships' => [
        'event_eventcapacities' => [
            'lhs_module' => 'Events',
            'lhs_table' => 'events',
            'lhs_key' => 'id',
            'rhs_module' => 'EventCapacities',
            'rhs_table' => 'eventcapacities',
            'rhs_key' => 'event_id',
            'relationship_type' => 'one-to-many'
        ],
        'eventcapacitytype_eventcapacities' => [
            'lhs_module' => 'EventCapacityTypes',
            'lhs_table' => 'eventcapacitytypes',
            'lhs_key' => 'id',
            'rhs_module' => 'EventCapacities',
            'rhs_table' => 'eventcapacities',
            'rhs_key' => 'eventcapacitytype_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => [
        [ 'name' => 'idx__eventcapacities__event_id', 'type' => 'index', 'fields' => ['event_id','deleted'] ],
        [ 'name' => 'idx__eventcapacities__eventcapacitytype_id', 'type' => 'index', 'fields' => ['eventcapacitytype_id','deleted'] ],
        [ 'name' => 'idx__eventcapacities__date_start', 'type' => 'index', 'fields' => ['date_start','deleted'] ],
        [ 'name' => 'idx__eventcapacities__date_end', 'type' => 'index', 'fields' => ['date_end','deleted'] ]
    ],
];

VardefManager::createVardef('EventCapacities', 'EventCapacity', ['default', 'assignable']);
