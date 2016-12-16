<?php
$dictionary['sysfts'] = array(
    'table' => 'sysfts',
    'fields' => array(
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => 255
        ),
        'index_priority' => array(
            'name' => 'index_priority',
            'type' => 'int'
        ),
        'ftsfields' => array(
            'name' => 'ftsfields',
            'type' => 'text'
        ),
        'activated_date' => array(
            'name' => 'activated_date',
            'type' => 'date'
        ),
        'activated_fields' => array(
            'name' => 'activated_fields',
            'type' => 'text'
        ),
        'settings' => array(
            'name' => 'settings',
            'type' => 'text'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysfts',
            'type' => 'index',
            'fields' => array('module'))
    )
);