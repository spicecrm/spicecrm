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
use SpiceCRM\includes\SpiceFTSManager\KREST\controllers\SpiceFTSRESTController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * routes
 */
$routes = [
    [
        'method'      => 'get',
        'route'       => '/fts/globalsearch',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'getGlobalSearchResults',
        'description' => 'get global search results',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/fts/globalsearch',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'getGlobalSearchResults',
        'description' => 'get global search results',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/fts/globalsearch/{module}',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'getSearchResultsForModuleByGet',
        'description' => 'get module search results',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/fts/globalsearch/{module}',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'getSearchResultsForModuleByPost',
        'description' => 'get module search results',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/fts/globalsearch/{module}/{searchterm}',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'getGlobalSearchResultsForModuleSearchTermByGet',
        'description' => 'get search term results',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/fts/globalsearch/{module}/{searchterm}',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'getGlobalSearchResultsForModuleSearchTermByPost',
        'description' => 'get search term results',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/fts/searchmodules',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'getGlobalSearchModules',
        'description' => 'all global search enabled modules',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/fts/searchterm/{searchterm}',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'searchTerm',
        'description' => 'search in a module',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/fts/check',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'check',
        'description' => 'check FTS connection',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/fts/status',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'getStatus',
        'description' => 'get some basic stats',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/fts/stats',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'getStats',
        'description' => 'get elasticsearch stats',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'put',
        'route'       => '/fts/unblock}',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'unblock',
        'description' => 'get indexes settings',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/fts/fields/{module}',
        'class'       => SpiceFTSRESTController::class,
        'function'    => 'getFTSModuleFields',
        'description' => 'load fields for selected module',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('fts', '1.0', [], $routes);
