<?php
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['Employee'] = [
    'table' => 'employees',
    'audited' =>  true,
    'fields' => [
        'users' => [
            'name' => 'users',
            'vname' => 'LBL_USERS',
            'type' => 'link',
            'relationship' => 'employees_users',
            'source' => 'non-db',
            'module' => 'Users'
        ],
        'hcmmeasures' => [
            'name' => 'hcmmeasures',
            'vname' => 'LBL_HCMMEASURES',
            'type' => 'link',
            'relationship' => 'employees_hcmmeasures',
            'source' => 'non-db',
            'module' => 'HCMMeasures'
        ],
        'hcmskills' => [
            'name' => 'hcmskills',
            'vname' => 'LBL_HCMSKILLS',
            'type' => 'link',
            'relationship' => 'employees_hcmskills',
            'source' => 'non-db',
            'module' => 'HCMSkills'
        ],
        'hcmtrainings' => [
            'name' => 'hcmtrainings',
            'vname' => 'LBL_HCMTRAININGS',
            'type' => 'link',
            'relationship' => 'employees_hcmtrainings',
            'source' => 'non-db',
            'module' => 'HCMTrainings'
        ],
        'orgunit_id' => [
            'vname' => 'LBL_ORGUNIT_ID',
            'name' => 'orgunit_id',
            'type' => 'varchar',
            'len' => 36
        ],
        'orgunit_name' => [
            'name' => 'orgunit_name',
            'rname' => 'name',
            'id_name' => 'orgunit_id',
            'link' => 'orgunits',
            'vname' => 'LBL_ORGUNIT',
            'type' => 'relate',
            'table' => 'orgunits',
            'module' => 'OrgUnits',
            'source' => 'non-db',
        ],
        'orgunit' => [
            'name' => 'orgunit',
            'id_name' => 'orgunit_id',
            'link' => 'orgunits',
            'vname' => 'LBL_ORGUNIT',
            'type' => 'linked',
            'module' => 'OrgUnits',
            'source' => 'non-db'
        ],
        'orgunits' => [
            'name' => 'orgunits',
            'type' => 'link',
            'vname' => 'LBL_ORGUNITS',
            'relationship' => 'orgunits_employees',
            'module' => 'OrgUnits',
            'source' => 'non-db'
        ],
        'userabsences' => [
            'name' => 'userabsences',
            'vname' => 'LBL_USER_ABSENCES',
            'type' => 'link',
            'relationship' => 'employees_userabsences',
            'source' => 'non-db',
            'module' => 'UserAbsences'
        ],
        'travels' => [
            'name' => 'travels',
            'vname' => 'LBL_TRAVELS',
            'type' => 'link',
            'relationship' => 'employee_travels',
            'source' => 'non-db',
            'module' => 'Employees',
        ],
        'calls' => [
            'name' => 'calls',
            'type' => 'link',
            'relationship' => 'employees_calls',
            'module' => 'Calls',
            'bean_name' => 'Call',
            'source' => 'non-db',
            'vname' => 'LBL_CALLS',
        ],
        'emails' => [
            'name' => 'emails',
            'type' => 'link',
            'relationship' => 'employees_emails',
            'module' => 'Emails',
            'bean_name' => 'Email',
            'source' => 'non-db',
            'vname' => 'LBL_EMAILS',
        ],
        'meetings' => [
            'name' => 'meetings',
            'type' => 'link',
            'relationship' => 'employees_meetings',
            'module' => 'Meetings',
            'bean_name' => 'Meeting',
            'source' => 'non-db',
            'vname' => 'LBL_MEETINGS',
        ],
        'notes' => [
            'name' => 'notes',
            'type' => 'link',
            'relationship' => 'employees_notes',
            'module' => 'Notes',
            'bean_name' => 'Note',
            'source' => 'non-db',
            'vname' => 'LBL_NOTES',
        ],
        'tasks' => [
            'name' => 'tasks',
            'type' => 'link',
            'relationship' => 'employees_tasks',
            'module' => 'Tasks',
            'bean_name' => 'Task',
            'source' => 'non-db',
            'vname' => 'LBL_TASKS',
        ],
    ],
    'indices' => [],
    'relationships' => [
        'employees_userabsences' => [
            'lhs_module' => 'Employees',
            'lhs_table' => 'employees',
            'lhs_key' => 'id',
            'rhs_module' => 'UserAbsences',
            'rhs_table' => 'userabsences',
            'rhs_key' => 'employee_id',
            'relationship_type' => 'one-to-many'
        ],
        'employees_calls' => [
            'lhs_module' => 'Employees',
            'lhs_table' => 'employees',
            'lhs_key' => 'id',
            'rhs_module' => 'Calls',
            'rhs_table' => 'calls',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Employees'
        ],
        'employees_emails' => [
            'lhs_module' => 'Employees',
            'lhs_table' => 'employees',
            'lhs_key' => 'id',
            'rhs_module' => 'Emails',
            'rhs_table' => 'emails',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Employees'
        ],
        'employees_notes' => [
            'lhs_module' => 'Employees',
            'lhs_table' => 'employees',
            'lhs_key' => 'id',
            'rhs_module' => 'Notes',
            'rhs_table' => 'notes',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Employees'
        ],
        'employees_meetings' => [
            'lhs_module' => 'Employees',
            'lhs_table' => 'employees',
            'lhs_key' => 'id',
            'rhs_module' => 'Meetings',
            'rhs_table' => 'meetings',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Employees'
        ],
        'employees_tasks' => [
            'lhs_module' => 'Employees',
            'lhs_table' => 'employees',
            'lhs_key' => 'id',
            'rhs_module' => 'Tasks',
            'rhs_table' => 'tasks',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Employees'
        ],
    ],
];

VardefManager::createVardef('Employees', 'Employee', ['default', 'assignable', 'person', 'activities']);

