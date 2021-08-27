<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Activities\api\controllers\UiAssistantController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('uiassistant', '1.0');

/**
 * restrict routes to authenticated users
 */

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Activities/assistant/list',
        'class'       => UiAssistantController::class,
        'function'    => 'getUiAssist',
        'description' => 'load activities into assistant bar of current user',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'objectfilters' => [
                'in' => 'query',
                'description' => 'json string of modules to filter by',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '["Calls","Meetings"]',
                'required' => false
            ],
            'timefilter' => [
                'in' => 'query',
                'description' => 'restrict by time all | today | overdue',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'today',
                'required' => false,
                'default' => 'all'
            ],
        ]
    ],
];
$RESTManager->registerRoutes($routes);
