<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Users\api\controllers\UsersPreferencesController;
use Slim\Routing\RouteCollectorProxy;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('userpreferences', '1.0');


$routes = [
    [
        'method' => 'get',
        'oldroute' => '/user/{userId}/preferences/{category}',
        'route' => '/module/Users/{userId}/preferences/{category}',
        'class' => UsersPreferencesController::class,
        'function' => 'getPreferences',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'userId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'GUID of the User',
            ],
            'category' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'Category of the preference',
            ],
            'names' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'description' => 'Specific Category entry',
            ],
        ]
    ],
    [
        'method' => 'get',
        'oldroute' => '/user/{userId}/preferences/{category}/{names}',
        'route' => '/module/User/{userId}/preferences/{category}/{names}',
        'class' => UsersPreferencesController::class,
        'function' => 'getUserPreferences',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'names' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
            ],
            'userId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'GUID of the User',
            ],
            'category' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'Category of the preference',
            ],
        ]
    ],
    [
        'method' => 'post',
        'oldroute' => '/user/{userId}/preferences/{category}',
        'route' => '/module/Users/{userId}/preferences/{category}',
        'class' => UsersPreferencesController::class,
        'function' => 'set_user_preferences',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            ValidationMiddleware::ANONYMOUS_ARRAY => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'required' => true,
            ],
            'userId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'GUID of the User',
            ],
            'category' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'Category of the preference',
            ],
            'names' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'description' => 'Specific Category entry',
            ],
        ]
    ],
];

$RESTManager->registerRoutes($routes);

