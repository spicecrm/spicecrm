<?php

use SpiceCRM\includes\SugarObjects\VardefManager;

global $dictionary;
$dictionary['Folder'] = [
    'table' => 'folders',
    'audited' => false,
    'fields' => [
        'module' => [
            'name'      => 'module',
            'type'      => 'varchar',
            'vname'     => 'LBL_MODULE',
            'required'  => true
        ],
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
        'parent_folder' => [
            'name' => 'parent_folder',
            'type' => 'link',
            'relationship' => 'folders_folders',
            'source' => 'non-db',
            'module' => 'Folders',
            'vname' => 'LBL_PARENT_FOLDER',
            'link_type' => 'one',
            'side' => 'right',
        ],
        'child_folders' => [
            'name' => 'child_folders',
            'type' => 'link',
            'relationship' => 'folders_folders',
            'source' => 'non-db',
            'module' => 'Folders',
            'vname' => 'LBL_CHILD_FOLDERS',
        ],
        'documents' => [
            'name' => 'documents',
            'type' => 'link',
            'relationship' => 'documents_folders',
            'source' => 'non-db',
            'module' => 'Documents',
            'vname' => 'LBL_DOCUMENTS',
        ]
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
        ],
        'folders_folders' => [
            'lhs_module' => 'Folders',
            'lhs_table' => 'folders',
            'lhs_key' => 'id',
            'rhs_module' => 'Folders',
            'rhs_table' => 'folders',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many'
        ]
    ]
];

VardefManager::createVardef('Folders', 'Folder', ['default', 'assignable']);
