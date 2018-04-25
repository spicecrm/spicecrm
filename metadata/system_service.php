<?php
$dictionary['sysservicecategories'] = array(
    'table' => 'sysservicecategories',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'name' => array(
            'name' => 'name',
            'type' => 'varchar',
        ),
        'keyname' => array(
            'name' => 'keyname',
            'type' => 'varchar',
            'len' => 32
        ),
        'selectable' => array(
            'name' => 'selectable',
            'type' => 'bool',
        ),
        'favorite' => array(
            'name' => 'favorite',
            'type' => 'bool'
        ),
        'parent_id' => array(
            'name' => 'parent_id',
            'type' => 'id',
            'comment' => 'id of a record located in this table'
        ),
        'servicequeue_id' =>  array(
            'name' => 'servicequeue_id',
            'type' => 'id',
        )
    ),
    'indices' => array(
        array(
            'name' => 'sysservicecategoriespk',
            'type' => 'primary',
            'fields' => array('id')
        ),
        array(
            'name' => 'idx_sysservicecategoriesparent',
            'type' => 'index',
            'fields' => array('parent_id')
        ),
        array(
            'name' => 'idx_sysservicecategoriesqueue',
            'type' => 'index',
            'fields' => array('servicequeue_id')
        ),
    )
);
