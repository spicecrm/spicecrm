<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

// adding project-to-bugs relationship
$dictionary['productgroups_productattributes'] = [
    'table' => 'productgroups_productattributes',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'productgroup_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'productattribute_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false]
    ],
    'indices' => [
        ['name' => 'prod_proda_pk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_prod_prodg', 'type' =>'index', 'fields'=> ['productgroup_id']],
        ['name' => 'idx_prod_proda', 'type' =>'index', 'fields'=> ['productattribute_id']]
    ],
    'relationships' => [
        'productgroups_productattributes' => [
            'lhs_module' => 'ProductGroups',
            'lhs_table' => 'productgroups',
            'lhs_key' => 'id',
            'rhs_module' => 'ProductAttributes',
            'rhs_table' => 'productattributes',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'productgroups_productattributes',
            'join_key_lhs' => 'productgroup_id',
            'join_key_rhs' => 'productattribute_id'
        ]
    ]
];

$dictionary['productvariants_resellers'] = [
    'table' => 'productvariants_resellers',
    'fields' => [
        ['name' => 'id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'productvariant_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'account_id', 'type' => 'varchar', 'len' => '36'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'len' => '1', 'default' => '0', 'required' => false]
    ],
    'indices' => [
        ['name' => 'prodvar_resellers_pk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_prodvar_resellers_acc', 'type' =>'index', 'fields'=> ['account_id']],
        ['name' => 'idx_prodvar_resellers_pv', 'type' =>'index', 'fields'=> ['productvariant_id']]
    ],
    'relationships' => [
        'productvariants_resellers' => [
            'lhs_module' => 'Accounts',
            'lhs_table' => 'accounts',
            'lhs_key' => 'id',
            'rhs_module' => 'ProductVariants',
            'rhs_table' => 'productvariants',
            'rhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'productvariants_resellers',
            'join_key_lhs' => 'account_id',
            'join_key_rhs' => 'productvariant_id'
        ]
    ]
];
