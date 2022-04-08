<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\UserAccessLogs\api\controllers\UserAccessLogController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'get',
        'oldroute' => '/login',
        'route' => '/admin/useraccesslog',
        'class' => UserAccessLogController::class,
        'function' => 'getUserAccessLog',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'limit' => [
                'in' => 'query',
                'description' => 'Maximal numbers of requested error log entries.',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'default' => 250
            ],
            'filter' => [
                'in' => 'query',
                'description' => 'a generid filter term',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'date_end' => [
                'in' => 'query',
                'description' => 'the end date',
                'type' => ValidationMiddleware::TYPE_DATETIME
            ],
            'failedonly' => [
                'in' => 'query',
                'description' => 'to only list failed attempts',
                'type' => ValidationMiddleware::TYPE_BOOL
            ]
        ]
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('useraccesslogs', '1.0', [], $routes);
