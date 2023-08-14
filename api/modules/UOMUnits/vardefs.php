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

SpiceDictionaryHandler::getInstance()->dictionary['UOMUnit'] = [
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
