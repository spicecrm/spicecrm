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
use SpiceCRM\includes\SpiceReminders\api\controllers\SpiceRemindersController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'get',
        'route' => '/common/spicereminders',
        'oldroute' => '/SpiceReminders',
        'class' => SpiceRemindersController::class,
        'function' => 'getReminders',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method' => 'post',
        'route' => '/common/spicereminders/{module}/{id}/{date}',
        'oldroute' => '/SpiceReminders/{module}/{id}/{date}',
        'class' => SpiceRemindersController::class,
        'function' => 'addReminder',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module related to the reminder',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Calls',
            ],
            'id' => [
                'in' => 'path',
                'description' => 'the id of the reminder',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '5dc836d2-2f98-7f3c-708e-970c597a19c6',
            ],
            'date' => [
                'in' => 'path',
                'description' => 'the date for which the reminder is set',
                'type' => ValidationMiddleware::TYPE_DATE,
                'example' => '2021-04-16',
            ],
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/common/spicereminders/{module}/{id}',
        'oldroute' => '/SpiceReminders/{module}/{id}',
        'class' => SpiceRemindersController::class,
        'function' => 'deleteReminder',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module related to the reminder',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Calls',
            ],
            'id' => [
                'in' => 'path',
                'description' => 'the id of the reminder',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '5dc836d2-2f98-7f3c-708e-970c597a19c6',
            ]
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spicereminders', '1.0', [], $routes);
