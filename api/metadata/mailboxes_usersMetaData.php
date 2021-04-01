<?php
$dictionary['mailboxes_users'] = [
    'table' => 'mailboxes_users',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'len' => '36'
        ],
        'mailbox_id' => [
            'name' => 'mailbox_id',
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
        'mailboxes_users' => [
            'lhs_module'=> 'Mailboxes',
            'lhs_table'=> 'mailboxes',
            'lhs_key' => 'id',
            'rhs_module'=> 'Users',
            'rhs_table'=> 'users',
            'rhs_key' => 'id',
            'relationship_type'=>'many-to-many',
            'join_table'=> 'mailboxes_users',
            'join_key_lhs'=>'mailbox_id',
            'join_key_rhs'=>'user_id'
        ],
    ],
    'indices' => [
        [
            'name' => 'mailboxes_userspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_mailboxes_users',
            'type' => 'index',
            'fields' => ['mailbox_id', 'user_id', 'deleted']
        ]
    ]
];
