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

require_once('KREST/handlers/user.php');

$KRESTUserHandler = new KRESTUserHandler($app);

$KRESTManager->registerExtension('user', '1.0');

$app->group('/user', function () use ($app, $KRESTUserHandler)
{
    $app->get('/acl', function () use ($app, $KRESTUserHandler) {
        echo json_encode($KRESTUserHandler->get_modules_acl());
    });

    $app->post('/password', function( $req, $res, $args ) use ($app, $KRESTUserHandler) {
        $postBody = $req->getParsedBody();
        echo json_encode( $KRESTUserHandler->set_password( $postBody ));
    });

    $app->get('/password/info', function ( $req, $res, $args ) use ($app, $KRESTUserHandler) {

        $response = array(
            'pwdCheck' => array(
                'regex' => '^'.KRESTUserHandler::getPwdCheckRegex().'$',
                'guideline' => KRESTUserHandler::getPwdGuideline( $req->getParam('lang'))
            )
        );

        echo json_encode( $response );

    });

    $app->group('/preferences', function () use ($app, $KRESTUserHandler)
    {
        $app->get('/{category}', function($request, $response, $args) use ($app, $KRESTUserHandler) {
            echo json_encode($KRESTUserHandler->get_user_preferences($args['category']));
        });
        $app->get('/{category}/{name}', function($request, $response, $args) use ($app, $KRESTUserHandler) {
            echo json_encode($KRESTUserHandler->get_user_preference($args['category'], $args['name']));
        });
        $app->post('/{category}', function($request, $response, $args) use ($app, $KRESTUserHandler) {
            $postBody = json_decode($request->getParsedBody(), true);
            echo json_encode($KRESTUserHandler->set_user_preferences($args['category'], $postBody));
        });
    });
});
