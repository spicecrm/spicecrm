<?php

$dictionary['systags'] = array(
    'table' => 'systags',
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
        'isactive' => array(
            'name' => 'isactive',
            'type' => 'bool'
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_syssystags',
            'type' => 'primary',
            'fields' => array('id')
        ),
        array(
            'name' => 'idx_syssystags_name',
            'type' => 'index',
            'fields' => array('name', 'isactive')
        ),
    )
);
