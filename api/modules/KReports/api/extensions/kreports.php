<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\KReports\api\controllers\KReportsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('kreports', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/KReports/published/{type}',
        'class'       => KReportsController::class,
        'function'    => 'getPublishedKReports',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters'  => [
            'type' => [
                'in' => 'path',
                'description' => 'dashlet or subpanel',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'dashlet',
                'required' => false
            ],
            'searchkey' => [
                'in' => 'query',
                'description' => 'search term applied on report name',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'opp',
                'required' => false
            ],
            'offset' => [
                'in' => 'query',
                'description' => 'offset for database query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 0,
                'required' => false
            ],
            'limit' => [
                'in' => 'query',
                'description' => 'limit for database query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 50,
                'required' => false,
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/KReports/dlistmanager/dlists',
        'oldroute'    => '/KReporter/dlistmanager/dlists',
        'class'       => KReportsController::class,
        'function'    => 'getDLists',
        'description' => 'get all distribution lists in use for KReporter',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
    ],


    [
        'method'      => 'post',
        'route'       => '/module/KReports/{id}/layout',
        'oldroute'    => '/KReporter/core/savelayout/{report_id}',
        'class'       => KReportsController::class,
        'function'    => 'saveLayout',
        'description' => 'save the layout of columns in report view',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters'  => [
            'type' => [
                'in' => 'path',
                'description' => 'id of the report',
                'type' => ValidationMiddleware::TYPE_STRING, // id is no guid when report is duplicated
                'example' => '',
                'required' => true
            ],
            'layout' => [
                'in' => 'body',
                'description' => 'json string containing the layout information',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/KReports/{id}/snapshots',
        'oldroute'    => '/KReporter/{report_id}}/snapshot',
        'class'       => KReportsController::class,
        'function'    => 'getSnapshots',
        'description' => 'get snapshots stored for the report',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'id of the report',
                'type' => ValidationMiddleware::TYPE_STRING, // id is no guid when report is duplicated
                'example' => '',
                'required' => true
            ],
            'layout' => [
                'in' => 'body',
                'description' => 'json string containing the layout information',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
                'required' => false
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/KReports/{id}/snapshot/{snapshotid}',
        'oldroute'    => '/KReporter/{report_id}}/snapshot/{snapshotid}',
        'class'       => KReportsController::class,
        'function'    => 'deleteSnapshot',
        'description' => 'delete specified snapshot stored for the report',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'id of the report',
                'type' => ValidationMiddleware::TYPE_STRING, // id is no guid when report is duplicated
                'example' => '',
                'required' => true
            ],
            'snapshotid' => [
                'in' => 'body',
                'description' => 'id of the snaphot data that shall be deleted',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '',
                'required' => false
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);

