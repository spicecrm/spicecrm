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
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters' => [
            'modelData' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
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
                'description' => 'ID of TextSnippet',
                'example' => '2816ba5c-97e7-11eb-8c42-00fffe0c4f07',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/TextSnippets/{id}/liveCompilePlainText',
        'class' => TextSnippetsController::class,
        'function' => 'liveCompilePlainText',
        'description' => 'live compile text snippet as plain text',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters' => [
            'modelData' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
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
                'description' => 'ID of TextSnippet',
                'example' => '2816ba5c-97e7-11eb-8c42-00fffe0c4f07',
                'required' => true
            ]
        ]
    ],
];
$RESTManager->registerRoutes($routes);

