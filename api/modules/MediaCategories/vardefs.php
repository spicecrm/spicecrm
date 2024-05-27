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

SpiceDictionaryHandler::getInstance()->dictionary['MediaCategory'] = [
    'table' => 'mediacategories',
    'fields' => [
        'parent_id' => [
            'name' => 'parent_id',
            'vname' => 'LBL_PARENT_MEDIACATEGORY_ID',
            'type' => 'id',
            'required' => false,
            'reportable' => false,
            'audited' => true,
            'comment' => 'Media Category ID of the parent of this Media Category'
        ],
        'parent_name' => [
            'name' => 'parent_name',
            'rname' => 'name',
            'id_name' => 'parent_id',
            'vname' => 'LBL_BELONGS_TO',
            'type' => 'relate',
            'isnull' => 'true',
            'module' => 'MediaCategories',
            'table' => 'mediacategories',
            'source' => 'non-db',
            'len' => 36,
            'link' => 'member_of',
            'unified_search' => true,
            #'importable' => 'true',
        ],
        'members' => [
            'name' => 'members',
            'type' => 'link',
            'relationship' => 'member_mediacategories',
            'module' => 'MediaCategories',
            'bean_name' => 'MediaCategory',
            'source' => 'non-db',
            'vname' => 'LBL_SUBCATEGORIES',
        ],
        'member_of' => [
            'name' => 'member_of',
            'type' => 'link',
            'relationship' => 'member_mediacategories',
            'module' => 'MediaCategories',
            'bean_name' => 'MediaCategory',
            'link_type' => 'one',
            'source' => 'non-db',
            'vname' => 'LBL_BELONGS_TO',
            'side' => 'right',
        ],
    ],
    'relationships' => [
        'member_mediacategories' => [
            'lhs_module' => 'MediaCategories',
            'lhs_table' => 'mediacategories',
            'lhs_key' => 'id',
            'rhs_module' => 'MediaCategories',
            'rhs_table' => 'mediacategories',
            'rhs_key' => 'parent_id',
            'relationship_type' => 'one-to-many'
        ]
    ],
    'indices' => [
        ['name' => 'idx_mediacategories_parent_id', 'type' => 'index', 'fields' => ['parent_id']]
    ]
];

VardefManager::createVardef('MediaCategories', 'MediaCategory', ['default','assignable']);
