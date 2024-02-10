<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Users\api\controllers\UsersController;
use SpiceCRM\includes\authentication\api\controllers\LoginController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'post',
        'oldroute'    => '/login',
        'route'       => '/authentication/login',
        'class'       => LoginController::class,
        'function'    => 'getCurrentUserData',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => []
    ],
    [
        'method'      => 'get',
        'oldroute'    => '/login',
        'route'       => '/authentication/login',
        'class'       => LoginController::class,
        'function'    => 'getCurrentUserData',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => [
            'impersonationuser'       => [
                'in'          => 'query',
                'description' => 'the user that is requesting the login impersonated as an other user',
                'type'        => ValidationMiddleware::TYPE_STRING
            ]
        ]
    ],
    [
        'method'      => 'delete',
        'oldroute'    => '/login',
        'route'       => '/authentication/login',
        'class'       => LoginController::class,
        'function'    => 'loginDelete',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
        'parameters'  => []
    ]
];

/**
 * build the 2fa settings
 */
$config = SpiceConfig::getInstance()->config['user_login_2fa'];
$auth2faConfig = [
    '2fa' => [
        'sms' => !empty($config['sms_mailbox_id']),
        'email' => !empty($config['email_mailbox_id']),
        'onlogin' => [
            'enforced' => $config['require_on'] ?: false,
            'method' => $config['method']
        ]
    ]
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('login', '1.0', $auth2faConfig, $routes);
