<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['user_device_ids'] = [
    'table' => 'user_device_ids',
    'contenttype'   => 'sensitive_data',
    'fields' => [
        'id' =>  [
            'name' => 'id',
            'type' => 'varchar',
            'len' => 100
        ],
        'user_id' =>  [
            'name' => 'user_id',
            'type' => 'id',
        ],
        'user_ip' =>  [
            'name' => 'user_ip',
            'type' => 'varchar',
            'len' => 15
        ],
        'expires_in' =>  [
            'name' => 'expires_in',
            'type' => 'date',
        ]
    ],
    'indices' => [
        [
            'name' => 'users_device_ids_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['user_2fa_codes'] = [
    'table' => 'user_2fa_codes',
    'contenttype'   => 'sensitive_data',
    'fields' => [
        'id' =>  [
            'name' => 'id',
            'type' => 'varchar',
            'len' => 100
        ],
        'user_id' =>  [
            'name' => 'user_id',
            'type' => 'id',
        ],
        'expires_in' =>  [
            'name' => 'expires_in',
            'type' => 'datetime',
        ]
    ],
    'indices' => [
        [
            'name' => 'user_2fa_codes_ids_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
    ]
];