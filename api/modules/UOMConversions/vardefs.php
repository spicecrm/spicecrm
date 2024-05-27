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
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;

SpiceDictionaryHandler::getInstance()->dictionary['UOMConversion'] = [
    'table' => 'uomconversions',
    'comment' => 'UOMConversions Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

	'fields' => [
        'parent_type' => [
            'name'  => 'parent_type',
            'vname' => 'LBL_PARENT_TYPE',
            'type'  => 'varchar',
            'len'   => '255',
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'vname' => 'LBL_PARENT_ID',
            'type' => 'id',
        ],
        'uom_unit' => [
            'name'  => 'uom_unit',
            'vname' => 'LBL_UNIT_OF_MEASURE',
            'type'  => 'varchar',
            'len'   => '255',
            'required' => true
        ],
        'reference_uom_unit' => [
            'name'  => 'reference_uom_unit',
            'vname' => 'LBL_REFERENCE_UNIT_OF_MEASURE',
            'type'  => 'varchar',
            'len'   => '255',
            'required' => true
        ],
        'quantity' => [
            'name'  => 'quantity',
            'vname' => 'LBL_QUANTITY',
            'type'  => 'varchar',
            'len'   => '255',
            'default' => '1',
            'required' => true
        ],
        'conversion_factor' => [
            'name'  => 'conversion_factor',
            'vname' => 'LBL_CONVERSION_FACTOR',
            'type'  => 'varchar',
            'len'   => '255',
            'required' => true
        ],
        'products' => [
            'name' => 'products',
            'type' => 'link',
            'relationship' => 'product_uomconversions',
            'module' => 'Products',
            'bean_name' => 'Product',
            'source' => 'non-db',
            'vname' => 'LBL_PRODUCTS',
        ],
        'productvariants' => [
            'name' => 'productvariants',
            'type' => 'link',
            'relationship' => 'productvariant_uomconversions',
            'module' => 'ProductVariants',
            'bean_name' => 'ProductVariant',
            'source' => 'non-db',
            'vname' => 'LBL_PRODUCT_VARIANTS',
        ],
    ],
	'relationships' => [
    ],
	'indices' => [
        'parent_idx' => ['name' => 'parent_idx', 'type' => 'index', 'fields' => ['parent_id'],],
    ]
];

VardefManager::createVardef('UOMConversions', 'UOMConversion', ['default', 'assignable']);
