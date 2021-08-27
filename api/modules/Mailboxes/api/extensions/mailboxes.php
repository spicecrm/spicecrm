<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Mailboxes\api\controllers\MailboxesController;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

$routes = [
    [
        'method'      => 'get',
        'route'       => '/module/Mailboxes/{id}/fetchemails',
        'oldroute'    => '/modules/Mailboxes/{id}/fetchemails',
        'class'       => MailboxesController::class,
        'function'    => 'fetchEmails',
        'description' => 'Fetches the emails from the server into the mailbox.',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'id' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_GUID,
                'description' => 'Mailbox ID',
                'required'    => true,
            ],
        ],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Mailboxes/dashlet',
        'oldroute'    => '/modules/Mailboxes/dashlet',
        'class'       => MailboxesController::class,
        'function'    => 'getMailboxesForDashlet',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
    ],
    [
        'method'      => 'get',
        'route'       => '/module/Mailboxes/dashlet/{type}',
        'oldroute'    => '/modules/Mailboxes/dashlet/{type}',
        'class'       => MailboxesController::class,
        'function'    => 'getMailboxesForDashlet',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false, 'validate' => true],
        'parameters'  => [
            'type' => [
                'in'          => 'path',
                'type'        => ValidationMiddleware::TYPE_ENUM,
                'options'     => ['email', 'sms'],
                'required'    => true,
                'description' => 'Mailbox type email/text message',
            ],
        ],
    ],
];

/**
 * register the Extension
 */
$RESTManager->registerExtension('mailboxes', '1.0', [], $routes);
