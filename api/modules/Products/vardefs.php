<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

use SpiceCRM\includes\SugarObjects\VardefManager;
global $dictionary;
$dictionary['Product'] = [
    'table' => 'products',
    'fields' => [
        'ext_id' => [
            'name' => 'ext_id',
            'vname' => 'LBL_EXT_ID',
            'type' => 'varchar',
            'len' => 50
        ],
        'productgroup_id' => [
            'name' => 'productgroup_id',
            'vname' => 'LBL_PRODUCTGROUP_ID',
            'type' => 'id',
            'comment' => 'Eindeutige SugarID der Produktgruppe'
        ],
        'productgroup_name' => [
            'name' => 'productgroup_name',
            'rname' => 'name',
            'id_name' => 'productgroup_id',
            'vname' => 'LBL_PRODUCTGROUP',
            'type' => 'relate',
            'isnull' => 'true',
            'module' => 'ProductGroups',
            'table' => 'productgroups',
            'massupdate' => false,
            'source' => 'non-db',
            'len' => 36,
            'link' => 'productgroup',
            'unified_search' => true,
            'importable' => 'true',
        ],
        'product_name' => [
            'vname' => 'LBL_PRODUCT',
            'join_name' => 'products',
            'type' => 'relate',
            'link' => 'products',
            'table' => 'products',
            'isnull' => 'true',
            'module' => 'Products',
            'dbType' => 'varchar',
            'len' => '255',
            'source' => 'non-db',
            'unified_search' => true,
        ],
        'price' => [
            'name' => 'price',
            'vname' => 'LBL_PRICE',
            'type' => 'double',
            'comment' => ' the standard sales price for the product'
        ],
        'gross_priced' => [
            'name' => 'gross_priced',
            'vname' => 'LBL_GROSS_PRICED',
            'type' => 'bool',
            'default' => 0,
            'comment' => 'indicates that the maintained price is a gross price'
        ],
        'taxcategory' => [
            'name' => 'taxcategory',
            'vname' => 'LBL_TAXCATEGORY',
            'type' => 'enum',
            'length' => 1,
            'options' => 'product_tax_categories_dom',
            'comment' => 'the tax category for the tax determination'
        ],
        'std_price'=> [
            'name' => 'std_price',
            'vname' => 'LBL_STD_PRICE',
            'type' => 'double',
            'len' => 7
        ],
        'purchase_price'=> [
            'name' => 'purchase_price',
            'vname' => 'LBL_PURCHASE_PRICE',
            'type' => 'double',
            'len' => 7
        ],
        'net_weight' => [
            'name' => 'net_weight',
            'vname' => 'LBL_NET_WEIGHT',
            'type' => 'double',
        ],
        'gross_weight' => [
            'name' => 'gross_weight',
            'vname' => 'LBL_GROSS_WEIGHT',
            'type' => 'double',
        ],
        'base_uom_id' => [
            'name' => 'base_uom_id',
            'type' => 'id',
        ],
        'product_status' => [
            'name' => 'product_status',
            'vname' => 'LBL_PRODUCT_STATUS',
            'type' => 'enum',
            'options' => 'product_status_dom'
        ],
        'manufacturer_id' => [
            'name' => 'manufacturer_id',
            'type' => 'id',
        ],
        'manufacturer_name' => [
            'name' => 'manufacturer_name',
            'rname' => 'name',
            'id_name' => 'manufacturer_id',
            'vname' => 'LBL_MANUFACTURER',
            'type' => 'relate',
            'module' => 'Accounts',
            'table' => 'accounts',
            'isnull' => 'true',
            'dbType' => 'varchar',
            'len' => '255',
            'link' => 'manufacturer',
            'source' => 'non-db'
        ],
        'base_uom' => [
            'name' => 'base_uom',
            'rname' => 'label',
            'id_name' => 'base_uom_id',
            'vname' => 'LBL_BASE_UNIT_OF_MEASURE',
            'type' => 'relate',
            'module' => 'UOMUnits',
            'table' => 'uomunits',
            'isnull' => 'true',
            'dbType' => 'varchar',
            'len' => '255',
            'link' => 'uomunits',
            'source' => 'non-db'
        ],
        'uomconversions' => [
            'name' => 'uomconversions',
            'vname' => 'LBL_UNIT_OF_MEASURE_CONVERSION',
            'type' => 'link',
            'relationship' => 'product_uomconversions',
            'module' => 'UOMConversions',
            'default' => true,
            'source' => 'non-db'

        ],
        'manufacturer' => [
            'name' => 'manufacturer',
            'type' => 'link',
            'relationship' => 'manufacturer_products',
            'source' => 'non-db',
            'module' => 'Accounts',
            'vname' => 'LBL_ACCOUNT'
        ],
        'uomunits' => [
            'name' => 'uomunits',
            'type' => 'link',
            'relationship' => 'uomunit_products',
            'source' => 'non-db',
            'module' => 'UOMUnits',
            'vname' => 'LBL_UNIT_OF_MEASURE'
        ],
        'productgroup' => [
            'name' => 'productgroup',
            'vname' => 'LBL_PRODUCTGROUP',
            'type' => 'link',
            'relationship' => 'productgroup_products',
            'source' => 'non-db'
        ],
        'left_node_id' => [
            'name' => 'left_node_id',
            'vname' => 'LBL_LEFT_NODE_ID',
            'source' => 'non-db',
            'type' => 'relate',
            'link' => 'productgroup',
            'id_name' => 'productgroup_id',
            'module' => 'ProductGroups',
            'rname' => 'left_node_id'
        ],
        'right_node_id' => [
            'name' => 'right_node_id',
            'vname' => 'LBL_RIGHT_NODE_ID',
            'source' => 'non-db',
            'type' => 'relate',
            'link' => 'productgroup',
            'id_name' => 'productgroup_id',
            'module' => 'ProductGroups',
            'rname' => 'right_node_id'
        ],
        'productvariants' => [
            'name' => 'productvariants',
            'vname' => 'LBL_PRODUCTVARIANTS',
            'type' => 'link',
            'relationship' => 'product_productvariants',
            'source' => 'non-db'
        ],
        'productattributevalues' => [
            'name' => 'productattributevalues',
            'vname' => 'LBL_PRODUCTATTRIBUTEVALUES',
            'type' => 'link',
            'relationship' => 'product_productattributevalues',
            'source' => 'non-db',
            'module' => 'ProductAttributeValues',
            'default' => true
        ],
        'spicetexts' => [
            'name' => 'spicetexts',
            'type' => 'link',
            'relationship' => 'product_spicetexts',
            'module' => 'SpiceTexts',
            'source' => 'non-db',
            'vname' => 'LBL_SPICE_TEXTS',
        ],
        'serviceorderitems' => [
            'name' => 'serviceorderitems',
            'type' => 'link',
            'vname' => 'LBL_SERVICE_ORDER_ITEMS',
            'relationship' => 'product_serviceorderitems_parent',
            'module' => 'ServiceOrderItems',
            'source' => 'non-db',
        ],
        'serviceorderefforts' => [
            'name' => 'serviceorderefforts',
            'type' => 'link',
            'vname' => 'LBL_SERVICE_ORDER_ITEMS',
            'relationship' => 'product_serviceorderefforts_parent',
            'module' => 'ServiceOrderEfforts',
            'source' => 'non-db',
        ],
        'product_image' => [
            'name' => 'product_image',
            'vname' => 'LBL_IMAGE',
            'type' => 'image',
            'dbType' => 'longtext',
            'maxWidth' => 300,
            'maxHeight' => 300
        ],
        'outputtemplate_id' => [
            'name' => 'outputtemplate_id',
            'type' => 'char',
            'len' => 36,
            'dbType' => 'id',
            'vname' => 'LBL_OUTPUTTEMPLATE_ID'
        ],
        'outputtemplate_name' => [
            'source' => 'non-db',
            'name' => 'outputtemplate_name',
            'vname' => 'LBL_OUTPUT_TEMPLATE',
            'type' => 'relate',
            'len' => '255',
            'id_name' => 'outputtemplate_id',
            'module' => 'OutputTemplates',
            'rname' => 'name',
            'link' => 'outputtemplate',
        ],
        'outputtemplate' => [
            'name' => 'outputtemplate',
            'type' => 'link',
            'relationship' => 'outputtemplates_products',
            'link_type' => 'one',
            'side' => 'left',
            'source' => 'non-db',
            'vname' => 'LBL_OUTPUTTEMPLATES',
        ]
    ],
    'relationships' => [
        'product_productvariants' => [
            'lhs_module' => 'Products',
            'lhs_table' => 'products',
            'lhs_key' => 'id',
            'rhs_module' => 'ProductVariants',
            'rhs_table' => 'productvariants',
            'rhs_key' => 'product_id',
            'relationship_type' => 'one-to-many',
        ],
        'product_productattributevalues' => [
            'lhs_module' => 'Products',
            'lhs_table' => 'products',
            'lhs_key' => 'id',
            'rhs_module' => 'ProductAttributeValues',
            'rhs_table' => 'productattributevalues',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Products',
        ],
        'product_uomconversions' => [
            'lhs_module' => 'Products',
            'lhs_table' => 'products',
            'lhs_key' => 'id',
            'rhs_module' => 'UOMConversions',
            'rhs_table' => 'uomconversions',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Products',
        ],
        'product_spicetexts' => [
            'lhs_module' => 'Products',
            'lhs_table' => 'products',
            'lhs_key' => 'id',
            'rhs_module' => 'SpiceTexts',
            'rhs_table' => 'spicetexts',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Products'
        ],
        'product_serviceorderitems_parent' => [
            'lhs_module' => 'Products',
            'lhs_table' => 'products',
            'lhs_key' => 'id',
            'rhs_module' => 'ServiceOrderItems',
            'rhs_table' => 'serviceorderitems',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Products'
        ],
        'product_serviceorderefforts_parent' => [
            'lhs_module' => 'Products',
            'lhs_table' => 'products',
            'lhs_key' => 'id',
            'rhs_module' => 'ServiceOrderEfforts',
            'rhs_table' => 'serviceorderserviceorderefforts',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many',
            'relationship_role_column' => 'parent_type',
            'relationship_role_column_value' => 'Products'
        ],
        'outputtemplates_products' => [
            'lhs_module' => 'OutputTemplates',
            'lhs_table' => 'outputtemplates',
            'lhs_key' => 'id',
            'rhs_module' => 'Products',
            'rhs_table' => 'products',
            'rhs_key' => 'outputtemplate_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => [
        ['name' => 'idx_products_manu_del', 'type' => 'index', 'fields' => ['manufacturer_id', 'deleted']],
        ['name' => 'idx_products_prodgrpid_del', 'type' => 'index', 'fields' => ['productgroup_id', 'deleted']],
        ['name' => 'idx_products_status_del', 'type' => 'index', 'fields' => ['product_status', 'deleted']],
        ['name' => 'idx_products_baseuomid_del', 'type' => 'index', 'fields' => ['base_uom_id', 'deleted']],
        ['name' => 'idx_products_ext_id_del', 'type' => 'index', 'fields' => ['ext_id', 'deleted']],

    ],
];

VardefManager::createVardef('Products', 'Product', ['default', 'assignable']);

if(file_exists('extensions/modules/ProjectWBSs')) {
    $dictionary['Product']['fields']['projectwbss'] = [
        'name' => 'projectwbss',
        'type' => 'link',
        'relationship' => 'projectwbss_products',
        'module' => 'ProjectWBSs',
        'source' => 'non-db',
        'vname' => 'LBL_PROJECTWBSS',
    ];
}