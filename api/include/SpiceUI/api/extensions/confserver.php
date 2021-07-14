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
use SpiceCRM\includes\SpiceUI\api\controllers\ConfServerController;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * restrict routes to authenticated users and only if the system acts as repository
 * also enable general unautohrized access if system is public repository
 */
#global $sugar_config;
//todo clarify ... do we need this if? should we add a auth middleware?
if((SpiceConfig::getInstance()->config['configrepository']['public'] !== true) || SpiceConfig::getInstance()->config['configrepository']['enabled'] !== true) return;


$routes = [
    [
        'method'      => 'get',
        'route'       => '/config',
        'class'       => ConfServerController::class,
        'function'    => 'getAvailable',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/config/repositoryitems',
        'class'       => ConfServerController::class,
        'function'    => 'getRepositoryItems',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/config/repositorymodules',
        'class'       => ConfServerController::class,
        'function'    => 'getRepositoryModules',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/config/{packages}/{version}',
        'class'       => ConfServerController::class,
        'function'    => 'getConfig',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/config/language/{language}/{package}/{version}',
        'class'       => ConfServerController::class,
        'function'    => 'getLanguageLabels',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/config/language/{language}',
        'class'       => ConfServerController::class,
        'function'    => 'getLanguageLabels',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('configrepository', '1.0', [], $routes);
