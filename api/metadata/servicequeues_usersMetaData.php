<?php
$dictionary['servicequeues_users'] = [
    'table' => 'servicequeues_users',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'len' => '36'
        ],
        'servicequeue_id' => [
            'name' => 'servicequeue_id',
            'type' => 'id',
            'len' => '36'
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'id',
            'len' => '36'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'default' => '0',
            'required' => false
        ]
    ],
    'relationships' => [
        'servicequeues_users' => [
            'lhs_module'=> 'ServiceQueues', 'lhs_table'=> 'servicequeues', 'lhs_key' => 'id',
            'rhs_module'=> 'Users', 'rhs_table'=> 'users', 'rhs_key' => 'id',
            'relationship_type'=>'many-to-many',
            'join_table'=> 'servicequeues_users', 'join_key_lhs'=>'servicequeue_id', 'join_key_rhs'=>'user_id'
        ],
    ],
    'indices' => [
        [
            'name' => 'servicequeues_userspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_servicequeues_users',
            'type' => 'index',
            'fields' => ['servicequeue_id', 'user_id', 'deleted']
        ]
    ]
];
