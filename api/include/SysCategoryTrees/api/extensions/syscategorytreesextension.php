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
use SpiceCRM\includes\SpiceUI\api\controllers\SystemUIController;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SysCategoryTrees\api\controllers\SysCategoryTreesController;

$routes = [
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/categorytrees',
        'class' => SysCategoryTreesController::class,
        'function' => 'getTrees',
        'description' => 'selects a tree without param',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/categorytrees/{id}',
        'class' => SysCategoryTreesController::class,
        'function' => 'addTree',
        'description' => 'adds a new tree',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the tree',
                'type' => ValidationMiddleware::TYPE_GUID
            ],
            'name' => [
                'in' => 'body',
                'description' => 'the name of the node',
                'type' => ValidationMiddleware::TYPE_STRING
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/configuration/spiceui/core/categorytrees/{id}/categorytreenodes',
        'class' => SysCategoryTreesController::class,
        'function' => 'getTreeNodes',
        'description' => 'gets all teh nodes of a tree',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the tree',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/configuration/spiceui/core/categorytrees/{id}/categorytreenodes',
        'class' => SysCategoryTreesController::class,
        'function' => 'postTreeNodes',
        'description' => 'saves all the nodes',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'excludeBodyValidation' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the tree',
                'type' => ValidationMiddleware::TYPE_GUID
            ]
        ]
    ]
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension(
    'categorytrees',
    '2.0',
    SpiceConfig::getInstance()->config['ui'],
    $routes
);
