<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

/**
 * CR1000108
 * Tables for Spice variable definitions
 */
SpiceDictionaryHandler::getInstance()->dictionary['sysreservedwords'] = [
    'table' => 'sysreservedwords',
    'comment' => 'contains reserved word for a context like database',
    'audited' => false,
    'fields' =>
        [
            'id' => [
                'name' => 'id',
                'type' => 'id'
            ],
            'word' => [
                'name' => 'word',
                'type' => 'varchar',
                'len' => 100
            ],
            'wordcontext' => [
                'name' => 'wordcontext',
                'type' => 'varchar',
                'len' => 20,
                'comment' => 'database, api...'
            ],
            'wordcontexttype' => [
                'name' => 'wordcontexttype',
                'type' => 'varchar',
                'len' => 20,
                'comment' => 'database type like oracle, mysql or any other categprization'
            ],
            'wordstatus' => [
                'name' => 'wordstatus',
                'type' => 'varchar',
                'len' => 20,
                'comment' => 'reserved|keyword'
            ],
            'wordcomment' => [
                'name' => 'wordcomment',
                'type' => 'varchar',
                'len' => 255,
                'comment' => 'a comment on the word like when added, removed or set (not) reserved'
            ],
            'deleted' => [
                'name' => 'deleted',
                'type' => 'bool',
                'default' => 0
            ]
        ],
    'indices' => [
        [
            'name' => 'sysreservedwordspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_sysreservedwordscontext',
            'type' => 'index',
            'fields' => ['wordcontext', 'deleted']
        ],
        [
            'name' => 'idx_sysreservedwords',
            'type' => 'index',
            'fields' => ['wordcontext', 'wordstatus', 'deleted']
        ],
    ]
];
