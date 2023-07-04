<?php

use SpiceCRM\modules\EmailTrackingActions\api\controllers\EmailTrackingActionsController;
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
        'method'      => 'get',
        'route'       => '/email/o/{key}',
        'class'       => EmailTrackingActionsController::class,
        'function'    => 'handleTrackingPixel',
        'description' => '',
        'options'     => ['noAuth' => true],
        'parameters' => [
            'key' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => '',
                'example' => '',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/email/u/{key}',
        'class'       => EmailTrackingActionsController::class,
        'function'    => 'handleUnsubscribe',
        'description' => '',
        'options'     => ['noAuth' => true],
        'parameters' => [
            'key' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => '',
                'example' => '',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/email/t/{key}',
        'class'       => EmailTrackingActionsController::class,
        'function'    => 'handleTrackingLink',
        'description' => '',
        'options'     => ['noAuth' => true],
        'parameters' => [
            'key' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => '',
                'example' => '',
                'required' => true
            ]
        ]
    ]
];

$RESTManager->registerExtension('marketing', '1.0', [], $routes);