<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['cron_remove_documents'] = [
    'table' => 'cron_remove_documents',
    'fields' => [
        [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ],
        [
            'name' => 'bean_id',
            'type' => 'varchar',
            'len' => '36'
        ],
        [
            'name' => 'module',
            'type' => 'varchar',
            'len' => '25'
        ],
        [
            'name' =>'date_modified',
            'type' => 'datetime'
        ]
    ],
    'indices' => [
        [
            'name' => 'cron_remove_documentspk',
            'type' =>'primary',
            'fields'=> ['id']
        ],
        [
            'name' => 'idx_cron_remove_document_bean_id',
            'type' => 'index',
            'fields' => ['bean_id']
        ],
        [
            'name' => 'idx_cron_remove_document_stamp',
            'type' => 'index',
            'fields' => ['date_modified']
        ]
    ]
];
