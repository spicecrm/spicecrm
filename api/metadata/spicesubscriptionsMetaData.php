<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['spicesubscriptions'] = [
    'table'  => 'spicesubscriptions',
    'fields' => [
        'user_id'     => [
            'name' => 'user_id',
            'type' => 'id',
            'len'  => '36',
            'required' => true
        ],
        'bean_id'     => [
            'name' => 'bean_id',
            'type' => 'id',
            'len'  => '36',
            'required' => true
        ],
        'bean_module' => [
            'name'    => 'bean_module',
            'type'    => 'varchar',
            'len'     => '255',
            'comment' => 'The name of the bean module',
            'required' => true
        ],
    ],
    'indices' => [
        [
            'name'   => 'spicesubscriptions_pk',
            'type'   => 'unique',
            'fields' => ['user_id', 'bean_id'],
        ]
    ],
];
