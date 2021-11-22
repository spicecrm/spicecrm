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
$dictionary['ProductGroup'] = [
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
            'massupdate' => false,
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
