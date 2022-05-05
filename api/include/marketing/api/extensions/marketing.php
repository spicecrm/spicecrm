<?php

use SpiceCRM\includes\marketing\api\controllers\MarketingAutomationController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;

/**
 * Rest Manager Instance
 */

$RESTManager = RESTManager::getInstance();

/**
 * Routes array
 */
$routes = [
    [
        'method'      => 'post',
        'route'       => '/system/marketing/count/{key}',
        'class'       => MarketingAutomationController::class,
        'function'    => 'handleTrackingPixel',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
        'parameters' => [
            'key' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_BASE64,
                'description' => '',
                'example' => '',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/system/marketing/link/{key}',
        'class'       => MarketingAutomationController::class,
        'function'    => 'handleTrackingUrl',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
        'parameters' => [
            'key' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_BASE64,
                'description' => '',
                'example' => '',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/system/marketing/aboStep1/{key}',
        'class'       => MarketingAutomationController::class,
        'function'    => 'handleSubscription',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
        'parameters' => [
            'key' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_BASE64,
                'description' => '',
                'example' => '',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/system/marketing/aboStep2/{key}',
        'class'       => MarketingAutomationController::class,
        'function'    => 'makeKey',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
];

$RESTManager->registerExtension('marketing', '1.0', [], $routes);