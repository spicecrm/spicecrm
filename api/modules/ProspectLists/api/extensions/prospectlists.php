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
use SpiceCRM\modules\ProspectLists\api\controllers\ProspectListsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('prospectlists', '1.0');
$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/ProspectLists/createfromlist/{listid}',
        'oldroute'    => '/modules/ProspectLists/createfromlist/{listid}',
        'class'       => ProspectListsController::class,
        'function'    => 'createFromListId',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'listid' => [
                'in' => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of list',
                'required' => true
            ],
            'targetlistname' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'name of targetlist'
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/ProspectLists/exportfromlist',
        'oldroute'    => '/modules/ProspectLists/exportFromList',
        'class'       => ProspectListsController::class,
        'function'    => 'exportFromList',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'module' => [
                'in' => 'query',
                'type'        => ValidationMiddleware::TYPE_MODULE,
                'description' => 'module',
                'required' => true
            ],
            'modulefilter' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'modulefilter'
            ],
            'ids' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'array of the selected ids'
            ],
            'listid' => [
                'in' => 'query',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'GUID of list'
            ],
            'targetlistname' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'name of targetlist'
            ],
            'listtype' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'type of current list'
            ],
            'owner' => [
                'in' => 'query',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'description' => 'is owner of current list'
            ],
            'searchterm' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'search string'
            ],
            'aggregates' => [
                'in' => 'query',
                'type'        => 'string',
                'description' => 'array of selected aggregates'
            ]
        ]
    ],

];

$RESTManager->registerRoutes($routes);

