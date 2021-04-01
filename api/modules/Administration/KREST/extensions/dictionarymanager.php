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

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Administration\KREST\controllers\DictionaryController;
use SpiceCRM\modules\Administration\KREST\controllers\adminController;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\modules\Administration\KREST\controllers\DictionaryManagerController;

/**
 * get a Rest Manager Instance
 */

$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('admindictionary', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/dictionary/list/{table}',
        'class'       => DictionaryManagerController::class,
        'function'    => 'GetDictionaryFields',
        'description' => 'get the dictionaryfields from the database',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/dictionary/browser/{module}/nodes',
        'class'       => DictionaryController::class,
        'function'    => 'getNodes',
        'description' => 'builds a note array',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/dictionary/browser/{module}/fields',
        'class'       => DictionaryController::class,
        'function'    => 'getFields',
        'description' => 'builds a field array',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/dictionary/browser/{module}/dbcolumns',
        'class'       => adminController::class,
        'function'    => 'getDBColumns',
        'description' => 'get all columns from the module-table in the database allowed as admin',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/repair/sql',
        'class'       => adminController::class,
        'function'    => 'buildSQLArray',
        'description' => 'buildind the query for a relationship repair',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/repair/database',
        'class'       => adminController::class,
        'function'    => 'repairAndRebuild',
        'description' => 'repairs and rebuilds the database',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/repair/language',
        'class'       => adminController::class,
        'function'    => 'repairLanguage',
        'description' => 'clears language cache and repairs the language extensions',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/repair/aclroles',
        'class'       => adminController::class,
        'function'    => 'repairACLRoles',
        'description' => 'repairs ACL Roles',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/repair/cache',
        'class'       => adminController::class,
        'function'    => 'repairCache',
        'description' => 'clears the vardef cache, executes rebuilding of vardefs extensions and',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/repair/dbcolumns',
        'class'       => adminController::class,
        'function'    => 'repairDBColumns',
        'description' => 'delete all the given columns in the database ',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
];
$RESTManager->registerRoutes($routes);