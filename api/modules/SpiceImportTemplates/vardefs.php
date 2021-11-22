<?php


use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['SpiceImportTemplate'] = [
    'table' => 'spiceimporttemplates',
    'comment' => 'SpiceImportTemplates Module',
    'duplicate_merge' =>  false,
    'unified_search' =>  false,
    'audited' =>  false,
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'mappings' => [
            'name' => 'mappings',
            'type' => 'text'
        ],
        'fixed' => [
            'name' => 'fixed',
            'type' => 'text'
        ],
        'checks' => [
            'name' => 'checks',
            'type' => 'text'
        ]
    ],
    'indices' => [

    ]
];

VardefManager::createVardef('SpiceImportTemplates', 'SpiceImportTemplate', ['default', 'assignable']);
