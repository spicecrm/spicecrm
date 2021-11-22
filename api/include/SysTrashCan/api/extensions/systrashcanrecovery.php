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
use SpiceCRM\includes\SysTrashCan\api\controllers\SysTrashCanRecoveryController;
use SpiceCRM\includes\authentication\AuthenticationController;


$routes = [
    [
        'method'      => 'get',
        'route'       => '/admin/systrashcan',
        'oldroute'    => '/systrashcan',
        'class'       => SysTrashCanRecoveryController::class,
        'function'    => 'getTrashedRecords',
        'description' => 'get all records contained in trash can',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/admin/systrashcan/related/{transactionid}/{recordid}',
        'oldroute'    => '/systrashcan/related/{transactionid}/{recordid}',
        'class'       => SysTrashCanRecoveryController::class,
        'function'    => 'getRelatedTrashRecords',
        'description' => 'get all related records corresponding to specified transaction id and record id',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters'  => [
            'transactionid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'a database transaction id',
                'example' => 'e4acc89d-6c75-f9c2-edc3-601044f6eafd',
                'required' => true
            ],
            'recordid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'a bean id',
                'example' => 'cc21dd0c-9ee7-11eb-b1c9-00fffe0c4f07',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/admin/systrashcan/recover/{recordid}',
        'oldroute'    => '/systrashcan/recover/{id}',
        'class'       => SysTrashCanRecoveryController::class,
        'function'    => 'recoverTrashedRecords',
        'description' => 'recover specified trashed record and optionally its related records',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true],
        'parameters' => [
            'recordid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'a bean id',
                'example' => 'cc21dd0c-9ee7-11eb-b1c9-00fffe0c4f07',
                'required' => true
            ],
            'recoverrelated' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_NUMERIC,
                'description' => 'number: 1 or 0',
                'example' => 1,
                'required' => true
            ]
        ]
    ],
];

/**
 * register the Extension
 */
RESTManager::getInstance()->registerExtension('systrashcan', '2.0', [], $routes);