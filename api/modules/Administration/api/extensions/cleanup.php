<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Administration\api\controllers\CleanUpController;

/**
 * routes
 */
$routes = [
    [
        'method'      => 'get',
        'route'       => '/admin/cleanup/configs/check/incomplete',
        'class'       => CleanUpController::class,
        'function'    => 'getIncompleteRecords',
        'description' => 'get Incomplete Records',
        'options'     => ['adminOnly' => true, 'validate' => true]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/cleanup/configs/check/incomplete/{scope}',
        'class'       => CleanUpController::class,
        'function'    => 'getIncompleteRecords',
        'description' => 'get Incomplete Records',
        'options'     => ['adminOnly' => true, 'validate' => true, 'validate' => true],
        'parameters'  => [
            'scope' => [
                'in' => 'path',
                'type'        => 'string',
                'description' => 'type of diagnose'
            ],
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/cleanup/configs/check/unused',
        'class'       => CleanUpController::class,
        'function'    => 'getUnusedRecords',
        'description' => 'get unused Records',
        'options'     => ['adminOnly' => true, 'validate' => true]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/cleanup/configs/check/unused/{scope}',
        'class'       => CleanUpController::class,
        'function'    => 'getUnusedRecords',
        'description' => 'get unused Records',
        'options'     => ['adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'scope' => [
                'in' => 'path',
                'type'        => 'string',
                'description' => 'type of diagnose'
            ],
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/cleanup/stylecache',
        'class'       => CleanUpController::class,
        'function'    => 'cleanDompdfStyleCacheFile',
        'description' => 'clean dompdf caches styles',
        'options'     => ['adminOnly' => true, 'validate' => true],
    ]
];

/**
 * Register the Extension
 */
RESTManager::getInstance()->registerExtension('admincleanup', '2.0', [], $routes);

