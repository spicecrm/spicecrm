<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

global $dictionary;
$dictionary['projects_users'] = [
    'table' => 'projects_users',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'user_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'project_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false],
    ],
    'indices' => [
        ['name' => 'projects_users_pk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_proj_usr_proj', 'type' =>'index', 'fields'=> ['project_id']],
        ['name' => 'idx_proj_usr_con', 'type' =>'index', 'fields'=> ['user_id']],
        ['name' => 'projects_users_alt', 'type'=>'alternate_key', 'fields'=> ['project_id','user_id']],
    ],
    'relationships' => [
        'projects_users' => [
            'lhs_module' => 'Projects',
            'lhs_table' => 'projects',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'projects_users',
            'join_key_lhs' => 'project_id',
            'join_key_rhs' => 'user_id',
        ],
    ],
];
