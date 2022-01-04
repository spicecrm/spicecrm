<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\RESTManager;
use SpiceCRM\modules\Mailboxes\api\controllers\ImapController;

/**
 * get a Rest Manager Instance
 */
$RESTManager = RESTManager::getInstance();

/**
 * register the Extension
 */
$RESTManager->registerExtension('imap', '1.0');

$routes = [
    [
        'method'      => 'post',
        'route'       => '/module/Mailboxes/imap/folders',
        'oldroute'    => '/mailboxes/imap/getmailboxfolders',
        'class'       => ImapController::class,
        'function'    => 'getMailboxFolders',
        'description' => '',
        'options'     => ['noAuth' => false, 'adminOnly' => false],
    ],
];

$RESTManager->registerRoutes($routes);

