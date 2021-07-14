<?php
/*
 * This File is part of KREST is a Restful service extension for SugarCRM
 *
 * Copyright (C) 2015 AAC SERVICES K.S., DOSTOJEVSKÉHO RAD 5, 811 09 BRATISLAVA, SLOVAKIA
 *
 * you can contat us at info@spicecrm.io
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */

$dictionary['sysapilogconfig'] = [
    'table' => 'sysapilogconfig',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'route' => [
            'name' => 'route',
            'type' => 'varchar',
            'len' => 255,
        ],
        'method' => [
            'name' => 'method',
            'type' => 'varchar',
            'len' => 6,
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'varchar',
            'len' => 36
        ],
        'ip' => [
            'name' => 'ip',
            'type' => 'varchar',
            'len' => 15
        ],
        'is_active' => [
            'name' => 'is_active',
            'type' => 'bool',
        ],
        'direction' => [
            'name'    => 'direction',
            'type'    => 'enum',
            'len'     => 1,
            'options' => 'apilog_direction_dom',
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_sysapilogconfig',
            'type' => 'primary',
            'fields' => ['id'],
        ],
        [
            'name' => 'unq_idx_sysapilogconfig_v2',
            'type' => 'unique',
            'fields' => ['route', 'method', 'user_id', 'ip'],
        ],
    ],
];


$dictionary['sysapilog'] = [
    'table' => 'sysapilog',
    'fields' => [
        'id' => [
            'name' => 'id',
            'type' => 'id'
        ],
        'route' => [
            'name' => 'route',
            'type' => 'varchar',
            'len' => 255,
        ],
        'url' => [
            'name' => 'url',
            'type' => 'varchar',
            'len' => 3072,
        ],
        'date_entered' => [
            'name' => 'date_entered',
            'type' => 'datetime',
        ],
        'date_timestamp' => [
            'name' => 'date_timestamp',
            'type' => 'varchar',
            'len' => 30,
            'comment' => 'a microtime timestamp for exact sequencing of events'
        ],
        'runtime' => [
            'name' => 'runtime',
            'type' => 'int',
        ],
        'user_id' => [
            'name' => 'user_id',
            'type' => 'varchar',
            'len' => 36
        ],
        'ip' => [
            'name' => 'ip',
            'type' => 'varchar',
            'len' => 15
        ],
        'session_id' => [
            'name' => 'session_id',
            'type' => 'varchar',
            'len' => 32
        ],
        'method' => [
            'name' => 'method',
            'type' => 'varchar',
            'len' => 6
        ],
        'request_args' => [
            'name' => 'request_args',
            'type' => 'varchar',
            'len' => 255
        ],
        'request_headers' => [
            'name' => 'request_headers',
            'type' => 'text'
        ],
        'request_params' => [
            'name' => 'request_params',
            'type' => 'text',
        ],
        'request_body' => [
            'name' => 'request_body',
            'type' => 'longtext'
        ],
        'response_headers' => [
            'name' => 'response_headers',
            'type' => 'text'
        ],
        'response_body' => [
            'name' => 'response_body',
            'type' => 'longtext'
        ],
        'response_error' => [
            'name' => 'response_error',
            'type' => 'text'
        ],
        'http_status_code' => [
            'name' => 'http_status_code',
            'type' => 'int',
        ],
        'transaction_id' => [
            'name' => 'transaction_id',
            'type' => 'varchar',
            'len' => 36
        ],
        'direction' => [
            'name'    => 'direction',
            'type'    => 'enum',
            'options' => 'apilog_direction_dom',
            'len'     => 1,
        ],
    ],
    'indices' => [
        [
            'name' => 'idx_sysapilog',
            'type' => 'primary',
            'fields' => ['id'],
        ],
        [
            'name' => 'idx_sysapilog_date_entered',
            'type' => 'index',
            'fields' => ['date_entered'],
        ],
        [
            'name' => 'idx_sysapilog_user_id',
            'type' => 'index',
            'fields' => ['user_id'],
        ],
        [
            'name' => 'idx_sysapilog_route',
            'type' => 'index',
            'fields' => ['route'],
        ],
        [
            'name' => 'idx_sysapilog_ip',
            'type' => 'index',
            'fields' => ['ip'],
        ],
        [
            'name' => 'idx_sysapilog_method',
            'type' => 'index',
            'fields' => ['method'],
        ],
        [
            'name' => 'idx_sysapilog_session_id',
            'type' => 'index',
            'fields' => ['session_id'],
        ],
        [
            'name' => 'idx_sysapilog_http_status_code',
            'type' => 'index',
            'fields' => ['http_status_code'],
        ],
        [
            'name' => 'idx_sysapilog_transaction_id',
            'type' => 'index',
            'fields' => ['transaction_id'],
        ]
    ],
];
