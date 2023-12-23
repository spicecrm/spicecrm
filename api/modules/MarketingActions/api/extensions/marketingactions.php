<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\MarketingActions\api\controllers\MarketingActionsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/MarketingActions/all/actions',
        'class'       => MarketingActionsController::class,
        'function'    => 'getAllMarketingActions',
        'description' => 'get all Marketing Actions',
        'options'     => ['noAuth' => false, 'adminOnly' => false]
    ]
];

$RESTManager->registerRoutes($routes);
