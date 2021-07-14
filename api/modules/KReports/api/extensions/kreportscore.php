<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\KReports\api\controllers\KReportsCoreController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('reporting', '1.0');


$routes = [

    [
        'method' => 'get',
        'route' => '/module/KReports/core/whereoperators/all',
        'class' => KReportsCoreController::class,
        'function' => 'getAllWhereOperators',
        'description' => 'get all the where operators',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method' => 'get',
        'route' => '/module/KReports/core/wherefunctions',
        'class' => KReportsCoreController::class,
        'function' => 'getWhereFunctions',
        'description' => 'get the where functions',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method' => 'get',
        'route' => '/module/KReports/core/enumoptions',
        'class' => KReportsCoreController::class,
        'function' => 'getEnumOptions',
        'description' => 'get the enum options',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'path' => [
                'in' => 'query',
                'description' => 'get options values for field within the path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
                'required' => true
            ],
            'grouping' => [
                'in' => 'query',
                'description' => 'handle grouping for the field if grouping exists',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false
            ],
            'operators' => [
                'in' => 'query',
                'description' => 'json string used for multienums',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false
            ],
        ]
    ],
    [
        'method' => 'get',
        'route' => '/module/KReports/core/vizcolors',
        'class' => KReportsCoreController::class,
        'function' => 'getVizColors',
        'description' => 'get color sets for visualization',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],




    [
        'method' => 'get',
        'route' => '/module/KReports/{id}/presentation',
        'class' => KReportsCoreController::class,
        'function' => 'getPresentation',
        'description' => 'build the query to retrieve results displayed in presentation',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'start' => [
                'in' => 'query',
                'description' => 'offset for database query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 0,
                'required' => false,
            ],
            'limit' => [
                'in' => 'query',
                'description' => 'limit for database query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 50,
                'required' => false,
            ],
            'dir'=> [
                'in' => 'query',
                'description' => 'sort direction asc |desc',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'asc',
                'required' => false,
            ],
            'sort' => [
                'in' => 'query',
                'description' => 'json string containing property and sort direction combinations',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
                'required' => false,
            ],
            'whereConditions' => [
                'in' => 'query',
                'description' => 'json string containing the were conditions',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 0,
                'required' => false,
            ],
            'dynamicoptionsfromurl' => [
                'in' => 'query',
                'description' => 'url encoded string containing dynamic options to override where clause',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
                'required' => false,
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/KReports/{id}/presentation/dynamicoptions',
        'class' => KReportsCoreController::class,
        'function' => 'getPresentationWithDynamicoptions',
        'description' => 'same as etPresentation but passes additional body parameters',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'start' => [
                'in' => 'query',
                'description' => 'offset for database query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 0,
                'required' => false,
            ],
            'limit' => [
                'in' => 'query',
                'description' => 'limit for database query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 50,
                'required' => false,
            ],
            'dir'=> [
                'in' => 'query',
                'description' => 'sort direction asc |desc',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'asc',
                'required' => false,
            ],
            'sort' => [
                'in' => 'query',
                'description' => 'json string containing property and sort direction combinations',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
                'required' => false,
            ],
            'whereConditions' => [
                'in' => 'query',
                'description' => 'json string containing the were conditions',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 0,
                'required' => false,
            ],
            'dynamicoptionsfromurl' => [
                'in' => 'query',
                'description' => 'url encoded string containing dynamic options to override where clause',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
                'required' => false,
            ],
            'dynamicoptions' => [
                'in' => 'body',
                'description' => 'an url encoded string containing parameters to pass to the report being loaded',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '- to do -',
                'required' => false
            ],
            'blockDynamicoptions' => [
                'in' => 'body',
                'description' => 'tell if dynamicoptions should be considered or not',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => false,
                'required' => false
            ],
            'filter' => [
                'in' => 'body',
                'description' => 'id of a kreporter filter to load with the report',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '71bbe40e-8bf7-11eb-917e-42010a84004c',
                'required' => false
            ],
            'parentbeanId' => [
                'in' => 'body',
                'description' => 'id of the parent bean (drilldown capability)',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '6b192296-8bf7-11eb-917e-42010a84004c',
                'required' => false
            ],
            'parentbeanModule' => [
                'in' => 'body',
                'description' => 'module name of the parent bean (drilldown capability)',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Contacts',
                'required' => false
            ]
        ]
    ],

    [
        'method' => 'get',
        'route' => '/module/KReports/{id}/visualization',
        'class' => KReportsCoreController::class,
        'function' => 'getVisualization',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'start' => [
                'in' => 'requeryquest',
                'description' => 'offset for database query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 0,
                'required' => false,
            ],
            'limit' => [
                'in' => 'query',
                'description' => 'limit for database query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 50,
                'required' => false,
            ],
            'dir'=> [
                'in' => 'query',
                'description' => 'sort direction asc |desc',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'asc',
                'required' => false,
            ],
            'sort' => [
                'in' => 'query',
                'description' => 'json string containing property and sort direction combinations',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
                'required' => false,
                'options' => ['asc', 'desc']
            ],
            'whereConditions' => [
                'in' => 'query',
                'description' => 'json string containing the were conditions',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 0,
                'required' => false,
            ],
            'dynamicoptionsfromurl' => [
                'in' => 'query',
                'description' => 'url encoded string containing dynamic options to override where clause',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
                'required' => false,
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/KReports/{id}/visualization/dynamicoptions',
        'class' => KReportsCoreController::class,
        'function' => 'getVisualizationWithDynamicoptions',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'start' => [
                'in' => 'query',
                'description' => 'offset for database query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 0,
                'required' => false,
            ],
            'limit' => [
                'in' => 'query',
                'description' => 'limit for database query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 50,
                'required' => false,
            ],
            'dir'=> [
                'in' => 'query',
                'description' => 'sort direction asc |desc',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'asc',
                'required' => false,
            ],
            'sort' => [
                'in' => 'query',
                'description' => 'json string containing property and sort direction combinations',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
                'required' => false,
            ],
            'whereConditions' => [
                'in' => 'query',
                'description' => 'json string containing the were conditions',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 0,
                'required' => false,
            ],
            'dynamicoptionsfromurl' => [
                'in' => 'query',
                'description' => 'url encoded string containing dynamic options to override where clause',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
                'required' => false,
            ],
            'dynamicoptions' => [
                'in' => 'body',
                'description' => 'an url encoded string containing parameters to pass to the report being loaded',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '- to do -',
                'required' => false
            ],
            'blockDynamicoptions' => [
                'in' => 'body',
                'description' => 'tell if dynamicoptions should be considered or not',
                'type' => 'bool',
                'example' => false,
                'required' => false
            ],
            'filter' => [
                'in' => 'body',
                'description' => 'id of a kreporter filter to load with the report',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '71bbe40e-8bf7-11eb-917e-42010a84004c',
                'required' => false
            ],
            'parentbeanId' => [
                'in' => 'body',
                'description' => 'id of the parent bean (drilldown capability)',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '6b192296-8bf7-11eb-917e-42010a84004c',
                'required' => false
            ],
            'parentbeanModule' => [
                'in' => 'body',
                'description' => 'module name of the parent bean (drilldown capability)',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Contacts',
                'required' => false
            ]
        ]
    ],

];

$RESTManager->registerRoutes($routes);

