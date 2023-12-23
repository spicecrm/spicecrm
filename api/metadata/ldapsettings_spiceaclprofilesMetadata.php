<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['spiceaclprofiles_ldap_groups'] = [
    'table' => 'spiceaclprofiles_ldap_groups',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'ldap_group_name' => [
            'name' => 'ldap_group_name',
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
            'name' => 'spiceaclprofiles_ldap_groupspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_spiceaclprofiles_ldap_groups_ldap_group_name',
            'type' => 'index',
            'fields' => ['ldap_group_name']
        ],
        [
            'name' => 'idx_spiceaclprofiles_ldap_groups_spiceaclprofile_id',
            'type' => 'index',
            'fields' => ['spiceaclprofile_id']
        ]

    ]
];
