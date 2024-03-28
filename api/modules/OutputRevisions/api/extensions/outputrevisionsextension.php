<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\modules\OutputRevisions\api\controllers\OutputRevisionsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('outputrevisions', '1.0');

$routes = [
    [
        'method' => 'get',
        'route' => '/module/OutputRevisions/{parenttype}/{parentid}/output/{template}/preview',
        'class' => OutputRevisionsController::class,
        'function' => 'previewOutput',
        'description' => 'previews a new Output',
        'options' => ['validate' => true],
        'parameters' => [
            'parenttype' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'the parent module',
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the parent module',
                'required' => true
            ],
            'template' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the id of the template to be used',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/OutputRevisions/{parenttype}/{parentid}/output/{template}',
        'class' => OutputRevisionsController::class,
        'function' => 'createOutput',
        'description' => 'creates a new Output',
        'options' => ['validate' => true],
        'parameters' => [
            'parenttype' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'the parent module',
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the parent module',
                'required' => true
            ],
            'template' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the id of the template to be used',
                'required' => true
            ],
            'description' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'id of sales document',
                'example' => '9229b126-96fc-11eb-b689-00fffe0c4f07',
                'required' => false
            ],
        ]
    ],
];

$RESTManager->registerRoutes($routes);

