<?php


use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['UserAbsence'] = [
    'table' => 'userabsences',
    'comment' => 'UserAbsences Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

    'fields' => [
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'required' => false,
        ],
        'date_start' => [
            'name' => 'date_start',
            'vname' => 'LBL_DATE_START',
            'type' => 'date',
            'audited' => true,
            'required' => true,
        ],
        'date_end' => [
            'name' => 'date_end',
            'vname' => 'LBL_DATE_END',
            'type' => 'date',
            'audited' => true,
            'required' => true,
        ],
        'type' => [
            'name' => 'type',
            'vname' => 'LBL_TYPE',
            'type' => 'enum',
            'required' => true,
            'reportable' => false,
            'options' => 'userabsences_type_dom',
        ],
        'status' => [
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'required' => true,
            'default' => 'created',
            'options' => 'userabsences_status_dom',
        ],
        'user_id' => [
            'name' => 'user_id',
            'vname' => 'LBL_USER_ID',
            'type' => 'id',
        ],
        'user_name' => [
            'name' => 'user_name',
            'rname' => 'name',
            'id_name' => 'user_id',
            'vname' => 'LBL_USER',
            'type' => 'relate',
            'table' => 'users',
            'module' => 'Users',
            'dbType' => 'varchar',
            'link' => 'users',
            'len' => 255,
            'source' => 'non-db'
        ],
        'users' => [
            'name' => 'users',
            'vname' => 'LBL_USERS',
            'type' => 'link',
            'relationship' => 'users_userabsences',
            'source' => 'non-db',
            'module' => 'Users'
        ],
        'representative_id' => [
            'name' => 'representative_id',
            'vname' => 'LBL_USER_ID',
            'type' => 'id',
        ],
        'representative_name' => [
            'name' => 'representative_name',
            'rname' => 'name',
            'id_name' => 'representative_id',
            'vname' => 'LBL_REPRESENTATIVE',
            'type' => 'relate',
            'table' => 'users',
            'module' => 'Users',
            'dbType' => 'varchar',
            'link' => 'representative_link',
            'len' => 255,
            'source' => 'non-db'
        ],
        'representative_link' => [
            'name' => 'representative_link',
            'vname' => 'LBL_REPRESENTATIVE_DURING_ABSENCE',
            'type' => 'link',
            'relationship' => 'representatives_userabsences',
            'source' => 'non-db',
            'module' => 'Users'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_userabsences_userid',
            'type' => 'index',
            'fields' => ['user_id']
        ]
    ]
];

VardefManager::createVardef('UserAbsences', 'UserAbsence', ['default', 'assignable']);
