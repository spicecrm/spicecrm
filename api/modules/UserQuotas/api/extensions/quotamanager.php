<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\UserQuotas\api\controllers\QuotaManagerController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('userquotas', '1.0');

$routes = [
    [
        'method' => 'get',
        'oldroute' => '/quotamanager/users',
        'route' => '/module/QuotaManager/users',
        'class' => QuotaManagerController::class,
        'function' => 'getQuotaUser',
        'description' => 'gets a quota User',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'oldroute' => '/quotamanager/quotas/{year}',
        'route' => '/module/QuotaManager/quotas/{year}',
        'class' => QuotaManagerController::class,
        'function' => 'getQuota',
        'description' => 'gets a quota',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'year' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 2021,
                'required' => true
            ],
        ]
    ],
    [
        'method' => 'post',
        'oldroute' => '/quotamanager/quota/{userid}/{year}/{period}/{quota}',
        'route' => '/module/QuotaManager/quota/{userid}/{year}/{period}/{quota}',
        'class' => QuotaManagerController::class,
        'function' => 'setQuota',
        'description' => 'sets a quota',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'userid' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
                'required' => true
            ],
            'year' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 2021,
                'required' => true
            ],
            'period' => [
                'in' => 'path',
                'description' => 'period1 or for multiple comma-seperated: period1,period2',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'period1 or for multiple comma-seperated: period1,period2',
                'required' => true
            ],
            'quota' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 500.20,
                'required' => true
            ],
        ],
    ],
    [
        'method' => 'delete',
        'oldroute' => '/quotamanager/quota/{userid}/{year}/{period}',
        'route' => '/module/QuotaManager/quota/{userid}/{year}/{period}',
        'class' => QuotaManagerController::class,
        'function' => 'deleteQuota',
        'description' => 'deletes a quota',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'userid' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
                'required' => true
            ],
            'year' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 2021,
                'required' => true
            ],
            'period' => [
                'in' => 'path',
                'description' => 'period1 or for multiple comma-seperated: period1,period2',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'period1 or for multiple comma-seperated: period1,period2',
                'required' => true
            ],
        ],
    ],
];

$RESTManager->registerRoutes($routes);

