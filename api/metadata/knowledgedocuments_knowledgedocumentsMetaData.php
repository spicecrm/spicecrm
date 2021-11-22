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

global $dictionary;
$dictionary['knowledgedocuments_knowledgedocuments'] = [
    'table' => 'knowledgedocuments_knowledgedocuments',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'],
        'kbl_id' => [
            'name' => 'kbl_id',
            'type' => 'varchar',
            'len' => '36'],
        'kbr_id' => [
            'name' => 'kbr_id',
            'type' => 'varchar',
            'len' => '36'],
        'date_modified' => [
            'name' => 'date_modified',
            'type' => 'datetime'
        ],
        'deleted' => [
            'name' => 'deleted',
            'type' => 'bool',
            'len' => '1',
            'required' => false,
            'default' => '0'
        ]
    ],
    'indices' => [
        [
            'name' => 'accounts_contactspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_kbl_id',
            'type' => 'index',
            'fields' => ['kbl_id']
        ],
        [
            'name' => 'idx_kbr_id',
            'type' => 'index',
            'fields' => ['kbr_id']
        ]

    ],
    'relationships' => [
        'knowledgedocuments_knowledgedocuments' => [
            'lhs_module' => 'KnowledgeDocuments',
            'lhs_table' => 'knowledgedocuments',
            'lhs_key' => 'id',
            'rhs_module' => 'KnowledgeDocuments',
            'rhs_table' => 'knowledgedocuments',
            'rhs_key' => 'id',
            'join_table' => 'knowledgedocuments_knowledgedocuments',
            'join_key_lhs' => 'kbl_id',
            'join_key_rhs' => 'kbr_id',
            'relationship_type' => 'many-to-many',
        ]
    ]
];
