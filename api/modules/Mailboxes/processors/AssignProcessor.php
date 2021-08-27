<?php
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
