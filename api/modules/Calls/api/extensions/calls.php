<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\Calls\api\controllers\CallsController;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('calls', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/Calls/{id}/status/{userid}/{value}',
        'oldroute'       => '/modules/Calls/{id}/setstatus/{userid}/{status}',
        'class'       => CallsController::class,
        'function'    => 'setStatus',
        'description' => 'set call participation status for a participant',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'id of the call',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => 'f946b9d7-500a-5695-af7a-2241db3be2c2',
                'required' => true
            ],
            'userid' => [
                'in' => 'path',
                'description' => 'id of invited user',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => 'f946b9d7-500a-5695-af7a-2241db3be2c2',
                'required' => true
            ],
            'value' => [
                'in' => 'path',
                'description' => 'status value from array of possibilities (accept|decline|tentative|none)',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'accept',
                'required' => true
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);
