<?php
require_once 'modules/Mailboxes/MailboxesRESTHandler.php';
$handler = new \SpiceCRM\modules\Mailboxes\MailboxesRESTHandler();
$KRESTManager->registerExtension('mailboxes', '1.0');

$app->group('/mailboxes', function () use ($app, $handler) {
    $app->get('/test', function($req, $res, $args) use ($app, $handler) {
        $result = $handler->testConnection($req->getQueryParams());
        echo json_encode($result);
    });

    $app->post('/sendmail', function($req, $res, $args) use ($app, $handler) {
        $result = $handler->sendMail($req->getParsedBody(), $req->getUploadedFiles());
        echo json_encode($result);
    });

    $app->get('/getmailboxes', function($req, $res, $args) use ($app, $handler) {
        $result = $handler->getMailboxes();
        echo json_encode($result);
    });

    $app->group('/imap', function () use ($app, $handler) {
        $app->get('/getmailboxfolders', function($req, $res, $args) use ($app, $handler) {
            $result = $handler->getMailboxFolders($req->getQueryParams());
            echo json_encode($result);
        });
        $app->get('/fetchemails', function($req, $res, $args) use ($app, $handler) {
            $result = $handler->fetchEmails($req->getQueryParams());
            echo json_encode($result);
        });
    });
});
