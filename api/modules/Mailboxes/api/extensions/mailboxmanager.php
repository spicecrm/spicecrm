<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Mailboxes\api\controllers\MailboxManagerController;
use Slim\Routing\RouteCollectorProxy;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('mailboxmanager', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/Mailboxes/test',
        'oldroute'    => '/mailboxes/test',
        'class'       => MailboxManagerController::class,
        'function'    => 'testConnection',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'test_email' => [
                'in'          => 'body',
                'required'    => false,
                'description' => 'Email address that will receive the test message.',
                'type'        => ValidationMiddleware::TYPE_STRING,
            ],
            'data' => [
                'in'          => 'body',
                'required'    => true,
                'description' => 'Mailbox model from the frontend',
                'type'        => ValidationMiddleware::TYPE_COMPLEX,
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Mailboxes/transports',
        'oldroute'    => '/mailboxes/transports',
        'class'       => MailboxManagerController::class,
        'function'    => 'getMailboxTransports',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Mailboxes/processors',
        'oldroute'    => '/mailboxes/getmailboxprocessors',
        'class'       => MailboxManagerController::class,
        'function'    => 'getMailboxProcessors',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Mailboxes/scope',
        'oldroute'    => '/mailboxes/getmailboxes',
        'class'       => MailboxManagerController::class,
        'function'    => 'getMailboxes',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'scope' => [
                'in'          => 'query',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'description' => 'Mailbox type',
                'options'     => [
                    'inbound', 'outbound', 'outboundsingle', 'outboundmass', 'inbound_sms', 'outboundsms',
                    'outboundsingle_sms', 'outboundmass_sms',
                ],
            ],
        ],
    ],
    [
        'method'      => 'post',
        'route'       => '/module/Mailboxes/default',
        'oldroute'    => '/mailboxes/setdefaultmailbox',
        'class'       => MailboxManagerController::class,
        'function'    => 'setDefaultMailbox',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'mailbox_id' => [
                'in'          => 'body',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'ID of the mailbox',
                'required'    => true,
            ],
        ],
    ],
];

$RESTManager->registerRoutes($routes);

