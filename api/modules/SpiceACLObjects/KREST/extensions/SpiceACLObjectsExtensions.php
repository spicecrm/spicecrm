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
use SpiceCRM\modules\SpiceACLObjects\KREST\controllers\SpiceACLObjectsController;

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
        'route'       => '/spiceaclobjects',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'spiceAclObjects',
        'description' => 'Get Spice Auth Object',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceaclobjects/createdefaultobjects',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'createDefaultObjects',
        'description' => 'Create default objects',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/spiceaclobjects/authtypes',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'authTypes',
        'description' => 'Get Auth Types',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'delete',
        'route'       => '/spiceaclobjects/authtypes/{id}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'deleteAuthType',
        'description' => 'Delete Auth Type',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/spiceaclobjects/authtypes/{id}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'getAuthType',
        'description' => 'Get Auth Type',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceaclobjects/authtypes/{id}/authtypefields/{field}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'createAuthTypeField',
        'description' => 'Create Auth Type Field',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'delete',
        'route'       => '/spiceaclobjects/authtypes/{id}/authtypefields/{fieldid}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'deleteAuthTypeField',
        'description' => 'Delete Auth Type Field',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/spiceaclobjects/authtypes/{id}/authtypeactions',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'getAuthTypeAction',
        'description' => 'Get Auth Type Action',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceaclobjects/authtypes/{id}/authtypeactions/{action}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'createAuthTypeAction',
        'description' => 'Create Auth Type Action',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'delete',
        'route'       => '/spiceaclobjects/authtypes/{id}/authtypeactions/{actionid}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'deleteAuthTypeAction',
        'description' => 'Delete Auth Type Action',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceaclobjects/activation/{id}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'activate',
        'description' => 'Activate',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'delete',
        'route'       => '/spiceaclobjects/activation/{id}',
        'class'       => SpiceACLObjectsController::class,
        'function'    => 'deleteActivation',
        'description' => 'Delete Activacion',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
];

$RESTManager->registerRoutes($routes);
