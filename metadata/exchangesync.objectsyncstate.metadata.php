<?php

if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');

$dictionary['exchangeobjectsyncstate'] = array(
    'table' => 'exchangeobjectsyncstate',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id',
        ),
        'user_id' => array(
            'name' => 'user_id',
            'type' => 'id',
        ),
        'upn' => array(
            'name' => 'upn',
            'type' => 'varchar',
        ),
        'exchange_id' => array(
            'name' => 'exchange_id',
            'type' => 'varchar',
            'len' => 512
        ),
        'change_key' => array(
            'name' => 'change_key',            
            'type' => 'varchar',
            'len' => 100
        ),
        'bean' => array(
            'name' => 'bean',
            'type' => 'varchar'
        ),
        'bean_id' => array(
            'name' => 'bean_id',
            'type' => 'id',
        ),
        'bean_hash' => array(
            'name' => 'bean_hash',
            'type' => 'varchar',
            'len' =>  '32'
        ),
        'date_modified' => array(
            'name' => 'date_modified',
            'type' => 'datetime'
        ),
        'deleted' => array(
            'name' => 'deleted',
            'type' => 'bool',
        )
    ),
    'indices' => array(
        array(
            'name' => 'exhchangeobjsyncspk',
            'type' => 'primary',
            'fields' => array('id')
        ),
        array(
            'name' => 'idx_exobjsync_bean',
            'type' => 'index',
            'fields' => array('bean_id', 'upn')
        ),
        array(
            'name' => 'idx_exobjsync_exchid',
            'type' => 'index',
            'fields' => array('exchange_id')
        )
    )
);
