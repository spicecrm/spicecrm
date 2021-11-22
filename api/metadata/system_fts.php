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

$dictionary['sysfts'] = [
    'table' => 'sysfts',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'char',
            'len' => 36,
            'required' => true,
            'isnull' => false,
        ],
        'module' => [
            'name' => 'module',
            'type' => 'varchar',
            'len' => 255,
            'required' => true,
            'isnull' => false
        ],
        'index_priority' => [
            'name' => 'index_priority',
            'type' => 'int'
        ],
        'ftsfields' => [
            'name' => 'ftsfields',
            'type' => 'text'
        ],
        'activated_date' => [
            'name' => 'activated_date',
            'type' => 'date'
        ],
        'activated_fields' => [
            'name' => 'activated_fields',
            'type' => 'text'
        ],
        'settings' => [
            'name' => 'settings',
            'type' => 'text'
        ]
    ],
    'indices' => [
        ['name' => 'sysftspk', 'type' => 'primary', 'fields' => ['id']],
        ['name' => 'sysftsmodule', 'type' => 'unique', 'fields' => ['module']],
    ]
];

$dictionary['sysftslog'] = [
    'table' => 'sysftslog',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'date_created' => [
            'name' => 'date_created',
            'type' => 'datetime'
        ],
        'response_status' => [
            'name' => 'response_status',
            'type' => 'varchar',
            'len' => 10
        ],'request_method' => [
            'name' => 'request_method',
            'type' => 'varchar',
            'len' => 10
        ],
        'request_url' => [
            'name' => 'request_url',
            'type' => 'longtext' # todo: MSSQL doesn´t know "longtext"
        ],
        'index_request' => [
            'name' => 'index_request',
            'type' => 'text'
        ],
        'index_response' => [
            'name' => 'index_response',
            'type' => 'longtext' # todo: MSSQL doesn´t know "longtext"
        ],
        'rt_local' => [
            'name' => 'rt_local',
            'type' => 'double'
        ],
        'rt_remote' => [
            'name' => 'rt_remote',
            'type' => 'double'
        ]

    ],
    'indices' => [
        [
            'name' => 'sysftslogpk',
            'type' => 'primary',
            'fields' => ['id']]
    ]
];