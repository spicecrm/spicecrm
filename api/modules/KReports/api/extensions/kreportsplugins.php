<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\KReports\api\controllers\KReportsPluginsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('kreportsplugins', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/KReports/plugins/action/{plugin}/{action}',
        'class'       => KReportsPluginsController::class,
        'function'    => 'processPluginAction',
        'description' => 'calls a plugin action',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],

];

$RESTManager->registerRoutes($routes);

