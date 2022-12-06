<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Currencies\api\controllers\CurrenciesController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */

$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */

$RESTManager->registerExtension('currencies', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Currencies',
        'oldroute'    => '/currencies',
        'class'       => CurrenciesController::class,
        'function'    => 'getCurrencies',
        'description' => 'get available currencies',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'start' => [
                'in'          => 'query',
                'description' => 'start for limit query',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => false
            ],
            'limit' => [
                'in'          => 'query',
                'description' => 'start for limit query',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => false
            ],
            'listid' => [
                'in'          => 'query',
                'description' => 'a list id',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false
            ],
            'searchterm' => [
                'in'          => 'query',
                'description' => 'a searchterm',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false
            ],
            'aggregates' => [
                'in'          => 'query',
                'description' => 'aggragates for filter',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false
            ],
            'buckets' => [
                'in'          => 'query',
                'description' => 'aggregates for filter',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false
            ],
            'offset' => [
                'in'          => 'query',
                'description' => 'an offset value',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => false
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Currencies/defaultcurrency',
        'oldroute'    => '/currencies/defaultcurrency',
        'class'       => CurrenciesController::class,
        'function'    => 'getDefaultCurrency',
        'description' => 'get default currency',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Currencies/add',
        'oldroute'    => '/currencies/add',
        'class'       => CurrenciesController::class,
        'function'    => 'addCurrency',
        'description' => 'adds a currency to currencies table',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'name'           => [
                'in'          => 'body',
                'description' => 'Name',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true
            ],
            'iso'           => [
                'in'          => 'body',
                'description' => 'ISO',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true
            ],
            'symbol'           => [
                'in'          => 'body',
                'description' => 'Symbol',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true
            ],
            'conversion_rate'           => [
                'in'          => 'body',
                'description' => 'Conversion Rate',
                'type'        => ValidationMiddleware::TYPE_NUMERIC,
                'required'    => true
            ]
        ]
    ]
];

$RESTManager->registerRoutes($routes);