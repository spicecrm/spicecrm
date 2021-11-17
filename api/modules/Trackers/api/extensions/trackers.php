<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\Trackers\api\controllers\TrackersController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('trackers', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Trackers/recent',
        'class'       => TrackersController::class,
        'function'    => 'getRecent',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters' => [
            'module' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'description' => 'module name or array of module names',
                'example' => 'Accounts | ["Accounts","Contacts","Opportunities"]',
                'required' => false
            ],
            'limit' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'description' => 'number of records to return',
                'example' => 5,
                'required' => false
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);

