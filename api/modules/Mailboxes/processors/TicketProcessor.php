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
