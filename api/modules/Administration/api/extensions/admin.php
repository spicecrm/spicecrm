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
use SpiceCRM\modules\Administration\api\controllers\AdminController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method' => 'get',
        'route' => '/configuration/systemstats',
        'oldroute' => '/admin/systemstats',
        'class' => AdminController::class,
        'function' => 'systemstats',
        'description' => 'get some system statistics',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'route' => '/configuration/settings',
        'oldroute' => '/admin/generalsettings',
        'class' => AdminController::class,
        'function' => 'getGeneralSettings',
        'description' => 'get some system config variables',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => []
    ],
    [
        'method' => 'post',
        'route' => '/configuration/settings',
        'oldroute' => '/admin/writesettings',
        'class' => AdminController::class,
        'function' => 'writeGeneralSettings',
        'description' => 'save some system config variables',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'system' => [
                'in' => 'body',
                'description' => 'the system settings',
                'type' => ValidationMiddleware::TYPE_JSON,
                'example' => '{"name":"SpiceCRM","site_url":"http://localhost/spicecrm_be_factory","unique_key":"03324ddd8cf6dedcebcc717c8c0066ce"}',
            ],
            'advanced' => [
                'in' => 'body',
                'description' => 'the advanced settings',
                'type' => ValidationMiddleware::TYPE_JSON,
                'example' => '{"developerMode":true,"stack_trace_errors":null,"dump_slow_queries":null,"log_memory_usage":null,"slow_query_time_msec":null,"upload_maxsize":30000000,"upload_dir":"upload/"}'
            ],
            'logger' => [
                'in' => 'body',
                'description' => 'the logger settings',
                'type' => ValidationMiddleware::TYPE_JSON,
                'example' => '{"level":"error"}'
            ]
        ]
    ],
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('admin', '2.0', [], $routes);