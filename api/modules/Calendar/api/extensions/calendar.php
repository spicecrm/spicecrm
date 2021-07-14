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
use SpiceCRM\modules\Calendar\api\controllers\CalendarController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Calendar/modules',
        'oldroute'    => '/calendar/modules',
        'class'       => CalendarController::class,
        'function'    => 'getCalendarModules',
        'description' => 'gets the modules setup for calendar',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Calendar/calendars',
        'oldroute'    => '/calendar/calendars',
        'class'       => CalendarController::class,
        'function'    => 'KRESTGetCalendar',
        'description' => 'gets a calendar',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Calendar/other/{calendarId}',
        'oldroute'    => '/calendar/other/{calendarid}',
        'class'       => CalendarController::class,
        'function'    => 'KRESTGetOtherCalendars',
        'description' => 'get other calendars depending on an id',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'calendarId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the calendar',
            ],
            'start'      => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => true,
                'description' => 'Start date',
            ],
            'end'        => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => true,
                'description' => 'End date',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Calendar/{userId}',
        'oldroute'    => '/calendar/{user}',
        'class'       => CalendarController::class,
        'function'    => 'getUserCalendar',
        'description' => 'gets a calender dependent on the user ',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'userId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the user',
            ],
            'start'  => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => true,
                'description' => 'Start date',
            ],
            'end'    => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => true,
                'description' => 'End date',
            ],
            'users'    => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'list of users',
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Calendar/users/{userId}',
        'oldroute'    => '/calendar/users/{user}',
        'class'       => CalendarController::class,
        'function'    => 'getUsersCalendar',
        'description' => 'get all calendars assigned to an user',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'userId' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the user',
            ],
            'start'  => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => true,
                'description' => 'Start date',
            ],
            'end'    => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_DATETIME,
                'required'    => true,
                'description' => 'End date',
            ],
            'users'  => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => '',
            ],
        ],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('calendar', '1.0', [], $routes);
