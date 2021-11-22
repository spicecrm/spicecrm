<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceNotifications\KREST\controllers\SpiceNotificationsKRESTController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'post',
        'route' => '/common/SpiceNotifications/{id}',
        'class' => SpiceNotificationsKRESTController::class,
        'function' => 'save',
        'description' => 'create a new notification',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method' => 'post',
        'route' => '/common/SpiceNotifications/{id}/markasread',
        'class' => SpiceNotificationsKRESTController::class,
        'function' => 'markAsRead',
        'description' => 'mark a notification as read',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method' => 'post',
        'route' => '/common/SpiceNotifications/all/read',
        'class' => SpiceNotificationsKRESTController::class,
        'function' => 'markAllAsRead',
        'description' => 'mark all notifications as read',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/common/SpiceNotifications',
        'class'       => SpiceNotificationsKRESTController::class,
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
