<?php

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\WebHook\api\controllers\WebHookController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */

$RESTManager->registerExtension('webhook', '1.0');


$routes = [
    [
        'method' => 'post',
        'route' => '/system/webhook',
        'class' => WebHookController::class,
        'function' => 'mapWebHooks',
        'description' => '',
        'options' => ['adminOnly' => true, 'validation' => false],
        'parameters' => []
    ],

];

$RESTManager->registerRoutes($routes);
