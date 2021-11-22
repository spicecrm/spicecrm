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

$dictionary['syslogs'] = [
    'table' => 'syslogs',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'type' => 'datetime',
        ],
        'microtime' => [
            'name' => 'microtime',
            'type' => 'varchar',
            'len' => 50
        ],
        'created_by' => [
            'name' => 'created_by',
            'type' => 'id',
        ],
        'pid' => [
            'name' => 'pid',
            'type' => 'int'
        ],
        'log_level' => [
            'name' => 'log_level',
            'type' => 'varchar',
        ],
        'level_value' => [
            'name' => 'level_value',
            'type' => 'tinyint'
        ],
        'description' => [
            'name' => 'description',
            'type' => 'text',
        ],
        'transaction_id' => [
            'name' => 'transaction_id',
            'type' => 'varchar',
            'len' => 36
        ]
    ],
    'indices' => [
        [
            'name' => 'syslogspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_syslogslevel',
            'type' => 'index',
            'fields' => ['log_level']
        ],
        [
            'name' => 'idx_syslogscreatedby',
            'type' => 'index',
            'fields' => ['created_by']
        ],
        [
            'name' => 'idx_syslogslogcreatedbylevel',
            'type' => 'index',
            'fields' => ['created_by', 'log_level']
        ],
        [
            'name' => 'idx_syslogs_microtime',
            'type' => 'index',
            'fields' => ['microtime']
        ],
        [
            'name' => 'idx_syslogs_pid',
            'type' => 'index',
            'fields' => ['pid']
        ],
        [
            'name' => 'idx_syslogs_level_value',
            'type' => 'index',
            'fields' => ['level_value']
        ],
        [
            'name' => 'idx_syslogs_transaction_id',
            'type' => 'index',
            'fields' => ['transaction_id']
        ]
    ]
];


$dictionary['syslogusers'] = [
    'table' => 'syslogusers',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'id',
        ],
        'log_level' => [
            'name' => 'log_level',
            'type' => 'varchar',
        ],
        'logstatus' => [
            'name' => 'logstatus',
            'type' => 'bool',
            'default' => 0
        ]
    ],
    'indices' => [
        [
            'name' => 'sysloguserspk',
            'type' => 'primary',
            'fields' => ['id']
        ],
        [
            'name' => 'idx_sysloguserslevel',
            'type' => 'index',
            'fields' => ['log_level']
        ],
        [
            'name' => 'idx_syslogsuseridstatus',
            'type' => 'index',
            'fields' => ['user_id', 'logstatus']
        ],
        [
            'name' => 'idx_syslogsuseridlevelstatus',
            'type' => 'index',
            'fields' => ['user_id', 'log_level', 'logstatus']
        ]
    ]
];
