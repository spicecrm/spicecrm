<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['authentication_services'] = [
    'table' => 'authentication_services',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id'
        ],
        'issuer' => [
            'name' => 'issuer',
            'vname' => 'LBL_ISSUER',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'unique key to retrieve by'
        ],
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => 100,
        ],
        'icon' => [
            'name' => 'icon',
            'vname' => 'LBL_ICON',
            'type' => 'longtext',
        ],
        'class_name' => [
            'name' => 'class_name',
            'vname' => 'LBL_CLASS_NAME',
            'type' => 'varchar',
            'comment' => 'holds the class name of the authentication class'
        ],
        'sequence' => [
            'name' => 'sequence',
            'vname' => 'LBL_SEQUENCE',
            'type' => 'int',
            'len' => 2,
            'comment' => 'sort sequence of the buttons'
        ],
    ],
    'indices' => [
        [
            'name' => 'oauth_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_oauth_issuer',
            'type' => 'index',
            'fields' => ['issuer']
        ]
    ],
];

SpiceDictionaryHandler::getInstance()->dictionary['sysauthconfig'] = [
    'table' => 'sysauthconfig',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'char',
            'len' => 36,
            'comment' => 'An ID field to make it possible to administrate records via workbench > Auth Config interface.',
            'isnull' => true
            // not set as primary key yet to enable the update via repair/rebuild!
        ],
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => 100,
        ],
        'issuer' => [
            'name' => 'issuer',
            'vname' => 'LBL_ISSUER',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'unique key to retrieve by'
        ],
        'config' => [
            'name' => 'config',
            'vname' => 'LBL_CONFIG',
            'type' => 'json',
            'dbtype' => 'text',
            'comment' => 'holds the configuration of the service'
        ]
    ]
];
