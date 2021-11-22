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

$dictionary['syscategorytreenodes'] = [
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
            'comment'=> 'the name resp label of the node'
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
        'syscategorytree_id' => [
            'name' => 'syscategorytree_id',
            'type' => 'id',
            'comment' => 'the id of the tree this node belongs to'
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


$dictionary['syscategorytrees'] = [
    'table' => 'syscategorytrees',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
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