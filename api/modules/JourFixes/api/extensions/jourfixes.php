<?php

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\JourFixes\api\controllers\JourFixeController;

$RESTManager = RestManager::getInstance();

$RESTManager->registerExtension('jourfix', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/JourFixes/{id}/nextoccurrence',
        'class'       => JourFixeController::class,
        'function'    => 'getNextOccurrence',
        'description' => 'Returns proposed next occurrence date for a JourFixe',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in'          => 'path',
                'description' => 'JourFixe ID',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true
            ]
        ]
    ]
];

$RESTManager->registerRoutes($routes);