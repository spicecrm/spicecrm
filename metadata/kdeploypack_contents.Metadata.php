<?php
if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');

$dictionary['kdeploypack_contents'] = array(
    'table' => 'kdeploypack_contents',
    'fields' => array(
        array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'kdeploypack_item_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        array(
            'name' => 'content',
            'type' => 'longblob',
        ),
        array(
            'name' => 'ctype',
            'type' => 'varchar',
            'len' => 1
        ),
        array(
            'name' => 'dirs_created',
            'type' => 'varchar'
        ),
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
            'name' => 'kdeploypack_contents',
            'type' => 'primary',
            'fields' => array('id')
        )
    )
);
