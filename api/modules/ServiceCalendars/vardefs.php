<?php


use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['ServiceCalendar'] = [
    'table' => 'servicecalendars',
    'comment' => 'ServiceCalendars Module',
    'audited' => false,
    'unified_search' => false,
    'fields' => [
        'timezone' => [
            'name' => 'timezone',
            'vname' => 'LBL_TIMEZONE',
            'type' => 'varchar',
            'len' => 50,
            'required' => true,
            'comment' => 'the timezone for time entries for this calendar'
        ],
        'systemholidaycalendar_id' => [
            'name' => 'systemholidaycalendar_id',
            'vname' => 'LBL_SYSTEMHOLIDAYCALENDAR_ID',
            'type' => 'id',
            'required' => false,
            'comment' => 'the id of the ServiceCalendar'
        ],
        'systemholidaycalendar_name' => [
            'name' => 'systemholidaycalendar_name',
            'vname' => 'LBL_SYSTEMHOLIDAYCALENDAR',
            'type' => 'relate',
            'source' => 'non-db',
            'len' => '255',
            'id_name' => 'systemholidaycalendar_id',
            'module' => 'SystemHolidayCalendars',
            'link' => 'systemholidaycalendar',
            'join_name' => 'systemholidaycalendar',
        ],
        'servicecalendartimes' => [
            'vname' => 'LBL_SERVICECALENDARTIMES',
            'name' => 'servicecalendartimes',
            'type' => 'link',
            'module' => 'ServiceCalendarTimes',
            'relationship' => 'servicecalendar_servicecalendartimes',
            'source' => 'non-db'
        ],
        'systemholidaycalendar' => [
            'vname' => 'LBL_SYSTEMHOLIDAYCALENDAR',
            'name' => 'systemholidaycalendar',
            'type' => 'link',
            'module' => 'SystemHolidayCalendars',
            'relationship' => 'systemholidaycalendar_servicecalendars',
            'link_type' => 'one',
            'source' => 'non-db'
        ],
        'serviceticketsla' => [
            'vname' => 'LBL_SERVICETICKETSLA',
            'name' => 'serviceticketsla',
            'type' => 'link',
            'module' => 'ServiceTicketSLAs',
            'relationship' => 'servicecalendar_serviceticketslas',
            'link_type' => 'one',
            'source' => 'non-db'
        ]
    ],
    'relationships' => [
        'servicecalendar_serviceticketslas' => [
            'lhs_module' => 'ServiceCalendars',
            'lhs_table' => 'servicecalendars',
            'lhs_key' => 'id',
            'rhs_module' => 'ServiceTicketSLAs',
            'rhs_table' => 'serviceticketslas',
            'rhs_key' => 'servicecalendar_id',
            'relationship_type' => 'one-to-many'
        ]
    ]
];

VardefManager::createVardef('ServiceCalendars', 'ServiceCalendar', ['default']);
