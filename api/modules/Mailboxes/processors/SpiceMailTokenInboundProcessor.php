<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Mailboxes\processors;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Emails\Email;

class SpiceMailTokenInboundProcessor extends Processor
{
    /**
     * holds the email instance
     * @var Email $email
     */
    public $email;

    /**
     * start processing SpiceEmailToken
     */
    public function processTokenEmail()
    {
        $this->getMailboxUsername();
    }

    /**
     * retrieves the EmailAddress (username) set up in the Mailbox to be used for SpiceMailToken
     * @return void
     * @throws NotFoundException
     */
    public function getMailboxUsername()
    {
        $username = $this->processMailboxData();

        // add "+" sign for further processing
        $emailPrefix = strstr($username, '@', true) . '+';
        $this->getSpiceEmailToken($emailPrefix);
    }

    /**
     * checks whether SpiceMailToken is configured in the mailbox
     * retrieves username from mailbox settings
     * @return string
     * @throws NotFoundException
     */
    public function processMailboxData(): string
    {
        $mailboxId = $this->email->mailbox_id;
        $mailbox = BeanFactory::getBean('Mailboxes', $mailboxId);
        $mailbox->initTransportHandler();

        // get mailbox to check if "processTokenEmail" processor is used
        $mailboxProcessors = $this->email->processors;
        foreach ($mailboxProcessors as $mailboxProcessor) {
            if (!empty($mailboxProcessor['processor_method']) && $mailboxProcessor['processor_method'] == 'processTokenEmail') {

                // set username from transport handler
                $username = $mailbox->transport_handler->getUsername();

                if (empty($username) || !isset($username)) throw new NotFoundException('Username not found for the mailbox: ' . $mailbox->name . ' with id: ' . $mailbox->id, 404);
            }
        }

        return $username;
    }

    /**
     * searches in E-Mail "to", "cc", "bcc" fields of an inbound Email for emailprefix
     * @param $emailPrefix
     * @return void
     * @throws NotFoundException
     */
    private function getSpiceEmailToken($emailPrefix)
    {
        $emailRecipients = $this->email->recipient_addresses;

        if (empty($emailRecipients) || !$emailRecipients) {
            throw new NotFoundException('Email Recipients Array is empty.');
        }

        foreach ($emailRecipients as $key => $value) {
            $pattern = '/' . $emailPrefix . '/i';

            if (preg_match($pattern, $value['email_address'])) {

                // retrieve hashed token from email address
                $regex = '/[a-zA-Z0-9]{32}/i';
                preg_match($regex, $value['email_address'], $match);
                $hashedToken = $match[0];

                // search module name and module id related to token
                $this->findBean($hashedToken);

                // delete hashed email address from recipients
                if (isset($hashedToken)) {
                    $this->deleteHashedEmailAddr($value['email_address']);

                    // empty recipient_addresses array by key
                    $this->email->recipient_addresses[$key] = [];
                }
            }
        }
    }

    /**
     * search with hashedToken in sysobjectemailtokens table for
     * Bean id and Bean modulerelated to token
     * @param $hashedToken
     * @return void
     * @throws NotFoundException
     */
    public function findBean($hashedToken)
    {
        $db = DBManagerFactory::getInstance();
        $query = $db->query("SELECT module_name, module_id FROM sysobjectemailtokens WHERE token = '$hashedToken' AND deleted = 0");

        while ($row = $db->fetchByAssoc($query)) {
            $beanName = $row['module_name'];
            $beanId = $row['module_id'];
            $this->linkParent($beanName, $beanId);
        }
    }

    /**
     * links parent to Email Bean
     * @param $beanName
     * @param $beanId
     * @return void
     * @throws NotFoundException
     */
    public function linkParent($beanName, $beanId)
    {
        if (empty($beanId) || empty($beanName)) {
            throw new NotFoundException('Bean ID or Module for SpiceMailToken empty.');
        }

        $db = DBManagerFactory::getInstance();

        // link bean to email in emails_beans table
        $db->insertQuery('emails_beans', [
            'id' => SpiceUtils::createGuid(),
            'email_id' => $this->email->id,
            'bean_module' => $beanName,
            'bean_id' => $beanId,
            'date_modified' => TimeDate::getInstance()->nowDb(),
            'deleted' => 0
        ], true);
    }

    /**
     * deletes email address with hash from Email Bean
     * @param $recipientAddress
     * @return void
     */
    public function deleteHashedEmailAddr($recipientAddress)
    {
        $db = DBManagerFactory::getInstance();

        // retrieve id of the hashed email address from email_addresses table -- needed to delete this email address from db
        $emailId = $db->getOne("SELECT id from email_addresses where LOWER(email_address) = '$recipientAddress'");

        // delete hashed email address from email_addresses table
        $delWhere = ['id' => $emailId];
        $db->deleteQuery('email_addresses', $delWhere);

        // delete hashed email address from emails_email_addr_rel table
        $delWhereRel = ['email_address_id' => $emailId];
        $db->deleteQuery('emails_email_addr_rel', $delWhereRel);
    }

}