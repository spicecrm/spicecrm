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
use SpiceCRM\includes\SpiceFTSManager\KREST\controllers\FTSManagerRESTController;

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
        'route'       => '/ftsmanager/core/modules',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'getModules',
        'description' => 'get modules',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/ftsmanager/core/index',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'getIndex',
        'description' => 'get index',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/ftsmanager/core/nodes',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'getNodes',
        'description' => 'get nodes',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/ftsmanager/core/fields',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'getFields',
        'description' => 'get fields',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/ftsmanager/core/analyzers',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'getAnalyzers',
        'description' => 'get analyzers',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/ftsmanager/core/initialize',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'initialize',
        'description' => 'initialize',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/ftsmanager/{module}/fields',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'getFTSFields',
        'description' => 'get fts fields',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/ftsmanager/{module}/settings',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'getFTSSettings',
        'description' => 'get fts settings for specific module',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'delete',
        'route'       => '/ftsmanager/{module}',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'deleteIndexSettings',
        'description' => 'delete fts settings for specific module',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/ftsmanager/{module}',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'setFTSFields',
        'description' => 'set fts fields for specific module',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/ftsmanager/{module}/index',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'index',
        'description' => 'index data',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'delete',
        'route'       => '/ftsmanager/{module}/index',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'deleteIndex',
        'description' => 'delete index',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/ftsmanager/{module}/index/reset',
        'class'       => FTSManagerRESTController::class,
        'function'    => 'resetIndex',
        'description' => 'reset index',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('adminftsmanager', '1.0', [], $routes);
