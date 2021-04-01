<?php

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary ['SpiceACLProfile'] = [
    'table' => 'spiceaclprofiles',
    'fields' => [
        'status' => [
            'name' => 'status',
            'type' => 'enum',
            'len' => 1,
            'options' => 'kauthprofiles_status'],
        'users' =>    [
            'name' => 'users',
            'type' => 'link',
            'relationship' => 'spiceaclprofiles_users',
            'source' => 'non-db',
            'module' => 'Users',
            'vname' => 'LBL_USERS',
        ],
    ],
    'indices' => [
    ]
];

VardefManager::createVardef('SpiceACLProfiles', 'SpiceACLProfile', ['default']);

