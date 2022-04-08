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
            ]
        ]
    ]
];

$RESTManager->registerRoutes($routes);