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

$dictionary['sysnumberranges'] = [
    'table' => 'sysnumberranges',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'type' => 'varchar',
            'len' => 100
        ],
        'prefix' => [
            'name' => 'prefix',
            'type' => 'varchar',
            'len' => 10
        ],
        'length' => [
            'name' => 'length',
            'type' => 'int',
            'isnull' => true
        ],
        'range_from' => [
            'name' => 'range_from',
            'type' => 'double'
        ],
        'range_to' => [
            'name' => 'range_to',
            'type' => 'double'
        ],
        'next_number' => [
            'name' => 'next_number',
            'type' => 'double'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_sysnumberranges',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];

$dictionary['sysnumberrangeallocation'] = [
    'table' => 'sysnumberrangeallocation',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 50
        ],
        'field' => [
            'name' => 'field',
            'type' => 'varchar',
            'len' => 50
        ],
        'numberrange' => [
            'name' => 'numberrange',
            'type' => 'varchar',
            'len' => 36,
        ],
        'valid_from' => [
            'name' => 'valid_from',
            'type' => 'date'
        ],
        'valid_to' => [
            'name' => 'valid_to',
            'type' => 'date'
        ]
    ],
    'indices' => [
        [
            'name' => 'idx_sysnumberrangeallocation',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];
