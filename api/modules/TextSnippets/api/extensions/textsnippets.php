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
        'method' => 'get',
        'route' => '/module/TextSnippets/{modulename}/load',
        'class' => TextSnippetsController::class,
        'function' => 'loadTextSnippets',
        'description' => 'loads text snippets for specified module',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'parentmodule' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'name of parent module',
                'example' => 'Accounts',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/module/TextSnippets/{id}/parse/{parentmodule}/{parentid}',
        'class' => TextSnippetsController::class,
        'function' => 'formatTextSnippet',
        'description' => 'formats the text snippet',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'parentmodule' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'name of parent module',
                'example' => 'Accounts',
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'if of parent bean',
                'example' => '2816ba5c-97e7-11eb-8c42-00fffe0c4f07',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/TextSnippets/{id}/livecompile/{parentmodule}/{parentid}',
        'class' => TextSnippetsController::class,
        'function' => 'getTextSnippet',
        'description' => 'gets the body of an email',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'parentmodule' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'name of parent module',
                'example' => 'Accounts',
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'if of parent bean',
                'example' => '2816ba5c-97e7-11eb-8c42-00fffe0c4f07',
                'required' => true
            ],
            'html' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'html string',
                'example' => '',
                'required' => true
            ],
            'field' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'html field',
                'example' => '',
                'required' => false
            ]
        ]
    ],

];
$RESTManager->registerRoutes($routes);

