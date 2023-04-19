<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['ProductGroup'] = [
    'table' => 'productgroups',
    'fields' => [
        'member_count' => [
            'name' => 'member_count',
            'type' => 'int',
            'source' => 'non-db',
            'vname' => 'LBL_MEMBER_COUNT',
        ],
        'product_count' => [
            'name' => 'product_count',
            'type' => 'int',
            'source' => 'non-db',
            'vname' => 'LBL_PRODUCT_COUNT',
        ],
        'left_node_id' => [
            'name' => 'left_node_id',
            'vname' => 'LBL_LEFT_NODE_ID',
            'type' => 'int',
            'comment' => 'left value for modified treeorder traversal'
        ],
        'right_node_id' => [
            'name' => 'right_node_id',
            'vname' => 'LBL_RIGHT_NODE_ID',
            'type' => 'int',
            'comment' => 'right value for modified treeorder traversal'
        ],
        'sortseq' => [
            'name' => 'sortseq',
            'vname' => 'LBL_SORTSEQ',
            'type' => 'int'
        ],
        'sortparam' => [
            'name' => 'sortparam',
            'vname' => 'LBL_SORTPARAM',
            'type' => 'varchar',
            'len' => '50'
        ],
        'external_id' => [
            'name' => 'external_id',
            'vname' => 'LBL_EXTERNAL_ID',
            'type' => 'varchar',
            'len' => '50'
        ],
        'shorttext' => [
            'name' => 'shorttext',
            'vname' => 'LBL_SHORTTEXT',
            'type' => 'varchar',
            'len' => '50'
        ],
        'productattributes' => [
            'name' => 'productattributes',
            'vname' => 'LBL_PRODUCTATTRIBUTES',
            'type' => 'link',
            'relationship' => 'productgroups_productattributes',
            'source' => 'non-db',
        ],
        'productattributevalues' => [
            'name' => 'productattributevalues',
            'vname' => 'LBL_PRODUCTATTRIBUTEVALUES',
            'type' => 'link',
            'relationship' => 'productgroup_productattributevalues',
            'source' => 'non-db',
        ],
        'parent_productgroup_id' =>
            [
                'name' => 'parent_productgroup_id',
                'vname' => 'LBL_PARENT_PRODUCTGROUP_ID',
                'type' => 'varchar',
                'len' => 36,
                'required' => false,
                'audited' => true
            ],
        'parent_productgroup_name' => [
            'name' => 'parent_productgroup_name',
            'rname' => 'name',
            'id_name' => 'parent_productgroup_id',
            'vname' => 'LBL_PARENT_PRODUCTGROUP',
            'type' => 'relate',
            'isnull' => 'true',
            'module' => 'ProductGroups',
            'table' => 'productgroups',
            'source' => 'non-db',
            'len' => 36,
            'link' => 'parent_productgroup'
        ],
        'parent_productgroup' => [
            'name' => 'parent_productgroup',
            'type' => 'link',
            'relationship' => 'parent_productgroup',
            'module' => 'ProductGroups',
            'bean_name' => 'ProductGroup',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_PARENT_PRODUCTGROUP',
            'side' => 'right'
        ],
        'productgroups' => [
            'name' => 'productgroups',
            'type' => 'link',
            'relationship' => 'parent_productgroup',
            'module' => 'ProductGroups',
            'bean_name' => 'ProductGroup',
            'source' => 'non-db',
            'vname' => 'LBL_PRODUCTGROUPS',
        ],
        'products' => [
            'name' => 'products',
            'type' => 'link',
            'relationship' => 'productgroup_products',
            'module' => 'Products',
            'bean_name' => 'Product',
            'source' => 'non-db',
            'vname' => 'LBL_PRODUCTS',
        ],
        'productvariants' => [
            'name' => 'productvariants',
            'type' => 'link',
            'relationship' => 'productvariants_productgroups',
            'module' => 'ProductVariants',
            'bean_name' => 'ProductVariant',
            'source' => 'non-db',
            'vname' => 'LBL_PRODUCTS',
        ],
        'spicetexts' => [
            'name' => 'spicetexts',
            'type' => 'link',
            'relationship' => 'productgroup_spicetexts',
            'module' => 'SpiceTexts',
            'source' => 'non-db',
            'vname' => 'LBL_SPICE_TEXTS',
        ],
    ],
    'relationships' => [
        'productgroup_productattributevalues' => [
            'lhs_module' => 'ProductGroups',
            'lhs_table' => 'productgroups',
            'lhs_key' => 'id',
            'rhs_module' => 'ProductAttributeValues',
            'rhs_table' => 'productattributevalues',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'ProductGroups',
        ],
        'productgroup_products' => [
            'lhs_module' => 'ProductGroups',
            'lhs_table' => 'productgroups',
            'lhs_key' => 'id',
            'rhs_module' => 'Products',
            'rhs_table' => 'products',
            'rhs_key' => 'productgroup_id',
            'relationship_type' => 'one-to-many',
        ],
        'parent_productgroup' => [
            'lhs_module' => 'ProductGroups',
            'lhs_table' => 'productgroups',
            'lhs_key' => 'id',
            'rhs_module' => 'ProductGroups',
            'rhs_table' => 'productgroups',
            'rhs_key' => 'parent_productgroup_id',
            'relationship_type' => 'one-to-many'
        ],
        'productgroup_spicetexts' => [
            'lhs_module' => 'Products',
            'lhs_table' => 'products',
            'lhs_key' => 'id',
            'rhs_module' => 'SpiceTexts',
            'rhs_table' => 'spicetexts',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'ProductGroups'
        ]
    ],
    'indices' => [
        ['name' => 'idx_productgroups_extid', 'type' => 'index', 'fields' => ['external_id']],
        ['name' => 'idx_productgroups_parengrpid_del', 'type' => 'index', 'fields' => ['parent_productgroup_id', 'deleted']],
    ],
];

VardefManager::createVardef('ProductGroups', 'ProductGroup', ['default', 'assignable']);
