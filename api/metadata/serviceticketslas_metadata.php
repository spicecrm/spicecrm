<?php
/**
 * moved to separate module
 */
/*
$dictionary['serviceticketslas'] = array(
    'table' => 'serviceticketslas',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id',
            'len' => '36'
        ),
        'serviceticket_type' => array(
            'name' => 'serviceticket_type',
            'type' => 'varchar',
            'len' => '50'
        ),
        'serviceticket_class' => array(
            'name' => 'serviceticket_class',
            'type' => 'varchar',
            'len' => '50'
        ),
        'time_to_response' => array(
            'name' => 'time_to_response',
            'type' => 'int'
        ),
        'time_to_resolution' => array(
            'name' => 'time_to_resolution',
            'type' => 'int'
        )
    ),
    'indices' => array(
        array(
            'name' => 'serviceticketslaspk',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);
*/

/*
$dictionary['serviceticketslaworkinghours'] = array(
    'table' => 'serviceticketslaworkinghours',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id',
            'len' => '36',
            'comment' => 'unique id'
        ),
        'dayofweek' => array(
            'name' => 'dayofweek',
            'type' => 'varchar',
            'len' => '1',
            'comment' => 'ISO-8601 numeric representation of the day of the week, 1 (for Monday) through 7 (for Sunday)'
        ),
        'timestart' => array(
            'name' => 'timestart',
            'type' => 'varchar',
            'len' => '4',
            'comment' => ' working start time in military format (e.g. 8000 for 8:00am or 2300 for 11pm)'
        ),
        'timeend' => array(
            'name' => 'timeend',
            'type' => 'varchar',
            'len' => '4',
            'comment' => ' working end time in military format (e.g. 8000 for 8:00am or 2300 for 11pm)'
        )
    ),
    'indices' => array(
        array(
            'name' => 'serviceticketslaworkinghourspk',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);
*/