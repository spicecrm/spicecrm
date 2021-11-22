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

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\authentication\IpAddresses\IpAddresses;
use SpiceCRM\includes\authentication\api\controllers\IpAddressesController;

$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'get',
        'route' => '/authentication/ipAddresses/{color}',
        'class' => IpAddressesController::class,
        'function' => 'getIpAddresses',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validation' => true],
        'parameters' => [
            'color' => [
                'in' => 'path',
                'description' => 'Gets the full list of IP Addresses from one color/list (black or white).',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '#^black|white$#'
                ]
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/authentication/ipAddress/{ipAddress}',
        'class' => IpAddressesController::class,
        'function' => 'addIpAddress',
        'description' => 'Creates an IP address.',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validation' => true],
        'parameters' => [
            'ipAddress' => [
                'in' => 'path',
                'description' => 'IP Address to create.',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '#^[1-9]{1,2}\.[1-9]\d{1,2}\.[1-9]\d{1,2}$#'
                ]
            ],
            'color' => [
                'in' => 'body',
                'description' => 'Color ("w" or "b")',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '#^w|b$#'
                ]
            ]
        ]
    ],
    [
        'method' => 'put',
        'route' => '/authentication/ipAddress/{ipAddress}',
        'class' => IpAddressesController::class,
        'function' => 'alterIpAddress',
        'description' => 'Alters the description of an IP address.',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validation' => true],
        'parameters' => [
            'ipAddress' => [
                'in' => 'path',
                'description' => 'IP Address to alter.',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '#^[1-9]{1,2}\.[1-9]\d{1,2}\.[1-9]\d{1,2}$#'
                ]
            ],
            'description' => [
                'in' => 'description',
                'description' => 'Description of the IP address.',
                'type' => ValidationMiddleware::TYPE_STRING
            ]
        ]
    ],
    [
        'method' => 'put',
        'route' => '/authentication/ipAddress/{ipAddress}/move/{color}',
        'class' => IpAddressesController::class,
        'function' => 'moveIpAddress',
        'description' => 'Moves an IP Address from one color/list to the other color/list.',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validation' => true],
        'parameters' => [
            'ipAddress' => [
                'in' => 'path',
                'description' => 'IP Address to move.',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '#^[1-9]{1,2}\.[1-9]\d{1,2}\.[1-9]\d{1,2}$#'
                ]
            ],
            'color' => [
                'in' => 'path',
                'description' => 'The destination color ("white" or "black")',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '#^white|black$#'
                ]
            ]
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/authentication/ipAddress/{ipAddress}',
        'class' => IpAddressesController::class,
        'function' => 'deleteIpAddress',
        'description' => 'Deletes a white or black listed IP address.',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'ipAddress' => [
                'in' => 'path',
                'description' => 'IP address to delete.',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => '123.123.123.123'
            ]
        ]
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('ipAddresses', '1.0', [], $routes);