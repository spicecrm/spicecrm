<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceFTSManager\api\controllers\SpiceFTSController;

/**
 * routes
 */
$routes = [
    [
        'method'      => 'get',
        'route'       => '/admin/elastic/status',
        'oldroute'    => '/fts/status',
        'class'       => SpiceFTSController::class,
        'function'    => 'getStatus',
        'description' => 'get some basic stats',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/elastic/stats',
        'oldroute'    => '/fts/stats',
        'class'       => SpiceFTSController::class,
        'function'    => 'getStats',
        'description' => 'get elasticsearch stats',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'put',
        'route'       => '/admin/elastic/unblock',
        'oldroute'    => '/fts/unblock',
        'class'       => SpiceFTSController::class,
        'function'    => 'unblock',
        'description' => 'get indexes settings',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('fts', '2.0', [], $routes);
