<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\Meetings\api\controllers\MeetingsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('meetings', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/Meetings/{id}/status/{userid}/{value}',
        'oldroute'       => '/modules/Meetings/{id}/setstatus/{userid}/{value}',
        'class'       => MeetingsController::class,
        'function'    => 'setStatus',
        'description' => 'set meeting participation status for a participant',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'id of the call',
                'type' => 'guid',
                'example' => 'f946b9d7-500a-5695-af7a-2241db3be2c2',
                'required' => true
            ],
            'userid' => [
                'in' => 'path',
                'description' => 'id of invited user',
                'type' => 'guid',
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

