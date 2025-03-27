<?php

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\TXControlEditor\api\controllers\TXControlEditorController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/common/TXControl/settings',
        'class'       => TXControlEditorController::class,
        'function'    => 'getSettings',
        'description' => 'Returns the tx control settings with the token',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/TXControl/parse/module/{module}/{beanId}',
        'class'       => TXControlEditorController::class,
        'function'    => 'parseContent',
        'description' => 'Parse TX control content',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'content' => [
                'content' => 'body',
                'description' => 'DocX content',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true
            ],
            'format' => [
                'content' => 'body',
                'description' => 'Return format options: "PDF", "PDFA", "RTF", "DOC", "DOCX", "HTML", "TX"',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false
            ],
        ],
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension(
    'txcontrol',
    '1.0',
    [],
    $routes
);