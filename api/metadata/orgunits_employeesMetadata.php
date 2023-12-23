<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['orgunits_employees'] = [
    'table' => 'orgunits_employees',
    'contenttype'   => 'relationdata',
    'fields' => [
        [
            'name' => 'id',
            'type' => 'id',
        ],
        [
            'name' => 'orgunit_id',
            'type' => 'id',
        ],
        [
            'name' => 'employee_id',
            'type' => 'id',
        ],
        [
            'name' => 'is_primary_orgunit',
            'type' => 'bool',
            'default' => 0,
        ],
        [
            'name' => 'employee_role',
            'type' => 'varchar',
            'len' => '50'
        ],
        [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
        ]
    ],
    'indices' => [
        [
            'name' => 'orgunits_employeespk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_orgunits_employees_orgid',
            'type' => 'index',
            'fields' => ['orgunit_id', 'is_primary_orgunit']
        ],
        [
            'name' => 'idx_orgunits_employees_employid',
            'type' => 'index',
            'fields' => ['employee_id', 'is_primary_orgunit']
        ],
        [
            'name' => 'idx_orgunits_employees_alt',
            'type' => 'alternate_key',
            'fields' => ['orgunit_id', 'employee_id']
        ]
    ],
    'relationships' => [
        'orgunits_employees' => [
            'lhs_module' => 'OrgUnits',
            'lhs_table' => 'orgunits',
            'lhs_key' => 'id',
            'rhs_module' => 'Employees',
            'rhs_table' => 'employees',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'orgunits_employees',
            'join_key_lhs' => 'orgunit_id',
            'join_key_rhs' => 'employee_id'
        ],
        'orgunits_employees_primary' => [
            'lhs_module' => 'OrgUnits',
            'lhs_table' => 'orgunits',
            'lhs_key' => 'id',
            'rhs_module' => 'Employees',
            'rhs_table' => 'employees',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'orgunits_employees',
            'join_key_lhs' => 'orgunit_id',
            'join_key_rhs' => 'employee_id',
            'relationship_role_column' => 'is_primary_orgunit',
            'relationship_role_column_value' => 1
        ],
    ]
];
