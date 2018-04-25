<?php
namespace SpiceCRM\modules\Mailboxes;

use Mailbox;
use SpiceCRM\modules\Mailboxes\Attachment;
use SpiceCRM\modules\Mailboxes\IMAPStructure;

require_once 'modules/Mailboxes/SMTPHandler.php';
require_once 'modules/Mailboxes/IMAPStructure.php';
require_once 'modules/Mailboxes/Attachment.php';

/**
 * Class IMAPHandler
 *
 * Handles retrieving emails via the IMAP Protocol
 */
class IMAPHandler
{
    private $db;
    private $mailbox;
    private $message_ids = [];

    const TYPE_TEXT        = 0;
    const TYPE_MULTIPART   = 1;
    const TYPE_MESSAGE     = 2;
    const TYPE_APPLICATION = 3;
    const TYPE_AUDIO       = 4;
    const TYPE_IMAGE       = 5;
    const TYPE_VIDEO       = 6;
    const TYPE_OTHER       = 7;

    const ENC_7BIT             = 0;
    const ENC_8BIT             = 1;
    const ENC_BINARY           = 2;
    const ENC_BASE64           = 3;
    const ENC_QUOTED_PRINTABLE = 4;

    function __construct(Mailbox $mailbox)
    {
        require_once(__DIR__ . '/../../vendor/autoload.php');

        global $db;
        $this->db = $db;

        $this->mailbox = $mailbox;
    }

    /**
     * getRef
     *
     * Concatenates mailbox info into a connection string
     *
     * @return string
     */
    private function getRef()
    {
        $ref = '{' . $this->mailbox->imap_pop3_host . ":" . $this->mailbox->imap_pop3_port . '/' . $this->mailbox->imap_pop3_protocol_type;
        if ($this->mailbox->imap_pop3_encryption == 'ssl_enable') {
            $ref .= '/ssl/novalidate-cert';
        }
        $ref .= '}';


        return $ref;
    }

    /**
     * getImapStream
     *
     * Gets IMAP connection stream
     *
     * @return resource
     */
    private function getImapStream()
    {
        $stream = imap_open(
            $this->getRef() . "INBOX",
            $this->mailbox->imap_pop3_username,
            $this->mailbox->imap_pop3_password
        );

        return $stream;
    }

    /**
     * testConnection
     *
     * Tests connection to the IMAP server
     *
     * @return mixed
     */
    public function testConnection()
    {
        $this->getImapStream();

        $response['imap']['errors'] = imap_errors();

        if ($response['imap']['errors']) {
            $response['imap']['result'] = false;
        } else {
            $response['imap']['result'] = true;

            $smtp_handler = new SMTPHandler($this->mailbox);
            $response['smtp'] = $smtp_handler->testConnection();
        }

        return $response;
    }

    /**
     * getMailboxes
     *
     * Returns the mailbox folders
     *
     * @return array
     */
    public function getMailboxes()
    {
        $mailboxes = imap_getmailboxes($this->getImapStream(), $this->getRef(), '*');

        return [
            'result'    => true,
            'mailboxes' => $this->getMailboxNames($mailboxes),
        ];
    }

    /**
     * getMailboxNames
     *
     * Extracts the actual folder names
     * Changes character encoding to UTF-8
     *
     * @param array $mailboxes
     * @return array
     */
    private function getMailboxNames(array $mailboxes)
    {
        $names = [];

        foreach ($mailboxes as $mailbox) {
            array_push($names, mb_convert_encoding(substr($mailbox->name, strpos($mailbox->name, '}') + 1), "UTF8", "UTF7-IMAP"));
        }

        return $names;
    }

    /**
     * fetchEmails
     *
     * Fetches Emails and saves them in the internal DB
     * It also fetches the attachments
     *
     * @return integer
     */
    public function fetchEmails()
    {
        $stream = $this->getImapStream();
        $this->initMessageIDs();

        if ($this->mailbox->last_message) {
            $items = imap_search($stream, 'UID ' . $this->mailbox->last_message . ':*', SE_UID);
        } else {
            $items = imap_search($stream, 'ALL');
        }


        rsort($items);

        $new_mail_count = 0;

        foreach ($items as $item) {

            $email     = \BeanFactory::getBean('Emails');
            $overview  = imap_fetch_overview($stream, $item);
            $header    = imap_headerinfo($stream, $item);

            if ($this->emailExists($overview[0]->message_id)) {
                continue;
            }

            $email->mailbox_id = $this->mailbox->id;
            $email->message_id = $overview[0]->message_id;
            $email->name       = imap_mime_header_decode($overview[0]->subject)[0]->text;
            $email->date_sent  = date('Y-m-d H:i:s', strtotime($overview[0]->date));
            $email->from_addr  = imap_mime_header_decode($overview[0]->from)[0]->text . imap_mime_header_decode($overview[0]->from)[1]->text;
            $email->to_addrs   = imap_mime_header_decode($overview[0]->to)[0]->text; // todo multiple addresses
            $email->cc_addrs   = $header->ccaddress;
            $email->bcc_addrs  = $header->bccaddress;

            $structure = new IMAPStructure($stream, $item);
            $structure->parseStructure();

            $email->body = $structure->getEmailBody();
            $email->save();

            foreach ($structure->getAttachments() as $attachment) {
                \SpiceAttachments::saveEmailAttachment('Emails', $email->id, $attachment);
            }

            ++$new_mail_count;
        }

        imap_close($stream);

        return ['new_mail_count' => $new_mail_count];
    }

    /**
     * emailExists
     *
     * Checks if an email with the given message ID already exists in the database
     *
     * @param $message_id
     * @return bool
     */
    private function emailExists($message_id)
    {
        if (in_array($message_id, $this->message_ids)) {
            return true;
        }
        return false;
    }

    /**
     * initMessageIDs
     *
     * Initializes an array containing the already existing message_ids
     *
     * @return void
     */
    private function initMessageIDs()
    {
        foreach (\BeanFactory::getBean('Emails')->get_full_list() as $bean) {
            array_push($this->message_ids, $bean->message_id);
        }
    }
}
