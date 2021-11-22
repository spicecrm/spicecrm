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
use SpiceCRM\modules\UserQuotas\api\controllers\QuotaManagerController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('userquotas', '1.0');

$routes = [
    [
        'method' => 'get',
        'oldroute' => '/quotamanager/users',
        'route' => '/module/QuotaManager/users',
        'class' => QuotaManagerController::class,
        'function' => 'getQuotaUser',
        'description' => 'gets a quota User',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => []
    ],
    [
        'method' => 'get',
        'oldroute' => '/quotamanager/quotas/{year}',
        'route' => '/module/QuotaManager/quotas/{year}',
        'class' => QuotaManagerController::class,
        'function' => 'getQuota',
        'description' => 'gets a quota',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'year' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 2021,
                'required' => true
            ],
        ]
    ],
    [
        'method' => 'post',
        'oldroute' => '/quotamanager/quota/{userid}/{year}/{period}/{quota}',
        'route' => '/module/QuotaManager/quota/{userid}/{year}/{period}/{quota}',
        'class' => QuotaManagerController::class,
        'function' => 'setQuota',
        'description' => 'sets a quota',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'userid' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
                'required' => true
            ],
            'year' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 2021,
                'required' => true
            ],
            'period' => [
                'in' => 'path',
                'description' => 'period1 or for multiple comma-seperated: period1,period2',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'period1 or for multiple comma-seperated: period1,period2',
                'required' => true
            ],
            'quota' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 500.20,
                'required' => true
            ],
        ],
    ],
    [
        'method' => 'delete',
        'oldroute' => '/quotamanager/quota/{userid}/{year}/{period}',
        'route' => '/module/QuotaManager/quota/{userid}/{year}/{period}',
        'class' => QuotaManagerController::class,
        'function' => 'deleteQuota',
        'description' => 'deletes a quota',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'userid' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
                'required' => true
            ],
            'year' => [
                'in' => 'path',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => 2021,
                'required' => true
            ],
            'period' => [
                'in' => 'path',
                'description' => 'period1 or for multiple comma-seperated: period1,period2',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'period1 or for multiple comma-seperated: period1,period2',
                'required' => true
            ],
        ],
    ],
];

$RESTManager->registerRoutes($routes);

