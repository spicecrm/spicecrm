<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\TextSnippets\api\controllers\TextSnippetsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('textsnippets', '1.0');

$routes = [
    [
        'method' => 'post',
        'route' => '/module/TextSnippets/{id}/liveCompile',
        'class' => TextSnippetsController::class,
        'function' => 'liveCompile',
        'description' => 'live compile text snippet',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'model_data' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_OBJECT,
                'description' => 'model data to be parsed',
                'example' => '{first_name: someone}',
                'required' => true
            ],
            'module' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'module name to be parsed',
                'example' => 'Accounts',
                'required' => true
            ],
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'if of parent bean',
                'example' => '2816ba5c-97e7-11eb-8c42-00fffe0c4f07',
                'required' => true
            ]
        ]
    ]
];
$RESTManager->registerRoutes($routes);

