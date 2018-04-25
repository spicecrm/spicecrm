<?php
$dictionary['servicequeues_users'] = array(
    'table' => 'servicequeues_users',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id',
            'len' => '36'
        ),
        'servicequeue_id' => array(
            'name' => 'servicequeue_id',
            'type' => 'id',
            'len' => '36'
        ),
        'user_id' => array(
            'name' => 'user_id',
            'type' => 'id',
            'len' => '36'
        ),
        'date_modified' => array(
            'name' => 'date_modified',
            'type' => 'datetime'
        ),
        'deleted' => array(
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'default' => '0',
            'required' => false
        )
    ),
    'relationships' => array(
        'servicequeues_users' => array(
            'lhs_module'=> 'ServiceQueues', 'lhs_table'=> 'servicequeues', 'lhs_key' => 'id',
            'rhs_module'=> 'Users', 'rhs_table'=> 'users', 'rhs_key' => 'id',
            'relationship_type'=>'many-to-many',
            'join_table'=> 'servicequeues_users', 'join_key_lhs'=>'servicequeue_id', 'join_key_rhs'=>'user_id'
        ),
    ),
    'indices' => array(
        array(
            'name' => 'servicequeues_userspk',
            'type' => 'primary',
            'fields' => array('id')
        ),
        array(
            'name' => 'idx_servicequeues_users',
            'type' => 'index',
            'fields' => array('servicequeue_id', 'user_id', 'deleted')
        )
    )
);
