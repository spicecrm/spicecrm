<?php
$dictionary['systrashcan'] = array(
    'table' => 'systrashcan',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'transactionid' => array(
            'name' => 'transactionid',
            'type' => 'id'
        ),
        'date_deleted' => array(
            'name' => 'date_deleted',
            'type' => 'datetime'
        ),
        'user_deleted' => array(
            'name' => 'user_deleted',
            'type' => 'id'
        ),
        'recordtype' => array(
            'name' => 'recordtype',
            'type' => 'varchar',
            'len' => 100
        ),
        'recordmodule' => array(
            'name' => 'recordmodule',
            'type' => 'varchar',
            'len' => 100
        ),
        'recordid' => array(
            'name' => 'recordid',
            'type' => 'varchar',
            'len' => 36
        ),
        'recordname' => array(
            'name' => 'recordname',
            'type' => 'varchar',
            'len' => 255
        ),
        'linkname' => array(
            'name' => 'linkname',
            'type' => 'varchar',
            'len' => 100
        ),
        'linkmodule' => array(
            'name' => 'linkmodule',
            'type' => 'varchar',
            'len' => 100
        ),
        'linkid' => array(
            'name' => 'linkid',
            'type' => 'varchar',
            'len' => 36
        ),
        'recorddata' => array(
            'name' => 'recorddata',
            'type' => 'text'
        ),
        'recovered' => array(
            'name' => 'recovered',
            'type' => 'bool',
            'default' => 0
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_systrashcan',
            'type' => 'index',
            'fields' => array('id'))
    )
);

