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
use SpiceCRM\includes\SpiceUrls\api\controllers\SpiceUrlsController;


/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'get',
        'route' => '/common/spiceurls/module/{beanName}/{beanId}',
        'class' => SpiceUrlsController::class,
        'function' => 'getUrls',
        'description' => 'retrieves an array of urls for a specific bean',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'beanName' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/common/spiceurls/module/{beanName}/{beanId}/count',
        'class' => SpiceUrlsController::class,
        'function' => 'getUrlsCount',
        'description' => 'get spice urls count. Define this route before this one /common/spiceurls/module/{beanName}/{beanId}/{urlId} to avoid conflict',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'beanName' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/common/spiceurls/module/{beanName}/{beanId}/{urlId}',
        'class' => SpiceUrlsController::class,
        'function' => 'getUrl',
        'description' => 'retrieves a single url by id',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'beanName' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'urlId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of the url',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/common/spiceurls/module/{beanName}/{beanId}',
        'class' => SpiceUrlsController::class,
        'function' => 'saveUrl',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'data' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'required' => true,
                'description' => 'url content',
            ],
            'beanId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'beanName' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/common/spiceurls/{id}',
        'class' => SpiceUrlsController::class,
        'function' => 'updateUrlData',
        'description' => 'save the url changes',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
                'description' => 'GUID of the Url',
            ],
            'description' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'text',
            ],
            'url_name' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'the name to set as display name for the url',
            ],
        ]
    ],
    [
        'method' => 'delete',
        'route' => '/common/spiceurls/module/{beanName}/{beanId}/{urlId}',
        'class' => SpiceUrlsController::class,
        'function' => 'deleteUrl',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'beanName' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'description' => 'name of a module',
                'example' => 'Accounts',
                'required' => true
            ],
            'beanId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of bean',
                'required' => true
            ],
            'urlId' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of the url',
                'required' => true
            ]
        ]
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('spiceurls', '1.0', [], $routes);
