<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Folders\api\controllers\FoldersController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('exchange', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Folders/{module}',
        'class'       => FoldersController::class,
        'function'    => 'getFoldersForModule',
        'description' => 'Get all the folders for a specific module.',
        'options'     => ['noAuth' => true, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'module'    => [
                'in'          => 'path',
                'description' => 'Module of the folders',
                'type'        => ValidationMiddleware::TYPE_MODULE
            ],
        ],
    ]
];

$RESTManager->registerRoutes($routes);
