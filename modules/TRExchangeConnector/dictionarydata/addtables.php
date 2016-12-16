<?php

/* 
 * Copyright notice
 * 
 * (c) 2014 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

if (!defined('sugarEntry') || !sugarEntry) 
    die('Not A Valid Entry Point');

$dictionary['trbusinessconnectorsyncs'] = array(
    'table' => 'trbusinessconnectorsyncs',
    'auditable' => false,
    'fields' => array(
        array('name' => 'id', 'type' => 'char', 'len' => 36),
        array('name' => 'job_class', 'type' => 'varchar', 'len' => 255),
        array('name' => 'job_parameters', 'type' => 'varchar', 'len' => 255),
        array('name' => 'last_sync', 'type' => 'datetime'),
        array('name' => 'status', 'type' => 'char', 'len' => 20),
        array('name' => 'monitored', 'type' => 'tinyint')
    ),
    'indices' => array(
        array('name' => 'PRIMARY', 'type' => 'primary', 'fields' => array('id')),
        array('name' => 'job_class', 'type' => 'index', 'fields' => array('job_class'))
    )
);
