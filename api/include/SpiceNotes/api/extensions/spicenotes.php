<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceNotes\api\controllers\SpiceNotesController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/{beanName}/{beanId}/note',
        'class'       => SpiceNotesController::class,
        'function'    => 'getQuickNotesForBean',
        'description' => 'get the quicknotes for the beans',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName'        => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'          => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}/note',
        'class'       => SpiceNotesController::class,
        'function'    => 'saveQuickNote',
        'description' => 'saves the notes',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'global'   => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => true,
                'description' => '',
            ],
            'text'     => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => '',
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/{beanName}/{beanId}/note/{noteId}',
        'class'       => SpiceNotesController::class,
        'function'    => 'editQuickNote',
        'description' => 'edits the quicknotes',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => true,
                'description' => 'The name of the module',
            ],
            'beanId'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'noteId'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'SpiceNote GUID',
            ],
            'global'   => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => true,
                'description' => '',
            ],
            'text'     => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => '',
            ],
        ],
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/{beanName}/{beanId}/note/{noteId}',
        'class'       => SpiceNotesController::class,
        'function'    => 'deleteQuickNote',
        'description' => 'deletes the quick notes',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            // todo bean name and ID doesn't seem to be needed for anything
            'beanName' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'required'    => false,
                'description' => 'The name of the module',
            ],
            'beanId'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => false,
                'description' => 'GUID of the bean',
            ],
            'noteId'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'SpiceNote GUID',
            ],
        ],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spicenotes', '1.0', [], $routes);
