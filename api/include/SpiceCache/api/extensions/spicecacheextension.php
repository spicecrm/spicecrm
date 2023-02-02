<?php

/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceCache\api\controllers\SpiceCacheController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('spicecache', '1.0', [], [
    [
        'method' => 'get',
        'route' => '/admin/spicecache/keys',
        'class' => SpiceCacheController::class,
        'function' => 'getKeys',
        'description' => 'returns all keys currently held in the Cache',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'get',
        'route' => '/admin/spicecache/key/{key}',
        'class' => SpiceCacheController::class,
        'function' => 'getKey',
        'description' => 'gets a key',
        'options' => ['adminOnly' => true]
    ],
    [
        'method' => 'delete',
        'route' => '/admin/spicecache/key/{key}',
        'class' => SpiceCacheController::class,
        'function' => 'deleteKey',
        'description' => 'deletes a key',
        'options' => ['adminOnly' => true]
    ],
]);
