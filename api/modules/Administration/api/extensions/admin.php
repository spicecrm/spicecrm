<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Administration\api\controllers\AdminController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method' => 'delete',
        'route' => '/system/cache',
        'class' => AdminController::class,
        'function' => 'resetCache',
        'description' => 'clears the cache (REDIS, MEMCAHCE, File, ..',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'post',
        'route' => '/admin/repair/pull',
        'class' => AdminController::class,
        'function' => 'pullFromRepository',
        'description' => 'pulls from Repository',
        'options' => ['adminOnly' => true]
    ],    [
        'method' => 'post',
        'route' => '/admin/repair/status',
        'class' => AdminController::class,
        'function' => 'showStatusRepository',
        'description' => 'status of git Repository',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/systemstats',
        'oldroute' => '/admin/systemstats',
        'class' => AdminController::class,
        'function' => 'systemstats',
        'description' => 'get some system statistics',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'route' => '/configuration/settings',
        'oldroute' => '/admin/generalsettings',
        'class' => AdminController::class,
        'function' => 'getGeneralSettings',
        'description' => 'get some system config variables',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'post',
        'route' => '/configuration/settings',
        'oldroute' => '/admin/writesettings',
        'class' => AdminController::class,
        'function' => 'writeGeneralSettings',
        'description' => 'save some system config variables',
        'options' => ['adminOnly' => true, 'validate' => true],
        'parameters' => [
            'system' => [
                'in' => 'body',
                'description' => 'the system settings',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'example' => '{"name":"SpiceCRM","site_url":"http://localhost/spicecrm_be_factory","unique_key":"03324ddd8cf6dedcebcc717c8c0066ce"}',
            ],
            'advanced' => [
                'in' => 'body',
                'description' => 'the advanced settings',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'example' => '{"developerMode":true,"stack_trace_errors":null,"dump_slow_queries":null,"log_memory_usage":null,"slow_query_time_msec":null,"upload_maxsize":30000000,"upload_dir":"upload/"}'
            ],
            'logger' => [
                'in' => 'body',
                'description' => 'the logger settings',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'example' => '{"level":"error"}'
            ],
            'cache' => [
                'in' => 'body',
                'description' => 'the cache settings',
                'type' => ValidationMiddleware::TYPE_ARRAY
            ],
            'currencies' => [
                'in' => 'body',
                'description' => 'the default currency settings',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'example' => '{"default_currency_iso4217":"EUR","default_currency_name":"Euro","default_currency_symbol":"€","default_currency_conversion_rate":1}'
            ]
        ]
    ],
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('admin', '2.0', [], $routes);