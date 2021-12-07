<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['SystemTenant'] = [
    'table' => 'systemtenants',
    'comment' => 'SystemTenants Module',
    'fields' => [
        'db_name' => [
            'name' => 'db_name',
            'vname' => 'LBL_DB_NAME',
            'type' => 'varchar',
            'len' => 36,
            'comment' => 'Name of tenants database',
        ],
        'systemtenant_status' => [
            'name' => 'systemtenant_status',
            'vname' => 'LBL_STATUS',
            'type' => 'varchar',
            'len' => 5,
            'comment' => 'status of the tenant',
        ],
        'initialized' => [
            'name'  => 'initialized',
            'vname' => 'LBL_INITIALIZED',
            'type'  => 'bool',
        ],
        'is_trial' => [
            'name' => 'is_trial',
            'vname' => 'LBL_IS_TRIAL',
            'type' => 'bool',
            'comment' => 'indicates that the tenant is a trial tenant',
        ],
        'valid_until' => [
            'name' => 'valid_until',
            'vname' => 'LBL_VALID_UNTIL',
            'type' => 'date',
            'comment' => 'indicates the expiry date of the current tenant',
        ],
        'limit_database' => [
            'name' => 'limit_database',
            'vname' => 'LBL_LIMIT_DATABASE',
            'type' => 'int',
            'comment' => 'the maximum database size limit in MB',
        ],
        'limit_uploads' => [
            'name' => 'limit_uploads',
            'vname' => 'LBL_LIMIT_UPLOADS',
            'type' => 'int',
            'comment' => 'the maximum upload files limit in MB',
        ],
        'limit_users' => [
            'name' => 'limit_users',
            'vname' => 'LBL_LIMIT_USERS',
            'type' => 'int',
            'comment' => 'the maximum number of users on the system',
        ],
        'limit_elastic' => [
            'name' => 'limit_elastic',
            'vname' => 'LBL_LIMIT_ELASTIC',
            'type' => 'int',
            'comment' => 'the maximum elastic indices size limit in MB',
        ],
        'users' => [
            'name' => 'users',
            'type' => 'link',
            'vname' => 'LBL_USERS',
            'relationship' => 'systemtenant_users',
            'module' => 'Users',
            'source' => 'non-db'
        ],
        'deploymentpackages' => [
            'name'         => 'deploymentpackages',
            'vname'        => 'LBL_SYSTEMDEPLOYMENTPACKAGES',
            'type'         => 'link',
            'module'       => 'SystemDeploymentPackages',
            'source'       => 'non-db',
            'relationship' => 'tenants_deploymentpackages',
        ],
    ],
    'indices' => [],
    'relationships' => [
        'systemtenant_users' => [
            'lhs_module' => 'SystemTenants',
            'lhs_table' => 'systemtenants',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'systemtenant_id',
            'relationship_type' => 'one-to-many'
        ]
    ]
];

VardefManager::createVardef('SystemTenants', 'SystemTenant', ['default', 'assignable']);
