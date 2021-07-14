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
use SpiceCRM\modules\Administration\api\controllers\CleanUpController;

/**
 * routes
 */
$routes = [
    [
        'method'      => 'get',
        'route'       => '/admin/cleanup/configs/check/incomplete',
        'class'       => CleanUpController::class,
        'function'    => 'getIncompleteRecords',
        'description' => 'get Incomplete Records',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/cleanup/configs/check/incomplete/{scope}',
        'class'       => CleanUpController::class,
        'function'    => 'getIncompleteRecords',
        'description' => 'get Incomplete Records',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true, 'validate' => true],
        'parameters'  => [
            'scope' => [
                'in' => 'path',
                'type'        => 'string',
                'description' => 'type of diagnose'
            ],
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/cleanup/configs/check/unused',
        'class'       => CleanUpController::class,
        'function'    => 'getUnusedRecords',
        'description' => 'get unused Records',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/cleanup/configs/check/unused/{scope}',
        'class'       => CleanUpController::class,
        'function'    => 'getUnusedRecords',
        'description' => 'get unused Records',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'scope' => [
                'in' => 'path',
                'type'        => 'string',
                'description' => 'type of diagnose'
            ],
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/cleanup/stylecache',
        'class'       => CleanUpController::class,
        'function'    => 'cleanDompdfStyleCacheFile',
        'description' => 'clean dompdf caches styles',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ]
];

/**
 * Register the Extension
 */
RESTManager::getInstance()->registerExtension('admincleanup', '2.0', [], $routes);

