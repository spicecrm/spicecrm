<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItem;

abstract class SpiceDictionaryDomainHandler
{
    /**
     * handle domain fields on retrieve
     * @param SpiceDictionaryDomain $domain
     * @param array $fields the current value of the domain fields from the bean to be filled by this method
     * @param SpiceBean $bean
     * @return bool
     */
    public function onRetrieve(array $item, SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
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
    public function beforeSave(array $item, SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
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
    public function afterSave(array $item, SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        return true;
    }

    /**
     * Manipulate the domain field definitions dynamically before repair
     * @param SpiceDictionaryItem $item
     * @param SpiceDictionaryDomain $domain
     * @param array $definitions The set of definitions to process and repair.
     * @return array The repaired definitions.
     */
    public function onRepair(SpiceDictionaryItem $item, SpiceDictionaryDomain $domain, array $definitions): array
    {
        return $definitions;
    }
}