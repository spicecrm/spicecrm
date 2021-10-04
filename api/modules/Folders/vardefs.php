<?php

use SpiceCRM\includes\SugarObjects\VardefManager;

global $dictionary;
$dictionary['Folder'] = [
    'table' => 'folders',
    'audited' => false,
    'fields' => [
        'parent_name' => [
            'name'       => 'parent_name',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'type'       => 'parent',
            'vname'      => 'LBL_RELATED_TO',
            'reportable' => false,
            'source'     => 'non-db',
        ],
        'parent_type' => [
            'name'       => 'parent_type',
            'type'       => 'varchar',
            'reportable' => false,
            'len'        => 100,
            'comment'    => 'Identifier of Sugar module to which this email is associated (deprecated as of 4.2)',
        ],
        'parent_id' => [
            'name'       => 'parent_id',
            'type'       => 'id',
            'len'        => '36',
            'reportable' => false,
            'comment'    => 'ID of Sugar object referenced by parent_type (deprecated as of 4.2)',
        ],
        'documents' => [
        'name' => 'documents',
        'type' => 'link',
        'relationship' => 'documents_folders',
        'source' => 'non-db',
        'module' => 'Documents',
        'vname' => 'LBL_DOCUMENTS',]



],
    'relationships' => [
        'documents_folders' => [
            'lhs_module' => 'Folders',
            'lhs_table' => 'folders',
            'lhs_key' => 'id',
            'rhs_module' => 'Documents',
            'rhs_table' => 'documents',
            'rhs_key' => 'folder_id',
            'relationship_type' => 'one-to-many'

        ]
    ]
];



VardefManager::createVardef('Folders', 'Folder', ['default', 'assignable']);
