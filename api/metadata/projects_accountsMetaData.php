<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

$dictionary['projects_accounts'] = [
    'table' => 'projects_accounts',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'account_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'project_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false],
    ],
    'indices' => [
        ['name' => 'projects_accounts_pk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_proj_acct_proj', 'type' =>'index', 'fields'=> ['project_id']],
        ['name' => 'idx_proj_acct_acct', 'type' =>'index', 'fields'=> ['account_id']],
        ['name' => 'projects_accounts_alt', 'type'=>'alternate_key', 'fields'=> ['project_id','account_id']],
    ],
    'relationships' => [
        'projects_accounts' => [
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'Accounts',
            'rhs_table' => 'accounts',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'projects_accounts',
            'join_key_lhs' => 'project_id',
            'join_key_rhs' => 'account_id',
        ],
    ],
];
