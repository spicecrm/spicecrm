<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SpiceFavorites\api\controllers\SpiceFavoritesController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/common/spicefavorites',
        'oldroute'    => '/SpiceFavorites',
        'class'       => SpiceFavoritesController::class,
        'function'    => 'getFavorites',
        'description' => 'get all beans marked as favorite for current user',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/spicefavorites/{modulename}/{beanid}',
        'oldroute'    => '/SpiceFavorites/{module}/{id}',
        'class'       => SpiceFavoritesController::class,
        'function'    => 'addFavorite',
        'description' => 'set a bean as favorite for current user',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'modulename' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the module name',
                'example' => 'Accounts',
                'required' => true,
            ],
            'beanid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the bean id to set as favorite',
                'example' => '91e35ad0-947a-11eb-ac92-00fffe0c4f07',
                'required' => true,
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/common/spicefavorites/{modulename}/{beanid}',
        'oldroute'    => '/SpiceFavorites/{module}/{id}',
        'class'       => SpiceFavoritesController::class,
        'function'    => 'deleteFavorite',
        'description' => 'delete a favorite set by current user',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'modulename' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the module name',
                'example' => 'Accounts',
                'required' => true,
            ],
            'beanid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the bean id to set as favorite',
                'example' => '91e35ad0-947a-11eb-ac92-00fffe0c4f07',
                'required' => true,
            ]
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spicefavorites', '1.0', [], $routes);
