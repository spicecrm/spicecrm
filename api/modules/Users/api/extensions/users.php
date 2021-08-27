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
use SpiceCRM\modules\Users\api\controllers\UsersController;
use SpiceCRM\modules\Users\api\controllers\ACLforPortalUserController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/Users/{id}',
        'oldroute'    => '/module/Users/{userId}',
        'class'       => UsersController::class,
        'function'    => 'saveUser',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'email1' => [
                'in' => 'body',
                'description' => 'Force user to change the password on next login',
                'type' => ValidationMiddleware::TYPE_EMAIL,
                'required' => true,
            ],
            'id' => [
                'in' => 'body',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
            ],
            'userId' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
            ],
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/Users/{id}',
        'oldroute'    => '/module/Users/{userId}',
        'class'       => UsersController::class,
        'function'    => 'setUserInactive',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'userId' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
            ],
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Users/{id}/deactivate',
        'oldroute'    => '/module/Users/{id}/deactivate',
        'class'       => UsersController::class,
        'function'    => 'getDeactivateUserStats',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'id' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Users/{id}/deactivate',
        'oldroute'    => '/module/Users/{id}/deactivate',
        'class'       => UsersController::class,
        'function'    => 'deactivateUser',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'id' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Users/{id}/activate',
        'oldroute'    => '/module/Users/{id}/activate',
        'class'       => UsersController::class,
        'function'    => 'activateUser',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters' => [
            'id' => [
                'in' => 'query',
                'description' => '',
                'type' => ValidationMiddleware::TYPE_GUID,
                'required' => true,
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Users/ACLforPortalUsers/set',
        'class'       => ACLforPortalUserController::class,
        'function'    => 'setACLprofile',
        'description' => 'Script (to execute by Postman) to set an ACL profile for all portal users. The ACL profile ID has to be set in config.php or config DB table (acl/portal_user_profile).',
        'options'     => ['noAuth' => false, 'adminOnly' => true, 'validate' => true ],
        'parameters' => [
            'doIt' => [
                'in' => 'body',
                'description' => 'Ensures that the script won´t get startet unintended.',
                'type' => ValidationMiddleware::TYPE_BOOL,
                'required' => true
            ],
        ]
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('users', '1.0', [], $routes);
