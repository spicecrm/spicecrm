<?php

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

use SpiceCRM\includes\SysCurrencies\api\controllers\SysCurrenciesController;

$routes = [
    [
        'method' => 'get',
        'route' => '/system/currencies',
        'class' => SysCurrenciesController::class,
        'function' => 'getCurrencies',
        'description' => 'loads the currencies'
    ],
    [
        'method' => 'put',
        'route' => '/system/currencies/{currencyid}/systemcurrency',
        'class' => SysCurrenciesController::class,
        'function' => 'setSystemCurrency',
        'description' => 'sets the currency with the id as systemcurrency',
        'options' => ['adminOnly' => true],
    ],
    [
        'method' => 'put',
        'route' => '/system/currencies/{currencyid}/active',
        'class' => SysCurrenciesController::class,
        'function' => 'setCurrencyActive',
        'description' => 'sets a currency active',
        'options' => ['adminOnly' => true],
    ],
    [
        'method' => 'delete',
        'route' => '/system/currencies/{currencyid}/active',
        'class' => SysCurrenciesController::class,
        'function' => 'setCurrencyInactive',
        'description' => 'sets a currency inactive',
        'options' => ['adminOnly' => true],
    ],
    [
        'method' => 'get',
        'route' => '/system/currencies/{currencyid}/rates',
        'class' => SysCurrenciesController::class,
        'function' => 'getExchangeRates',
        'description' => 'loads the exchange rates'
    ],
    [
        'method' => 'put',
        'route' => '/system/currencies/loadfromfile',
        'class' => SysCurrenciesController::class,
        'function' => 'loadCurrencies',
        'description' => 'loads the currencies from the file',
        'options' => ['adminOnly' => true],
        'parameters' => []
    ]
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension(
    'syscurrencies',
    '1.0',
    null,
    $routes
);
