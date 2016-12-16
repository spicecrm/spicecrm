<?php

if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');

$dictionary['exchangesyncdefs'] = array(
    'table' => 'exchangesyncdefs',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id',
        ),
        'sync_type' => array (
            'name' => 'sync_type',
            'type' => 'char',
            'len'  => 15
        ),
        'user_id' => array(
            'name' => 'user_id',
            'type' => 'id',
        ),
        'server' => array(
            'name' => 'server',
            'type' => 'varchar',
        ),
        'upn' => array(
            'name' => 'upn',
            'type' => 'varchar',
        ),
        'distinguished_folder_name' => array(
            'name' => 'distinguished_folder_name',
            'type' => 'varchar',
            'len' => 255
        ),
        'folder_id' => array(
            'name' => 'folder_id',
            'type' => 'varchar',
            'len' => 255
        ),
        'initial_from_exchange_compl' => array(
            'name' => 'initial_from_exchange_compl',
            'type' => 'bool'
        ),
        'initial_to_exchange_compl' => array(
            'name' => 'initial_to_exchange_compl',
            'type' => 'bool',
        ),        
        'exchange_sync_state' => array(
            'name' => 'exchange_sync_state',
            'type' => 'text',
        ),
        'sugar_last_sync_date' => array (
            'name' => 'sugar_last_sync_date',
            'type' => 'datetime'
        ),
        'next_offset' => array (
            'name' => 'next_offset',
            'type' => 'int'
        ),
        'start_after' => array (
            'name' => 'start_after',
            'type' => 'datetime'
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
            'name' => 'exhchangesyncspk',
            'type' => 'primary',
            'fields' => array('id')
        ),
        array(
            'name' => 'idx_exsync_userid',
            'type' => 'index',
            'fields' => array('user_id')
        )        
    )
);
