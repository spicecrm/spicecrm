<?php
namespace SpiceCRM\modules\Mailboxes\Handlers;

use Exception;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use Swift_Attachment;
use Swift_Mailer;
use Swift_Message;
use Swift_Mime_ContentEncoder_PlainContentEncoder;
use Swift_RfcComplianceException;
use Swift_SmtpTransport;
use Swift_TransportException;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\Mailboxes\Mailbox;

/**
 * Class ImapHandler
 */
class ImapHandler extends TransportHandler
{
    use SwiftInlineImagesTrait;

    private $transport;

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

    protected $incoming_settings = [
        'imap_pop3_protocol_type',
        'imap_pop3_host',
        'imap_pop3_port',
        'imap_pop3_encryption',
        'imap_pop3_username',
        'imap_pop3_password',
//        'shared_mailbox_auth_user',
//        'shared_mailbox_user',
//        'imap_delete_after_fetch',
    ];

    protected $outgoing_settings = [
        'smtp_host',
        'smtp_port',
        'smtp_encryption',
        'imap_pop3_username',
        'imap_pop3_password',
    ];

    /**
     * initTransportHandler
     *
     * Initializes the transport handler.
     *
     * @return void
     */
    protected function initTransportHandler()
    {
        if ($this->checkConfiguration($this->outgoing_settings)['result']) {
            //initialize transport
            $this->transport = (new Swift_SmtpTransport(
                $this->mailbox->smtp_host,
                $this->mailbox->smtp_port,
                ($this->mailbox->smtp_encryption == 'none') ? null : $this->mailbox->smtp_encryption
            ))
                ->setUsername($this->mailbox->imap_pop3_username)
                ->setPassword($this->mailbox->imap_pop3_password)
                ->setStreamOptions([$this->mailbox->smtp_encryption => [
                    'verify_peer' => $this->mailbox->smtp_verify_peer,
                    'verify_peer_name' => $this->mailbox->smtp_verify_peer_name,
                    'allow_self_signed' => $this->mailbox->smtp_allow_self_signed,
                ]]);

            // initialize mailer
            $this->transport_handler = new Swift_Mailer($this->transport);
        }
    }

    /**
     * testConnection
     *
     * Tests both the IMAP and SMTP connections
     *
     * @return mixed
     */
    public function testConnection($testEmail)
    {
        if ($this->mailbox->inbound_comm == 1) {
            $response['imap'] = $this->testImapConnection();
        }

        if ($this->mailbox->outbound_comm == 'single' || $this->mailbox->outbound_comm == 'mass') {
            $response['smtp'] = $this->testSmtpConnection($testEmail);
        }

        return $response;
    }

    /**
     * fetchEmails
     *
     * Fetches Emails and saves them in the internal DB
     * It also fetches the attachments
     *
     * @return array
     */
    public function fetchEmails(): array {
        $imap_status = $this->checkConfiguration($this->incoming_settings);
        if (!$imap_status['result']) {
            $this->log(Mailbox::LOG_DEBUG,
                $this->mailbox->name . ': No IMAP connection set up. Missing values for: '
                    . implode(', ', $imap_status['missing']));

            return [
                'result' => false,
                'errors' => 'No IMAP connection set up. Missing values for: '
                    . implode(', ', $imap_status['missing']),
            ];
        }

        $stream = $this->getImapStream($this->mailbox->imap_inbox_dir);

        $imapErrors = imap_errors();

        if ($imapErrors) {
            LoggerManager::getLogger()->error('IMAP connection failure: ' . implode(';', $imapErrors));
        }

        $this->initMessageIDs();

        if ($this->mailbox->last_checked != '') {
            if (isset(SpiceConfig::getInstance()->config['mailboxes']['delta_t'])) {
                $dateSince = date(
                    'd-M-Y',
                    strtotime(
                        '-' . (int) SpiceConfig::getInstance()->config['mailboxes']['delta_t'] . ' day',
                        strtotime($this->mailbox->last_checked)
                    )
                );
            } else {
                $dateSince = date('d-M-Y', strtotime($this->mailbox->last_checked));
            }

            $items = imap_search($stream, 'SINCE ' . $dateSince);
        } else {
            $items = imap_search($stream, 'ALL');
        }

        $this->log(Mailbox::LOG_DEBUG, count($items) . ' emails in mailbox since '
            . date('d-M-Y', strtotime($dateSince)));

        $new_mail_count = 0;
        $checked_mail_count = 0;

        if (is_array($items)) {
            foreach ($items as $item) {
                ++$checked_mail_count;
                $email = BeanFactory::getBean('Emails');
                $overview = imap_fetch_overview($stream, $item);
                $header = imap_headerinfo($stream, $item);

                if ($this->emailExists($overview[0]->message_id)) {
                    continue;
                }

                $email->mailbox_id = $this->mailbox->id;
                $email->message_id = $overview[0]->message_id;
                $email->name = $email->name = $this->parseSubject($overview[0]->subject);
                $email->date_sent = date('Y-m-d H:i:s', strtotime($overview[0]->date));
                $email->from_addr = $this->parseAddress($overview[0]->from);
                $email->to_addrs = $this->parseAddress($overview[0]->to); // todo multiple addresses
                if (isset($header->ccaddress)) {
                    $email->cc_addrs = $header->ccaddress;
                }
                if (isset($header->bccaddress)) {
                    $email->bcc_addrs = $header->bccaddress;
                }
                $email->type = Email::TYPE_INBOUND;
                $email->status = Email::STATUS_UNREAD;
                $email->openness = Email::OPENNESS_OPEN;

                $structure = new ImapStructure($stream, $item);
                $structure->parseStructure();

                $email->body = $structure->getEmailBody();
                try {
                    $email->save(false, true, false);
                } catch (Exception $e) {
                    LoggerManager::getLogger()->error('Could not save email: ' . $email->name);
                    continue;
                }


                foreach ($structure->getAttachments() as $attachment) {
                    SpiceAttachments::saveEmailAttachment('Emails', $email->id, $attachment);
                }

                $email->processEmail();

                if ($new_mail_count > 100) {
                    break;
                }

                $mailboxStatus = imap_mailboxmsginfo($stream);
                if (isset($this->mailbox->imap_delete_after_fetch) && $this->mailbox->imap_delete_after_fetch == true) {
                    imap_delete($stream, $item);
                }

                ++$new_mail_count;
            }

            $this->mailbox->last_checked = date('Y-m-d H:i:s');
            $this->mailbox->save();

            $mailboxStatus = imap_mailboxmsginfo($stream);

            if (isset($this->mailbox->imap_delete_after_fetch) && $this->mailbox->imap_delete_after_fetch == true) {
                imap_expunge($stream);
            }

            $mailboxStatus = imap_mailboxmsginfo($stream);
        }

        imap_close($stream);

        $this->log(Mailbox::LOG_DEBUG, $checked_mail_count . ' emails checked');
        $this->log(Mailbox::LOG_DEBUG, $new_mail_count . ' emails fetched');


        if (isset($this->mailbox->allow_external_delete) && $this->mailbox->allow_external_delete == true) {
            $this->fetchDeleted();
        }

        return ['new_mail_count' => $new_mail_count];
    }

    /**
     * fetchDeleted
     *
     * Fetches Emails from the trash folder and marks them as deleted in the database
     *
     * @return array
     */
    public function fetchDeleted() {
        $deleted_mail_count = 0;

        $stream = $this->getImapStream($this->mailbox->imap_trash_dir);

        $items = imap_search($stream, 'ALL');

        if (is_array($items) || is_object($items)) {
            foreach ($items as $item) {
                $overview = imap_fetch_overview($stream, $item);
                $email = BeanFactory::getBean('Emails')
                    ->get_full_list(
                        '',
                        'message_id= "' . $overview[0]->message_id . '"'
                    )[0];

                if (!$this->emailExists($overview[0]->message_id)) {
                    continue;
                }

                $email->mark_deleted($email->id);

                ++$deleted_mail_count;
            }
        }

        imap_close($stream);

        return ['deleted_mail_count' => $deleted_mail_count];
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
        $mailboxes = imap_getmailboxes($this->getImapStream(), $this->mailbox->getRef(), '*');

        // in case we had an error return false
        if(!$mailboxes){
            return [
                'result'    => false
            ];
        }

        // we have a list of mailboxes .. get the names
        return [
            'result'    => true,
            'mailboxes' => $this->getMailboxNames($mailboxes),
        ];
    }

    /**
     * getImapStream
     *
     * Gets IMAP connection stream
     *
     * @param string $folder
     * @return resource
     */
    private function getImapStream($folder = "INBOX") {
        $stream = imap_open(
            $this->mailbox->getRef() . $folder,
            $this->mailbox->imap_pop3_username,
            $this->mailbox->imap_pop3_password,
            null,
            1,
            ['DISABLE_AUTHENTICATOR' => 'GSSAPI']
        );

        return $stream;
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
            array_push(
                $names,
                mb_convert_encoding(
                    substr($mailbox->name, strpos($mailbox->name, '}') + 1),
                    "UTF8",
                    "UTF7-IMAP"
                )
            );
        }

        return $names;
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
        // Check if the Email exists in the current mailbox
        if (in_array($message_id, $this->message_ids)) {
            return true;
        }

        // Check if the Email exists for a different mailbox
        $db = DBManagerFactory::getInstance();
        $query = "SELECT DISTINCT id FROM emails WHERE message_id='" . $message_id . "'";
        $q = $db->query($query);
        $result = $db->fetchByAssoc($q);

        if (!empty($result)) { // Substitute the old mailbox ID with the current one
            $query2 = "UPDATE emails SET mailbox_id='" . $this->mailbox->id . "' WHERE id='" . $result['id'] . "'";
            $q2 = $db->query($query2);
            $result2 = $db->fetchByAssoc($q2);
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
        $db = DBManagerFactory::getInstance();

        $query = "SELECT DISTINCT message_id FROM emails WHERE mailbox_id = '" . $this->mailbox->id . "'";

        $q = $db->query($query);

        while ($row = $db->fetchRow($q)) {
            array_push($this->message_ids, $row['message_id']);
        }
    }

    /**
     * testImapConnection
     *
     * Tests connection to the IMAP server
     *
     * @return mixed
     */
    private function testImapConnection()
    {
        $imap_status = $this->checkConfiguration($this->incoming_settings);
        if (!$imap_status['result']) {
            $response = [
                'result' => false,
                'errors' => 'No IMAP connection set up. Missing values for: '
                    . implode(', ', $imap_status['missing']),
            ];
            return $response;
        }

        $this->getImapStream();

        $response['errors'] = imap_errors();

        if ($response['errors']) {
            $response['result'] = false;
        } else {
            $response['result'] = true;
        }

        return $response;
    }

    /**
     * testSmtpConnection
     *
     * Tests connection to the SMTP server by sending a dummy email
     *
     * @return mixed
     */
    private function testSmtpConnection($testEmail)
    {
        $smtp_status = $this->checkConfiguration($this->outgoing_settings);
        if (!$smtp_status['result']) {
            $response = [
                'result' => false,
                'errors' => 'No SMTP connection set up. Missing values for: '
                    . implode(', ', $smtp_status['missing']),
            ];
            return $response;
        }

        try {
            $this->transport_handler->getTransport()->start();

            $this->sendMail(Email::getTestEmail($this->mailbox, $testEmail));
            $response['result'] = true;
        } catch (Swift_TransportException $e) {
            $response['errors'] = $e->getMessage();
            LoggerManager::getLogger()->info($e->getMessage());
            $response['result'] = false;
        } catch (Exception $e) {
            $response['errors'] = $e->getMessage();
            LoggerManager::getLogger()->info($e->getMessage());
            $response['result'] = false;
        }

        return $response;
    }

    /**
     * composeEmail
     *
     * Converts the Email bean object into the structure used by the transport handler
     *
     * @param $email
     * @return Swift_Message
     * @throws Exception
     */
    protected function composeEmail($email)
    {
        $this->checkEmailClass($email);

        $message = (new Swift_Message($email->name))
            ->setEncoder(new Swift_Mime_ContentEncoder_PlainContentEncoder('7bit'))
            ->setFrom([$this->mailbox->imap_pop3_username => $this->mailbox->imap_pop3_display_name])
            ->setBody($email->body, 'text/html')
        ;

        if ($this->mailbox->catch_all_address == '') {
            $toAddressess = [];
            foreach ($email->to() as $address) {
                array_push($toAddressess, $address['email']);
            }
            $message->setTo($toAddressess);
        } else { // send everything to the catch all address
            $message->setTo([$this->mailbox->catch_all_address]);

            // add a message for whom this was intended for
            $intendedReciepients = [];
            foreach ($email->to() as $recipient) {
                $intendedReciepients[] = $recipient['email'];
            }
            $email->name .= ' [intended for ' . join(', ', $intendedReciepients) . ']';
            $message->setSubject($email->name);
        }

        if (!empty($email->cc_addrs)) {
            $ccAddressess = [];
            foreach ($email->cc() as $address) {
                array_push($ccAddressess, $address['email']);
            }
            $message->setCc($ccAddressess);
        }

        if (!empty($email->bcc_addrs)) {
            $bccAddressess = [];
            foreach ($email->bcc() as $address) {
                array_push($bccAddressess, $address['email']);
            }
            $message->setBcc($bccAddressess);
        }

        if ($this->mailbox->reply_to != '') {
            $message->setReplyTo($this->mailbox->reply_to);
        }

        if ($email->id) {
            foreach ($email->attachments as $att) {
                $message->attach(
                    Swift_Attachment::fromPath('upload://' . $att->filemd5)->setFilename($att->filename)
                );
            }

            $this->handleInlineImages($message, $email);
        }

        return $message;
    }

    /**
     * Sends the converted Email
     *
     * @param $message
     * @return array
     * @throws Exception
     */
    protected function dispatch($message) {
        $logEntryHandler = new APILogEntryHandler();
        try {
            // todo Call to undefined method Swift_RfcComplianceException::isFatal()
            // this error message shows on the first try
            $logEntryHandler->generateSmtpLogEntry($message, $this->mailbox,  'smtp_send');
            $result = [
                'result'     => $this->transport_handler->send($message),
                'message_id' => $message->getId(),
            ];

        } catch (Swift_RfcComplianceException $exception) {
            $result = [
                'result' => false,
                'errors' => $exception->getMessage(),
            ];
            $logEntryHandler->updateSmtpLogEntry($exception);
            $this->log(Mailbox::LOG_DEBUG, $this->mailbox->name . ': ' . $exception->getMessage());
        } catch (Swift_TransportException $exception) {
            $result = [
                'result' => false,
                'errors' => "Cannot inititalize connection.",
            ];
            $logEntryHandler->updateSmtpLogEntry($exception);
            $this->log(Mailbox::LOG_DEBUG, $this->mailbox->name . ': ' . $exception->getMessage());
        } catch (Exception $exception) {
            $result = [
                'result' => false,
                'errors' => $exception->getMessage(),
            ];
            $logEntryHandler->updateSmtpLogEntry($exception);
            $this->log(Mailbox::LOG_DEBUG, $this->mailbox->name . ': ' . $exception->getMessage());
        }

        if (($result['result'] == true || $result == true)) {
            $logEntryHandler->updateSmtpLogEntry($result);
            if ($this->mailbox->imap_sent_dir != '') {
                $msg = $message->toString();
                imap_append($this->getImapStream(), $this->mailbox->getSentFolder(), $msg . "\r\n");
            }
        }

        $logEntryHandler->writeSmtpLogEntry();

        return $result;
    }

    /**
     * checkConfiguration
     *
     * Checks the existence of all necessary configuration settings.
     *
     * @param $settings
     * @return array
     */
    protected function checkConfiguration($settings)
    {
        $response = parent::checkConfiguration($settings);


        // If there is no incoming communication and SMTP authentication is disabled the password is allowed to be empty
        foreach ($response['missing'] as $index => $missingSetting) {
            if ($missingSetting == 'imap_pop3_password' && $this->mailbox->inbound_comm == 0
                && ($this->mailbox->smtp_auth == 0 || !isset($this->mailbox->smtp_auth))) {
                unset($response['missing'][$index]);
            }
        }

        /**
         * If after removing the password from the missing fields array in the case above, the missing fields array
         * is empty, then the response result should be reset to true.
         */

        if (empty($response['missing']) && $response['result'] == false) {
            $response['result'] = true;
        }

        return $response;
    }

    /**
     * parseSubject
     *
     * Parses the subject of the email and converts the encoding if necessary.
     *
     * @param $imapSubject
     * @return string
     */
    private function parseSubject($imapSubject) {
        $decodedSubject = imap_mime_header_decode($imapSubject);
        $subject = '';

        if ((substr(strtolower($decodedSubject[0]->charset), 0 ,3) == 'iso')
            || (strtolower($decodedSubject[0]->charset) == 'windows-1252')
            || (strtolower($decodedSubject[0]->charset) == 'windows-1250')) {
            $subject = utf8_encode($decodedSubject[0]->text);
        } else {
            $subject = $decodedSubject[0]->text;
        }

        return $subject;
    }

    /**
     * parseAddress
     *
     * Parses the email address and converts the encoding if necessary.
     *
     * @param $imapAddress
     * @return string
     */
    private function parseAddress($imapAddress) {
        $decodedAddress = imap_mime_header_decode($imapAddress);
        $address = '';

        foreach ($decodedAddress as $addressPart) {
            if (strtolower($addressPart->charset) != 'utf-8'
                && strtolower($addressPart->charset) != 'default') {
                $address .= utf8_encode($addressPart->text);
            } else {
                $address .= $addressPart->text;
            }
        }

        return str_replace(',', '', $address);
    }

    /**
     * saveRelation
     *
     * Only saves the relation between the current email address and another bean.
     *
     * @param $beanId
     * @param $module
     */
    public function saveRelation($beanId, $module) {
        $query = "INSERT INTO `email_addr_bean_rel`
                (`id`, `email_address_id`, `bean_id`, `bean_module`)
                VALUES ('" . create_guid() . "', '" . $this->id . "', '" . $beanId . "', '" . $module . "')";
        $this->db->query($query);
    }
}
