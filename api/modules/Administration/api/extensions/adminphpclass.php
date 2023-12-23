<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Administration\api\controllers\AdminPHPClassController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'get',
        'route' => '/system/checkclass/{class}',
        'class' => AdminPHPClassController::class,
        'function' => 'checkClass',
        'description' => 'check if a class exists',
        'options' => ['adminOnly' => false],
        'parameters' => [
            'class' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true
            ],
        ],
    ],
];

$RESTManager->registerRoutes($routes);
