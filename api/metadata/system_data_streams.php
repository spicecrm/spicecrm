<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['sysdatastreams'] = [
    'table' => 'sysdatastreams',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
        ],
        'class_namespace' => [
            'name' => 'class_namespace',
            'type' => 'varchar'
        ],
        'config' => [
            'name' => 'config',
            'type' => 'json',
            'dbtype' => 'text',
        ]
    ],
    'indices' => [
        [
            'name' => 'sysdatastreams_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
    ]
];
