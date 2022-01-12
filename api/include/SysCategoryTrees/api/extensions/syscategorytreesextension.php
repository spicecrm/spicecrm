<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SpiceUI\api\controllers\SystemUIController;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SysCategoryTrees\api\controllers\SysCategoryTreesController;

$routes = [
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/categorytrees',
        'class' => SysCategoryTreesController::class,
        'function' => 'getTrees',
        'description' => 'selects a tree without param',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/categorytrees/{id}',
        'class' => SysCategoryTreesController::class,
        'function' => 'addTree',
        'description' => 'adds a new tree',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the tree',
                'type' => ValidationMiddleware::TYPE_GUID
            ],
            'name' => [
                'in' => 'body',
                'description' => 'the name of the node',
                'type' => ValidationMiddleware::TYPE_STRING
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/categorytrees/{id}/categorytreenodes',
        'class' => SysCategoryTreesController::class,
        'function' => 'getTreeNodes',
        'description' => 'gets all the nodes of a tree',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the tree',
                'type' => ValidationMiddleware::TYPE_GUID
            ],
            'all' => [
                'in' => 'query',
                'description' => 'set to true to retuns all (active and inactive and invalid)',
                'type' => ValidationMiddleware::TYPE_BOOL
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/categorytrees/{id}/categorytreenodes',
        'class' => SysCategoryTreesController::class,
        'function' => 'postTreeNodes',
        'description' => 'saves all the nodes',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the tree',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ]
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension(
    'categorytrees',
    '2.0',
    SpiceConfig::getInstance()->config['ui'],
    $routes
);
