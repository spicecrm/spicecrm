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
use SpiceCRM\modules\SpiceACLProfiles\KREST\controllers\SpiceACLProfilesController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('aclmanager', '1.0');


$routes = [

    [
        'method'      => 'get',
        'route'       => '/spiceaclprofiles/foruser/{userrid}',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'spiceAclProfilesForUser',
        'description' => 'Get SpiceACL Profiles for user',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceaclprofiles/{id}/activate',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'spiceAclProfilesActivate',
        'description' => 'SpiceACL Profile Activate',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceaclprofiles/{id}/deactivate',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'spiceAclProfilesDeactivate',
        'description' => 'SpiceACL Profile Deactivate',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/spiceaclprofiles/{id}/aclobjects',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'spiceAclProfilesObjects',
        'description' => 'SpiceACL Profile Objects',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceaclprofiles/{id}/aclobjects/{objectid}',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'spiceAclProfilesObject',
        'description' => 'SpiceACL Profile Object',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'delete',
        'route'       => '/spiceaclprofiles/{id}/aclobjects/{objectid}',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'spiceAclProfilesObjectDelete',
        'description' => 'SpiceACL Profile Object Delete',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/spiceaclprofiles/{id}/aclusers',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'spiceAclProfilesUsers',
        'description' => 'SpiceACL Profile Users',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceaclprofiles/{id}/aclusers',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'spiceAclAddProfilesUsers',
        'description' => 'SpiceACL Add Profile Users',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'post',
        'route'       => '/spiceaclprofiles/{id}/aclusers/{userid}',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'spiceAclAddProfilesUser',
        'description' => 'SpiceACL Add Profile User',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],
    [
        'method'      => 'delete',
        'route'       => '/spiceaclprofiles/{id}/aclusers/{userid}',
        'class'       => SpiceACLProfilesController::class,
        'function'    => 'spiceAclDeleteProfilesUser',
        'description' => 'SpiceACL Delete Profile User',
        'options'     => ['noAuth' => false, 'adminOnly' => true],
    ],

];

$RESTManager->registerRoutes($routes);
