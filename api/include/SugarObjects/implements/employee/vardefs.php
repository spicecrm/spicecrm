<?php

$vardefs = [
    'fields' => [
        'employee_id' => [
            'name' => 'employee_id',
            'vname' => 'LBL_EMPLOYEE_ID',
            'type' => 'id',
            'audited' => true,
            'comment' => 'Employee ID assigned to record',
            'duplicate_merge' => true,
        ],
        'employee_name' => [
            'name' => 'employee_name',
            'link' => 'employees',
            'vname' => 'LBL_EMPLOYEE',
            'rname' => 'last_name',
            'type' => 'relate',
            'reportable' => false,
            'source' => 'non-db',
            'table' => 'employees',
            'id_name' => 'employee_id',
            'module' => 'Employees',
            'duplicate_merge' => false
        ],
        'employee' => [
            'name' => 'employee',
            'link' => 'employees',
            'vname' => 'LBL_EMPLOYEE',
            'rname' => 'last_name',
            'type' => 'linked',
            'reportable' => false,
            'source' => 'non-db',
            'id_name' => 'employee_id',
            'module' => 'employees',
            'duplicate_merge' => true
        ],
        'employees' => [
            'name' => 'employees',
            'type' => 'link',
            'relationship' => strtolower($module) . '_employee',
            'vname' => 'LBL_EMPLOYEE',
            'module' => 'Employees',
            'bean_name' => 'Employee',
            'source' => 'non-db',
            'table' => 'employees',
            'recover' => false,
            'duplicate_merge' => true
        ]
    ],
    'relationships' => [
        strtolower($module) . '_employee' => [
            'lhs_module' => 'Employees',
            'lhs_table' => 'employees',
            'lhs_key' => 'id',
            'rhs_module' => $module,
            'rhs_table' => strtolower($module),
            'rhs_key' => 'employee_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => [
        ['name' => 'idx_' . strtolower($module) . '_employeeid', 'type' => 'index', 'fields' => ['employee_id']],
    ]
];
