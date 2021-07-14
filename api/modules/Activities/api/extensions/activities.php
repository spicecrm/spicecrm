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
use SpiceCRM\modules\Activities\api\controllers\ActivitiesController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('activities', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/Activities/fts/{parentmodule}/{parentid}',
        'class'       => ActivitiesController::class,
        'function'    => 'loadFTSActivities',
        'description' => 'load planned activities into activity stream',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'parentmodule' => [
                'in' => 'path',
                'description' => 'name of the parent module',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'Accounts',
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'description' => 'id of the parent bean',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => 'cda04b43-89b8-11eb-9bff-00fffe0c4f07',
                'required' => true
            ],
            'count' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'example' => true,
                'required' => false
            ],
            'start' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => '50',
                'required' => false
            ],
            'limit' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'example' => '100',
                'required' => false
            ],
            'searchterm' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'proposal January',
                'required' => false
            ],
            'own' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'true',
                'required' => false
            ],
            'objects' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => '[]',
                'required' => false
            ]
        ]
    ],
// no longer in use
//    [
//        'method'      => 'get',
//        'route'       => '/module/Activities/{parentmodule}/{parentid}',
//        'class'       => ActivitiesKRESTController::class,
//        'function'    => 'loadHistory',
//        'description' => 'load held activities into activity stream',
//        'options'     => ['noAuth' => true, 'adminOnly' => false],
//    ],
];

$RESTManager->registerRoutes($routes);
