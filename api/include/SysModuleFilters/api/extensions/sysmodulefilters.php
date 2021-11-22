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
use SpiceCRM\includes\SysModuleFilters\api\controllers\SysModuleFiltersController;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method' => 'get',
        'route' => '/configuration/sysmodulefilters/{module}',
        'oldroute' => '/sysmodulefilters/{module}',
        'class' => SysModuleFiltersController::class,
        'function' => 'getFilters',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name the module',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'example' => 'Accounts',
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/sysmodulefilters/{module}/{filter}',
        'oldroute' => '/sysmodulefilters/{module}/{filter}',
        'class' => SysModuleFiltersController::class,
        'function' => 'getFilter',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name the module',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'example' => 'Accounts',
            ],
            'filter' => [
                'in' => 'path',
                'description' => 'the name the filter',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '5dc836d2-2f98-7f3c-708e-970c597a19c6',
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/configuration/sysmodulefilters/{module}/{filter}',
        'oldroute' => '/sysmodulefilters/{module}/{filter}',
        'class' => SysModuleFiltersController::class,
        'function' => 'saveFilter',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'example' => 'Calls',
            ],
            'filter' => [
                'in' => 'path',
                'description' => 'the id of the filter',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '5dc836d2-2f98-7f3c-708e-970c597a19c6',
            ],
            'id' => [
                'in' => 'body',
                'description' => 'the id of the filter',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '5dc836d2-2f98-7f3c-708e-970c597a19c6',
            ],
            'name' => [
                'in' => 'body',
                'description' => 'the name of the filter',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'my open Calls',
            ],
            'filtermethod' => [
                'in' => 'body',
                'description' => 'the method of the filter',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => 'method->',
            ],
            'scope' => [
                'in' => 'body',
                'description' => 'the scope of the filter',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'global',
            ],
            'created_by_id' => [
                'in' => 'body',
                'description' => 'the id of the user who created the filter',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '2dc836d2-2f98-7f3c-708e-970c597a1926',
            ],
            'package' => [
                'in' => 'body',
                'description' => 'the package related to the filter',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'core',
            ],
            'version' => [
                'in' => 'body',
                'description' => 'the release version of the package ',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'global',
            ],
            'filterdefs' => [
                'in' => 'body',
                'description' => 'the object containing the definition of the filter',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{}',
            ],
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/configuration/sysmodulefilters/{module}/{filter}',
        'oldroute' => '/sysmodulefilters/{module}/{filter}',
        'class' => SysModuleFiltersController::class,
        'function' => 'deleteFilter',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'module' => [
                'in' => 'path',
                'description' => 'the name the module',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'example' => 'Accounts',
            ],
            'filter' => [
                'in' => 'path',
                'description' => 'the name the filter',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '5dc836d2-2f98-7f3c-708e-970c597a19c6',
            ]
        ]
    ],
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('sysmodulefilters', '2.0', [], $routes);
