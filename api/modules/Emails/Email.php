<?php
/*********************************************************************************
* SugarCRM Community Edition is a customer relationship management program developed by
* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
*
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation with the addition of the following permission added
* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
*
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
*
* You should have received a copy of the GNU Affero General Public License along with
* this program; if not, see http://www.gnu.org/licenses or write to the Free
* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301 USA.
*
* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
*
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
*
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
********************************************************************************/

namespace SpiceCRM\modules\Emails;


use DOMDocument;
use DOMNodeList;
use DOMXPath;
use Exception;
use Hfig\MAPI;
use Hfig\MAPI\Mime\Swiftmailer;
use Hfig\MAPI\OLE\Pear;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
use SpiceCRM\includes\SugarCleaner;
use SpiceCRM\includes\utils\DBUtils;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\EmailAddresses\EmailAddress;
use SpiceCRM\modules\Mailboxes\Mailbox;

class Email extends SugarBean
{


    var $table_name = 'emails';
    var $module_dir = 'Emails';
    var $object_name = 'Email';

    public $attachment_image;

    public $recipient_addresses = [];
    public $processors = [];

    public $mailbox;
    /**
     * holds the attachments
     * @var array
     */
    public $attachments = [];

    /**
     * Openness Statuses
     */
    const OPENNESS_OPEN = 'open';
    const OPENNESS_USER_CLOSED = 'user_closed';
    const OPENNESS_SYSTEM_CLOSED = 'system_closed';

    const STATUS_UNREAD = 'unread';
    const STATUS_READ = 'read';
    const STATUS_CREATED = 'created';

    const TYPE_INBOUND = 'inbound';
    const TYPE_OUTBOUND = 'out';

    /**
     * sole constructor
     */
    function __construct()
    {
        parent::__construct();

        $this->emailAddress = BeanFactory::getBean('EmailAddresses');

        if ($this->load_relationship('mailboxes')) {
            $mailbox = $this->mailboxes->getBeans()[$this->mailbox_id];
        }
    }

    /**
     * sets the proper date either date_entered, date_start or date_
     */
    public function add_fts_fields()
    {

        if ($this->date_sent) {
            $retvalue = $this->date_sent;
        } else {

            $retvalue = $this->date_entered;
        }

        return ['date_activity' => $retvalue];
    }

    /**
     * Overrides
     */
    ///////////////////////////////////////////////////////////////////////////
    ////	SAVERS
    public function save($check_notify = false, $fts_index_bean = true, bool $ignoreInvalidEmailAddresses = true)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $timedate = TimeDate::getInstance();

        if ($this->isDuplicate) {
            LoggerManager::getLogger()->debug("EMAIL - tried to save a duplicate Email record");
        } else {

            if (!empty($this->mailbox_id)) {
                $mailbox = BeanFactory::getBean('Mailboxes', $this->mailbox_id);
                if ($mailbox) // check on object (mainly for spicecrm installation process)
                    $mailbox->initTransportHandler();
            }

            if (empty($this->id)) {
                $this->id = SpiceUtils::createGuid();
                $this->new_with_id = true;
            }

            if (!empty($this->reference_id) && $this->new_with_id) {
                $this->cloneRelatedBeansFromReference();
            }

            if ($this->to_be_sent) {
                $this->type = self::TYPE_OUTBOUND;
                $this->status = self::STATUS_CREATED;
            }

            $this->from_addr_name = $this->cleanEmails($this->from_addr_name);
            if (empty($this->from_addr) && isset($mailbox)) {
                $this->from_addr = $mailbox->getEmailAddress();
            } elseif (empty($this->from_addr) && !empty($this->from_addr_name)) {
                $this->from_addr = $this->from_addr_name;
            } elseif (empty($this->from_addr)) {
                $this->from_addr = $mailbox->imap_pop3_username;
            }
            if (!empty($this->to_addrs_names) && empty($this->to_addrs)) {
                $this->to_addrs = $this->cleanEmails($this->to_addrs_names);
            }
            $this->to_addrs_names = $this->extractAddresses($this->to_addrs_names);
            $this->cc_addrs_names = $this->cleanEmails($this->cc_addrs_names);
            $this->bcc_addrs_names = $this->cleanEmails($this->bcc_addrs_names);
            $this->reply_to_addr = $this->cleanEmails($this->reply_to_addr);
            $this->description = SugarCleaner::cleanHtml($this->description);
            $this->description_html = SugarCleaner::cleanHtml($this->description_html, true);
            $this->raw_source = SugarCleaner::cleanHtml($this->raw_source, true);
            // disable cache! timedate->now() return null at this time
            $timedate->allow_cache = false;


            LoggerManager::getLogger()->debug('-------------------------------> Email called save()');

            // handle legacy concatenation of date and time fields
            //Bug 39503 - SugarBean is not setting date_sent when seconds missing
            if (empty($this->date_sent)) {
                $this->date_sent = $timedate->now();
            }

            // save without indexing
            parent::save($check_notify, false);

            // handle the email addresses
            if (!is_array($this->recipient_addresses) || empty($this->recipient_addresses)) {
                $this->fillInEmailAddressesFromLegacyFields();

            }
            $this->handleFromAddress();
            $this->saveRecipientAddresses($ignoreInvalidEmailAddresses);

            // process the indexing after the addresseshave been saved so relationships are updated
            if($fts_index_bean){
                SpiceFTSHandler::getInstance()->indexBean($this);
            }
        }
        LoggerManager::getLogger()->debug('-------------------------------> Email save() done');

        // send the email only if the send flag is set
        if ($this->to_be_sent) {
            try {
                $this->loadAttachments();
                $result = $this->sendEmail();
                $this->to_be_sent = false;
            } catch (Exception $e) {
                $result = [
                    'result' => false,
                    'message' => 'Mail not sent: ' . $e->getMessage(),
                ];
            }


            if ($result['result'] == true) {
                $this->status = 'sent';

            } else {
                if ($result['errors']) {
                    $this->status = 'send_error';
                } else {
                    $this->status = 'created';
                }
            }
            $this->new_with_id = false;
            parent::save($check_notify, $fts_index_bean);

            return $result;
        }
        $this->updateParentNotificationStatus();


    }

    /**
     * clone the related beans from the reference email
     */
    private function cloneRelatedBeansFromReference()
    {
        global $resavingRelatedBeans;
        if ($resavingRelatedBeans) return;
        $referenceEmail = BeanFactory::getBean('Emails', $this->reference_id);
        $linked_fields = array_filter(
            $this->get_linked_fields(),
            function ($key) {return !in_array($key, ['assigned_user_link', 'created_by_link', 'modified_user_link', 'mailboxes']);},
            ARRAY_FILTER_USE_KEY
        );
        foreach ($linked_fields as $name => $properties) {
            $linkedBeans = $referenceEmail->get_linked_beans($name);
            foreach ($linkedBeans as $linkedBean) {
                if (!$this->load_relationship($name)) continue;
                $this->{$name}->add($linkedBean->id);
            }
        }
    }

    /**
     * load attachments from database for send
     */
    public function loadAttachments()
    {
        if (!empty($this->attachments) || empty($this->id)) {
            return;
        }
        $attachments = SpiceAttachments::getAttachmentsForBean('Emails', $this->id);
        $this->attachments = json_decode($attachments);
        $this->attachments_count = count($this->attachments);
    }

    /**
     * set the local property attachments for send
     * @param $attachments
     */
    public function setAttachments($attachments)
    {
        $this->attachments = json_decode(json_encode($attachments));
        $this->attachments_count = count($this->attachments);
    }

    /**
     * check if parent has a determineNotificationStatus method
     * if method exists, and current status is different to has_notification, update the field on parent and call save.
     */
    private function updateParentNotificationStatus()
    {
        if (!$this->parent_type || !$this->parent_id) {
            return;
        }

        $parentObj = BeanFactory::getBean($this->parent_type, $this->parent_id);
        if ($parentObj->id && method_exists($parentObj, "determineNotificationStatus")) {
            $parentNotificationStatus = $parentObj->determineNotificationStatus();

            if ($parentNotificationStatus !== $parentObj->has_notification) {
                $parentObj->has_notification = $parentNotificationStatus;
                $parentObj->save();
            }
        }
    }


    /**
     * fill in email addresses from legacy fields
     */
    function fillInEmailAddressesFromLegacyFields(bool $ignoreInvalid = true)
    {
        if (!is_array($this->recipient_addresses)) {
            $this->recipient_addresses = [];
        }

        $fields = [
            'bcc' => 'bcc_addrs',
            'cc' => 'cc_addrs',
            'to' => 'to_addrs',
            'from' => 'from_addr',
        ];

        foreach ($fields as $type => $field) {

            if (empty($this->$field)) continue;

            $addressesString = str_replace([",", ";"], "::", DBUtils::fromHtml($this->$field));
            $addresses = explode("::", $addressesString);

            if (empty($addresses)) continue;

            foreach ($addresses as $address) {
                $address = EmailAddress::cleanAddress($address);
                $existingIndex = array_search($address, array_column($this->recipient_addresses, 'email_address'));

                if (empty($address) || ($existingIndex !== false && $this->recipient_addresses[$existingIndex]['address_type'] == $type)) {
                    continue;
                }

                $this->addEmailAddress($type, $address);
            }

        }
    }

    /**
     * handle saving email address from string if it does not exist
     * @param string $addressString
     * @param bool $ignoreInvalid
     * @return string the existing/new email address id
     */
    private function handleSaveEmailAddress(string $addressString, bool $ignoreInvalid = true): string
    {
        $addressString = $this->db->quote(DBUtils::fromHtml($addressString));
        $id = EmailAddress::getEmailAddressId($addressString);

        if (empty($id)) {
            $newAddress = BeanFactory::newBean('EmailAddresses');
            $newAddress->email_address = $addressString;
            $newAddress->email_address_caps = strtoupper($addressString);
            $id = $newAddress->save(false, true, $ignoreInvalid);
        }

        return $id;
    }

    /**
     * Sets the from address in case it is not set for an outgoing Email.
     */
    private
    function handleFromAddress()
    {
        if ($this->type != 'out') {
            return;
        }
        $fromAddress = '';
        $mailbox = $this->getMailbox();
        foreach ($this->recipient_addresses as $recipientAddress) {
            if ($recipientAddress->address_type == 'from' && $recipientAddress->email_address != '') {
                $fromAddress = $recipientAddress->email_address;
            }
        }

        if ($fromAddress == '') {
            $this->addEmailAddress('from', $mailbox->getEmailAddress());
        }
    }

    function saveRecipientAddresses($ignoreInvalid = true)
    {
        if (!is_array($this->recipient_addresses) || empty($this->recipient_addresses)) {
            $this->addressesToArray();
        }

        $addresses = [
            'to_addrs' => [],
            'cc_addrs' => [],
            'bcc_addrs' => [],
        ];

        foreach ($this->recipient_addresses as $recipient_address) {
            $record = $this->db->fetchByAssoc($this->db->query(
                "SELECT * FROM emails_email_addr_rel WHERE id = '{$recipient_address['id']}'"
            ));
            if ($record) {
                // check if record has been deleted
                if ($recipient_address['deleted']) {
                    $this->db->query(
                        "UPDATE emails_email_addr_rel SET deleted = 1 WHERE id='{$recipient_address['id']}'"
                    );
                }
            } else {
                // handle that the email address is created if it does not exist
                if (empty($recipient_address['email_address_id'])) {
                    $emailAddress = BeanFactory::getBean('EmailAddresses');

                    if (strtoupper($recipient_address['email_address']) != "") {
                        if (!$emailAddress->retrieve_by_string_fields(
                            ['email_address_caps' => strtoupper($recipient_address['email_address'])]
                        )) {
                            $emailAddress->email_address = $recipient_address['email_address'];
                            $emailAddress->email_address_caps = strtoupper($recipient_address['email_address']);
                            $emailAddress->invalid_email = 0;
                            $emailAddress->opt_out = 0;
                            $emailAddress->save(false, true, $ignoreInvalid);
                        }
                        $recipient_address['email_address_id'] = $emailAddress->id;
                    }
                }

                // check if we have an id
                if (empty($recipient_address['id'])) {
                    $recordid = $this->db->fetchByAssoc($this->db->query("SELECT id FROM emails_email_addr_rel WHERE email_id = '$this->id' AND address_type='{$recipient_address['address_type']}' AND email_address_id='{$recipient_address['email_address_id']}' AND deleted = 0"));
                    $doUpdate = false;
                    if ($recordid['id']) {
                        $doUpdate = true;
                    }
                    $recipient_address['id'] = $recordid['id'] ?: SpiceUtils::createGuid();
                }

                // save the relationship record
                //check if relationship exists.... linkEmailToAddress() might have been called before this (happens during installation when loading demo data)
                if ($doUpdate) {
                    $this->db->query(
                        "UPDATE emails_email_addr_rel SET
                            email_id = '{$this->id}',
                            address_type = '{$recipient_address['address_type']}',
                            email_address_id = '{$recipient_address['email_address_id']}',
                            parent_type = '{$recipient_address['parent_type']}',
                            parent_id = '{$recipient_address['parent_id']}',
                            deleted = 0
                            WHERE id='{$recipient_address['id']}'
                        "
                    );
                } else {
                    $this->db->query(
                        "INSERT INTO emails_email_addr_rel (
                            id,
                            email_id,
                            address_type,
                            email_address_id,
                            parent_type,
                            parent_id,
                            deleted
                        ) VALUES(
                            '{$recipient_address['id']}',
                            '{$this->id}',
                            '{$recipient_address['address_type']}',
                            '{$recipient_address['email_address_id']}',
                            '{$recipient_address['parent_type']}',
                            '{$recipient_address['parent_id']}',
                            0
                        )"
                    );
                }

            }

            // save the relationship to the parent
            if($recipient_address['parent_type'] && $recipient_address['parent_id']){
                $recExists = $this->db->fetchByAssoc($this->db->query("SELECT id FROM emails_beans WHERE email_id='{$this->id}' AND bean_module = '{$recipient_address['parent_type']}' AND bean_id = '{$recipient_address['parent_id']}' AND deleted = 0"));
                if(!$recExists){
                    $this->db->insertQuery('emails_beans', [
                        'id' => SpiceUtils::createGuid(),
                        'email_id' => $this->id,
                        'bean_module' => $recipient_address['parent_type'],
                        'bean_id' => $recipient_address['parent_id'],
                        'date_modified' => TimeDate::getInstance()->nowDb(),
                        'deleted' => 0
                    ], true);
                }
            }

            $addresses[$recipient_address['address_type'] . '_addrs'][] = $recipient_address['email_address'];
        }

        foreach ($addresses as $type => $items) {
            if ($this->$type == '') {
                $this->$type = implode(', ', $items);
            }
        }
    }

    /**
     * @param $id
     * @param $type
     * @return String
     */
    function linkEmailToAddress($id, $type)
    {
        // TODO: make this update?
        $q1 = "SELECT * FROM emails_email_addr_rel WHERE email_id = '{$this->id}' AND email_address_id = '{$id}' AND address_type = '{$type}' AND deleted = 0";
        $r1 = $this->db->query($q1);
        $a1 = $this->db->fetchByAssoc($r1);

        if (!empty($a1) && !empty($a1['id'])) {
            return $a1['id'];
        } else {
            $guid = SpiceUtils::createGuid();
            $q2 = "INSERT INTO emails_email_addr_rel (id, email_id, address_type, email_address_id, deleted) VALUES('{$guid}', '{$this->id}', '{$type}', '{$id}', 0)";
            $r2 = $this->db->query($q2);
        }

        return $guid;
    }

    /**
     * deletes the email
     *
     * @param $id
     */
    public
    function mark_deleted($id)
    {
        if (!empty($this->mailbox_id)) {
            $mailbox = BeanFactory::getBean('Mailboxes', $this->mailbox_id);
            $mailbox->deleteEmail($this);
        }
        return parent::mark_deleted($id);
    }


    function cleanEmails($emails)
    {
        if (empty($emails)) {
            return '';
        }

        $res = [];

        if (is_array($emails)) {
            foreach ($emails as $email) {
                if (!empty($email['email'])) {
                    $res[] = $email['email'];
                }
            }
        } else {
            $emails = str_replace([",", ";"], "::", from_html($emails));
            $addrs = explode("::", $emails);

            foreach ($addrs as $addr) {
                $parts = $this->emailAddress->splitEmailAddress($addr);
                if (empty($parts["email"])) {
                    continue;
                }
                if (!empty($parts["name"])) {
                    $res[] = "{$parts['name']} <{$parts['email']}>";
                } else {
                    $res[] .= $parts["email"];
                }
            }
        }

        return join(", ", $res);
    }

///////////////////////////////////////////////////////////////////////////
////	RETRIEVERS
    function retrieve($id = -1, $encoded = true, $deleted = true, $relationships = true)
    {
        // cn: bug 11915, return SugarBean's retrieve() call bean instead of $this
        $ret = parent::retrieve($id, $encoded, $deleted, $relationships);

        // if bean was not found --- return false
        if(!$ret) return false;

        //$ret->raw_source = SugarCleaner::cleanHtml($ret->raw_source);
        $ret->description = to_html($ret->description);
        //$ret->description_html = SugarCleaner::cleanHtml($ret->description_html);

        // BEGIN CR1000307
        if (empty($this->body)) {
            if (!empty($ret->description)) {
                $this->body = $ret->description;
            }
            if (!empty($ret->description_html)) {
                $this->body = $ret->description_html;
            }
        }
        // END

        $ret->retrieveEmailAddresses();

        $ret->date_start = '';
        $ret->time_start = '';
        $dateSent = explode(' ', $ret->date_sent);
        if (!empty($dateSent)) {
            $ret->date_start = $dateSent[0];
            if (isset($dateSent[1]))
                $ret->time_start = $dateSent[1];
        }
        // for Email 2.0
        foreach ($ret as $k => $v) {
            $this->$k = $v;
        }

        // forec utf8 encode if body cannot be encoded
        if (!json_encode(['text' => $this->body])) {
            if (json_last_error() == 5)
                $this->body = utf8_encode($this->body);
        }

        // check for embedded files, if they are attached embed them as base64 ref
        $matches = [];
        if (preg_match_all('/src\s*=\s*"(.+?)"/', html_entity_decode($this->body), $matches)) {
            $attachments = SpiceAttachments::getAttachmentsForBean('Emails', $this->id, 100, false);
            foreach ($attachments as $attachment) {
                foreach ($matches[1] as $match) {
                    if (strpos($match, $attachment['filename']) !== false) {
                        $attachmentDetails = SpiceAttachments::getAttachment($attachment['id'], false);
                        $this->body = str_replace($match, "data:{$attachmentDetails['file_mime_type']};charset=utf-8;base64,{$attachmentDetails['file']}", $this->body);
                    }
                }
            }
        };

        // get the number of attachments
        $this->attachments_count = SpiceAttachments::getAttachmentsCount('Emails', $this->id);

        // return the bean
        return $ret;
    }

    public
    function mapToRestArray($beanDataArray)
    {

        $q = "SELECT eam.id, eam.email_address_id, ea.email_address, eam.address_type, eam.parent_type, eam.parent_id, eam.deleted
				FROM emails_email_addr_rel eam
				JOIN email_addresses ea ON ea.id = eam.email_address_id
				WHERE eam.email_id = '{$this->id}' AND eam.deleted=0";
        $r = $this->db->query($q);

        while ($a = $this->db->fetchByAssoc($r)) {
            // PHP >=7.1 triggers an error
            // [] operator not supported by string
            if ($beanDataArray['recipient_addresses'] == '') {
                unset($beanDataArray['recipient_addresses']);
            }

            $beanDataArray['recipient_addresses'][] = $a;
        }

        return $beanDataArray;
    }


    public
    function mapFromRestArray($beanDataArray)
    {

        $this->recipient_addresses = $beanDataArray['recipient_addresses'];
    }


    /**
     * Retrieves email addresses from GUIDs
     */
    function retrieveEmailAddresses()
    {
        $return = [];

        $q = "SELECT email_address, address_type
				FROM emails_email_addr_rel eam
				JOIN email_addresses ea ON ea.id = eam.email_address_id
				WHERE eam.email_id = '{$this->id}' AND eam.deleted=0";
        $r = $this->db->query($q);

        while ($a = $this->db->fetchByAssoc($r)) {
            if (!isset($return[$a['address_type']])) {
                $return[$a['address_type']] = [];
            }
            $return[$a['address_type']][] = $a['email_address'];
        }

        if (count($return) > 0) {
            if (isset($return['from'])) {
                $this->from_addr = implode(", ", $return['from']);
            }
            if (isset($return['to'])) {
                $this->to_addrs = implode(", ", $return['to']);
                foreach ($return['to'] as $mail) $this->to_addrs_arr[] = ['email' => $mail];
            }
            if (isset($return['cc'])) {
                $this->cc_addrs = implode(", ", $return['cc']);
                foreach ($return['cc'] as $mail) $this->cc_addrs_arr[] = ['email' => $mail];
            }
            if (isset($return['bcc'])) {
                $this->bcc_addrs = implode(", ", $return['bcc']);
                foreach ($return['bcc'] as $mail) $this->bcc_addrs_arr[] = ['email' => $mail];
            }
        }
    }

    /**
     * Send the Email
     *
     * @return mixed
     * @throws Exception
     */
    public
    function sendEmail()
    {
        if ($this->mailbox_id) {
            $mailbox = BeanFactory::getBean('Mailboxes', $this->mailbox_id);
        }

        if (!$mailbox) {
            try {
                $mailbox = Mailbox::getDefaultMailbox();
                $this->mailbox_id = $mailbox->id;
            } catch (Exception $exception) {
                throw $exception;
            }
        }

        $mailbox->initTransportHandler();
        $result = $mailbox->transport_handler->sendMail($this);

        if (!empty($result['message_id'])) {
            $this->message_id = $result['message_id'];
        }

        return $result;
    }


    function getSystemDefaultEmail()
    {
        $email = [];

        $r1 = $this->db->query('SELECT config.value FROM config WHERE name=\'fromaddress\'');
        $r2 = $this->db->query('SELECT config.value FROM config WHERE name=\'fromname\'');
        $a1 = $this->db->fetchByAssoc($r1);
        $a2 = $this->db->fetchByAssoc($r2);

        $email['email'] = $a1['value'];
        $email['name'] = $a2['value'];

        return $email;
    }


    private
    function extractAddresses($items)
    {
        if (is_array($items)) {
            $addresses = [];

            foreach ($items as $item) {
                $address = [];

                if (!empty($item['displayname'])) {
                    $address['name'] = substr($item['displayname'], 0, strpos($item['displayname'], '<'));
                }
                if (!empty($item['email'])) {
                    $address['email'] = $item['email'];
                }

                array_push($addresses, $address);
            }

            return json_encode($addresses);
        } else {
            return $this->cleanEmails($items);
        }
    }

    /**
     * getTestEmail
     *
     * Generates a test email with dummy data for use in transport handler connection testing
     *
     * @return Email
     */
    public
    static function getTestEmail(Mailbox $mailbox, $testEmailAddress)
    {
        $testEmail = new Email();

        // todo add recipient_addresses
        // that would require saving the test email
        $testEmail->from_addr = $mailbox->imap_pop3_username ?? $mailbox->ews_username;
        if ($mailbox->imap_pop3_display_name != '') {
            $testEmail->from_addr = $mailbox->imap_pop3_display_name . ' <' . $testEmail->from_addr . '>';
        }

        $testEmail->to_addrs = $testEmailAddress;
        $testEmail->name = "Connection Test Email from SpiceCRM";
        $testEmail->body = "<p>This is a machine generated Test Email</p>";

        return $testEmail;
    }

    /**
     * to
     *
     * Extracts and returns a list of to recipients.
     *
     * @return array
     */
    public
    function to()
    {
        if (!empty($this->recipient_addresses)) {
            $emailAddresses = [];

            if (is_array($this->recipient_addresses)) {
                foreach ($this->recipient_addresses as $address) {
                    if ($address['address_type'] == 'to') {
                        $emailAddresses[] = ['email' => $address['email_address']];
                    };
                };
            }
            return $emailAddresses;
        } else {
            $items = explode(', ', $this->to_addrs);
            return $this->extractEmailAddress($items);
        }
    }

    /**
     * from
     *
     * Extracts and returns a list of from recipients.
     * Although realistically there should only be one.
     *
     * @return array
     */
    public
    function from()
    {
        $emailAddresses = [];

        if (is_array($this->recipient_addresses) && sizeof($this->recipient_addresses) > 0) {
            $emailAddresses = [];
            foreach ($this->recipient_addresses as $address) {
                if ($address['address_type'] == 'from') {
                    $emailAddresses[] = ['email' => $address['email_address']];
                };
            };
        }

        if (sizeof($emailAddresses) == 0) {
            $emailAddresses = $this->extractEmailAddress([$this->from_addr]);
        }

        return $emailAddresses;
    }

    /**
     * cc
     *
     * Extracts and returns a list of cc recipients.
     *
     * @return array
     */
    public
    function cc()
    {
        if (!empty($this->recipient_addresses)) {
            $emailAddresses = [];

            if (is_array($this->recipient_addresses)) {
                foreach ($this->recipient_addresses as $address) {
                    if ($address['address_type'] == 'cc') {
                        $emailAddresses[] = ['email' => $address['email_address']];
                    };
                };
            }
            return $emailAddresses;
        } else {
            $items = explode(', ', $this->cc_addrs);
            return $this->extractEmailAddress($items);
        }
    }

    /**
     * bcc
     *
     * Extracts and returns a list of bcc recipients.
     * Only useful for outgoing emails.
     *
     * @return array
     */
    public
    function bcc()
    {
        if (!empty($this->recipient_addresses)) {
            $emailAddresses = [];

            if (is_array($this->recipient_addresses)) {
                foreach ($this->recipient_addresses as $address) {
                    if ($address['address_type'] == 'bcc') {
                        $emailAddresses[] = ['email' => $address['email_address']];
                    };
                };
            }
            return $emailAddresses;
        } else {
            $items = explode(', ', $this->bcc_addrs);
            return $this->extractEmailAddress($items);
        }
    }

    /**
     * extractEmailAddress
     *
     * Extracts the email address and name from email header data.
     * Addresses in the email header form can also be stored in from_addr, to_addrs, cc_addrs and bcc_addrs.
     *
     * @param $items
     * @return array
     */
    private
    function extractEmailAddress($items)
    {
        $email_array = [];

        foreach ($items as $item) {
            if (empty($item)) {
                return null;
            }

            $pos = strpos($item, ' <');
            if ($pos > 0) { // name and email
                $emailAddress['name'] = substr($item, 0, $pos);
                $emailAddress['email'] = str_replace('<', '',
                    str_replace('>', '', substr($item, $pos + 1))
                );
            } else { // just email
                $emailAddress['name'] = null;
                $emailAddress['email'] = trim($item);
            }

            array_push($email_array, $emailAddress);
        }

        return $email_array;
    }

    /**
     * addressesToArray
     *
     * Converts all the address fields (from, to, cc, bcc) into an array
     * The result is stored in $this->recipient_addresses
     *
     * @return void
     */
    public
    function addressesToArray()
    {
        if ($this->recipient_addresses == '') {
            $this->recipient_addresses = [];
        }

        $address_fields = [
            'bcc' => 'bcc_addrs',
            'cc' => 'cc_addrs',
            'to' => 'to_addrs',
            'from' => 'from_addr',
        ];

        foreach ($address_fields as $type => $address_field) {
            if (empty($this->$address_field)) {
                continue;
            }

            $replace = [',', ';'];
            $items = $this->extractEmailAddress(explode(',', $this->$address_field));

            foreach ($items as $item) {
                $address = [
                    'address_type' => $type,
                    'email_address' => $item['email'],
                    'name' => $item['name'],
                ];

                array_push($this->recipient_addresses, $address);
            }
        }
    }

    function addEmailAddress($type, $address)
    {
        $this->recipient_addresses[] = [
            'address_type' => $type,
            'email_address' => EmailAddress::cleanAddress($address)
        ];
    }

    /**
     * init Processors
     *
     * Initializes the mailbox processors
     */
    public
    function initProcessors()
    {
        $db = DBManagerFactory::getInstance();

        $query = "SELECT * FROM mailbox_processors WHERE mailbox_id='" . $this->mailbox_id . "' ORDER BY priority";
        $q = $db->query($query);

        while ($processor = $db->fetchByAssoc($q)) {
            array_push($this->processors, $processor);
        }
    }

    /**
     * processEmail
     *
     * Goes thru the list of email processors assigned to this email's mailbox and runs the processing.
     */
    public
    function processEmail()
    {
        if (empty($this->processors)) {
            $this->initProcessors();
        }

        foreach ($this->processors as $processor) {
            if (class_exists($processor['processor_class'])) {
                if (method_exists($processor['processor_class'], $processor['processor_method'])) {
                    $mailbox_processor = new $processor['processor_class']($this);

                    if ($this->mailbox->log_level == Mailbox::LOG_DEBUG) {
                        LoggerManager::getLogger()->error('Processor ' . $processor['processor_class'] . '->'
                            . $processor['processor_method'] . ' started for email ' . $this->id);
                    }

                    $result = call_user_func_array(
                        [$mailbox_processor, $processor['processor_method']],
                        []
                    );

                    if ($result && $processor['stop_on_success']) {
                        break;
                    }
                } else {
                    // todo trigger an exception maybe?
                }
            } else {
                // todo check file existence
            }
        }
    }

    /**
     * links this email to another bean by using the assignBeanToEmail() method.
     * @param SugarBean $bean
     * @return bool
     */
    public
    function assignToBean(SugarBean $bean)
    {
        return $this->assignBeanToEmail($bean->id, $bean->module_name);
    }

    /**
     * assignBeanToEmail
     *
     * Assigns a Bean to Email
     *
     * @param $bean / the bean or a string with te bean id
     * @param $bean_module
     * @return bool
     */
    public
    function assignBeanToEmail($bean, $bean_module)
    {
        // if no bean is passed in we assume it is an id and load the bean
        if (is_string($bean)) {
            $bean = BeanFactory::getBean($bean_module, $bean);
        }

        // if no bean is passed in or it copuld nto be retrieved .. do nothing
        if (!$bean) {
            return false;
        }

        $db = DBManagerFactory::getInstance();
        // check if assignment exists already

        // try to find a relationship between Emails and the module
        $rels = $db->query("SELECT relationship_name FROM relationships WHERE lhs_module = 'Emails' AND rhs_module = '$bean_module'");
        while ($rel = $db->fetchByAssoc($rels)) {
            foreach ($this->field_name_map as $field => $fieldDetails) {
                if ($fieldDetails['type'] == 'link' && $fieldDetails['relationship'] == $rel['relationship_name']) {
                    $this->load_relationship($field);
                    $this->{$field}->add($bean->id);
                    return;
                }
            }
        }

        /*
        $query = "INSERT INTO emails_beans (
                      id,
                      email_id,
                      bean_id,
                      bean_module,
                      campaign_data,
                      date_modified,
                      deleted
                    ) VALUES (
                      UUID(),
                      '{$this->id}',
                      '{$bean_id}',
                      '{$bean_module}',
                      NULL,
                      NOW(),
                      0
                    )";

        return $db->query($query);*/
    }


    /**
     * addStylesheet
     *
     * If the mailbox has a stylesheet set, it will be added to the email body
     *
     * @param $stylesheet_id
     */
    public
    function addStylesheet($stylesheet_id)
    {
        $db = DBManagerFactory::getInstance();

        $query = "SELECT * FROM sysuihtmlstylesheets WHERE id='" . $stylesheet_id . "'";
        $q = $db->query($query);

        while ($row = $db->fetchByAssoc($q)) {
            $this->body = '<style>' . $row['csscode'] . '</style>' . $this->body;
        }
    }

    public
    static function findByMessageId($message_id)
    {
        $db = DBManagerFactory::getInstance();

        $query = "SELECT id, message_id FROM emails WHERE message_id='" . $message_id . "'";
        $q = $db->query($query);

        while ($row = $db->fetchRow($q)) {
            if ($row['message_id'] != $message_id) {
                continue;
            }

            $email = BeanFactory::getBean('Emails', $row['id']);
        }

        if (!isset($email)) {
            throw new Exception('Cannot find Email');
        } else {
            return $email;
        }
    }

    public
    function getMailbox()
    {
        $mailbox = BeanFactory::getBean('Mailboxes', $this->mailbox_id);

        return $mailbox;
    }

    public
    function setParent(SugarBean $bean)
    {
        $this->parent_type = $bean->module_name;
        $this->parent_id = $bean->id;
        return true;
    }

    /**
     * saveSentiment
     *
     * Sets and saves the sentiment and magnitude of the email
     * without going thru whatever it is that happens in the save function.
     *
     * @param $sentiment
     * @param $magnitude
     */
    public
    function saveSentiment($sentiment, $magnitude)
    {
        $this->sentiment = $sentiment;
        $this->magnitude = $magnitude;
        parent::save();
    }

    /**
     * retrieves all related emails to a given bean
     * should be static I know...
     * @param SugarBean $bean
     * @return array of Emails or empty
     */
    public
    function retrieve_for_bean(SugarBean $bean)
    {
        $emails = [];
        $sql = "SELECT email_id FROM emails_beans WHERE bean_id = '{$bean->id}' AND deleted = 0";
        $res = $this->db->query($sql);
        while ($row = $this->db->fetchByAssoc($res)) {
            $emails[] = $this->retrieve($row['email_id']);
        }
        return $emails;
    }

    /**
     * convertMsgToEmail
     *
     * Converts a file in Outlook .msg format into an Email Bean.
     *
     * @param $fileId
     * @param null $beanModule
     * @param null $beanId
     *
     * @throws Exception
     */
    public
    function convertMsgToEmail($fileId, $beanModule = null, $beanId = null)
    {
        $messageFactory = new MAPI\MapiMessageFactory(new Swiftmailer\Factory());
        $documentFactory = new Pear\DocumentFactory();
        $this->convertMessageToBean($messageFactory->parseMessage($documentFactory->createFromFile('upload://' . $fileId)));

        // set the parent
        $this->parent_id = $beanId;
        $this->parent_type = $beanModule;
    }

    /**
     * convertMessageToBean
     *
     * Converts a Swiftmailer Message into an Email Bean.
     *
     * @param Swiftmailer\Message $message
     * @return SugarBean
     * @throws Exception
     */
    private
    function convertMessageToBean(Swiftmailer\Message $message)
    {

        // process the message
        $this->name = $message->properties['subject'];
        try {
            set_time_limit(60);
            $this->body = utf8_encode($message->getBodyHTML());
        } catch (Exception $e) {
            try {
                $this->body = $message->getBody();
            } catch (Exception $e) {
                // Apparently there is no email body whatsoever.
                $this->body = '';
            }
        }
        $this->message_id = $message->properties['internet_message_id'];
        $dateSent = isset($message->properties['message_delivery_time']) ? $message->properties['message_delivery_time'] :
            (isset($message->properties['client_submit_time']) ? $message->properties['client_submit_time'] :
                (isset($message->properties['last_modification_time']) ? $message->properties['last_modification_time'] :
                    (isset($message->properties['creation_time']) ? $message->properties['creation_time'] : null)));
        $this->date_sent = date('Y-m-d H:i:s', $dateSent);
        $this->from_addr = $message->getSender();
        foreach ($message->getRecipients() as $recipient) {
            $this->recipient_addresses[] = [
                'email_address' => $recipient->getEmail(),
                'address_type' => strtolower($recipient->getType()),
            ];
        }
        $this->type = self::TYPE_INBOUND;
        $this->status = self::STATUS_UNREAD;
        $this->openness = self::OPENNESS_OPEN;
        $this->to_be_sent = false;

        // todo deal with attachments lol
        foreach ($message->getAttachments() as $attachment) {
            $fileArray = [
                'filename' => $attachment->getFilename(),
                'file' => base64_encode($attachment->getData()),
                'filemimetype' => $attachment->getMimeType()
            ];
            SpiceAttachments::saveAttachmentHashFiles('Emails', $this->id, $fileArray);
        }
    }

    /**
     * Searches for inline base64 images in the email body.
     */
    public
    function findInlineImages(): DOMNodeList
    {
        $doc = new DOMDocument();
        $doc->loadHTML($this->body);
        $selector = new DOMXPath($doc);

        return $selector->query("//img[contains(@src, 'data:image/png;base64,')]");
    }
}
