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

use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Users\api\controllers\UsersPreferencesController;
use Slim\Routing\RouteCollectorProxy;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('userpreferences', '1.0');


$routes = [
    [
        'method' => 'get',
        'oldroute' => '/user/{userId}/preferences/{category}',
        'route' => '/module/Users/{userId}/preferences/{category}',
        'class' => UsersPreferencesController::class,
        'function' => 'getPreferences',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'userId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'GUID of the User',
            ],
            'category' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'Category of the preference',
            ],
            'names' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'description' => 'Specific Category entry',
            ],
        ]
    ],
    [
        'method' => 'get',
        'oldroute' => '/user/{userId}/preferences/{category}/{names}',
        'route' => '/module/User/{userId}/preferences/{category}/{names}',
        'class' => UsersPreferencesController::class,
        'function' => 'getUserPreferences',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'names' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
            ],
            'userId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'GUID of the User',
            ],
            'category' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'Category of the preference',
            ],
        ]
    ],
    [
        'method' => 'post',
        'oldroute' => '/user/{userId}/preferences/{category}',
        'route' => '/module/Users/{userId}/preferences/{category}',
        'class' => UsersPreferencesController::class,
        'function' => 'set_user_preferences',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            ValidationMiddleware::ANONYMOUS_ARRAY => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'required' => true,
            ],
            'userId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'GUID of the User',
            ],
            'category' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'Category of the preference',
            ],
            'names' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'description' => 'Specific Category entry',
            ],
        ]
    ],
];

$RESTManager->registerRoutes($routes);

