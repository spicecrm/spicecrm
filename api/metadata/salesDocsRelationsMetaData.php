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

$dictionary ['salesdocsflow'] = [
    'table' => 'salesdocsflow',
    'fields' => [
        ['name' => 'id', 'type' => 'id'],
        ['name' => 'salesdoc_from_id', 'type' => 'id'],
        ['name' => 'salesdoc_to_id', 'type' => 'id'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'required' => true, 'default' => false]
    ],
    'indices' => [
        ['name' => 'salesdocsflowpk', 'type' => 'primary', 'fields' => ['id']]
    ],
    'relationships' => [
        'salesdocsflow' => [
            'rhs_module' => 'SalesDocs',
            'rhs_table' => 'salesdocs',
            'rhs_key' => 'id',
            'lhs_module' => 'SalesDocs',
            'lhs_table' => 'salesdocs',
            'lhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'salesdocsflow',
            'join_key_lhs' => 'salesdoc_from_id',
            'join_key_rhs' => 'salesdoc_to_id',
            'reverse' => 0
        ]
    ]
];

$dictionary ['salesdocsitemsflow'] = [
    'table' => 'salesdocsitemsflow',
    'fields' => [
        ['name' => 'id', 'type' => 'id'],
        ['name' => 'salesdocitem_from_id', 'type' => 'id'],
        ['name' => 'salesdocitem_to_id', 'type' => 'id'],
        ['name' => 'date_modified', 'type' => 'datetime'],
        ['name' => 'deleted', 'type' => 'bool', 'required' => true, 'default' => false]
    ],
    'indices' => [
        ['name' => 'salesdocsitemsflowpk', 'type' => 'primary', 'fields' => ['id']]
    ],
    'relationships' => [
        'salesdocsitemsflow' => [
            'rhs_module' => 'SalesDocItems',
            'rhs_table' => 'salesdocitems',
            'rhs_key' => 'id',
            'lhs_module' => 'SalesDocItems',
            'lhs_table' => 'salesdocitems',
            'lhs_key' => 'id',
            'relationship_type' => 'many-to-many',
            'join_table' => 'salesdocsitemsflow',
            'join_key_lhs' => 'salesdocitem_from_id',
            'join_key_rhs' => 'salesdocitem_to_id',
            'reverse' => 0
        ]
    ]
];
