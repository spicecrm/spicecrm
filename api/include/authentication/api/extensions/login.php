<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Users\api\controllers\UsersController;
use SpiceCRM\includes\authentication\api\controllers\LoginController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'post',
        'oldroute'    => '/login',
        'route'       => '/authentication/login',
        'class'       => LoginController::class,
        'function'    => 'getCurrentUserData',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => []
    ],
    [
        'method'      => 'get',
        'oldroute'    => '/login',
        'route'       => '/authentication/login',
        'class'       => LoginController::class,
        'function'    => 'getCurrentUserData',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'impersonationuser'       => [
                'in'          => 'query',
                'description' => 'the user that is requesting the login impersonated as an other user',
                'type'        => ValidationMiddleware::TYPE_STRING
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'oldroute'    => '/login',
        'route'       => '/authentication/login',
        'class'       => LoginController::class,
        'function'    => 'loginDelete',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => []
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('login', '1.0', [], $routes);
