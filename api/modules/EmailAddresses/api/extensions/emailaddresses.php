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
use SpiceCRM\modules\EmailAddresses\api\controllers\EmailAddressesController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('emailaddresses', '1.0');

$routes = [
    [
        'method' => 'get',
        'route' => '/module/EmailAddresses/{searchterm}',
        'oldroute' => '/EmailAddresses/{searchterm}',
        'class' => EmailAddressesController::class,
        'function' => 'searchMailAddress',
        'description' => 'searches for emails ',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'searchterm' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => true,
                'description' => 'A search term',
            ],
        ],
    ],
    [
        'method' => 'post',
        'route' => '/module/EmailAddress/searchbeans',
        'oldroute' => '/EmailAddress/searchBeans',
        'class' => EmailAddressesController::class,
        'function' => 'getMailText',
        'description' => 'get and parse the body of an email',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'addresses' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_ARRAY,
                'subtype' => ValidationMiddleware::TYPE_EMAIL,
                'required' => true,
                'description' => 'An array containing email addresses',
            ],
            'message_id' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'required' => false,
                'description' => 'a string containing a key',
            ]
        ],
    ],
    [
        'method' => 'get',
        'route' => '/module/EmailAddresses/{parentmodule}/{parentid}',
        'class' => EmailAddressesController::class,
        'function' => 'searchParentBeanMailAddress',
        'description' => 'searches for emailaddresses related to the parent bean',
        'options' => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters' => [
            'parentmodule' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_MODULE,
                'required' => true
            ],
            'parentid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true
            ]
        ],
    ]
];

$RESTManager->registerRoutes($routes);
