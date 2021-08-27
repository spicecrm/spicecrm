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
use SpiceCRM\modules\Contacts\api\controllers\ContactsPortalController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Contacts/{id}/portalAccess',
        'oldroute'    => '/portal/{id}/portalaccess',
        'class'       => ContactsPortalController::class,
        'function'    => 'getPortalUser',
        'description' => 'Gets the data of an Contact that is also Portal User.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'id' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the Contact.',
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Contacts/{id}/portalAccess',
        'oldroute'    => '/portal/{contactId}/portalaccess/{action:create|update}',
        'class'       => ContactsPortalController::class,
        'function'    => 'createPortalUser',
        'description' => 'handles the creating and updating of contacts as portal users',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'username'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The name of the user to be created.',
                'validationOptions' => [
                    ValidationMiddleware::VOPT_MIN_SIZE => 1,
                    ValidationMiddleware::VOPT_MAX_SIZE => $GLOBALS['dictionary']['User']['fields']['user_name']['len']
                ]
            ],
            'password'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The name of the user to be created.',
            ],
            'aclRole'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => false,
                'description' => 'The ACL role of the user to be created.',
            ],
            'aclProfile'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => false,
                'description' => 'The ACL profile of the user to be created.',
            ],
            'portalRole'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'The portal role of the user to be created.',
            ],
            'setDateTimePrefsWithSystemDefaults' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => false,
                'description' => 'Set the date and time preferences of the user with the system defaults.',
            ],
            'status' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => false,
                'description' => 'The status of the user to be created.',
            ],
            'id' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the Contact.',
            ]
        ]
    ],
    [
        'method'      => 'put',
        'route'       => '/module/Contacts/{id}/portalAccess',
        'oldroute'    => '/portal/{contactId}/portalaccess/{action:create|update}',
        'class'       => ContactsPortalController::class,
        'function'    => 'updatePortalUser',
        'description' => 'handles the creating and updating of contacts as portal users',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'username'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The name of the user to be created.',
                'validationOptions' => [
                    ValidationMiddleware::VOPT_MIN_SIZE => 1,
                    ValidationMiddleware::VOPT_MAX_SIZE => $GLOBALS['dictionary']['User']['fields']['user_name']['len']
                ]
            ],
            'password'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'The name of the user to be created.',
            ],
            'aclRole'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
                'description' => 'The ACL role of the user to be created.',
            ],
            'aclProfile'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => false,
                'description' => 'The ACL profile of the user to be created.',
            ],
            'portalRole'        => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The portal role of the user to be created.',
            ],
            'setDateTimePrefsWithSystemDefaults' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => false,
                'description' => 'Set the date and time preferences of the user with the system defaults.',
            ],
            'status' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_BOOL,
                'required'    => false,
                'description' => 'The status of the user to be created.',
            ],
            'id' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the Contact.',
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Contacts/{id}/testUsername',
        'oldroute'    => '/portal/{contactId}/testUsername',
        'class'       => ContactsPortalController::class,
        'function'    => 'checkUsernameExistance',
        'description' => 'Checks if a potential user name already exists (except the concerning user).',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true ],
        'parameters'  => [
            'username'        => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
                'description' => 'The user name to check for.',
            ],
            'id' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'required'    => true,
                'description' => 'GUID of the Contact.',
            ]
        ]
    ],
];

/**
 * Register the API Extension
 */
RESTManager::getInstance()->registerExtension('portal', '2.0', [], $routes);
