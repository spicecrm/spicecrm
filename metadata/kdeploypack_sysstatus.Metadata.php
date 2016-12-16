<?php
if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');

$dictionary['kdeploypack_sysstatus'] = array(
    'table' => 'kdeploypack_sysstatus',
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
            'name' => 'kdeploymentsystem_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'pstatus',
            'type' => 'varchar',
            'len' => '1'
        ),
        array(
            'name' => 'date_modified',
            'type' => 'datetime'
        ),
        array(
            'name' => 'history',
            'type' => 'bool',
            'required' => true,
            'isnull' => false
        ),
    ),
    'indices' => array(
        array(
            'name' => 'kdeploypack_sysstatus',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);
