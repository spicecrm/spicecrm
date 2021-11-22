<?php


use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['UOMUnit'] = [
    'table' => 'uomunits',
    'comment' => 'UOMUnits Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

	'fields' => [
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => '255',
        ],
        'iso' => [
            'name'  => 'iso',
            'vname' => 'LBL_ISO',
            'type'  => 'varchar',
            'len'   => '55',
            'required' => true
        ],
        'label' => [
            'name'  => 'label',
            'vname' => 'LBL_NAME',
            'type'  => 'varchar',
            'len'   => '255',
            'required' => true
        ],
        'dimensions' => [
            'name'  => 'dimensions',
            'vname' => 'LBL_DIMENSIONS',
            'type'  => 'enum',
            'options' => 'uom_unit_dimensions_dom',
        ],
        'main_unit' => [
            'name'  => 'main_unit',
            'vname' => 'LBL_MAIN_UNIT',
            'type' => 'bool',
            'default' => '0',
        ],
        'nominator' => [
            'name'  => 'nominator',
            'vname' => 'LBL_NOMINATOR',
            'type'  => 'varchar',
            'len'   => '55',
        ],
        'denominator' => [
            'name'  => 'denominator',
            'vname' => 'LBL_DENOMINATOR',
            'type'  => 'varchar',
            'len'   => '55',
        ],
        'products' => [
            'name' => 'products',
            'type' => 'link',
            'relationship' => 'uomunit_products',
            'module' => 'Products',
            'source' => 'non-db',
        ],
        'productvariants' => [
            'name' => 'productvariants',
            'type' => 'link',
            'relationship' => 'uomunit_productvariants',
            'module' => 'ProductVariants',
            'source' => 'non-db',
        ],
    ],
	'relationships' => [
        'uomunit_products' => [
            'lhs_module' => 'UOMUnits',
            'lhs_table' => 'uomunits',
            'lhs_key' => 'id',
            'rhs_module' => 'Products',
            'rhs_table' => 'products',
            'rhs_key' => 'base_uom_id',
            'relationship_type' => 'one-to-many',
        ],
        'uomunit_productvariants' => [
            'lhs_module' => 'UOMUnits',
            'lhs_table' => 'uomunits',
            'lhs_key' => 'id',
            'rhs_module' => 'ProductVariants',
            'rhs_table' => 'productvariants',
            'rhs_key' => 'base_uom_id',
            'relationship_type' => 'one-to-many',
        ],
        'uomunit_serviceorderitems' => [
            'lhs_module' => 'UOMUnits',
            'lhs_table' => 'uomunits',
            'lhs_key' => 'id',
            'rhs_module' => 'ServiceOrderItems',
            'rhs_table' => 'serviceorderitems',
            'rhs_key' => 'uom_id',
            'relationship_type' => 'one-to-many',
        ],
        'uomunit_serviceorderefforts' => [
            'lhs_module' => 'UOMUnits',
            'lhs_table' => 'uomunits',
            'lhs_key' => 'id',
            'rhs_module' => 'ServiceOrderEfforts',
            'rhs_table' => 'serviceorderefforts',
            'rhs_key' => 'uom_id',
            'relationship_type' => 'one-to-many',
        ],
    ],
	'indices' => [
    ]
];

VardefManager::createVardef('UOMUnits', 'UOMUnit', ['default', 'assignable']);
