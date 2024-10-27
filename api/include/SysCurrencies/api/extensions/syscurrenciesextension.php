<?php

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

use SpiceCRM\includes\SysCurrencies\api\controllers\SysCurrenciesController;

$routes = [
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
