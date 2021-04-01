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

$dictionary['syskrestlogconfig'] = [
    'table' => 'syskrestlogconfig',
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
    ],
    'indices' => [
        [
            'name' => 'idx_syskrestlogconfig',
            'type' => 'primary',
            'fields' => ['id'],
        ],
        [
            'name' => 'unq_idx_syskrestlogconfig_v2',
            'type' => 'unique',
            'fields' => ['route', 'method', 'user_id', 'ip'],
        ],
    ],
];


$dictionary['syskrestlog'] = [
    'table' => 'syskrestlog',
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
        'requested_at' => [
            'name' => 'requested_at',
            'type' => 'datetime',
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
            'len' => 30
        ],
        'method' => [
            'name' => 'method',
            'type' => 'varchar',
            'len' => 6
        ],
        'args' => [
            'name' => 'args',
            'type' => 'varchar',
            'len' => 255
        ],
        'headers' => [
            'name' => 'headers',
            'type' => 'text'
        ],
        'get_params' => [
            'name' => 'get_params',
            'type' => 'text',
        ],
        'post_params' => [
            'name' => 'post_params',
            'type' => 'longtext' # todo: MSSQL doesn´t know "longtext"
        ],
        'response' => [
            'name' => 'response',
            'type' => 'longtext' # todo: MSSQL doesn´t know "longtext"
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
    ],
    'indices' => [
        [
            'name' => 'idx_syskrestlog',
            'type' => 'primary',
            'fields' => ['id'],
        ],
        [
            'name' => 'idx_syskrestlog_requested_at',
            'type' => 'index',
            'fields' => ['requested_at'],
        ],
        [
            'name' => 'idx_syskrestlog_user_id',
            'type' => 'index',
            'fields' => ['user_id'],
        ],
        [
            'name' => 'idx_syskrestlog_route',
            'type' => 'index',
            'fields' => ['route'],
        ],
        [
            'name' => 'idx_syskrestlog_ip',
            'type' => 'index',
            'fields' => ['ip'],
        ],
        [
            'name' => 'idx_syskrestlog_method',
            'type' => 'index',
            'fields' => ['method'],
        ],
        [
            'name' => 'idx_syskrestlog_session_id',
            'type' => 'index',
            'fields' => ['session_id'],
        ],
        [
            'name' => 'idx_syskrestlog_http_status_code',
            'type' => 'index',
            'fields' => ['http_status_code'],
        ],
        [
            'name' => 'idx_syskrestlog_transaction_id',
            'type' => 'index',
            'fields' => ['transaction_id'],
        ]
    ],
];
