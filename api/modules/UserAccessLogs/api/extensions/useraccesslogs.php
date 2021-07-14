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
use SpiceCRM\modules\UserAccessLogs\api\controllers\UserAccessLogController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method' => 'get',
        'oldroute' => '/login',
        'route' => '/admin/useraccesslog',
        'class' => UserAccessLogController::class,
        'function' => 'getUserAccessLog',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'limit' => [
                'in' => 'query',
                'description' => 'Maximal numbers of requested error log entries.',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'default' => 250
            ],
            'filter' => [
                'in' => 'query',
                'description' => 'a generid filter term',
                'type' => ValidationMiddleware::TYPE_STRING
            ],
            'date_end' => [
                'in' => 'query',
                'description' => 'the end date',
                'type' => ValidationMiddleware::TYPE_DATETIME
            ],
            'failedonly' => [
                'in' => 'query',
                'description' => 'to only list failed attempts',
                'type' => ValidationMiddleware::TYPE_BOOL
            ]
        ]
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('useraccesslogs', '1.0', [], $routes);
