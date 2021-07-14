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
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\KREST\controllers\CoreController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/',
        'class'       => CoreController::class,
        'function'    => 'getExtensions',
        'description' => 'get the loaded Extensions',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/sysinfo',
        'oldroute'    => '/sysinfo',
        'class'       => CoreController::class,
        'function'    => 'getSysinfo',
        'description' => 'get vital system information for the startup',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'oldroute'    => '/language/{language}',
        'route'       => '/system/language',
        'class'       => CoreController::class,
        'function'    => 'getLanguage',
        'summary'     => 'loads the specific language strings',
        'description' => 'loads the specific language strings',
        'options'     => ['noAuth' => true, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'setPreferences' => [
                'in' => 'query',
                'description' => 'set the preferences',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => 'de_DE'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'oldroute'    => '/language/{language}',
        'route'       => '/system/language/{language}',
        'class'       => CoreController::class,
        'function'    => 'getLanguage',
        'summary'     => 'loads the specific language strings',
        'description' => 'loads the specific language strings',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
        'parameters' => [
            'language' => [
                'in' => 'path',
                'description' => 'requested language',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'example' => 'de_DE'
            ],
            'setPreferences' => [
                'in' => 'query',
                'description' => 'set the preferences',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => 'de_DE'
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/system/guid',
        'class'       => CoreController::class,
        'function'    => 'generateGuid',
        'description' => 'helper to generate a GUID',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/system/httperrors',
        'oldroute'    => '/httperrors',
        'class'       => CoreController::class,
        'function'    => 'postHttpErrors',
        'description' => 'Logs HTTP errors got from the frontend.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters'  => [
            'errors' => [
                'in'          => 'body',
                'description' => 'Data of the errors occurred in the frontend.',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'subtype' => ValidationMiddleware::TYPE_COMPLEX,
                'required' => true
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/system/shorturl/{key}',
        'class'       => CoreController::class,
        'function'    => 'getRedirection',
        'description' => 'get redirection data for a short url',
        'options'     => ['noAuth' => true, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'key' => [
                'in'          => 'path',
                'description' => 'Short URL key',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'example'     => 'gX2qwKsKc',
                'validationOptions' => [
                    ValidationMiddleware::VOPT_REGEX => '#^[a-km-zA-HJ-NP-Z2-9]+$#'
                ]
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/routes',
        'oldroute'    => '/routes',
        'class'       => CoreController::class,
        'function'    => 'getRoutes',
        'description' => 'get the routes from the restmanager',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/Swagger',
        'oldroute'    => '/swagger',
        'class'       => CoreController::class,
        'function'    => 'getSwagger',
        'description' => 'Returns all swagger definitions of the API',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'modules'    => [
                'in'          => 'body',
                'description' => 'The modules names for which the generic routes will be instantiated.',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => 'module',
                'required'    => false,
            ],
            'extensions' => [
                'in'          => 'body',
                'description' => 'The extension names for which the swagger file will be generated.',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => 'extension',
                'required'    => false,
            ],
            'node' => [
                'in'          => 'body',
                'description' => 'A (partial) API path. All routes including the node at the beginning of its path will be included in the generated swagger file.',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example'     => '/example',
                'required'    => false,
            ],
        ],
    ],
];

/**
 * register the extension
 */

RESTManager::getInstance()->registerExtension(
    'core',
    '2.0',
    ['edit_mode' => SpiceConfig::getInstance()->config['workbench_edit_mode']['mode'] ?: 'custom'],
    $routes
);
