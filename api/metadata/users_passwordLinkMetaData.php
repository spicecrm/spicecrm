<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['users_password_link'] = [
    'table' => 'users_password_link',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'required' => true,
        ],
        'username' => [
            'name' => 'username',
            'vname' => 'LBL_USERNAME',
            'type' => 'varchar',
            'len' => 36,
        ],
        'date_generated' => [
            'name' => 'date_generated',
            'vname' => 'LBL_DATE_ENTERED',
            'type' => 'datetime',
        ],
        'deleted' => [
            'name' => 'deleted',
            'vname' => 'LBL_DELETED',
            'type' => 'bool',
            'required' => false,
            'reportable' => false,
        ],
    ],
    'indices' => [
        [
            'name' => 'users_password_link_pk',
            'type' => 'primary',
            'fields' => [
                'id'
            ]
        ],
        [
            'name' => 'idx_username',
            'type' => 'index',
            'fields' => [
                'username'
            ]
        ]
    ],
];

SpiceDictionaryHandler::getInstance()->dictionary['users_password_tokens'] = [
    'table' => 'users_password_tokens',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'required' => true,
        ],
        'user_id' => [
            'name' => 'user_id',
            'vname' => 'LBL_USERNAME',
            'type' => 'varchar',
            'len' => 36,
        ],
        'date_generated' => [
            'name' => 'date_generated',
            'vname' => 'LBL_DATE_ENTERED',
            'type' => 'datetime',
        ],
    ],
    'indices' => [
        [
            'name' => 'users_password_tokens_pk',
            'type' => 'primary',
            'fields' => [
                'id'
            ]
        ],
        [
            'name' => 'idx_user_id',
            'type' => 'index',
            'fields' => [
                'user_id'
            ]
        ]
    ],
];
