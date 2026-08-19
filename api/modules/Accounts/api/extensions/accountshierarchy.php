<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Accounts\api\controllers\AccountsHierarchyController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('accounthierachy', '1.0');

$routes = [
//    [
//        'method'      => 'get',
//        'route'       => '/AccountsHierachy/{id}',
//        'class'       => AccountsHierarchyController::class,
//        'function'    => 'getAccountHierarchyId',
//        'description' => 'get the id of an account',
//        'options'     => ['noAuth' => false, 'adminOnly' => false]
//
//    ],
    [
        'method'      => 'get',
        'route'       => '/module/Accounts/{id}/hierarchy/{addfields}',
        'oldroute'    => '/AccountsHierachy/{id}/{addfields}',
        'class'       => AccountsHierarchyController::class,
        'function'    => 'getACLAction',
        'description' => 'get the id of an account',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in'           => 'path',
                'required'     => true,
                'description'  => 'Accounts id that will receive the Account',
                'type'        => ValidationMiddleware::TYPE_STRING,
            ],
            'addfields' => [
                'in'           => 'path',
                'required'     => true,
                'description'  => 'add Account fields',
                'type'        => ValidationMiddleware::TYPE_JSON,
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);