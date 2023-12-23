<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceNotifications\api\controllers\SpiceNotificationsController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'post',
        'route' => '/common/SpiceNotifications/{id}',
        'class' => SpiceNotificationsController::class,
        'function' => 'save',
        'description' => 'create a new notification',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method' => 'post',
        'route' => '/common/SpiceNotifications/{id}/markasread',
        'class' => SpiceNotificationsController::class,
        'function' => 'markAsRead',
        'description' => 'mark a notification as read',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method' => 'post',
        'route' => '/common/SpiceNotifications/all/read',
        'class' => SpiceNotificationsController::class,
        'function' => 'markAllAsRead',
        'description' => 'mark all notifications as read',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/common/SpiceNotifications',
        'class'       => SpiceNotificationsController::class,
        'function'    => 'loadNotifications',
        'description' => 'Loads user notifications.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false,],
        'parameters'  => [
            'offset' => [
                'in'          => 'query',
                'type'        => 'numeric',
                'description' => 'Offset of the database query.',
                'required'    => false,
            ],
            'limit'  => [
                'in'          => 'query',
                'type'        => 'numeric',
                'description' => 'Limit of the database query.',
                'required'    => false,
            ],
        ],
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spicenotifications', '1.0', [], $routes);
