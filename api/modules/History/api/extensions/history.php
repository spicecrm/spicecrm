<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\History\api\controllers\HistoryController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('history', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/History/fts/{parentmodule}/{parentid}',
        'class'       => HistoryController::class,
        'function'    => 'loadFTSHistory',
        'description' => 'get held items in activity stream for specified bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'parentmodule' => [
                'in' => 'path',
                'description' => 'name of the parent module',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Accounts',
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'description' => 'id of the parent bean',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => 'cda04b43-89b8-11eb-9bff-00fffe0c4f07',
                'required' => true
            ],
            'count' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => true,
                'required' => false
            ],
            'start' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => '50',
                'required' => false
            ],
            'limit' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => '100',
                'required' => false
            ],
            'searchterm' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'proposal January',
                'required' => false
            ],
            'own' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'true',
                'required' => false
            ],
            'objects' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '[]',
                'required' => false
            ]
        ]
    ]
];

$RESTManager->registerRoutes($routes);

