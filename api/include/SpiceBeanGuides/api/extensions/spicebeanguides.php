<?php

/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceBeanGuides\api\controllers\SpiceBeanGuidesController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [

    /*
        feature_swagger refactoring: route not found in frontend
        [
            'method' => 'get',
            'route' => '/common/spicebeanguide/{module}',
            'oldroute' => '/spicebeanguide/{module}',
            'class' => SpiceBeanGuidesController::class,
            'function' => 'getStages',
            'description' => '',
            'options' => ['noAuth' => true, 'adminOnly' => false],
            'parameters' => [
                'module' => [
                    'in' => 'path',
                    'description' => 'the module corresponding to the table',
                    'type' => ValidationMiddleware::TYPE_STRING,
                    'example' => 'Opportunities'
                ]
            ]
        ],*/
    [
        'method' => 'get',
        'route' => '/common/spicebeanguide/{module}/{beanid}',
        'oldroute' => '/spicebeanguide/{module}/{beanid}',
        'class' => SpiceBeanGuidesController::class,
        'function' => 'getBeanStages',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the module',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Opportunities'
            ],
            'beanid' => [
                'in' => 'path',
                'description' => 'the id of the record',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ]
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spicebeanguides', '1.0', [], $routes);
