<?php

$dictionary ['SpiceACLProfiles_LdapGrups'] = array(
    'table' => 'spiceaclprofiles_ldap_groups',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'id'
        ),
        'ldap_group_name' => array(
            'name' => 'ldap_group_name',
            'type' => 'id'
        ),
        'spiceaclprofile_id' => array(
            'name' => 'spiceaclprofile_id',
            'type' => 'id'
        ),
        'date_modified' => array(
            'name' => 'date_modified',
            'type' => 'datetime'
        ),
        'deleted' => array(
            'name' => 'deleted',
            'type' => 'bool',
            'default' => false
        )
    ),
    'indices' => array(
        array(
            'name' => 'idx_ldap_group_name',
            'type' => 'index',
            'fields' => array('ldap_group_name')
        ),
        array(
            'name' => 'idx_spiceaclprofile_id',
            'type' => 'index',
            'fields' => array('spiceaclprofile_id')
        )

    )
);

