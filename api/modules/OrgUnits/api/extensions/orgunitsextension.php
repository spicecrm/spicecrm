<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\OrgUnits\api\controller\OrgUnitsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('OrgUnits', '1.0');

$routes = [
    [
        'method' => 'get',
        'route' => '/module/OrgUnits/{id}/employees',
        'class' => OrgUnitsController::class,
        'function' => 'getEmployees',
        'description' => 'returns all employees assigned via job positons to an org unit',
        'options' => ['validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'OrgUnit id',
                'type' => 'guid',
                'required' => true
            ],
            'module' => [
                'in' => 'query',
                'description' => 'the related mpdule',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'required' => false
            ],
            'getcount' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'required' => false
            ],
            'offset' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'required' => false
            ],
            'limit' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'required' => false
            ],
            'fieldfilters' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'required' => false
            ],
            'searchterm' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false
            ]
        ]
    ]
];

$RESTManager->registerRoutes($routes);

