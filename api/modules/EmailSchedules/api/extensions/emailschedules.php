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
use SpiceCRM\modules\EmailSchedules\api\controllers\EmailSchedulesController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('emailschedules', '1.0');

$routes = [
    [
        'method' => 'post',
        'route' => '/module/EmailSchedules/{id}',
        'oldroute' => '/modules/EmailSchedules/saveSchedule',
        'class' => EmailSchedulesController::class,
        'function' => 'saveSchedule',
        'description' => 'saves a scheduled email',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the record',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
            'module' => [
                'in' => 'body',
                'description' => 'the name of the module',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Accounts',
            ],
            'ids' => [
                'in' => 'body',
                'description' => 'the ids of the records ',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'example' => '["894562d5-d74b-4587-a10a-fabe7ec2f696", "9d2174a3-7eb8-461c-9c03-b1416388e614"]',
            ],
            'data' => [
                'in' => 'body',
                'description' => 'the data object of the email-schedule',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{"assigned_user_id": "1","assigned_user_name": "admin", ..}',
            ],
            'modulefilter' => [
                'in' => 'body',
                'description' => 'the modulefilter for the list',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '',
            ],
            'searchterm' => [
                'in' => 'body',
                'description' => 'the term entered for the search',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'gmbH',
            ],
            'aggregates' => [
                'in' => 'body',
                'description' => 'the aggregates of the list',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'example' => '[]',
            ]
        ]
    ],
    [
        'method' => 'post',
        'route' => '/module/EmailSchedules/{id}/{parentmodule}/{parentid}',
        'oldroute' => '/modules/EmailSchedules/saveScheduleFromRelated',
        'class' => EmailSchedulesController::class,
        'function' => 'saveScheduleFromRelated',
        'description' => 'saves a scheduled email for each related link of the parent',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'id' => [
                'in' => 'path',
                'description' => 'the id of the record',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
            'parentmodule' => [
                'in' => 'path',
                'description' => 'the name of the parent module',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'example' => 'ProspectLists',
            ],
            'parentid' => [
                'in' => 'path',
                'description' => 'the id of the parent',
                'type' => ValidationMiddleware::TYPE_GUID
            ],
            'module' => [
                'in' => 'body',
                'description' => 'the name of the linked module',
                'type' => ValidationMiddleware::TYPE_MODULE
            ],
            'links' => [
                'in' => 'body',
                'description' => 'the modules related to the parent',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'example' => '["Contacts", "Accounts"]',
            ],
            'linkedbeans' => [
                'in' => 'body',
                'description' => 'manual linked beans if the link is not selecteds',
                'type' => ValidationMiddleware::TYPE_COMPLEX
            ],
            'data' => [
                'in' => 'body',
                'description' => 'data object of the email schedule',
                'type' => ValidationMiddleware::TYPE_COMPLEX,
                'example' => '{"assigned_user_id": "1","assigned_user_name": "admin", ..}',
            ],
            'ids' => [
                'in' => 'body',
                'description' => 'an array of ids',
                'type' => ValidationMiddleware::TYPE_ARRAY
            ],
            'aggregates' => [
                'in' => 'body',
                'description' => 'aggregates',
                'type' => ValidationMiddleware::TYPE_COMPLEX
            ],
            'searchterm' => [
                'in' => 'body',
                'description' => 'a searchterm entered',
                'type' => ValidationMiddleware::TYPE_STRING
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/module/EmailSchedules/myopen/{userid}',
        'oldroute' => '/module/Users/{id}/myOpenSchedules',
        'class' => EmailSchedulesController::class,
        'function' => 'getOwnOpenSchedules',
        'description' => 'shows all user created email schedules that are open',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'userid' => [
                'in' => 'path',
                'description' => 'the id of the user',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ]
        ]
    ],
    [
        'method' => 'get',
        'route' => '/module/EmailSchedules/{parentmodule}/{parentid}',
        'oldroute' => '/module/EmailSchedules/checkRelated/{module}/{id}',
        'class' => EmailSchedulesController::class,
        'function' => 'checkRelated',
        'description' => '',
        'options' => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'parentmodule' => [
                'in' => 'body',
                'description' => 'the name of the parent module',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'ProspectLists',
            ],
            'parentid' => [
                'in' => 'path',
                'description' => 'the id of the parent',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => '894562d5-d74b-4587-a10a-fabe7ec2f696',
            ],
            'modules' => [
                'in' => 'query',
                'description' => 'the modules related to the parent',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'example' => '["Contacts", "Accounts"]',
            ]
        ]
    ]
];

$RESTManager->registerRoutes($routes);
