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
use SpiceCRM\includes\Logger\KREST\controllers\LogViewController;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [

    [
        'method'      => 'get',
        'route'       => '/crmlog',
        'class'       => LogViewController::class,
        'function'    => 'CRMLogGetLines',
        'description' => 'get the lines of the crmlogger',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/crmlog/{begin:\d{10}}/{end:\d{10}}',
        'class'       => LogViewController::class,
        'function'    => 'CRMLogWithTime',
        'description' => 'get the logs within a timeframe',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/crmlog/fullLine/{lineId}',
        'class'       => LogViewController::class,
        'function'    => 'CRMLogFullLine',
        'description' => 'get the full line logs',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/crmlog/userlist',
        'class'       => LogViewController::class,
        'function'    => 'CRMLogGetAllUser',
        'description' => 'get the log from all user',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/krestlog',
        'class'       => LogViewController::class,
        'function'    => 'SpiceLogGetLines',
        'description' => 'get the lines of the spice logger',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/krestlog/{begin:\d{10}}/{end:\d{10}}',
        'class'       => LogViewController::class,
        'function'    => 'SpiceLogWithTime',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/krestlog/fullLine/{lineId}',
        'class'       => LogViewController::class,
        'function'    => 'SpiceLogFullLine',
        'description' => 'get the full line logs',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
         'method'      => 'get',
         'route'       => '/krestlog/routes',
         'class'       => LogViewController::class,
         'function'    => 'SpiceLogRoutes',
         'description' => 'get the log routes',
         'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/krestlog/userlist',
        'class'       => LogViewController::class,
        'function'    => 'SpiceLogGetAllUser',
        'description' => 'get the spice log from all users',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('crmlog', '1.0', [], $routes);
