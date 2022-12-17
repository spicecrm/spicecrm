<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\includes\SpiceTags\api\controllers\SpiceTagsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    /* route not found in fe
     * [
        'method'      => 'get',
        'route'=>'/common/spicetags',
        'oldroute'       => '/SpiceTags/{query}',
        'class'       => SpiceTagsController::class,
        'function'    => 'searchTags',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => []

    ],*/
    [
        'method' => 'post',
        'route' => '/common/spicetags',
        'oldroute' => '/SpiceTags',
        'class' => SpiceTagsController::class,
        'function' => 'searchPostTags',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'search' => [
                'in' => 'body',
                'description' => 'the name the tag',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => 'mytag',
            ]
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spicetags', '1.0', [], $routes);
