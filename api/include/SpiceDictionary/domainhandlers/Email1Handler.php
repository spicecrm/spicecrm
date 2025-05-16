<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;
use SpiceCRM\modules\EmailAddresses\EmailAddress;

class Email1Handler extends SpiceDictionaryDomainHandler
{
    /**
     * fill in email1 field
     * @param SpiceDictionaryDomain $domain
     * @param array $fields
     * @param SpiceBean $bean
     * @return bool
     * @throws \Exception
     */
    public function onRetrieve(SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        $emailAddress = DBManagerFactory::getInstance()->getOne("SELECT email_address FROM email_addresses ea, email_addr_bean_rel ear WHERE ear.bean_id='{$bean->id}' AND ear.bean_module='{$bean->_module}'  AND ear.primary_address=1 AND ear.deleted != 1 AND ear.email_address_id = ea.id AND ea.deleted != 1");

        if($emailAddress){
            $fields['email1'] = $emailAddress;
            return true;
        } else {
            return false;
        }
    }

    /**
     * save email1 field to m2m primary email address relationship table
     * @param SpiceDictionaryDomain $domain
     * @param array $fields
     * @param SpiceBean $bean
     * @return bool
     * @throws \Exception
     */
    public function afterSave(SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        if (empty(trim($fields['email1']))) {
            return false;
        }

        $primaryEmailAddressId = EmailAddress::getEmailAddressId($fields['email1']);

        if (!$primaryEmailAddressId) {
            $newEmailAddress = BeanFactory::newBean('EmailAddresses');
            $newEmailAddress->email_address = $fields['email1'];
            $newEmailAddress->email_address_caps = strtoupper($fields['email1']);
            $primaryEmailAddressId = $newEmailAddress->save();
        }

        if (!empty($bean->opt_in_status)) {
            $this->setPrimaryEmailAddress($bean, $primaryEmailAddressId, ['opt_in_status' => $bean->opt_in_status]);
        } else {
            $this->setPrimaryEmailAddress($bean, $primaryEmailAddressId);
        }

        return true;
    }

    /**
     * set the primary email address from the email1 field
     * @param SpiceBean $bean
     * @param string $primaryEmailAddressId
     * @param array $relFieldsValues
     */
    private function setPrimaryEmailAddress(SpiceBean $bean, string $primaryEmailAddressId, $relFieldsValues = []): void
    {
        if(!$bean->load_relationship('email_addresses')) return;

        $relationExists = false;
        $linkedEmailAddresses = $bean->get_linked_beans('email_addresses');

        if (!is_array($linkedEmailAddresses)) return;

        foreach ($linkedEmailAddresses as $linkedEmailAddress) {

            if ($primaryEmailAddressId == $linkedEmailAddress->id) {

                $relationExists = true;
                $bean->email_addresses->add($linkedEmailAddress->id, ['primary_address' => 1]);
            } else {
                $bean->email_addresses->add($linkedEmailAddress->id, ['primary_address' => 0]);
            }
        }

        if (!$relationExists) {
            $relFieldsValues['primary_address'] = 1;
            $bean->email_addresses->add($primaryEmailAddressId, $relFieldsValues);
        }
    }
}