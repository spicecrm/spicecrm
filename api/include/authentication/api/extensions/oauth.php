<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\authentication\api\controllers\OAuthController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();
$config      = SpiceConfig::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/authentication/oauth',
        'class'       => OAuthController::class,
        'function'    => 'handleOAuthRedirect',
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
];

/**
 * register the Extension
 */
$RESTManager->registerExtension(
    'oauth',
    '1.0',
    [
        'server_url'     => $config['oauth']['server_url'],
        'authorize_path' => $config['oauth']['authorize_path'],
        'token_path'     => $config['oauth']['token_path'],
        'profile_path'   => $config['oauth']['profile_path'],
        'client_id'      => $config['oauth']['client_id'],
    ],
    $routes
);