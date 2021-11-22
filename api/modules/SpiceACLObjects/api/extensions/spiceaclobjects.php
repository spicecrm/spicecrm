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
use SpiceCRM\modules\SpiceACLObjects\api\controllers\SpiceACLObjectsController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('spiceaclobjects', '1.0');


$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/SpiceACLObjects',
        'oldroute'    => '/spiceaclobjects',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'getSpiceACLObjects',
        'description' => 'Get Spice Auth Object by module or search term',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'moduleid' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of the module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => false
            ],
            'searchterm' => [
                'in' => 'query',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'a search term',
                'example' => '',
                'required' => false
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLObjects/defaultobjects',
        'oldroute'    => '/spiceaclobjects/createdefaultobjects',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'createDefaultObjects',
        'description' => 'Create default ACL objects',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'moduleid' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'a module id',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => false
            ],
            'modulename' => [
                'in' => 'body',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'a module name',
                'example' => 'Accounts',
                'required' => false
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceACLObjects/modules',
        'oldroute'    => '/spiceaclobjects/authtypes',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'getACLModules',
        'description' => 'get usage count of SpiceACLObjects for all modules under acl',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
//    [
//        'method'      => 'delete',
//        'route'       => '/spiceaclobjects/authtypes/{id}',
//        'class'       => SpiceACLObjectsController::class,
//        'function'    => 'deleteAuthType',
//        'description' => 'Delete Auth Type',
//        'options'     => ['noAuth' => false, 'adminOnly' => false],
//    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'getACLModule',
        'description' => 'get ACL module name, including fields and actions for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of module which is under acl',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}/fields/{field}',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}/authtypefields/{field}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'addACLModuleField',
        'description' => 'Create  field entry for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ],
            'field' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'field name',
                'example' => 'date_entered',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}/fields/{fieldid}',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}/authtypefields/{fieldid}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'deleteACLModuleField',
        'description' => 'Delete field entry for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ],
            'fieldid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of field',
                'example' => '37fdc731-3fa0-11eb-94d8-42010a9c008e',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'get',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}/actions',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}/authtypeactions',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'getACLModuleActions',
        'description' => 'Get Auth Type Action',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}/actions/{action}',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}/authtypeactions/{action}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'addACLModuleAction',
        'description' => 'Create ACL action for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ],
            'action' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_STRING,
                'description' => 'action itself',
                'example' => 'edit',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/SpiceACLObjects/modules/{moduleid}/actions/{actionid}',
        'oldroute'    => '/spiceaclobjects/authtypes/{id}/authtypeactions/{actionid}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'deleteACLModuleAction',
        'description' => 'Delete action for specified module',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'   => [
            'moduleid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL Module',
                'example' => '3f3b8d46-fa1f-49de-8b29-e04e4a183c99',
                'required' => true
            ],
            'actionid' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id of ACL Module action',
                'example' => '37e9c102-3fa0-11eb-94d8-42010a9c008e',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/module/SpiceACLObjects/{id}/activation',
        'oldroute'    => '/spiceaclobjects/activation/{id}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'activateObject',
        'description' => 'activate specified ACL Object',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'   => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id for ACL Object',
                'example' => '19c16e85-d253-4015-9cf5-5e4fa12ada50',
                'required' => true
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'route'       => '/module/SpiceACLObjects/{id}/activation',
        'oldroute'    => '/spiceaclobjects/activation/{id}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'deactivateObject',
        'description' => 'deactivate specified ACL Object',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
        'parameters'   => [
            'id' => [
                'in' => 'path',
                'type' => ValidationMiddleware::TYPE_GUID,
                'description' => 'id for ACL Object',
                'example' => '19c16e85-d253-4015-9cf5-5e4fa12ada50',
                'required' => true
            ]
        ]
    ],
];

$RESTManager->registerRoutes($routes);
