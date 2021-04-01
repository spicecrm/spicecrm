<?php
$dictionary['sysgsuiteuserconfig'] = [
    'table' => 'sysgsuiteuserconfig',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'id',
        ],
        'scope' => [
            'name' => 'scope',
            'vname' => 'LBL_SCOPE',
            'type' => 'varchar',
            'len' => 36
        ],
        'sync_token' => [
            'name' => 'sync_token',
            'type' => 'varchar',
            'len' => 64
        ]
    ],
    'indices' => [
        [
            'name' => 'sysgsuiteuserconfigpk',
            'type' => 'primary',
            'fields' => ['id'],
        ],
        [
            'name' => 'idx_sysgsuiteuserconfiguser',
            'type' => 'index',
            'fields' => ['user_id'],
        ],
    ],
];


$dictionary['sysgsuiteusersubscriptions'] = [
    'table' => 'sysgsuiteusersubscriptions',
    'fields' => [
        'subscriptionid' => [
            'name'     => 'subscriptionid',
            'type'     => 'id',
            'len'      => 36,
            'required' => true,
            'comment' => 'a subscription ID added when subscribing'
        ],
        'resourceid' => [
            'name' => 'resourceid',
            'type' => 'varchar',
            'len' => 100
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'id'
        ],
        'expiration' => [
            'name' => 'expiration',
            'type' => 'datetime'
        ],
        'last_active' => [
            'name' => 'last_active',
            'type' => 'datetime'
        ]
    ],
    'indices' => [
        [
            'name' => 'sysgsuiteusersubscriptionspk',
            'type' => 'primary',
            'fields' => ['subscriptionid']
        ],
        [
            'name' => 'idx_sysgsuiteusersubscriptionsuser',
            'type' => 'index',
            'fields' => ['user_id']
        ]
    ]
];
