<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SpiceUI\api\controllers\SystemUIController;
use SpiceCRM\includes\SpiceUI\api\controllers\SpiceUISysTextIdsController;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

RESTManager::getInstance()->registerExtension('spiceuisystextids', '1.0');

$routes = [
    [
        'method' => 'post',
        'route' => '/system/spiceuisystextids/core/addsystext',
        'class' => SpiceUISysTextIdsController::class,
        'function' => 'addSysText',
        'description' => 'creates a new entries in the systextid & systextids_modules tables',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'textId' => [
                'in' => 'body',
                'description' => 'the text_id of the systext',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'pg-000-001',
            ],
            'name' => [
                'in' => 'body',
                'description' => 'the name of the entry',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Product Group Text One',
            ],
            'label' => [
                'in' => 'body',
                'description' => 'the label',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'LBL_ENTRY',
            ],
            'module' => [
                'in' => 'body',
                'description' => 'module',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Module of systtext',
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);
