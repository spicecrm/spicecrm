<?php

$dictionary['sysnumberranges'] = array(
    'table' => 'sysnumberranges',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ),
        'prefix' => array(
            'name' => 'prefix',
            'type' => 'varchar',
            'len' => 10
        ),
        'range_from' => array(
            'name' => 'range_from',
            'type' => 'double'
        ),
        'range_to' => array(
            'name' => 'range_to',
            'type' => 'double'
        ),
        'next_number' => array(
            'name' => 'next_number',
            'type' => 'double'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_sysnumberranges',
            'type' => 'primary',
            'fields' => array('id'))
    )
);
