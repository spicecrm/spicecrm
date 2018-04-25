<?php
namespace SpiceCRM\modules\Mailboxes;

require_once 'modules/Mailboxes/IMAPHandler.php';
require_once('include/SpiceAttachments/SpiceAttachments.php');

/**
 * Class MailboxesRESTHandler
 * Handles the REST requests for the mailbox module
 */
class MailboxesRESTHandler
{
    private $db;

    function __construct()
    {
        require_once(__DIR__ . '/../../vendor/autoload.php');

        global $db;
        $this->db = $db;
    }

    /**
     * testConnection
     *
     * Tests connection to mail servers
     *
     * @param array $params
     * @return array
     */
    public function testConnection(array $params)
    {
        $mailbox = \BeanFactory::getBean('Mailboxes', $params['mailbox_id']);

        switch ($mailbox->transport) {
            case 'imap':
                $imap_handler = new IMAPHandler($mailbox);
                $result = $imap_handler->testConnection();
                break;
            case 'mailgun': // todo implement mailgun testing
                break;
            case 'sendgrid': // todo implement sendgrid testing
                break;
        }

        return [
            'result' => $result,
        ];
    }

    /**
     * getMailboxFolders
     *
     * Returns the mailbox folders
     *
     * @param array $params
     * @return array
     */
    public function getMailboxFolders(array $params)
    {
        $mailbox = \BeanFactory::getBean('Mailboxes', $params['mailbox_id']);

        $imap_handler = new IMAPHandler($mailbox);
        $result = $imap_handler->getMailboxes();

        return $result;
    }

    /**
     * fetchEmails
     *
     * Fetches emails from a particulal mailbox
     *
     * @param array $params
     * @return array
     */
    public function fetchEmails(array $params)
    {
        $mailbox = \BeanFactory::getBean('Mailboxes', $params['mailbox_id']);

        $imap_handler = new IMAPHandler($mailbox);
        $result = $imap_handler->fetchEmails();

        return $result;
    }

    /**
     * sendMail
     *
     * Sends email
     *
     * @param array $params
     * @return boolean
     */
    public function sendMail(array $params, $files)
    {
        $email_payload = $this->extractEmailData($params, $files);

        /*$transport_handler = $this->getTransportHandler($mailbox);
        $result = $transport_handler->sendMail($email_payload);

        // todo make sure different transport handlers return uniform responses in sendMail
        if ($result) {
            // todo set Email bean as sent
        }*/

        return $result;
    }

    /**
     * getTransportHandler
     *
     * Gets the appropriate transport handler for the mailbox transport protocol/service
     *
     * @param Mailbox $mailbox
     * @return null|SMTPHandler
     */
    private function getTransportHandler(Mailbox $mailbox)
    {
        switch ($mailbox->transport) {
            case 'imap':
                $handler = new SMTPHandler($mailbox);
                break;
            case 'mailgun':
                //$handler = new MailgunHandler($mailbox);
                break;
            case 'sendgrid':
                //$handler = new SendgridHandler($mailbox);
                break;
            default:
                $handler = null;
        }

        return $handler;
    }

    /**
     * extractEmailData
     *
     * Extracts Email related data from the request body
     *
     * todo use the Email bean instead of an array
     *
     * @param array $params
     * @return array
     */
    private function extractEmailData(array $params, $files)
    {
        $email = \BeanFactory::getBean('Emails');

        $email->name       = $params['subject'];
        $email->to_addrs   = $params['to'];
        $email->body       = $params['body'];
        $email->cc_addrs   = $params['cc'];
        $email->bcc_addrs  = $params['bcc'];
        $email->mailbox_id = $params['mailbox_id'];

        $email->save();

        /*if (!empty($_FILES['attachments'])) {
            SpiceAttachments::saveAttachment('Emails', $email->id, 'attachments');
        }*/

        return $email;
    }

    /**
     * getMailboxes
     *
     * Gets all mailboxes that are allowed for outbound communication
     *
     * @return array
     */
    public function getMailboxes()
    {
        $result = [];
        $mailboxes = \BeanFactory::getBean('Mailboxes')
            ->get_full_list(
                'mailboxes.name',
                'outbound_comm="mass" OR outbound_comm="single"'
            )
        ;

        foreach ($mailboxes as $mailbox) {
            array_push($result,
                [
                    'value'=>$mailbox->id,
                    'display' => $mailbox->name . ' <' . $mailbox->imap_pop3_username . '>'
                ]
            );
        }

        return $result;
    }
}