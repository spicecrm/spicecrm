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
use SpiceCRM\modules\SchedulerJobs\api\controllers\SchedulerJobController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('schedulerjobs', '1.0');

$routes = [
    [
        'method' => 'get',
        'route' => '/module/SchedulerJobs/{id}/log',
        'class' => SchedulerJobController::class,
        'function' => 'loadJobLog',
        'description' => 'returns a job log list',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of job',
                'required' => true
            ],
            'offset' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'description' => 'offset for the retrieve query',
                'required' => true
            ],
            'limit' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'description' => 'limit for the retrieve query',
                'required' => true
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/SchedulerJobs/{id}/schedule',
        'class' => SchedulerJobController::class,
        'function' => 'scheduleJob',
        'description' => 'creates and submits a job',
        'options' => ['noAuth' => false, 'adminOnly' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of job',
                'required' => true
            ],
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/SchedulerJobs/{id}/run',
        'class' => SchedulerJobController::class,
        'function' => 'runJob',
        'description' => 'run a specific job',
        'options' => ['noAuth' => false, 'adminOnly' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of job',
                'required' => true
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/SchedulerJobs/{id}/kill',
        'class' => SchedulerJobController::class,
        'function' => 'killJobProcess',
        'description' => 'kill a running job by process id',
        'options' => ['noAuth' => false, 'adminOnly' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of job',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SchedulerJobs/{beanId}/related/jobtasks',
        'class'       => SchedulerJobController::class,
        'function'    => 'addRelatedTasks',
        'description' => 'Add related bean',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => false],
        'parameters'  => [
            'beanId'   => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the bean',
            ],
            ValidationMiddleware::ANONYMOUS_ARRAY => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_ARRAY,
                'subtype'     => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'An array with GUIDs of related beans',
            ],
        ],
    ]
];

$RESTManager->registerRoutes($routes);
