<?php

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