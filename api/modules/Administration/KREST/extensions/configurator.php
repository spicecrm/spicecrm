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
use SpiceCRM\modules\Administration\KREST\controllers\ConfiguratorController;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('adminconfigurator', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/configurator/editor/{category}',
        'class'       => ConfiguratorController::class,
        'function'    => 'CheckForConfig',
        'description' => 'checks if an config exists if not create an stdclass',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/configurator/editor/{category}',
        'class'       => ConfiguratorController::class,
        'function'    => 'WriteConfToDb',
        'description' => 'writes not forbidden categories to the database',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/configurator/entries/{table}',
        'class'       => ConfiguratorController::class,
        'function'    => 'ConvertToHTMLDecoded',
        'description' => 'converts the arguments to an html decoded value',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'delete',
        'route'       => '/configurator/{table}/{id}',
        'class'       => ConfiguratorController::class,
        'function'    => 'CheckMetaData',
        'description' => 'checks the metadata and handles them',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/configurator/{table}/{id}',
        'class'       => ConfiguratorController::class,
        'function'    => 'WriteConfig',
        'description' => 'writes config to database',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/configurator/update',
        'class'       => ConfiguratorController::class,
        'function'    => 'ConfigMergeArrays',
        'description' => 'merges the postbody and postparams arrays together',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/configurator/load',
        'class'       => ConfiguratorController::class,
        'function'    => 'LoadDefaultConfig',
        'description' => 'loads clears the default config',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/configurator/objectrepository',
        'class'       => ConfiguratorController::class,
        'function'    => 'ConcatRepoQuery',
        'description' => 'concats the repository queries together',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],

];

$RESTManager->registerRoutes($routes);

