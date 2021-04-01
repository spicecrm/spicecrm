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
use SpiceCRM\modules\Administration\KREST\controllers\PackageController;
use Slim\Routing\RouteCollectorProxy;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('adminpackages', '1.0');


$routes = [
    [
        'method'      => 'get',
        'route'       => '/packages/repositories',
        'class'       => PackageController::class,
        'function'    => 'getRepositories',
        'description' => 'get links to repositories to retrieve packages from',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/packages[/{repository}]',
        'class'       => PackageController::class,
        'function'    => 'getPackages',
        'description' => 'get all packages for selected repository',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/packages/package/{package}[/{repository}]',
        'class'       => PackageController::class,
        'function'    => 'loadPackage',
        'description' => 'load a specific package from a specific repository',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'put',
        'route'       => '/packages/package/{package}[/{repository}]',
        'class'       => PackageController::class,
        'function'    => 'loadPackage',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'delete',
        'route'       => '/packages/package/{package}',
        'class'       => PackageController::class,
        'function'    => 'deletePackage',
        'description' => 'unload a specific package',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/packages/language/{language}[/{repository}]',
        'class'       => PackageController::class,
        'function'    => 'loadLanguage',
        'description' => 'load a specific language from a specific repository',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'put',
        'route'       => '/packages/language/{language}[/{repository}]',
        'class'       => PackageController::class,
        'function'    => 'loadLanguage',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'delete',
        'route'       => '/packages/language/{language}',
        'class'       => PackageController::class,
        'function'    => 'deleteLanguage',
        'description' => 'unload a specific language',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/packages/language/{language}',
        'class'       => PackageController::class,
        'function'    => 'setDefaultLanguage',
        'description' => 'save default language setting',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
];

$RESTManager->registerRoutes($routes);
