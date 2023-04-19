<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['tasks_users'] = [
    'table' => 'tasks_users',
    'contenttype'   => 'relationdata',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'task_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'user_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false]
    ],
    'indices' => [
        ['name' => 'tasks_userspk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'idx_usr_task_task', 'type' => 'index', 'fields' => ['task_id']],
        ['name' => 'idx_usr_task_usr', 'type' => 'index', 'fields' => ['user_id']],
        ['name' => 'idx_task_users', 'type' => 'alternate_key', 'fields' => ['task_id', 'user_id']]
    ],
    'relationships' => [
        'tasks_users' => [
            'lhs_module' => 'Tasks',
            'lhs_table' => 'tasks',
            'lhs_key' => 'id',
            'rhs_module' => 'Users',
            'rhs_table' => 'users',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'tasks_users',
            'join_key_lhs' => 'task_id',
            'join_key_rhs' => 'user_id',
        ],
    ],
];
