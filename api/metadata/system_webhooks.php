<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['syswebhooks'] = [
    'table' => 'syswebhooks',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 50
        ],
        'event' => [
            'name' => 'event',
            'type' => 'varchar',
            'len' => 50
        ],
        'url' => [
            'name' => 'url',
            'type' => 'varchar',
            'len' => 100
        ],
        'active' => [
            'name' => 'active',
            'type' => 'bool',
            'default' => 0
        ],
        'send_data' => [
            'name' => 'send_data',
            'type' => 'bool',
            'default' => 0
        ],
        'modulefilter_id' => [
            'name' => 'modulefilter_id',
            'type' => 'id'
        ],
        'fieldset_id' => [
            'name' => 'fieldset_id',
            'type' => 'id',

        ],
        'ssl_verifypeer' => [
            'name' => 'ssl_verifypeer',
            'type' => 'bool',
            'default' => 1

        ],
        'ssl_verifyhost' => [
            'name' => 'ssl_verifyhost',
            'type' => 'bool',
            'default' => 1

        ],
        'custom_headers' => [
            'name' => 'custom_headers',
            'dbtype' => 'text'
        ]
    ],
    'indices' => [
        [
            'name' => 'webhookspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_webhooks_module',
            'type' => 'index',
            'fields' => ['module']
        ]
    ]
];
