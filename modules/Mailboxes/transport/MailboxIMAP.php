<?php
/**
 * Created by PhpStorm.
 * User: Patrik
 * Date: 07-Mar-18
 * Time: 13:41
 */

class MailboxIMAP
{
    function request_emails($mailbox_id)
    {
        $host = $_GET["smtp_host"];
        $port = $_GET["smtp_port"];
        $username = $_GET["smtp_username"];
        $password = $_GET["smtp_password"];

        $host = "imap.gmail.com";
        $port = "993";
        $address = '{' . $host . ':' . $port . '/imap/ssl}INBOX';
        $username = "chynoranskypatrik@gmail.com";
        $password = "***";

        $mailbox = imap_open($address, $username, $password) or die('Cannot connect to Gmail: ' . imap_last_error());
        $emails = imap_search($mailbox, 'SINCE 04-Apr-2018');

        if ($emails) {
            rsort($emails);
            foreach ($emails as $email_number) {
                $message = imap_body($mailbox, $email_number);
                $this->process_email($message, $mailbox_id);
            }
        }
        imap_close($mailbox);
    }

    function process_email($body, $mailbox_id)
    {
        $email = new Email();
        $email->body = $body;
        $email->mailbox_id = $mailbox_id;
        $email->save();
    }
}