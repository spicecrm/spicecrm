<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary ['SpiceACLProfiles_SpiceACLObjects'] = [
    'table' => 'spiceaclprofiles_spiceaclobjects',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'spiceaclobject_id' => [
            'name' => 'spiceaclobject_id',
            'type' => 'id'
        ],
        'spiceaclprofile_id' => [
            'name' => 'spiceaclprofile_id',
            'type' => 'id'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => false
        ]
    ],
    'indices' => [
        [
            'name' => 'spiceaclprofiles_spricaclobjects_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_spiceaclprofilesaclobjects_objid',
            'type' => 'index',
            'fields' => ['spiceaclobject_id']
        ],
        [
            'name' => 'idx_spiceaclprofilesaclobjects_profid',
            'type' => 'index',
            'fields' => ['spiceaclprofile_id']
        ]

    ],
    'relationships' => [
        'spiceaclprofiles_spiceaclobjects' => [
            'lhs_module' => 'SpiceACLProfiles',
            'lhs_table' => 'spiceaclprofiles',
            'lhs_key' => 'id',
            'rhs_module' => 'SpiceACLObjects',
            'rhs_table' => 'spiceaclobjects',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'projects_contacts',
            'join_key_lhs' => 'spiceaclprofile_id',
            'join_key_rhs' => 'spiceaclobject_id'
        ]
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['spiceaclprofiles_users'] = [
    'table' => 'spiceaclprofiles_users',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'id'
        ],
        'spiceaclprofile_id' => [
            'name' => 'spiceaclprofile_id',
            'type' => 'id'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => '0'
        ]
    ],
    'indices' => [
        [
            'name' => 'spiceaclprofiles_users_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'spiceaclprofiles_users_userid',
            'type' => 'index',
            'fields' => ['user_id']
        ],
        [
            'name' => 'spiceaclprofiles_users_profileid',
            'type' => 'index',
            'fields' => ['user_id', 'spiceaclprofile_id']
        ]
    ],
    'relationships' => [
        'spiceaclprofiles_users' => [
            'lhs_module' => 'Users',
            'lhs_table' => 'users',
            'lhs_key' => 'id',
            'rhs_module' => 'SpiceACLProfiles',
            'rhs_table' => 'spiceaclprofiles',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'spiceaclprofiles_users',
            'join_key_lhs' => 'user_id',
            'join_key_rhs' => 'spiceaclprofile_id',
        ]
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['spiceaclprofiles_orgunits'] = [
    'table' => 'spiceaclprofiles_orgunits',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'orgunit_id' => [
            'name' => 'orgunit_id',
            'type' => 'id'
        ],
        'spiceaclprofile_id' => [
            'name' => 'spiceaclprofile_id',
            'type' => 'id'
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => '0'
        ]
    ],
    'indices' => [
        'spiceaclprofiles_orgunits_pk' => [
            'name' => 'spiceaclprofiles_orgunits_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        'spiceaclprofiles_orgunits_orgunitid' => [
            'name' => 'spiceaclprofiles_orgunits_orgunitid',
            'type' => 'index',
            'fields' => ['orgunit_id']
        ],
        'spiceaclprofiles_orgunits_profileid' => [
            'name' => 'spiceaclprofiles_orgunits_profileid',
            'type' => 'index',
            'fields' => ['orgunit_id', 'spiceaclprofile_id']
        ]
    ],
    'relationships' => [
        'spiceaclprofiles_orgunits' => [
            'lhs_module' => 'OrgUnits',
            'lhs_table' => 'orgunits',
            'lhs_key' => 'id',
            'rhs_module' => 'SpiceACLProfiles',
            'rhs_table' => 'spiceaclprofiles',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'spiceaclprofiles_orgunits',
            'join_key_lhs' => 'orgunit_id',
            'join_key_rhs' => 'spiceaclprofile_id',
        ]
    ]
];
