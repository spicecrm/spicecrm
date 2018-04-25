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

//session_start();

error_reporting(1);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

// set error reporting to E_ERROR
//ini_set('error_reporting', 'E_ERROR');
//ini_set("display_errors", "off");
// header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header('Content-Type: application/json');
// initialize SLIM Framework
require_once dirname(__FILE__).'/../vendor/autoload.php';
require_once dirname(__FILE__).'/../vendor/slim/slim/Slim/App.php';

$GLOBALS['isREST'] = true;

/**
 * SETTINGs
 */
$config = [
    'displayErrorDetails' => true,
    'determineRouteBeforeAppMiddleware' => true,
    /*'logger' => [
        'name' => 'slim-app',
        //'level' => Monolog\Logger::DEBUG,
        'path' => __DIR__ . '/app.log',
    ],*/
];
$app = new \Slim\App(['settings' => $config]);

/*
 * ERROR HANDLING
 * each thrown Exception is catched here and is available in $exception
 */

$c = $app->getContainer();

// Error handlers

$c['phpErrorHandler'] = function( $container ) {
    return function( $request, $response, $exception ) use( $container ) {
        $GLOBALS['log']->fatal( $exception->getMessage() . ' in ' . $exception->getFile() . ':' . $exception->getLine() );
        if ( !isset( $GLOBALS['sugar_config']['developerMode'] ) or !$GLOBALS['sugar_config']['developerMode'] ) {
            $responseData['error'] = ['message' => 'Application Error.'];
        } else {
            $responseData['error'] = [
                'message' => $exception->getMessage(),
                'line' => $exception->getLine(),
                'file' => $exception->getFile(),
                'trace' => $exception->getTrace()
            ];
        }
        return $container['response']->withJson( $responseData, 500 );
    };
};

# errorHandler is for PHP < 7
$c['errorHandler'] = function( $container ) {
    return function( $request, $response, $exceptionMessage ) use ( $container ) {
        $GLOBALS['log']->fatal( $exceptionMessage );
        if ( !isset( $GLOBALS['sugar_config']['developerMode'] ) or !$GLOBALS['sugar_config']['developerMode'] ) {
            $responseData['error'] = ['message' => 'Application Error.'];
        } else {
            $responseData['error'] = ['message' => $exceptionMessage ];
        }
        return $container['response']->withJson( $responseData, 500 );
    };
};

$c['krestErrorHandler'] = function( $container ) {
    return function( $request, $response, $exception ) use( $container ) {
        if ( is_object( $exception )) {
            if ( $exception->isFatal() ) $GLOBALS['log']->fatal( $exception->getMessage() . ' in ' . $exception->getFile() . ':' . $exception->getLine() );
            $responseData = [ 'error' => $exception->getResponseData() ];
            $httpCode = $exception->getHttpCode();
        } else {
            $responseData = [ 'error' => $exception ];
            $httpCode = 500;
        }
        return $container['response']->withJson( $responseData, $httpCode );
    };
};

$c['notFoundHandler'] = function ( $container ) {
    return function( $request, $response ) use( $container ) {
        $exception = new KREST\NotFoundException();
        $responseData = ['error' => $exception->getResponseData() ];
        return $container['response']->withJson( $responseData, $exception->getHttpCode());
    };
};

$c['notAllowedHandler'] = function( $container ) {
    return function ( $request, $response, $allowedMethods ) use( $container ) {
        $responseData['error'] = [ 'message' => 'Method not allowed.', 'errorCode' => 'notAllowed', 'methodsAllowed' => implode(', ', $allowedMethods), 'httpCode' => 405 ];
        return $container['response']
            ->withHeader('Allow', implode(', ', $allowedMethods )) # todo: header not appears in browser (response)
            ->withJson( $responseData, 405 );
    };
};

/**
 * MIDDLEWARE / KREST Logger
 */
$mw = function ($request, $response, $next)
{
    global $db, $current_user;
    $starting_time = microtime(true);

    $route = $request->getAttribute('route');
    $log = (object) [];
    // if no route was found... $route = null
    if($route)
    {
        $log->route = $route->getPattern();
        $log->method = $route->getMethods()[0];
        $log->args = json_encode($route->getArguments());
    }

    $log->url = (string) $request->getUri();    // will be converted to the complete url when be used in text context, therefore it is cast to a string...

    $log->ip = $request->getServerParam('REMOTE_ADDR');
    $log->get_params = json_encode($_GET);
    $log->post_params = $request->getBody()->getContents();
    $log->requested_at = date('Y-m-d H:i:s');
    // $current_user is an empty beansobject if the current route doesn't need any authentication...
    $log->user_id = $current_user->id;
    // and session is also missing!
    $log->session_id = session_id();
    //var_dump($request->getParsedBody(), $request->getParams());

    // check if this request has to be logged by some rules...
    $sql = "SELECT 1 FROM syskrestlogconfig WHERE 
              (route = '{$log->route}' OR route = '*') AND
              (method = '{$log->method}' OR method = '*') AND
              (user_id = '{$log->user_id}' OR user_id = '*') AND
              (ip = '{$log->ip}' OR ip = '*') AND
              is_active = 1
              LIMIT 1";
    $res = $db->query($sql);
    if( $res->num_rows > 0 ) {
        $logging = true;
        // write the log...
        $log->id = null;
        $id = $db->insertQuery('syskrestlog', (array) $log);
        $log->id = $id;

        ob_start();
    }
    else
        $logging = false;


    // do the magic...
    $response = $next($request, $response);

    if( $logging )
    {
        $log->http_status_code = $response->getStatusCode();
        $log->runtime = (microtime(true) - $starting_time)*1000;
        $log->response = $db->quote(ob_get_contents());
        ob_end_flush();
        //var_dump($log);
        // update the log...
        $result = $db->updateQuery('syskrestlog', ['id' => $log->id], (array) $log);
        //var_dump($result, $db->last_error);
    }
    return $response;
};

$app->add($mw);

require_once 'handlers/exceptionClasses.php';

$app->add( function( $request, $response, $next ) {
    try {
        $response = $next( $request, $response );
    }
    catch( KREST\Exception $e ) {
        $handler = $this->get('krestErrorHandler');
        return $handler( $request, $response, $e );
    }
    catch( Exception $e ) {
        $handler = $this->get('krestErrorHandler');
        return $handler( $request, $response, $e );
    }
    return $response;
});

$app->mode = 'production';
chdir(dirname(__FILE__) . '/../');
define('sugarEntry', 'SLIM');

// disrgeard a sessionid sent via cookie
// unset($_COOKIE['PHPSESSID']);

// initialize the Rest Manager
require 'KREST/KRESTManager.php';
$KRESTManager = new KRESTManager($app, $_GET);


// set a global transaction id
$GLOBALS['transactionID'] = create_guid();

// check if we have extension in the local path
$checkRootPaths= ['include', 'modules', 'custom/modules'];
foreach($checkRootPaths as $checkRootPath) {
    $KRestDirHandle = opendir("./$checkRootPath");
    if ($KRestDirHandle) {
        while (($KRestNextDir = readdir($KRestDirHandle)) !== false) {
            if ($KRestNextDir != '.' && $KRestNextDir != '..' && is_dir("./$checkRootPath/$KRestNextDir") && file_exists("./$checkRootPath/$KRestNextDir/KREST/extensions")) {
                $KRestSubDirHandle = opendir("./$checkRootPath/$KRestNextDir/KREST/extensions");
                if ($KRestSubDirHandle) {
                    while (false !== ($KRestNextFile = readdir($KRestSubDirHandle))) {
                        if (preg_match('/.php$/', $KRestNextFile)) {
                            require_once("./$checkRootPath/$KRestNextDir/KREST/extensions/$KRestNextFile");
                        }
                    }
                }
            }
        }
    }
}

$KRestDirHandle = opendir('./custom/KREST/extensions');
if ($KRestDirHandle) {
    while (false !== ($KRestNextFile = readdir($KRestDirHandle))) {
        if (preg_match('/.php$/', $KRestNextFile)) {
            require_once('./custom/KREST/extensions/' . $KRestNextFile);
        }
    }
}

$KRestDirHandle = opendir('./KREST/extensions');
while (false !== ($KRestNextFile = readdir($KRestDirHandle))) {
    $statusInclude = 'NOP';
    if (preg_match('/.php$/', $KRestNextFile)) {
        $statusInclude = 'included';
        require_once('./KREST/extensions/' . $KRestNextFile);
    }
}

// authenticate
$KRESTManager->authenticate();

// specific handler for the files
$KRESTManager->getProxyFiles();

// SpiceCRM Deployment Maintenance Windows Check
if(file_exists("modules/KDeploymentMWs/KDeploymentMW.php")) {
    global $db, $timedate;
    $date = new DateTime('now', new DateTimeZone('UTC'));
    $res = $db->query("SELECT * FROM kdeploymentmws WHERE deleted = 0 AND from_date <= '" . date_format($date, $timedate->get_db_date_time_format()) . "' AND to_date > '" . date_format($date, $timedate->get_db_date_time_format()) . "'");
    while ($row = $db->fetchByAssoc($res)) {
        $logged_in_user = new User();
        $logged_in_user->retrieve($_SESSION['authenticated_user_id']);
        if ($row['disable_krest'] > 0 && !$logged_in_user->is_admin && !$KRESTManager->noAuthentication) {
            unset($_GET[session_name()]); //PHPSESSID
            session_destroy();
            $to_date = $timedate->fromDb($row['to_date']);
            $KRESTManager->authenticationError('System in Deployment Maintenance Window till ' . $timedate->asUser($to_date) . " !");
            exit;
        }
    }
}
// run the request
//$app->contentType('application/json');
$app->run();

// cleanup
$KRESTManager->cleanup();
?>