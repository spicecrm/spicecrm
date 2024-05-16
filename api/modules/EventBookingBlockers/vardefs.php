<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['EventBookingBlocker'] = [
    'table' => 'eventbookingblockers',
    'comment' => 'EventBookingBlockers Module',
    'audited' => false,
    'duplicate_merge' => false,
    'unified_search' => false,
    'fields' => [
        'booking_blocked_until' => [
            'name' => 'booking_blocked_until',
            'vname' => 'LBL_BOOKING_BLOCKED_UNTIL',
            'type' => 'datetime',
            'required' => true,
            'comment' => 'common calendar booking blocked until'
        ],
        'booking_blocked_from' => [
            'name' => 'booking_blocked_from',
            'vname' => 'LBL_BOOKING_BLOCKED_FROM',
            'type' => 'datetime',
            'required' => false,
            'comment' => 'common calendar booking blocked from'
        ],
        'participant_id' => [
            'name' => 'participant_id',
            'vname' => 'LBL_PARTICIPANT_ID',
            'type' => 'id',
            'reportable' => false,
            'comment' => 'ID of parent record'
        ],
        'participant_type' => [
            'name'     => 'participant_type',
            'vname'    => 'LBL_PARTICIPANT_TYPE',
            'type'     => 'parent_type',
            'dbtype'   => 'varchar',
            'len'      => 50,
            'comment'  => 'The module name of participant record',
        ],
        'participant_name' => [
            'name'        => 'participant_name',
            'vname'       => 'LBL_RELATED_TO',
            'type'        => 'parent',
            'type_name'   => 'participant_type',
            'id_name'     => 'participant_id',
            'source'      => 'non-db',
            'required' => true,
            'comment'  => 'The summary of the participant record',
        ],
        'consumer' => [
            'name' => 'consumer',
            'vname' => 'LBL_CONSUMER',
            'type' => 'link',
            'relationship' => 'consumer_eventbookingblockers',
            'source' => 'non-db',
        ],
        /*
        'eventcapacitytype_id' => [
            'name' => 'eventcapacitytype_id',
            'vname' => 'LBL_EVENTCAPACITYTYPE_ID',
            'type' => 'varchar',
            'len' => 36,
            'reportable' => false,
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
            'source' => 'non-db'
        ],
        'eventcapacitytype' => [
            'name' => 'eventcapacitytype',
            'vname' => 'LBL_EVENTCAPACITYTYPE',
            'type' => 'link',
            'relationship' => 'eventcapacitytype_eventbookingblockers',
            'source' => 'non-db'
        ],
        */
        'subtype' => [
                'name' => 'subtype',
                'vname' => 'LBL_SUBTYPE',
                'type' => 'enum',
                'len' => 20,
                'options' => 'eventCapacity_subtype_dom'
        ]
    ],
    'relationships' => [
        'consumer_eventbookingblockers' => [
            'lhs_module' => 'Consumers',
            'lhs_table' => 'consumers',
            'lhs_key' => 'id',
            'rhs_module' => 'EventBookingBlockers',
            'rhs_table' => 'eventbookingblockers',
            'rhs_key' => 'participant_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column'=>'participant_type',
            'relationship_role_column_value' => 'Consumers'
        ],
        /*
        'eventcapacitytype_eventbookingblockers' => [
            'lhs_module' => 'EventCapacityTypes',
            'lhs_table' => 'eventcapacitytypes',
            'lhs_key' => 'id',
            'rhs_module' => 'EventBookingBlockers',
            'rhs_table' => 'eventbookingblockers',
            'rhs_key' => 'eventcapacitytype_id',
            'relationship_type' => 'one-to-many'
        ]
        */
    ],
    'indices' => [
        ['name' => 'idx__event_b_blockers__participant', 'type' => 'index', 'fields' => ['participant_id', 'participant_type', 'deleted']],
        ['name' => 'idx__event_b_blockers__subtype', 'type' => 'index', 'fields' => ['subtype', 'deleted']],
        ['name' => 'idx__event_b_blockers__blocked_until', 'type' => 'index', 'fields' => ['booking_blocked_until', 'deleted']],
    ]
];

VardefManager::createVardef('EventBookingBlockers', 'EventBookingBlocker', ['default', 'assignable']);


SpiceDictionaryHandler::getInstance()->dictionary['EventBookingBlocker']['fields']['name'] = [
    'name' => 'name',
    'type' => 'varchar',
    'len' => 50,
    'required' => false,
    'vname' => "LBL_EVENTBOOKINGBLOCKER_NAME"
];