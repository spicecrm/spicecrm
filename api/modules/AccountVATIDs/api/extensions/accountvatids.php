<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\AccountVATIDs\api\controllers\AccountVATIDsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('accountvatids', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Account/{vatid}/vatids',
        'oldroute'    => '/module/AccountVATIDs/{vatid}',
        'class'       => AccountVATIDsController::class,
        'function'    => 'getSoapBody',
        'description' => 'gets the soap body of an curled url',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'vatid'      => [
                'in'                => 'path',
                'description'       => 'VATID',
                'type'              => ValidationMiddleware::TYPE_STRING,
            ],
        ],
    ],
];


$RESTManager->registerRoutes($routes);