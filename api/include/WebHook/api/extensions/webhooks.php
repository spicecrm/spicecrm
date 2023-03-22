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
        'function' => 'callWebHooks',
        'description' => '',
        'options' => ['noAuth' => true, 'adminOnly' => false, 'validation' => true],
        'parameters' => []
    ],

];

$RESTManager->registerRoutes($routes);
