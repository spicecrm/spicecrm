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
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Logger\api\controllers\LogViewController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/admin/crmlog/entries',
        'oldroute'    => '/crmlog',
        'class'       => LogViewController::class,
        'function'    => 'CRMLogGetEntries',
        'description' => 'Get the entries of the error log.',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => false],
        'parameters'  => [
            'level' => [
                'in' => 'query',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'options'     => ['debug', 'info', 'warn', 'deprecated', 'login', 'error', 'fatal', 'security'],
                'description' => 'Error level of the requested error log entries.',
            ],
            'limit' => [
                'in' => 'query',
                'description' => 'Maximal numbers of requested error log entries.',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'default' => 250
            ],
            'processId' => [
                'in' => 'query',
                'description' => 'Process ID of the requested error log entries.',
                'type' => ValidationMiddleware::TYPE_NUMERIC
            ],
            'transactionId' => [
                'in' => 'query',
                'description' => 'Transaction ID of the requested error log entries.',
                'type' => ValidationMiddleware::TYPE_GUID,
            ],
            'userId' => [
                'in' => 'query',
                'description' => 'User ID of the requested error log entries.',
                'type' => ValidationMiddleware::TYPE_GUID
            ],
            'text' => [
                'in' => 'query',
                'description' => 'Filter text for the requested error log entries.',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'end' => [
                'in' => 'query',
                'description' => 'End date and hour of the requested error log entries.',
                'type' => ValidationMiddleware::TYPE_STRING,
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '/^\d{10}$/',
                ],
            ],
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/crmlog/entry/{id}',
        'oldroute'    => '/crmlog/entry/{entryId}',
        'class'       => LogViewController::class,
        'function'    => 'CRMLogGetFullEntry',
        'description' => 'Get a specific full (not truncated) entry of the error log.',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true ],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'GUID of the requested error log entry.',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true
            ]
        ],
    ],
    [
        'method'      => 'delete',
        'route'       => '/admin/crmlog',
        'class'       => LogViewController::class,
        'function'    => 'CRMlogTruncate',
        'description' => 'Deletes all the CRM log data.',
        'options'     => ['noAuth' => false, 'adminOnly' => true]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/apilog',
        'oldroute'    => '/restlog/entries',
        'class'       => LogViewController::class,
        'function'    => 'APIlogGetRecords',
        'description' => 'Get the entries of the REST log.',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'limit' => [
                'in' => 'query',
                'description' => 'Maximal numbers of requested REST log entries.',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'default' => 5000
            ],
            'session_id' => [
                'in' => 'query',
                'description' => 'Transaction ID of the requested REST log entries.',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'user_id' => [
                'in' => 'query',
                'description' => 'User ID of the requested REST log entries.',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'method' => [
                'in' => 'query',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'options'     => ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PATCH', 'PUT', 'TRACE', 'SOAP'],
                'description' => 'HTTP method of the requested REST log entries.',
            ],
            'route' => [
                'in' => 'query',
                'description' => 'url or route fragment of the requested REST log entries.',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'filter' => [
                'in' => 'query',
                'description' => 'Route arguments fragment of the requested REST log entries.',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'status' => [
                'in' => 'query',
                'description' => 'HTTP status code of the requested REST log entries.',
                'type' => ValidationMiddleware::TYPE_NUMERIC
            ],
            'direction' => [
                'in' => 'query',
                'description' => 'either inbound or outbound.',
                'type' => ValidationMiddleware::TYPE_ENUM,
                'options' => ['I', 'O']
            ],
            'ip' => [
                'in' => 'query',
                'description' => 'IP address of the requested REST log entries.',
                'type' => ValidationMiddleware::TYPE_STRING,
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '#^\d+\.\d+\.\d+\.\d+$#',
                ]
            ],
            'end' => [
                'in' => 'query',
                'description' => 'End date and hour of the requested REST log entries.',
                'type' => ValidationMiddleware::TYPE_DATETIME
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/admin/apilog',
        'class'       => LogViewController::class,
        'function'    => 'APIlogTruncate',
        'description' => 'truncates the API log',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/apilog/{id}',
        'oldroute'    => '/restlog/entry/{id}',
        'class'       => LogViewController::class,
        'function'    => 'APIlogGetRecord',
        'description' => 'Get a specific full (not truncated) entry of the REST log.',
        'options'     => [ 'noAuth' => false, 'adminOnly' => true, 'validate' => true ],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'GUID of the requested REST log entry.',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true
            ]
        ]
    ]
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('crmlog', '2.0', [], $routes);
