<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;

abstract class SpiceDictionaryDomainHandler
{
    /**
     * handle domain fields on retrieve
     * @param SpiceDictionaryDomain $domain
     * @param array $fields the current value of the domain fields from the bean to be filled by this method
     * @param SpiceBean $bean
     * @return bool
     */
    public function onRetrieve(SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        return true;
    }

    /**
     * handle domain fields before save
     * @param SpiceDictionaryDomain $domain
     * @param array $fields the current value of the domain fields from the bean to be used for this method
     * @param SpiceBean $bean
     * @return bool
     */
    public function beforeSave(SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        return true;
    }

    /**
     * handle domain fields after save
     * @param SpiceDictionaryDomain $domain
     * @param array $fields the current value of the domain fields from the bean to be used for this method
     * @param SpiceBean $bean
     * @return bool
     */
    public function afterSave(SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        return true;
    }
}