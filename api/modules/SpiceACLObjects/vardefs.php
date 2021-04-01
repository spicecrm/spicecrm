<?php

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary ['SpiceACLObject'] = [
    'table' => 'spiceaclobjects',
    'fields' => [
        'sysmodule_id' => [
            'name' => 'sysmodule_id',
            'vname' => 'LBL_SYSMODULE_ID',
            'required' => true,
            'type' => 'varchar',
            'len' => 60
        ],
        'spiceacltype_module' => [
            'name' => 'spiceacltype_module',
            'type' => 'varchar',
            'len' => 60,
            'source' => 'non-db'
        ],
        'spiceaclobjecttype' => [
            'name' => 'spiceaclobjecttype',
            'vname' => 'LBL_SPICEACLOBJECTTYPE',
            'type' => 'enum',
            'len' => 1,
            'options' => 'spiceaclobjects_types_dom'
        ],
        'description' => [
            'name' => 'description',
            'vname' => 'LBL_DESCRIPTION',
            'type' => 'text'],
        'status' => [
            'name' => 'status',
            'vname' => 'LBL_STATUS',
            'type' => 'enum',
            'len' => 1,
            'options' => 'kauthprofiles_status'],
        'spiceaclorgassignment' => [
            'name' => 'spiceaclorgassignment',
            'vname' => 'LBL_SPICEACLORGASSIGNMENT',
            'type' => 'varchar',
            'len' => 2
        ],
        'spiceaclowner' => [
            'name' => 'spiceaclowner',
            'vname' => 'LBL_SPICEACLOWNER',
            'type' => 'bool',
            'default' => false
        ],
        'spiceaclcreator' => [
            'name' => 'spiceaclcreator',
            'vname' => 'LBL_SPICEACLCREATOR',
            'type' => 'bool',
            'default' => false
        ],
        'allorgobjects' => [
            'name' => 'allorgobjects',
            'vname' => 'LBL_ALLORGOBJECTS',
            'type' => 'bool',
            'default' => false
        ],
        'activity' => [
            'name' => 'activity',
            'vname' => 'LBL_ACTIVITY',
            'type' => 'varchar',
            'len' => 36],
        'customsql' => [
            'name' => 'customsql',
            'vname' => 'LBL_CUSTOMSQL',
            'type' => 'base64',
            'dbType' => 'text'
        ],
        'fieldvalues' => [
            'name' => 'fieldvalues',
            'type' => 'json',
            'source' => 'non-db'
        ],
        'fieldcontrols' => [
            'name' => 'fieldcontrols',
            'type' => 'json',
            'source' => 'non-db'
        ],
        'objectactions' => [
            'name' => 'objectactions',
            'type' => 'json',
            'source' => 'non-db'
        ],
        'territoryelementvalues' => [
            'name' => 'territoryelementvalues',
            'type' => 'json',
            'source' => 'non-db'
        ]
    ]
];

VardefManager::createVardef('SpiceACLObjects', 'SpiceACLObject', ['default']);

