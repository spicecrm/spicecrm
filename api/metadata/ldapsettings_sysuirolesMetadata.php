<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

$dictionary ['sysuiroles_ldap_groups'] = [
    'table' => 'sysuiroles_ldap_groups',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'ldap_group_name' => [
            'name' => 'ldap_group_name',
            'type' => 'id'
        ],
        'sysuirole_id' => [
            'name' => 'sysuirole_id',
            'type' => 'id'
        ],
        'defaultrole' =>[
            'name' => 'defaultrole',
            'type' => 'bool',
            'default' => 0
        ],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0
        ]
    ],
    'indices' => [
        [
            'name' => 'sysuiroles_ldap_groupspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_sysuiroles_ldap_groups_ldap_group_name',
            'type' => 'index',
            'fields' => ['ldap_group_name']
        ],
        [
            'name' => 'idx_sysuiroles_ldap_groups_del',
            'type' => 'index',
            'fields' => ['deleted']
        ],
        [
            'name' => 'idx_sysuiroles_ldap_groups_sysuiroleid_default_del',
            'type' => 'index',
            'fields' => ['sysuirole_id', 'defaultrole', 'deleted']
        ]

    ]
];
