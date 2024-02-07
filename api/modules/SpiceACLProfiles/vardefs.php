<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['SpiceACLProfile'] = [
    'table' => 'spiceaclprofiles',
    'fields' => [
        'status' => [
            'name' => 'status',
            'type' => 'enum',
            'len' => 1,
            'options' => 'kauthprofiles_status'
        ],
        'is_global' =>    [
            'name' => 'is_global',
            'type' => 'bool',
            'source' => 'non-db',
            'comment' => 'a boolean indicator if the proile is assigned to all users'
        ],
        'users' =>    [
            'name' => 'users',
            'type' => 'link',
            'relationship' => 'spiceaclprofiles_users',
            'source' => 'non-db',
            'module' => 'Users',
            'vname' => 'LBL_USERS',
        ],
        'orgunits' =>    [
            'name' => 'orgunits',
            'type' => 'link',
            'relationship' => 'spiceaclprofiles_orgunits',
            'source' => 'non-db',
            'module' => 'OrgUnits',
            'vname' => 'LBL_ORGUNITS',
        ],
        'for_portal_users' => [
            'name' => 'for_portal_users',
            'vname' => 'LBL_FOR_PORTAL_USERS',
            'type' => 'bool',
            'default' => '0',
            'comment' => 'ACL profile is intended for portal users.'
        ],
        'spiceaclprofilescope' => [
            'name' => 'spiceaclprofilescope',
            'type' => 'varchar',
            'len' => 1,
            'default' => 'i',
            'comment' => 'defines the scope for the profile if applied to employees or all other users, a for all, i for internal e for external'
        ],
    ],
    'indices' => [
    ]
];

VardefManager::createVardef('SpiceACLProfiles', 'SpiceACLProfile', ['default']);
