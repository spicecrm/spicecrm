<?php

$vardefs = [
    'fields' => [
        //=> activities
        'calls' => [
            'name' => 'calls',
            'module' => 'Calls',
            'type' => 'link',
            'relationship' => strtolower($table_name) .'_calls',
            'source' => 'non-db',
            'vname' => 'LBL_CALLS',
        ],
        'tasks' => [
            'name' => 'tasks',
            'module' => 'Tasks',
            'type' => 'link',
            'relationship' => strtolower($table_name) .'_tasks',
            'source' => 'non-db',
            'vname' => 'LBL_TASKS',
        ],
        'notes' => [
            'name' => 'notes',
            'module' => 'Notes',
            'type' => 'link',
            'relationship' => strtolower($table_name) .'_notes',
            'source' => 'non-db',
            'vname' => 'LBL_NOTES',
        ],
        'meetings' => [
            'name' => 'meetings',
            'module' => 'Meeting',
            'type' => 'link',
            'relationship' => strtolower($table_name) .'_meetings',
            'bean_name' => 'Meeting',
            'source' => 'non-db',
            'vname' => 'LBL_MEETINGS',
        ],
        'emails' => [
            'name' => 'emails',
            'module' => 'Emails',
            'type' => 'link',
            'relationship' => 'emails_'.strtolower($table_name) .'_rel',/* reldef in emails */
            'source' => 'non-db',
            'vname' => 'LBL_EMAILS',
        ],
    ],
    'relationships' => [
        strtolower($table_name) . '_calls' => [
            'lhs_module'=> $module, 'lhs_table'=> $table_name, 'lhs_key' => 'id',
            'rhs_module'=> 'Calls', 'rhs_table'=> 'calls', 'rhs_key' => 'parent_id',
            'relationship_type'=>'one-to-many', 'relationship_role_column'=>'parent_type',
            'relationship_role_column_value' => $module
        ],
        strtolower($table_name) . '_tasks' => [
            'lhs_module'=> $module, 'lhs_table'=> $table_name, 'lhs_key' => 'id',
            'rhs_module'=> 'Tasks', 'rhs_table'=> 'tasks', 'rhs_key' => 'parent_id',
            'relationship_type'=>'one-to-many', 'relationship_role_column'=>'parent_type',
            'relationship_role_column_value' => $module
        ],
        strtolower($table_name) . '_notes' => [
            'lhs_module'=> $module, 'lhs_table'=> $table_name, 'lhs_key' => 'id',
            'rhs_module'=> 'Notes', 'rhs_table'=> 'notes', 'rhs_key' => 'parent_id',
            'relationship_type'=>'one-to-many', 'relationship_role_column'=>'parent_type',
            'relationship_role_column_value' => $module
        ],
        strtolower($module) . '_meetings' => [
            'lhs_module'=> $module, 'lhs_table'=> $table_name, 'lhs_key' => 'id',
            'rhs_module'=> 'Meetings', 'rhs_table'=> 'meetings', 'rhs_key' => 'parent_id',
            'relationship_type'=>'one-to-many', 'relationship_role_column'=>'parent_type',
            'relationship_role_column_value' => $module
        ],
        strtolower($table_name) . '_emails' => [
            'lhs_module'=> $module, 'lhs_table'=> $table_name, 'lhs_key' => 'id',
            'rhs_module'=> 'Emails', 'rhs_table'=> 'emails', 'rhs_key' => 'parent_id',
            'relationship_type'=>'one-to-many', 'relationship_role_column'=>'parent_type',
            'relationship_role_column_value' => $module
        ]
    ]
];
