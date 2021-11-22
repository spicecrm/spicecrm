<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
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
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/
namespace SpiceCRM\modules\Mailboxes;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\modules\Mailboxes\processors\MailboxProcessor;
use SpiceCRM\includes\authentication\AuthenticationController;

class Mailbox extends SugarBean {

    public $module_dir  = 'Mailboxes';
    public $table_name  = "mailboxes";
    public $object_name = "Mailbox";
    public $message_type;

    public $transport_handler;

    const LOG_NONE  = 0;
    const LOG_ERROR = 1;
    const LOG_DEBUG = 2;

    const TRANSPORT_EWS            = 'ews';
    const TRANSPORT_IMAP           = 'imap';
    const TRANSPORT_MAILGUN        = 'mailgun';
    const TRANSPORT_SENDGRID       = 'sendgrid';
    const TRANSPORT_PERSONAL_EWS   = 'personalEws';
    const TRANSPORT_GMAIL          = 'gmail';
    const TRANSPORT_PERSONAL_GMAIL = 'personalGmail';

    /**
     * Mailbox constructor.
     */
    public function __construct() {
        parent::__construct();
    }

    /**
     * get the summary text. Will try to checkif the handler returns a specific mailbox name
     *
     * @return string
     * @throws \Exception
     */
    function get_mailbox_display_name()
    {
        $this->initTransportHandler();
        if(method_exists($this->transport_handler, 'getMailboxName')){
            return $this->transport_handler->getMailboxName();
        }
        return $this->name;
    }

    /**
     * initTransportHandler
     *
     * Initializes the mailbox transport handler according to the transport setting
     *
     * @return bool
     * @throws \Exception
     */
    public function initTransportHandler(): bool {
        if ($this->settings != '') {
            $this->initializeSettings();
        }

        $className = "\\SpiceCRM\\\custom\\modules\\Mailboxes\\Handlers\\" . ucfirst($this->transport) . "Handler";

        if (!class_exists($className)) {
            $className = "\\SpiceCRM\\extensions\\modules\\Mailboxes\\Handlers\\" . ucfirst($this->transport) . "Handler";
            if (!class_exists($className)) {
                $className = "\\SpiceCRM\\modules\\Mailboxes\\Handlers\\" . ucfirst($this->transport) . "Handler";
                if (!class_exists($className)) {
                    throw new Exception('Transport Handler '
                        . "\\SpiceCRM\\modules\\Mailboxes\\Handlers\\" . ucfirst($this->transport) . "Handler"
                        . ' or ' . $className . ' do not exist.');
                }
            }
        }

        $this->transport_handler = new $className($this);

        $this->initMessageType();

        return true;
    }

    /**
     * getSentFolder
     *
     * Returns the whole IMAP path to the sent email folder
     *
     * @return string
     */
    public function getSentFolder(): string {
        return $this->getRef() . $this->imap_sent_dir;
    }

    /**
     * getRef
     *
     * Concatenates mailbox info into a connection string
     *
     * @return string
     */
    public function getRef(): string {
        $ref = '{' . $this->imap_pop3_host . ":" . $this->imap_pop3_port . '/' . $this->imap_pop3_protocol_type;
        if ($this->imap_pop3_encryption == 'ssl') {
            $ref .= '/ssl/novalidate-cert';
        } elseif ($this->imap_pop3_encryption == 'tls') {
            $ref .= '/tls/novalidate-cert';
        }
        if (isset($this->shared_mailbox_auth_user) && isset($this->shared_mailbox_user)) {
            // shared mailbox
            $ref .= "/authuser={$this->shared_mailbox_auth_user}";
            $ref .= "/user={$this->shared_mailbox_user}";
        }
        $ref .= '}';

        return $ref;
    }

    /**
     * save
     *
     * Saves the Mailbox bean
     *
     * @param bool $check_notify
     * @param bool $fts_index_bean
     * @return string|void
     */
    public function save($check_notify = false, $fts_index_bean = true) {

        parent::save($check_notify, $fts_index_bean);
    }

    public function mapToRestArray($beanDataArray)
    {
        // Need to initialize it as an array, otherwise
        // PHP >=7.1 triggers an error
        // [] operator not supported by string
        $beanDataArray['mailbox_processors'] = [];

        $q = "SELECT *
				FROM mailbox_processors
				WHERE mailbox_id = '{$this->id}'";
        $r = $this->db->query($q);

        while ($a = $this->db->fetchByAssoc($r)) {
            $beanDataArray['mailbox_processors'][] = $a;
        }

        return $beanDataArray;
    }

    public function mapFromRestArray($beanDataArray)
    {
        foreach ($beanDataArray['mailbox_processors'] as $processorData) {
            $processor = new MailboxProcessor($processorData);
            if ($processor->deleted && $processor->id != '') {
                $processor->delete();
                continue;
            }

            $processor->mailbox_id = $this->id;

            if ($processor->validate()) {
                $processor->save();
            }
        }
    }

    /**
     * initializeSettings
     *
     * Converts the mailbox settings stored as json into object attributes
     *
     * @return void
     */
    private function initializeSettings() {
        $settings = json_decode(html_entity_decode($this->settings, ENT_QUOTES));

        foreach ($settings as $key => $value) {
            $this->$key = $value;
        }
    }

    /**
     * getDefaultMailbox
     *
     * Returns the default system mailbox
     *
     * @return bool|Mailbox
     * @throws Exception
     */
    public static function getDefaultMailbox()
    {// todo errors when no default mailbox available

        if ( !empty( $GLOBALS['installing'] )) return false;

//        $db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();
//        if(is_null($db)){
//            $db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();
//        }
//        $defaultId = null;
//        $q = "SELECT id FROM mailboxes WHERE is_default=1 AND deleted=0";
//        $r = $db->query($q);
//        while ($row = $db->fetchByAssoc($r)) {
//            $defaultId = $row['id'];
//        }

//        $defaultMailbox =  \SpiceCRM\data\BeanFactory::getBean('Mailboxes', $defaultId);

        $defaultMailbox = BeanFactory::getBean('Mailboxes');
        $defaultMailbox = $defaultMailbox->retrieve_by_string_fields(['is_default' => true]);
        //getBean will return Mailboxe object with empty properties if $defaultId is null
        //Check on property id
        if (is_null($defaultMailbox) || empty($defaultMailbox->id)) {
            # logging temporarily turned off to prevent messing sugarcrm.log:
            # \SpiceCRM\includes\Logger\LoggerManager::getLogger()->fatal('No default Mailbox found');
            throw new Exception('No default Mailbox found');
        } else {
            return $defaultMailbox;
        }
    }

    /**
     * setAsDefault
     *
     * Sets current Mailbox as the default system mailbox
     * Unsets the default flag on all other mailboxes
     *
     * @return boolean
     */
    public function setAsDefault()
    {
        $q1 = "UPDATE mailboxes SET is_default=0 WHERE 1";
        $this->db->query($q1);
        $q2 = "UPDATE mailboxes SET is_default=1 WHERE id='" . $this->id . "'";
        $this->db->query($q2);
        return true;
    }

    /**
     * to use instead of this bad named property imap_pop3_username...
     * for a better future...
     * @return mixed
     */
    public function getEmailAddress() {
        switch ($this->transport) {
            case self::TRANSPORT_EWS:
                return $this->ews_email ?? $this->ews_username;
            case self::TRANSPORT_GMAIL:
                return $this->gmail_email_address ?? $this->gmail_user_name;
            case self::TRANSPORT_PERSONAL_GMAIL:
                $current_user = AuthenticationController::getInstance()->getCurrentUser();
                return $current_user->user_name;
            default:
                return $this->imap_pop3_username;
        }
    }

    // todo find out where those settings are needed and if they're actually useful
    public static function getSystemMailerSettings() {
        $systemMailbox   = self::getDefaultMailbox();
        $defaultSettings = [];

        if ($systemMailbox->transport == 'imap') {
            $defaultSettings = [
                'mail_sendtype'     => 'SMTP',
                'mail_smtptype'     => 'other',
                'mail_smtpserver'   => $systemMailbox->smtp_host,
                'mail_smtpport'     => $systemMailbox->smtp_port,
                'mail_smtpuser'     => $systemMailbox->imap_pop3_username,
                'mail_smtppass'     => $systemMailbox->imap_pop3_password,
                'mail_smtpauth_req' => $systemMailbox->smtp_auth,
                'mail_smtpssl'      => ($systemMailbox->smtp_encryption == 'none') ? '0' : '1',
            ];
        } else {
            // todo figure out what to with default mailgun/sendgrid mailboxes for now just return hardcoded values
            $defaultSettings = [
                'mail_sendtype'     => 'SMTP',
                'mail_smtptype'     => 'other',
                'mail_smtpserver'   => '',
                'mail_smtpport'     => '25',
                'mail_smtpuser'     => '',
                'mail_smtppass'     => '',
                'mail_smtpauth_req' => '1',
                'mail_smtpssl'      => '0',
            ];
        }

        return $defaultSettings;
    }

    /**
     * deletes an email from teh mailbox
     *
     * @param $email
     * @return bool
     * @throws Exception
     */
    public function deleteEmail($email){
        $this->initTransportHandler();
        if(method_exists($this->transport_handler, 'deleteEmail')){
            $this->transport_handler->deleteEmail($email, json_decode(html_entity_decode($this->settings, ENT_QUOTES)));
            return true;
        }
        return false;
    }

    /**
     * findByPhoneNumber
     *
     * Searches for a Mailbox with the given number set as phone_number_from in the JSON settings.
     * Useful only for SMS Mailboxes.
     *
     * @param $phoneNo
     * @return bool|Mailbox
     */
    public static function findByPhoneNumber($phoneNo) {
        $db = DBManagerFactory::getInstance();

        $query = "SELECT id FROM mailboxes WHERE inbound_comm='1' AND (outbound_comm='single_sms' OR outbound_comm='mass_sms')";
        $q = $db->query($query);

        while($row = $db->fetchRow($q)) {
            $mailbox = BeanFactory::getBean('Mailboxes', $row['id']);
            if ($mailbox->settings != '') {
                $mailbox->initTransportHandler();
            }
            if ($mailbox->phone_number_from == $phoneNo) {
                return $mailbox;
            }
        }

        return false;
    }

    public function getUnreadEmailsCount() {
        $db = DBManagerFactory::getInstance();

        $query = "SELECT COUNT(*) as cnt from " . $this->getMessagesTable() . " WHERE mailbox_id='" . $this->id . "'"
            . " AND status='unread' AND deleted = 0";
        $q = $db->query($query);
        $result = $db->fetchByAssoc($q);

        return $result['cnt'];
    }

    public function getReadEmailsCount() {
        $db = DBManagerFactory::getInstance();

        $query = "SELECT COUNT(*) as cnt from " . $this->getMessagesTable() . " WHERE mailbox_id='" . $this->id . "'"
            . " AND status='read' AND deleted = 0";
        $q = $db->query($query);
        $result = $db->fetchByAssoc($q);

        return $result['cnt'];
    }

    public function getClosedEmailsCount() {
        $db = DBManagerFactory::getInstance();

        $query = "SELECT COUNT(*) as cnt from " . $this->getMessagesTable() . " WHERE mailbox_id='" . $this->id . "'"
            . " AND status='closed' AND deleted = 0";
        $q = $db->query($query);
        $result = $db->fetchByAssoc($q);

        return $result['cnt'];
    }

    /**
     * Returns the table in which the messages for this mailbox are stored.
     *
     * @return string
     */
    private function getMessagesTable() {
        if ($this->getType() == 'sms') {
            return 'textmessages';
        }
        if ($this->getType() == 'email') {
            return 'emails';
        }
        return '';
    }

    /**
     * Returns the message type for which the transport handler is used.
     * In case there is no type set in the sysmailboxestransports table it uses email as default.
     *
     * @return string
     */
    public function getType() {
        if ($this->message_type == '') {
            $this->initMessageType();
        }

        return $this->transport_handler->message_type ?? 'email';
    }

    /**
     * Checks if a mailbox uses EWS and if the EWS push notifications are turned on.
     *
     * @return bool
     */
    public function usesEwsNotifications() {
        if ($this->transport != self::TRANSPORT_EWS) {
            return false;
        }

        if (!isset($this->ews_push)) {
            return false;
        }

        if ($this->ews_push == false) {
            return false;
        }

        return true;
    }

    /**
     * Checks if a mailbox has non empty EWS subscription data stored in the settings.
     *
     * @return bool
     */
    public function hasEwsSubscription() {
        if (!$this->usesEwsNotifications()) {
            return false;
        }

        if (!isset($this->ews_subscriptionid) || !isset($this->ews_watermark)) {
            return false;
        }

        if ($this->ews_subscription == '' || $this->ews_watermark == '') {
            return false;
        }

        return true;
    }

    /**
     * Initialized the value of message_type which is stored for every transport handler in either the
     * sysmailboxtransports or syscustommailboxtransports table.
     */
    private function initMessageType() {
        $sql = "SELECT message_type FROM sysmailboxtransports WHERE name='" . $this->transport . "'";

        $result = $this->db->query($sql);
        $row = $this->db->fetchByAssoc($result);

        if ($row['message_type'] == '') {
            $sql = "SELECT message_type FROM syscustommailboxtransports WHERE name='" . $this->transport . "'";

            $result = $this->db->query($sql);
            $row = $this->db->fetchByAssoc($result);

        }

        $this->message_type = $row['message_type'];
    }

    public function isConnected() {
        if ($this->transport == self::TRANSPORT_PERSONAL_EWS) {
            $this->initTransportHandler();
            try {
                if ($this->transport_handler->checkConnection() == false) {
                    return false;
                }
            } catch (\SoapFault $exception) {
                return false;
            }
        }

        return true;
    }
}
