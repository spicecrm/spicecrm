<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\SchedulerJobs\api\controllers\SchedulerJobController;

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
        'route' => '/module/SchedulerJobs/{id}/log',
        'class' => SchedulerJobController::class,
        'function' => 'loadJobLog',
        'description' => 'returns a job log list',
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
            'failedOnly' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'description' => 'show failed only ',
                'required' => false
            ],
            'fromDateTime' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_DATE,
                'description' => 'from date to filter',
                'required' => false
            ],
            'sortDirection' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'sort direction',
                'required' => false
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/SchedulerJobs/{id}/schedule',
        'class' => SchedulerJobController::class,
        'function' => 'scheduleJob',
        'description' => 'creates and submits a job',
        'options' => ['noAuth' => false, 'adminOnly' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of job',
                'required' => true
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/SchedulerJobs/{id}/run',
        'class' => SchedulerJobController::class,
        'function' => 'runJob',
        'description' => 'run a specific job',
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
        'method' => 'post',
        'route' => '/module/SchedulerJobs/{id}/kill',
        'class' => SchedulerJobController::class,
        'function' => 'killJobProcess',
        'description' => 'kill a running job by process id',
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
        'method'      => 'post',
        'route'       => '/module/SchedulerJobs/{beanId}/related/jobtasks',
        'class'       => SchedulerJobController::class,
        'function'    => 'addRelatedTasks',
        'description' => 'Add related bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters'  => [
            'beanId'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            ValidationMiddleware::ANONYMOUS_ARRAY => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'An array with GUIDs of related beans',
            ],
        ],
    ]
];

$RESTManager->registerRoutes($routes);
