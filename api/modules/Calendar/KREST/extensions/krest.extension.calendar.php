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
use SpiceCRM\modules\Calendar\KREST\controllers\KRESTCalendarController;
use SpiceCRM\modules\Calendar\KREST\handlers\CalendarRestHandler;
/**
 * get a Rest Manager Instance
 */

$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('calendar', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/calendar/modules',
        'class'       => KRESTCalendarController::class,
        'function'    => 'KRESTGEtCalendarModules',
        'description' => 'gets the modules setup for calendar',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/calendar/calendars',
        'class'       => KRESTCalendarController::class,
        'function'    => 'KRESTGetCalendar',
        'description' => 'gets a calendar',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/calendar/other/{calendarid}',
        'class'       => KRESTCalendarController::class,
        'function'    => 'KRESTGetOtherCalendars',
        'description' => 'get other calendars depending on an id',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/calendar/{user}',
        'class'       => KRESTCalendarController::class,
        'function'    => 'KRESTGEtUserCalendar',
        'description' => 'gets a calender dependind on the user ',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/calendar/users/{user}',
        'class'       => KRESTCalendarController::class,
        'function'    => 'KRESTGetUsersCalendar',
        'description' => 'get all calendars assigned to an user',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
];
$RESTManager->registerRoutes($routes);
