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
use SpiceCRM\modules\Mailboxes\api\controllers\MailboxManagerController;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('mailboxmanager', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/Mailboxes/test',
        'oldroute'    => '/mailboxes/test',
        'class'       => MailboxManagerController::class,
        'function'    => 'testConnection',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'test_email' => [
                'in'          => 'body',
                'required'    => false,
                'description' => 'Email address that will receive the test message.',
                'type'        => ValidationMiddleware::TYPE_STRING,
            ],
            'data' => [
                'in'          => 'body',
                'required'    => true,
                'description' => 'Mailbox model from the frontend',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Mailboxes/transports',
        'oldroute'    => '/mailboxes/transports',
        'class'       => MailboxManagerController::class,
        'function'    => 'getMailboxTransports',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Mailboxes/processors',
        'oldroute'    => '/mailboxes/getmailboxprocessors',
        'class'       => MailboxManagerController::class,
        'function'    => 'getMailboxProcessors',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Mailboxes/scope',
        'oldroute'    => '/mailboxes/getmailboxes',
        'class'       => MailboxManagerController::class,
        'function'    => 'getMailboxes',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'scope' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'description' => 'Mailbox type',
                'options'     => [
                    'inbound', 'outbound', 'outboundsingle', 'outboundmass', 'inbound_sms',
                    'outboundsingle_sms', 'outboundmass_sms',
                ],
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Mailboxes/default',
        'oldroute'    => '/mailboxes/setdefaultmailbox',
        'class'       => MailboxManagerController::class,
        'function'    => 'setDefaultMailbox',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'mailbox_id' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'ID of the mailbox',
                'required'    => true,
            ],
        ],
    ],
];

$RESTManager->registerRoutes($routes);

