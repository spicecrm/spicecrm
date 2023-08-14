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

SpiceDictionaryHandler::getInstance()->dictionary['syscategorytreenodes'] = [
    'table' => 'syscategorytreenodes',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id',
            'comment' => 'the unique id of the node'
        ],
        'node_name' => [
            'name' => 'node_name',
            'type' => 'varchar',
            'comment' => 'the name resp label of the node'
        ],
        'node_description' => [
            'name' => 'node_description',
            'type' => 'shorttext',
            'len' => 1000,
            'comment' => 'a short description to be displayed'
        ],
        'node_key' => [
            'name' => 'node_key',
            'type' => 'varchar',
            'len' => 32,
            'comment' => 'a key value'
        ],
        'selectable' => [
            'name' => 'selectable',
            'type' => 'bool',
            'comment' => 'set to true to make the node selectable'
        ],
        'favorite' => [
            'name' => 'favorite',
            'type' => 'bool',
            'comment' => 'set to mark a node as favorite'
        ],
        'parent_id' => [
            'name' => 'parent_id',
            'type' => 'id',
            'comment' => 'the id of a parent node inteh tree hiearchy'
        ],
        'valid_from' => [
            'name' => 'valid_from',
            'type' => 'datetime',
            'comment' => 'the date this is valid from'
        ],
        'valid_to' => [
            'name' => 'valid_to',
            'type' => 'datetime',
            'comment' => 'the date this is valid to'
        ],
        'node_status' => [
            'name' => 'node_status',
            'type' => 'varchar',
            'len' => 1,
            'comment' => 'the status a for active, i for inactive'
        ],
        'add_params' => [
            'name' => 'add_params',
            'type' => 'json',
            'dbtype' => 'shorttext',
            'comment' => 'optional additonal data'
        ],
        'syscategorytree_id' => [
            'name' => 'syscategorytree_id',
            'type' => 'id',
            'comment' => 'the id of the tree this node belongs to'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'default' => 0,
            'comment' => 'indicates this one is deleted'
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_syscategorytreenodes_pk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_syscategorytreenodes_tree',
            'type' => 'index',
            'fields' => ['syscategorytree_id']
        ],
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['syscategorytrees'] = [
    'table' => 'syscategorytrees',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
        ],
        'add_params_component' => [
            'name' => 'add_params_component',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'component to manage additonal data'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_syscategorytrees_pk',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];

SpiceDictionaryHandler::getInstance()->dictionary['syscategorytreelinks'] = [
    'table' => 'syscategorytreelinks',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'syscategorytree_id' => [
            'name' => 'syscategorytree_id',
            'type' => 'id',
            'comment' => 'the id of the tree this node belongs to'
        ],
        'module_id' => [
            'name' => 'module_id',
            'type' => 'varchar',
            'len' => 36,
            'comment' => 'the id of the module from sysmodules'
        ],
        'module_field' => [
            'name' => 'module_field',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'the name of a nonDB field on the module to link the tree to'
        ],
        'module_field_c1' => [
            'name' => 'module_field_c1',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'the name of a field on teh module to write the category 1 value to'
        ],
        'module_field_c2' => [
            'name' => 'module_field_c2',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'the name of a field on teh module to write the category 2 value to'
        ],
        'module_field_c3' => [
            'name' => 'module_field_c3',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'the name of a field on teh module to write the category 3 value to'
        ],
        'module_field_c4' => [
            'name' => 'module_field_c4',
            'type' => 'varchar',
            'len' => 100,
            'comment' => 'the name of a field on teh module to write the category 4 value to'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_syscategorytreelinks_pk',
            'type' => 'primary',
            'fields' => ['id']
        ]
    ]
];
