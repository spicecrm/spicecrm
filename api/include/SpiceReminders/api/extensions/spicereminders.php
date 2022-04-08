<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceReminders\api\controllers\SpiceRemindersController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'get',
        'route' => '/common/spicereminders',
        'oldroute' => '/SpiceReminders',
        'class' => SpiceRemindersController::class,
        'function' => 'getReminders',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method' => 'post',
        'route' => '/common/spicereminders/{module}/{id}/{date}',
        'oldroute' => '/SpiceReminders/{module}/{id}/{date}',
        'class' => SpiceRemindersController::class,
        'function' => 'addReminder',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module related to the reminder',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Calls',
            ],
            'id' => [
                'in' => 'path',
                'description' => 'the id of the reminder',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '5dc836d2-2f98-7f3c-708e-970c597a19c6',
            ],
            'date' => [
                'in' => 'path',
                'description' => 'the date for which the reminder is set',
                'type' => ValidationMiddleware::TYPE_DATE,
                'example' => '2021-04-16',
            ],
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/common/spicereminders/{module}/{id}',
        'oldroute' => '/SpiceReminders/{module}/{id}',
        'class' => SpiceRemindersController::class,
        'function' => 'deleteReminder',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module related to the reminder',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Calls',
            ],
            'id' => [
                'in' => 'path',
                'description' => 'the id of the reminder',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '5dc836d2-2f98-7f3c-708e-970c597a19c6',
            ]
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spicereminders', '1.0', [], $routes);
