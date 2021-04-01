<?php
namespace SpiceCRM\modules\Mailboxes\KREST\controllers;

use Exception;
use SpiceCRM\data\BeanFactory;
use DateTime;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\modules\Emails\Email;

class MailgunController
{
    public function handleIncomingEmails($req, $res, $args) {
        $body = $req->getParsedBody();

        $email =  BeanFactory::getBean('Emails');
        $mailbox = BeanFactory::getBean('Mailboxes', $args['mailboxid']);

        if ($mailbox) {
            $email->mailbox_id = $mailbox->id;
            $email->message_id = $body['Message-Id'];
            $email->name       = $body['subject'];
            $dateSent          = new DateTime($body['Date']);
            $email->date_sent  = $dateSent->format('Y-m-d H:i:s');
            $email->from_addr  = $body['sender'];
            $toRecipients      = [];
            $toRecipients[]    = $body['To'];
            // todo check the structure for multiple recipients
//            foreach ($body['To'] as $toRecipient) {
//                $toRecipients[] = $toRecipient;
//            }
//            $email->to_addrs   = implode(';', $toRecipients);

            // todo
//            $ccRecipients      = [];
//            foreach ($body['Cc'] as $ccRecipient) {
//                $ccRecipients[] = $ccRecipient
//            }
//            $email->cc_addrs   = implode(';', $ccRecipients);
            $email->type       = Email::TYPE_INBOUND;
            $email->status     = Email::STATUS_UNREAD;
            $email->openness   = Email::OPENNESS_OPEN;
            $email->body       = $body['body-html'] ?? $body['body-plain'];

            try {
                $email->save();
            } catch (Exception $e) {
                LoggerManager::getLogger()->error('Could not save email: ' . $email->name);
                return;
            }

            $this->handleAttachments($email, $body);

            $email->processEmail();
        }
    }

    private function handleAttachments(Email $email, $incomingMessage) {

    }
}
