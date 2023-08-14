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

class AssignProcessor extends Processor
{
    /**
     * Searches for any beans linked to the email addresses in an email and links those beans to the email itself.
     *
     * @throws \Exception
     */
    public function assignAddressesToBeans(): void {
        $this->assignBeansToEmail(false);
    }

    /**
     * Searches for any beans linked to the email addresses in an email and links those beans to the email itself.
     * In case the email is not linked to any beans it will be deleted.
     *
     * @throws \Exception
     */
    public function assignAddressesToBeansOrDelete(): void {
        $this->assignBeansToEmail(true);
    }

    public function assignAllAddressesToBeans(): void {
        $db = DBManagerFactory::getInstance();

        $this->email->addressesToArray();

        $found_addresses = [];
        $results = preg_match_all('/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/', $this->email->body, $matches);
        if ($results > 0) {
            $found_addresses = $matches[0];
        }

        foreach ($this->email->recipient_addresses as $address) {
            $found_addresses[] = strtoupper($address['email_address']);
        }
        $found_addresses = array_unique($found_addresses);

        $addressIn = "'" . implode("','", $found_addresses) . "'";
        $query = "SELECT * FROM email_addresses WHERE email_address_caps in ($addressIn) AND deleted = 0";
        $q = $db->query($query);

        while ($email_address = $db->fetchByAssoc($q)) {
            $query2 = "SELECT * FROM email_addr_bean_rel WHERE email_address_id='" . $email_address['id'] . "' AND deleted = 0";
            $q2 = $db->query($query2);
            while ($bean = $db->fetchByAssoc($q2)) {
                $seed = BeanFactory::getBean($bean['bean_module'], $bean['bean_id']);
                if($seed) {
                    $this->email->assignBeanToEmail($seed, $bean["bean_module"]);
                }
            }
        }
    }

    /**
     * Searches for any beans linked to the email addresses in an email and links those beans to the email itself.
     *
     * @param bool $allowDelete determines if an unlinked email will be deleted
     * @throws \Exception
     */
    private function assignBeansToEmail(bool $allowDelete = false): void {
        $isAssigned = false;
        $this->email->addressesToArray();

        foreach ($this->email->recipient_addresses as $address) {
            $db = DBManagerFactory::getInstance();

            $capAddress = strtoupper($address['email_address']);
            $query = "SELECT * FROM email_addresses WHERE email_address_caps='{$capAddress}' AND deleted = 0";
            $q = $db->query($query);

            while ($email_address = $db->fetchByAssoc($q)) {
                $query2 = "SELECT * FROM email_addr_bean_rel WHERE email_address_id='" . $email_address['id'] . "' AND deleted = 0";
                $q2 = $db->query($query2);
                while ($bean = $db->fetchByAssoc($q2)) {
                    $seed = BeanFactory::getBean($bean['bean_module'], $bean['bean_id']);
                    if ($seed) {
                        $this->email->assignBeanToEmail($seed, $bean["bean_module"]);
                        $isAssigned = true;
                    }
                }
            }
        }

        if ($isAssigned == false && $allowDelete == true) {
            $this->email->mark_deleted($this->email->id);
        }
    }
}
