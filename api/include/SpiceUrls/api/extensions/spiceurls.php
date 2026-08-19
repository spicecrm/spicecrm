<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceUrls\api\controllers\SpiceUrlsController;


/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'get',
        'route' => '/common/spiceurls/module/{beanName}/{beanId}',
        'class' => SpiceUrlsController::class,
        'function' => 'getUrls',
        'description' => 'retrieves an array of urls for a specific bean',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'beanName' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/common/spiceurls/module/{beanName}/{beanId}/count',
        'class' => SpiceUrlsController::class,
        'function' => 'getUrlsCount',
        'description' => 'get spice urls count. Define this route before this one /common/spiceurls/module/{beanName}/{beanId}/{urlId} to avoid conflict',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'beanName' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/common/spiceurls/module/{beanName}/{beanId}/{urlId}',
        'class' => SpiceUrlsController::class,
        'function' => 'getUrl',
        'description' => 'retrieves a single url by id',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'beanName' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'urlId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of the url',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/common/spiceurls/module/{beanName}/{beanId}',
        'class' => SpiceUrlsController::class,
        'function' => 'saveUrl',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'data' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'required' => true,
                'description' => 'url content',
            ],
            'beanId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'beanName' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/common/spiceurls/{id}',
        'class' => SpiceUrlsController::class,
        'function' => 'updateUrlData',
        'description' => 'save the url changes',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'GUID of the Url',
            ],
            'description' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'text',
            ],
            'url_name' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the name to set as display name for the url',
            ],
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/common/spiceurls/module/{beanName}/{beanId}/{urlId}',
        'class' => SpiceUrlsController::class,
        'function' => 'deleteUrl',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'beanName' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'urlId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of the url',
                'required' => true
            ]
        ]
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spiceurls', '1.0', [], $routes);
