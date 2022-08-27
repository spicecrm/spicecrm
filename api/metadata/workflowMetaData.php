<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;


SpiceDictionaryHandler::getInstance()->dictionary['workflowtasktypes'] = [
    'table' => 'workflowtasktypes',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 16
        ],
        'handler_class' => [
            'name' => 'handler_class',
            'type' => 'varchar'
        ],
        'admin_component' => [
            'name' => 'admin_component',
            'type' => 'varchar',
            'len' => 100
        ],
        'frontend_component' => [
            'name' => 'frontend_component',
            'type' => 'varchar',
            'len' => 100
        ],
        'type' => [
            'name' => 'type',
            'type' => 'enum',
            'options' => 'workflowtasktypes_type_enum',
            'default' => 'regular'
        ],
        'icon' => [
            'name' => 'icon',
            'type' => 'enum',
            'options' => 'workflowtasktypes_icon_enum'
        ],
        'assignable' => [
            'name' => 'assignable',
            'type' => 'bool',
            'default' => true,
            'comment' => 'if tasks of this type can be assigned to users'
        ],
        'has_timing' => [
            'name' => 'has_timing',
            'type' => 'bool',
            'default' => true,
            'comment' => 'if tasks of this type can set timing'
        ],
        'typedefaults' => [
            'name' => 'typedefaults',
            'type' => 'json',
            'comment' => 'any defaults for this tasktype'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
        ],
        'version' => [
            'name' => 'version',
            'type' => 'varchar',
            'len' => 16
        ],
        'package' => [
            'name' => 'package',
            'type' => 'varchar',
            'len' => 32
        ]
    ],
    'indices' => [
        [
            'name' => 'workflowtasktypespk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_workflowtasktypes_deleted',
            'type' => 'index',
            'fields' => ['deleted']
        ]
    ]
];