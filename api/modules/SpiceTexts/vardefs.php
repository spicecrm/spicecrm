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

SpiceDictionaryHandler::getInstance()->dictionary['SpiceText'] = [
    'table' => 'spicetexts',
    'comment' => 'SpiceTexts Module',
    'audited' =>  false,
    'duplicate_merge' =>  false,
    'unified_search' =>  false,

	'fields' => [
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_NAME',
            'type' => 'varchar',
            'len' => '100',
            'required' => false
        ],
        'description' => [
            'name' => 'description',
            'vname' => 'LBL_DESCRIPTION',
            'type' => 'text',
            'required' => true
        ],
        'parent_type' => [
            'name'     => 'parent_type',
            'vname'    => 'LBL_PARENT_TYPE',
            'type'     => 'parent_type',
            'dbType'   => 'varchar',
            'required' => false,
            'len'      => 255,
        ],
        'parent_name' => [
            'name'        => 'parent_name',
            'type_name'   => 'parent_type',
            'id_name'     => 'parent_id',
            'vname'       => 'LBL_RELATED_TO',
            'type'        => 'parent',
            'source'      => 'non-db',
        ],
        'parent_id' => [
            'name'       => 'parent_id',
            'vname'      => 'LBL_LIST_RELATED_TO_ID',
            'type'       => 'id',
            'reportable' => false,
        ],
        'text_id' => [
            'name' => 'text_id',
            'vname' => 'LBL_TEXT',
            'type' => 'id',
            'required' => true
        ],
        'text_language' => [
            'name' => 'text_language',
            'vname' => 'LBL_TEXT_LANGUAGE',
            'type' => 'varchar',
            'len' => '55',
            'required' => true
        ],
        'products' => [
            'name'         => 'products',
            'type'         => 'link',
            'relationship' => 'product_spicetexts',
            'source'       => 'non-db',
            'vname'        => 'LBL_PRODUCTS',
            'module'       => 'Products',
            'default'      => true,
        ],
        'productvariants' => [
            'name'         => 'productvariants',
            'type'         => 'link',
            'relationship' => 'productvariant_spicetexts',
            'source'       => 'non-db',
            'vname'        => 'LBL_PRODUCT_VARIANTS',
            'module'       => 'ProductVariants',
            'default'      => true,
        ],
        'accounts' => [
            'name' => 'accounts',
            'type' => 'link',
            'relationship' => 'accounts_spicetexts',
            'module' => 'Accounts',
            'source' => 'non-db',
            'vname' => 'LBL_Accounts',
            'default'      => true
        ]
    ],
	'relationships' => [
    ],
	'indices' => [
        ['name' => 'idx_spicetexts_id_del', 'type' => 'index', 'fields' => ['id', 'deleted']],
        ['name' => 'idx_spicetexts_parentid_del', 'type' => 'index', 'fields' => ['parent_id', 'deleted']],
        ['name' => 'idx_spicetexts_parenttype_del', 'type' => 'index', 'fields' => ['parent_type', 'deleted']],
        ['name' => 'idx_spicetexts_txid_lang_del', 'type' => 'index', 'fields' => ['text_id', 'text_language','deleted']],
        ['name' => 'idx_spicetexts_parid_lang_del', 'type' => 'index', 'fields' => ['parent_id', 'text_language','deleted']],
    ]
];

VardefManager::createVardef('SpiceTexts', 'SpiceText', ['default', 'assignable']);
