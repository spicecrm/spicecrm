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
use SpiceCRM\KREST\controllers\coreController;

$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/',
        'class'       => coreController::class,
        'function'    => 'getExtensions',
        'description' => 'get the loaded Extensions',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/sysinfo',
        'class'       => coreController::class,
        'function'    => 'getSysinfo',
        'description' => 'get vital sysinfo for the startup',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/language',
        'class'       => coreController::class,
        'function'    => 'getLanguage',
        'description' => 'routes for the language',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/language/{language}',
        'class'       => coreController::class,
        'function'    => 'getLanguage',
        'summary'     => 'routes for the language',
        'description' => 'routes for the language lorem ipsum dolor sit amet',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
        'requestBody' => [ // optional. use only if there actually is a post body
            'description' => 'lorem ipsum',
            'example' => 'beispiel als text',
            'content' => [
                'setLanguage' => [
                    'type' => 'boolean',
                    'required' => false,
                    'description' => 'lorem ipsum dolor sit amet',
                    // todo later add some validation rules
                ],
                // die struktur erweitern und verschachteln abhängig davon was die methode erwartet
            ],
        ],
        'parameters'  => [
            'language' => [
                'in' => 'path', // path or query
                'description' => 'Language lorem ipsum',
                'type' => 'enum',
                'options' => [], // entweder hardcoden, oder ein string (dann ist das ein Domain)
                'example' => 'optional',
            ],
            'lorem' => [
                'in' => 'path', // path or query
                'description' => 'Language lorem ipsum',
                'type' => 'string',
                'example' => 'optional',
            ],
        ],
        'responses'   => [
            404 => [
                'description' => 'not found',
            ],
            200 => [
                'description' => 'OK',
//                'content' // leave it for now
            ],
        ],
    ],
    // begin workaround when {language} in the route above is empty
    // the / for the route is set and RESTManager would throw a 404 error
    // it usually happens after installation
    [
        'method'      => 'get',
        'route'       => '/language/',
        'class'       => coreController::class,
        'function'    => 'getLanguage',
        'description' => 'routes for the language',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    // end
    [
        'method'      => 'get',
        'route'       => '/system/guid',
        'class'       => coreController::class,
        'function'    => 'generateGuid',
        'description' => 'helper to generate a GUID',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/tmpfile',
        'class'       => coreController::class,
        'function'    => 'storeTmpFile',
        'description' => 'called from teh proxy to store a temp file storeTmpFile',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/httperrors',
        'class'       => coreController::class,
        'function'    => 'postHttpErrors',
        'description' => 'logs http errors',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/shorturl/{key}',
        'class'       => coreController::class,
        'function'    => 'getRedirection',
        'description' => 'get redirection data for a short url',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/shorturl/{key}',
        'class'       => coreController::class,
        'function'    => 'getRedirection',
        'description' => 'get redirection data for a short url',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/routes',
        'class'       => coreController::class,
        'function'    => 'getRoutes',
        'description' => 'get the routes from the restmanager',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/swagger',
        'class'       => coreController::class,
        'function'    => 'getSwagger',
        'description' => 'Returns the swagger definition of the API',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
];

/**
 * register the extension
 */

$RESTManager->registerExtension(
    'core',
    '2.0',
    ['edit_mode' => SpiceConfig::getInstance()->config['workbench_edit_mode']['mode'] ?: 'custom'],
    $routes
);
