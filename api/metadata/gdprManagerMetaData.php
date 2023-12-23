<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['sysgdprretentions'] = [
    'table' => 'sysgdprretentions',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'sysmodulefilter_id' => [
            'name' => 'sysmodulefilter_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        'retention_type' => [
            'name' => 'retention_type',
            'type' => 'varchar',
            'len' => '5',
            'comment' => 'the type of action, options are I for inactive, D for delete, P for Purge'
        ],
        'delete_related' => [
            'name' => 'delete_related',
            'type' => 'varchar',
            'len' => '255',
            'comment' => 'a comma separated list of modules where records should also be deleted'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 255
        ],
        'description' => [
            'name' => 'description',
            'type' => 'text'
        ],
        'active' => [
            'name' => 'active',
            'type' => 'bool',
            'default' => 0
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0
        ]
    ],
    'indices' => [
        [
            'name' => 'accounts_contactspk',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];
