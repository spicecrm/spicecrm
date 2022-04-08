<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['spicethemepages_users'] = [
    'table' => 'spicethemepages_users',
    'contenttype'   => 'relationdata',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'spicethemepage_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'user_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'required' => false, 'default' => '0']
    ],
    'indices' => [
        ['name' => 'spicethemepages_userspk', 'type' => 'primary', 'fields' => ['id']]
    ],
    'relationships' => [
        'ausers_spicethemepages' => [
            'lhs_module' => 'SpiceThemePages',
            'lhs_table' => 'spicethemepages',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'spicethemepages_users',
            'join_key_lhs' => 'spicethemepage_id',
            'join_key_rhs' => 'user_id']
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['spicethemepages_aclroles'] = [
    'table' => 'spicethemepages_aclroles',
    'contenttype'   => 'relationdata',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'spicethemepage_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'aclrole_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'required' => false, 'default' => '0']
    ],
    'indices' => [
        ['name' => 'spicethemepages_aclrolespk', 'type' => 'primary', 'fields' => ['id']]
    ],
    'relationships' => [
        'aclroles_spicethemepages' => [
            'lhs_module' => 'SpiceThemePages',
            'lhs_table' => 'spicethemepages',
            'lhs_key' => 'id',
            'rhs_module' => 'ACLRoles',
            'rhs_table' => 'acl_roles',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'spicethemepages_aclroles',
            'join_key_lhs' => 'spicethemepage_id',
            'join_key_rhs' => 'aclrole_id']
    ]
];
