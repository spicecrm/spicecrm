<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceSubscriptions\KREST\controllers\SpiceSubscriptionsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'post',
        'route'       => '/common/SpiceSubscriptions/{beanModule}/{beanId}',
        'class'       => SpiceSubscriptionsController::class,
        'function'    => 'addSubscription',
        'description' => 'Adds a subscription on a bean.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false,],
        'parameters'  => [
            'beanId' => [
                'in'          => 'path',
                'type'        => 'guid',
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'beanModule' => [
                'in'          => 'path',
                'type'        => 'module',
                'required'    => true,
                'description' => 'Module name of the bean',
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/common/SpiceSubscriptions/{beanModule}/{beanId}',
        'class'       => SpiceSubscriptionsController::class,
        'function'    => 'deleteSubscription',
        'description' => 'Deletes a subscription.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false,],
        'parameters'  => [
            'beanId' => [
                'in'          => 'path',
                'type'        => 'guid',
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            'beanModule' => [
                'in'          => 'path',
                'type'        => 'module',
                'required'    => true,
                'description' => 'Module name of the bean',
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/common/SpiceSubscriptions',
        'class'       => SpiceSubscriptionsController::class,
        'function'    => 'getSubscriptions',
        'description' => 'Returns a list of subscriptions',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spicenotes', '1.0', [], $routes);
