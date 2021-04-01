<?php
namespace SpiceCRM\modules\Mailboxes\processors;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;

class TicketProcessor extends Processor
{
    private $contact;
    private $ticket;
    private $ticket_number;
    const PATTERN = '/009[0-9]{7}/';

    public function process() {
        if ($this->hasContact()) {
            $this->ticket_number = $this->findTicketNumber();

            if ($this->ticket_number) {
                $this->updateTicket();
            } else {
                $this->createTicket();
            }
        } // else nothing happens with no contact
    }

    /**
     * createTicket
     *
     * Creates a new ticket and assigns it to the email
     */
    private function createTicket() {
        $this->ticket = BeanFactory::newBean('ServiceTickets');
        $this->ticket->serviceticket_status = 'New';
        $this->ticket->name                 = $this->email->name;
        $this->ticket->description          = $this->email->body;
        $this->ticket->contact_id           = $this->contact->id;
        $this->ticket->account_id           = $this->getAccountId();
        $this->ticket->save();
        $this->email->assignBeanToEmail($this->ticket->id, 'ServiceTickets');
    }

    /**
     * updateTicket
     *
     * Updates the status of the ticket
     */
    private function updateTicket() {
        $db = DBManagerFactory::getInstance();

        // todo check if that ticket actually exists

        $query = "UPDATE servicetickets 
                    SET serviceticket_status='Updated' 
                    WHERE serviceticket_number='" . $this->ticket_number . "'";
        $q = $db->query($query);
    }

    /**
     * hasContact
     *
     * Checks if there is any contact linked to the email
     *
     * @return bool
     */
    private function hasContact() {
        $db = DBManagerFactory::getInstance();

        $query = "SELECT * FROM emails_beans WHERE email_id='" . $this->email->id . "' AND bean_module='Contacts'";

        $q = $db->query($query);

        while ($contact = $db->fetchByAssoc($q)) {
            $this->contact = BeanFactory::getBean('Contacts', $contact['id']);

            return true;
        }

        return false;
    }

    /**
     * findTicketNumber
     *
     * Parses the subject and body of the email in search for valid ticket numbers
     *
     * @return null|string
     */
    private function findTicketNumber() {
        if (preg_match(self::PATTERN, $this->email->name, $matches)) {
            return $matches[0];
        }

        if (preg_match(self::PATTERN, $this->email->body, $matches)) {
            return $matches[0];
        }

        return null;
    }

    /**
     * getAccountId
     *
     * Checks if there is any account linked to the email and returns either the account ID or null
     *
     * @return null|string
     */
    private function getAccountId() {
        $db = DBManagerFactory::getInstance();

        $query = "SELECT * FROM emails_beans WHERE email_id='" . $this->email->id . "' AND bean_module='Accounts'";
        $q = $db->query($query);

        while ($account = $db->fetchByAssoc($q)) {
            return $account['id'];
        }

        return null;
    }
}
