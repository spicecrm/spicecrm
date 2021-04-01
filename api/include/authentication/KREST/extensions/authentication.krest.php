<?php

/*
 * This File is part of KREST is a Restful service extension for SugarCRM
 * 
 * Copyright (C) 2015 AAC SERVICES K.S., DOSTOJEVSKÉHO RAD 5, 811 09 BRATISLAVA, SLOVAKIA
 * 
 * you can contat us at info@spicecrm.io
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */

use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\UserAuthenticate\UserAuthenticate;
use SpiceCRM\includes\authentication\KREST\controllers\AuthenticationKRESTController;

$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'post',
        'route'       => '/passwordtoken/token/{token}',
        'class'       => AuthenticationKRESTController::class,
        'function'    => 'AuthResetPasswordByToken',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/passwordtoken/email/{emailAddress}',
        'class'       => AuthenticationKRESTController::class,
        'function'    => 'AuthSendTokenToUser',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/changepassword',
        'class'       => AuthenticationKRESTController::class,
        'function'    => 'AuthChangePassword',
        'description' => '',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/acl',
        'class'       => AuthenticationKRESTController::class,
        'function'    => 'AuthGetModuleACL',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Users/{id}/password/reset',
        'class'       => AuthenticationKRESTController::class,
        'function'    => 'AuthSetNewPassword',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/user/preferencesformats',
        'class'       => AuthenticationKRESTController::class,
        'function'    => 'AuthGetFormat',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
];

$RESTManager->registerExtension('userpassword', '2.0', [
        'oneupper' => SpiceConfig::getInstance()->config['passwordsetting']['oneupper'],
        'onelower' => SpiceConfig::getInstance()->config['passwordsetting']['onelower'],
        'onenumber' => SpiceConfig::getInstance()->config['passwordsetting']['onenumber'],
        'minpwdlength' => SpiceConfig::getInstance()->config['passwordsetting']['minpwdlength'],
        'regex' => '^' . UserAuthenticate::getPwdCheckRegex() . '$'
    ],
    $routes
);
