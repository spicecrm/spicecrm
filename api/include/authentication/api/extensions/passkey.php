<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\authentication\api\PasskeyController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'post',
        'route' => '/authentication/passkey/getArgs',
        'class' => PasskeyController::class,
        'function' => 'getArgs',
        'description' => 'passkey get args',
        'options' => ['noAuth' => true, 'adminOnly' => false, 'validate' => false],
        'parameters' => [
            'state' => [
                'in' => 'query',
                'description' => 'This is the value passed on from the login page. It should contain the session ID',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/authentication/passkey/createArgs',
        'class' => PasskeyController::class,
        'function' => 'createArgs',
        'description' => 'passkey create args',
        'options' => ['adminOnly' => false, 'validate' => false],
        'parameters' => [
            'state' => [
                'in' => 'query',
                'description' => 'This is the value passed on from the login page. It should contain the session ID',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/authentication/passkey/processCreate',
        'class' => PasskeyController::class,
        'function' => 'processCreate',
        'description' => 'passkey process create',
        'options' => ['adminOnly' => false, 'validate' => false],
        'parameters' => [
            'state' => [
                'in' => 'query',
                'description' => 'This is the value passed on from the login page. It should contain the session ID',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/authentication/passkey/{userId}',
        'class' => PasskeyController::class,
        'function' => 'checkPasskey',
        'description' => 'check passkey for user',
        'options' => ['adminOnly' => false, 'validate' => false],
        'parameters' => [
            'state' => [
                'in' => 'query',
                'description' => 'This is the value passed on from the login page. It should contain the session ID',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
            ]
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/authentication/passkey/{userId}',
        'class' => PasskeyController::class,
        'function' => 'removePasskey',
        'description' => 'check passkey for user',
        'options' => ['adminOnly' => false, 'validate' => false],
        'parameters' => [
            'state' => [
                'in' => 'query',
                'description' => 'This is the value passed on from the login page. It should contain the session ID',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
            ]
        ]
    ],
];


/**
 * register the Extension
 */
$RESTManager->registerExtension(
    'passkey',
    '1.0',
    [],
    $routes
);