<?php

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['SpiceImport'] = [
    'table' => 'spiceimports',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'required' => true,
            'reportable'=>true,
            'comment' => 'Unique identifier'
        ],
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => '50',
            'importable' => 'required',
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'vname' => 'LBL_DATE_ENTERED',
            'type' => 'datetime',
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'vname' => 'LBL_DATE_MODIFIED',
            'type' => 'datetime',
        ],
        'modified_user_id' => [
            'name' => 'modified_user_id',
            'rname' => 'user_name',
            'id_name' => 'modified_user_id',
            'vname' => 'LBL_MODIFIED_BY',
            'type' => 'assigned_user_name',
            'table' => 'modified_user_id_users',
            'isnull' => 'false',
            'dbType' => 'id',
            'reportable'=>true,
        ],
        'created_by' => [
            'name' => 'created_by',
            'rname' => 'user_name',
            'id_name' => 'created_by',
            'vname' => 'LBL_CREATED',
            'type' => 'assigned_user_name',
            'table' => 'created_by_users',
            'isnull' => false,
            'dbType' => 'id',
            'len' => 36,
        ],
        'description' => [
            'name' => 'description',
            'type' => 'text'
        ],
        'deleted' => [
            'name' => 'deleted',
            'vname' => 'LBL_DELETED',
            'type' => 'bool',
            'reportable'=>false,
            'comment' => 'Record deletion indicator'
        ],
        'tags' => [
            'name' => 'tags',
            'type' => 'text'
        ],
        'assigned_user_id' => [
            'name' => 'assigned_user_id',
            'vname' => 'LBL_USER_ID',
            'type' => 'id',
            'required' => true,
            'reportable' => false,
        ],
        'status' => [
            'name' => 'status',
            'type' => 'enum',
            'options' => 'spiceimports_status_dom',
            'len' => 1,
            'vname' => 'LBL_STATUS'
        ],
        'data' => [
            'name' => 'data',
            'type' => 'text',
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
        ],

    ],
    'indices' => [
        'id' => ['name' => 'spiceimports_pk', 'type' => 'primary', 'fields' => ['id']],
    ]
];


VardefManager::createVardef('SpiceImports', 'SpiceImport', ['default', 'assignable']);
