<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\PageBuilder\api\controllers\PageBuilderController;


$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/common/PageBuilder/customElements',
        'class'       => PageBuilderController::class,
        'function'    => 'getCustomElements',
        'description' => 'get page builder custom elements',
        'options'     => ['noAuth' => false, 'adminOnly' => false]
    ],
    [
        'method'      => 'post',
        'route'       => '/common/PageBuilder/customElements',
        'class'       => PageBuilderController::class,
        'function'    => 'addCustomElements',
        'description' => 'save page builder custom elements',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of the custom element',
            ],
            'name' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'name of the custom element',
            ],
            'type' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'type of the custom element',
            ],
            'content' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'content of the custom element',
            ],
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/common/PageBuilder/customElements/{id}',
        'class'       => PageBuilderController::class,
        'function'    => 'deleteCustomElements',
        'description' => 'save page builder custom elements',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of the custom element',
            ],
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('pagebuilder', '1.0', [], $routes);
