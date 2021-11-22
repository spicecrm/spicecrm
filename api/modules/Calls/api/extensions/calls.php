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
use SpiceCRM\modules\Calls\api\controllers\CallsController;
/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('calls', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/Calls/{id}/status/{userid}/{value}',
        'oldroute'       => '/modules/Calls/{id}/setstatus/{userid}/{status}',
        'class'       => CallsController::class,
        'function'    => 'setStatus',
        'description' => 'set call participation status for a participant',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'id of the call',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => 'f946b9d7-500a-5695-af7a-2241db3be2c2',
                'required' => true
            ],
            'userid' => [
                'in' => 'path',
                'description' => 'id of invited user',
                'type' => ValidationMiddleware::TYPE_GUID,
                'example' => 'f946b9d7-500a-5695-af7a-2241db3be2c2',
                'required' => true
            ],
            'value' => [
                'in' => 'path',
                'description' => 'status value from array of possibilities (accept|decline|tentative|none)',
                'type' => ValidationMiddleware::TYPE_STRING,
                'example' => 'accept',
                'required' => true
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);
