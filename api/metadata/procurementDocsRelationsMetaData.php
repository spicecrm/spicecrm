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

SpiceDictionaryHandler::getInstance()->dictionary['procurementdocsflow'] = [
    'table' => 'procurementdocsflow',
    'fields' => [
        ['name' => 'id', 'type' => 'id'],
        ['name' => 'procurementdoc_from_id', 'type' => 'id'],
        ['name' => 'procurementdoc_to_id', 'type' => 'id'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'required' => true, 'default' => false]
    ],
    'indices' => [
        ['name' => 'procurementdocsflowpk', 'type' => 'primary', 'fields' => ['id']]
    ],
    'relationships' => [
        'procurementdocsflow' => [
            'rhs_module' => 'ProcurementDocs',
            'rhs_table' => 'procurementdocs',
            'rhs_key' => 'id',
            'lhs_module' => 'ProcurementDocs',
            'lhs_table' => 'procurementdocs',
            'lhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'procurementdocsflow',
            'join_key_lhs' => 'procurementdoc_from_id',
            'join_key_rhs' => 'procurementdoc_to_id',
            'reverse' => 0
        ]
    ]
];

/**
 * handles two things:
 */
SpiceDictionaryHandler::getInstance()->dictionary['procurementdocsitemsflow'] = [
    'table' => 'procurementdocsitemsflow',
    'fields' => [
        ['name' => 'id', 'type' => 'id'],
        ['name' => 'procurementdocitem_from_id', 'type' => 'id'],
        ['name' => 'procurementdocitem_to_id', 'type' => 'id'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'required' => true, 'default' => false]
    ],
    'indices' => [
        ['name' => 'procurementdocsitemsflowpk', 'type' => 'primary', 'fields' => ['id']]
    ],
    'relationships' => [
        'procurementdocsitemsflow' => [
            'rhs_module' => 'ProcurementDocItems',
            'rhs_table' => 'procurementdocitems',
            'rhs_key' => 'id',
            'lhs_module' => 'ProcurementDocItems',
            'lhs_table' => 'procurementdocitems',
            'lhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'procurementdocsitemsflow',
            'join_key_lhs' => 'procurementdocitem_from_id',
            'join_key_rhs' => 'procurementdocitem_to_id',
            'reverse' => 0
        ]
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['sysProcurementDocItemTypesFlow'] = [
    'table' => 'sysprocurementdocitemtypesflow',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'procurementdoctype_from' => [
            'name' => 'procurementdoctype_from',
            'vname' => 'LBL_PROCUREMENTDOCTYPE_FROM',
            'type' => 'varchar',
            'len' => 36
        ],
        'procurementdocitemtype_from' => [
            'name' => 'procurementdocitemtype_from',
            'vname' => 'LBL_PROCUREMENTDOCITEMTYPE_FROM',
            'type' => 'varchar',
            'len' => 36
        ],
        'procurementdoctype_to' => [
            'name' => 'procurementdoctype_to',
            'vname' => 'LBL_PROCUREMENTDOCTYPE_TO',
            'type' => 'varchar',
            'len' => 36
        ],
        'procurementdocitemtype_to' => [
            'name' => 'procurementdocitemtype_to',
            'vname' => 'LBL_PROCUREMENTDOCITEMTYPE_TO',
            'type' => 'varchar',
            'len' => 36
        ],
        'convert_method' => [
            'name' => 'convert_method',
            'vname' => 'LBL_CONVERT_METHOD',
            'type' => 'varchar',
            'len' => 200,
            'comment' => 'a class and method to identify the processing of the item to be applied when copying from one item to the next'
        ],
        'quantityhandling' => [
            'name' => 'quantityhandling',
            'vname' => 'LBL_QUANTITYHANDLING',
            'type' => 'char',
            'len' => 1,
            'default' => '0',
            'comment' => 'defines the quantitiy handling, 0 has no impact, - reduces the open quantity, + adds to the open quantity'
        ]
    ],
    'indices' => [
        [
            'name' => 'sysprocurementdocitemtypesflow_id',
            'type' => 'unique',
            'fields' => ['id']
        ]
    ]
];

