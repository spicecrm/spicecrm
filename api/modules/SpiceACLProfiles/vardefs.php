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
            'options' => 'kauthprofiles_status'
        ],
        'users' =>    [
            'name' => 'users',
            'type' => 'link',
            'relationship' => 'spiceaclprofiles_users',
            'source' => 'non-db',
            'module' => 'Users',
            'vname' => 'LBL_USERS',
        ],
        'for_portal_users' => [
            'name' => 'for_portal_users',
            'vname' => 'LBL_FOR_PORTAL_USERS',
            'type' => 'bool',
            'default' => '0',
            'comment' => 'ACL profile is intended for portal users.'
        ]
    ],
    'indices' => [
    ]
];

VardefManager::createVardef('SpiceACLProfiles', 'SpiceACLProfile', ['default']);

