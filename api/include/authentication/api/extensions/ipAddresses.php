<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

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