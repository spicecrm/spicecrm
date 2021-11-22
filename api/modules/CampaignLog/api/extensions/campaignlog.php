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

use SpiceCRM\modules\CampaignLog\api\controllers\CampaignLogController;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('telecockpit', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/CampaignLog/{id}/{status}',
        'oldroute'    => '/module/CampaignLog/{campaignlogid}/{status}',
        'class'       => CampaignLogController::class,
        'function'    => 'getCampaignLogByStatus',
        'description' => 'gets campaign logs by status',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of campaign log entry',
                'example' => 'c7a88116-97e0-11eb-8c42-00fffe0c4f07',
                'required' => true
            ],
            'status' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'status to set in campaign log attempted|called|completed',
                'example' => 'attempted',
                'required' => true
            ],
            'planned_activity_date' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_DATETIME,
                'description' => 'UTC date and time of the attempt. Only needed for attempted.',
                'example' => '2021-02-23 11:25:06',
                'required' => false
            ],
            'call_id' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of the call created. ONly needed for called',
                'example' => '30d70a8f-97e1-11eb-8c42-00fffe0c4f07',
                'required' => false
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);
