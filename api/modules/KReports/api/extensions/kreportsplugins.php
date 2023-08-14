<?php
/*********************************************************************************
 * This file is part of KReporter. KReporter is an enhancement developed
 * by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 *
 * This Version of the KReporter is licensed software and may only be used in
 * alignment with the License Agreement received with this Software.
 * This Software is copyrighted and may not be further distributed without
 * witten consent of aac services k.s.
 *
 * You can contact us at info@kreporter.org
 ********************************************************************************/


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

