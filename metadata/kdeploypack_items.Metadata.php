<?php
if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');

$dictionary['kdeploypack_items'] = array(
    'table' => 'kdeploypack_items',
    'fields' => array(
        array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'kreleasepackage_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'ckey',
            'type' => 'varchar'
        ),
        array(
            'name' => 'ctype',
            'type' => 'varchar',
            'len' => '10'
        ),
        array(
            'name' => 'date_modified',
            'type' => 'datetime'),
        array(
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'default' => '0',
            'required' => false
        )
    ),
    'indices' => array(
        array(
            'name' => 'kdeploypack_items',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);
