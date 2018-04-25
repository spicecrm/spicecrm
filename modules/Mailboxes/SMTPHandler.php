<?php
namespace SpiceCRM\modules\Mailboxes;

/**
 * Class SMTPHandler
 *
 * Handles sending emails via SMTP Protocol
 */
class SMTPHandler
{
    private $db;
    private $mailbox;
    private $transport;
    private $mailer;

    function __construct(\Mailbox $mailbox)
    {
        require_once(__DIR__ . '/../../vendor/autoload.php');

        global $db;
        $this->db = $db;

        $this->mailbox = $mailbox;

        //initialize transport
        $this->transport = (new \Swift_SmtpTransport(
            $this->mailbox->smtp_host,
            $this->mailbox->smtp_port,
            ($this->mailbox->smtp_encryption == 'none') ? null : $this->mailbox->smtp_encryption
        ))
            ->setUsername($this->mailbox->imap_pop3_username)
            ->setPassword($this->mailbox->imap_pop3_password)
            ->setStreamOptions([
                'verify_peer'       => $this->mailbox->smtp_verify_peer,
                'verify_peer_name'  => $this->mailbox->smtp_verify_peer_name,
                'allow_self_signed' => $this->mailbox->smtp_allow_self_signed,
            ])
        ;

        // initialize mailer
        $this->mailer = new \Swift_Mailer($this->transport);
    }

    /**
     * testConnection
     *
     * Tests connection to the SMTP server by sending a dummy email
     *
     * @return mixed
     */
    public function testConnection()
    {
        try {
            $this->mailer->getTransport()->start();

            $test_message = (new \Swift_Message('Testing SMTP Connection'))
                ->setFrom([$this->mailbox->imap_pop3_username])
                ->setTo(['test@example.org'])
                ->setBody('Lorem ipsum dolor sit amet')
            ;

            $response['errors'] = $this->mailer->send($test_message);
            $response['result'] = true;
        } catch (\Swift_TransportException $e) {
            $response['errors'] = $e->getMessage();
            $response['result'] = false;
        } catch (Exception $e) {
            $response['errors'] = $e->getMessage();
            $response['result'] = false;
        }

        return $response;
    }

    /**
     * sendMail
     *
     * Sends email
     *
     * @param $email_payload
     * @return int
     */
    public function sendMail(\Email $email_payload)
    {
        $message = (new \Swift_Message($email_payload->name))
            ->setFrom([$this->mailbox->imap_pop3_username])
            ->setTo([$email_payload->to_addrs])
            ->setBody($email_payload->body)
        ;

        if (!empty($email_payload->cc_addrs)) {
            $message->setCc([$email_payload->cc_addrs]);
        }

        if (!empty($email_payload->bcc_addrs)) {
            $message->setBcc([$email_payload->bcc_addrs]);
        }

        // todo deal with attachments
        /*foreach (\SpiceAttachments::getAttachmentsForBean('Emails', $email_payload->id) as $attachment) {
            $message->attach(
                \Swift_Attachment::fromPath($attachment->file)->setFilename($attachment->filename)
            );
        }*/

        $result = $this->mailer->send($message);

        return $result;
    }
}