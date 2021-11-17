<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\SchedulerJobTasks\api\controllers\SchedulerJobTaskController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('schedulerjobs', '1.0');

$routes = [
    [
        'method' => 'get',
        'route' => '/module/SchedulerJobTasks/{id}/log',
        'class' => SchedulerJobTaskController::class,
        'function' => 'loadJobTaskLog',
        'description' => 'returns a job task log list',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of job',
                'required' => true
            ],
            'offset' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'description' => 'offset for the retrieve query',
                'required' => true
            ],
            'limit' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'description' => 'limit for the retrieve query',
                'required' => true
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/SchedulerJobTasks/{id}/run',
        'class' => SchedulerJobTaskController::class,
        'function' => 'runJobTask',
        'description' => 'run a specific job task',
        'options' => ['noAuth' => false, 'adminOnly' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of job',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/SchedulerJobTasks/classes',
        'class'       => SchedulerJobTaskController::class,
        'function'    => 'getSchedulerJobTaskClasses',
        'description' => 'Returns a list of classes that can be used for scheduler job tasks.',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ]
];

$RESTManager->registerRoutes($routes);
