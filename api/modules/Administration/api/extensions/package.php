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
use SpiceCRM\modules\Administration\api\controllers\PackageController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/configuration/packages/repositories',
        'oldroute'    => '/packages/repositories',
        'class'       => PackageController::class,
        'function'    => 'getRepositories',
        'description' => 'get the links to available repositories to retrieve packages from',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/packages',
        'class'       => PackageController::class,
        'function'    => 'getPackages',
        'description' => 'get all packages',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/packages/{repository}',
        'class'       => PackageController::class,
        'function'    => 'getPackages',
        'description' => 'get all packages for selected repository',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'repository' => [
                'in' => 'path',
                'description' => 'the repository id to retrieve the package from',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => false,
                'example' => 'b5feb33a-8ae4-11eb-b159-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/packages/package/{package}[/{repository}]',
        'oldroute'       => '/packages/package/{package}[/{repository}]',
        'class'       => PackageController::class,
        'function'    => 'loadPackage',
        'description' => 'load a specific package from a specific repository',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'package' => [
                'in' => 'path',
                'description' => 'name of the package to retrieve ',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => 'opportunitymanagement'
            ],
            'repository' => [
                'in' => 'path',
                'description' => 'the repository id to retrieve the package from',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => false,
                'example' => 'b5feb33a-8ae4-11eb-b159-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/configuration/packages/package/{package}',
        'oldroute'    => '/packages/package/{package}',
        'class'       => PackageController::class,
        'function'    => 'deletePackage',
        'description' => 'unload a specific package',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'package' => [
                'in' => 'path',
                'description' => 'the package name to remove from current configuration ',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => 'opportunitymanagement'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/configuration/packages/language/{language}[/{repository}]',
        'oldroute'    => '/packages/language/{language}[/{repository}]',
        'class'       => PackageController::class,
        'function'    => 'loadLanguage',
        'description' => 'load a specific language into current configuration from a specific repository',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'language' => [
                'in' => 'path',
                'description' => 'the language name to add to current configuration ',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => 'de_DE'
            ],
            'repository' => [
                'in' => 'path',
                'description' => 'the repository id to get the package from',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => false,
                'example' => 'b5feb33a-8ae4-11eb-b159-00fffe0c4f07'
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/configuration/packages/language/{language}',
        'oldroute'    => '/packages/language/{language}',
        'class'       => PackageController::class,
        'function'    => 'deleteLanguage',
        'description' => 'remove a specific language and its translations from current configuration',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'language' => [
                'in' => 'path',
                'description' => 'the language name to remove from current configuration ',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example' => 'de_DE'
            ]
        ]
    ]
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('adminpackages', '1.0', [], $routes);

