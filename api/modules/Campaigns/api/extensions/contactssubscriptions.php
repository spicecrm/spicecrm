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

use SpiceCRM\modules\Campaigns\api\controllers\ContactsSubscriptionsController;

use SpiceCRM\includes\RESTManager;


/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('campaigns', '1.0');

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Contacts/{id}/newsletters/subscriptions',
        'oldroute'    => '/newsletters/subscriptions/{contactid}',
        'class'       => ContactsSubscriptionsController::class,
        'function'    => 'getSubscriptionList',
        'description' => 'get newsletters subscriptions for specific contact where a newsletter corresponds to a campaign in CRM',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'id of the contact',
                'type' => 'guid',
                'example' => 'f946b9d7-500a-5695-af7a-2241db3be2c2',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Contacts/{id}/newsletters/subscriptions',
        'oldroute'    => '/newsletters/subscriptions/{contactid}',
        'class'       => ContactsSubscriptionsController::class,
        'function'    => 'changeSubscriptionType',
        'description' => 'subscribe or unsubscribe to newsletters for specific contact where a newsletter corresponds to a campaign in CRM',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in' => 'path',
                'description' => 'id of the contact',
                'type' => 'guid',
                'example' => 'f946b9d7-500a-5695-af7a-2241db3be2c2',
                'required' => true
            ],
            'subscribed' => [
                'in' => 'body',
                'description' => 'array of campaign associative arrays to subscribe for the contact',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '[["id"=>"a29342d1-897b-11eb-9bff-00fffe0c4f07"], ["id"=>"b061e2ab-897b-11eb-9bff-00fffe0c4f07"]]',
                'required' => false
            ],
            'unsubscribed' => [
                'in' => 'body',
                'description' => 'array of campaign associative arrays to unsubscribe for the contact',
                'type' => 'array',
                'subtype' => 'array',
                'example' => '[["id"=>"a29342d1-897b-11eb-9bff-00fffe0c4f07"], ["id"=>"b061e2ab-897b-11eb-9bff-00fffe0c4f07"]]',
                'required' => false
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);