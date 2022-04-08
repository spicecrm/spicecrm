<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['systemdeploymentcrs_users'] = [
    'table' => 'systemdeploymentcrs_users',
    'contenttype'   => 'relationdata',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'systemdeploymentcr_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'user_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'user_role', 'type' => 'multienum', 'dbType' => 'text', 'options' => 'cruser_role_dom'], // CR1000333
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false]
    ],
    'indices' => [
        ['name' => 'systemdeploymentcrs_userspk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'idx_systemdeploymentcrs_users', 'type' => 'alternate_key', 'fields' => ['systemdeploymentcr_id', 'user_id']],
        ['name' => 'idx_systemdeploymentcrs_crid', 'type' => 'index', 'fields' => ['systemdeploymentcr_id']],
        ['name' => 'idx_systemdeploymentcrs_userid', 'type' => 'index', 'fields' => ['user_id']],
    ],
    'relationships' => [
        'systemdeploymentcrs_users' => [
            'lhs_module' => 'SystemDeploymentCRs',
            'lhs_table' => 'systemdeploymentcrs',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'systemdeploymentcrs_users',
            'join_key_lhs' => 'systemdeploymentcr_id',
            'join_key_rhs' => 'user_id',
        ],
    ],
];
