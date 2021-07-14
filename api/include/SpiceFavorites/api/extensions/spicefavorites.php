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
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SpiceFavorites\api\controllers\SpiceFavoritesController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/common/spicefavorites',
        'oldroute'    => '/SpiceFavorites',
        'class'       => SpiceFavoritesController::class,
        'function'    => 'getFavorites',
        'description' => 'get all beans marked as favorite for current user',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/common/spicefavorites/{modulename}/{beanid}',
        'oldroute'    => '/SpiceFavorites/{module}/{id}',
        'class'       => SpiceFavoritesController::class,
        'function'    => 'addFavorite',
        'description' => 'set a bean as favorite for current user',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'modulename' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the module name',
                'example' => 'Accounts',
                'required' => true,
            ],
            'beanid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the bean id to set as favorite',
                'example' => '91e35ad0-947a-11eb-ac92-00fffe0c4f07',
                'required' => true,
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/common/spicefavorites/{modulename}/{beanid}',
        'oldroute'    => '/SpiceFavorites/{module}/{id}',
        'class'       => SpiceFavoritesController::class,
        'function'    => 'deleteFavorite',
        'description' => 'delete a favorite set by current user',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'modulename' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the module name',
                'example' => 'Accounts',
                'required' => true,
            ],
            'beanid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'the bean id to set as favorite',
                'example' => '91e35ad0-947a-11eb-ac92-00fffe0c4f07',
                'required' => true,
            ]
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spicefavorites', '1.0', [], $routes);
