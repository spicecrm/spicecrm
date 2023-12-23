<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['users_totp'] = [
    'table' => 'users_totp',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'required' => true,
        ],
        'user_id' => [
            'name' => 'user_id',
            'vname' => 'LBL_USER_ID',
            'type' => 'varchar',
            'len' => 36,
        ],
        'user_secret' => [
            'name' => 'user_secret',
            'vname' => 'LBL_USER_SECRET',
            'type' => 'varchar',
            'len' => 16,
        ],
        'date_generated' => [
            'name' => 'date_generated',
            'vname' => 'LBL_DATE_ENTERED',
            'type' => 'datetime',
        ],
        'auth_status' => [
            'name' => 'auth_status',
            'vname' => 'LBL_AUTH_STATUS',
            'type' => 'varchar',
            'len' => 1,
            'comment' => 'the status of the secret, C created, A active'
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
            'name' => 'users_totp_pk',
            'type' => 'primary',
            'fields' => [
                'id'
            ]
        ],
        [
            'name' => 'users_totp_userid',
            'type' => 'index',
            'fields' => [
                'user_id',
                'deleted'
            ]
        ]
    ],
];
