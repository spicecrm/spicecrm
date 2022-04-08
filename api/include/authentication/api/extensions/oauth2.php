<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\authentication\api\controllers\OAuth2Controller;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();
$config      = SpiceConfig::getInstance()->config;

$routes = [
    [
        'method'      => 'get',
        'route'       => '/authentication/oauth2/profile',
        'class'       => OAuth2Controller::class,
        'function'    => 'getUserProfile',
        'description' => 'This is the route used as the redirect URL for OAuth',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
        'parameters'  => [
            'state' => [
                'in'          => 'query',
                'description' => 'This is the value passed on from the login page. It should contain the session ID',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
            ],
            'code'  => [
                'in'          => 'query',
                'description' => 'Authorization code that needs to be exchanged for the access token.',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
            ],
        ]
    ],
    [
        'method'      => 'post',
        'route'       => '/authentication/oauth2/accessToken',
        'class'       => OAuth2Controller::class,
        'function'    => 'getAccessToken',
        'description' => 'request access token based on auth code',
        'options'     => ['noAuth' => true, 'adminOnly' => false],
        'parameters'  => [
            'issuer' => [
                'in'          => 'body',
                'description' => '',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => false,
            ],
            'code'  => [
                'in'          => 'body',
                'description' => 'Authorization code that needs to be exchanged for the access token.',
                'type'        => ValidationMiddleware::TYPE_STRING,
                'required'    => true,
            ],
        ]
    ],
];

try {
    $services = AuthenticationController::loadServices();
} catch (Exception $e) {
    $services = [];
}

/**
 * register the Extension
 */
$RESTManager->registerExtension(
    'oauth2',
    '1.0',
    $services,
    $routes
);