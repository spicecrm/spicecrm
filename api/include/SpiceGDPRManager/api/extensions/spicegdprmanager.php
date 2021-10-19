<?php

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SpiceGDPRManager\api\controllers\SpiceGDPRManagerController;

$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/admin/gdprmanager/retentionpolicies',
        'class'       => SpiceGDPRManagerController::class,
        'function'    => 'getRetentionPolicies',
        'description' => 'check on url rewrite',
        'options'     => ['noAuth' => false, 'adminOnly' => true,],
    ],
    [
        'method'      => 'post',
        'route'       => '/admin/gdprmanager/retentionpolicies/{id}',
        'class'       => SpiceGDPRManagerController::class,
        'function'    => 'saveRetentionPolicy',
        'description' => 'saves the record',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the ID of the Record',
                'required' => true,
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/admin/gdprmanager/retentionpolicies/{id}',
        'class'       => SpiceGDPRManagerController::class,
        'function'    => 'deleteRetentionPolicy',
        'description' => 'deletes the record',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the ID of the Record',
                'required' => true,
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/gdprmanager/retentionpolicies/{id}/results',
        'class'       => SpiceGDPRManagerController::class,
        'function'    => 'getResults',
        'description' => 'gets the results',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the ID of the Record',
                'required' => true,
            ],
            'start' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'description' => 'start to load records from',
                'required' => false
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/admin/gdprmanager/retentionpolicies/{id}/activate/{active}',
        'class'       => SpiceGDPRManagerController::class,
        'function'    => 'setActive',
        'description' => 'check connection to elactic server',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the ID of the Record',
                'required' => true,
            ],
            'active' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'description' => 'true or false to activate or deactivate'
            ]
        ]
    ]
];

$RESTManager->registerExtension('spicegdprmanager', '1.0', [], $routes);
