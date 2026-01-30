<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use SpiceCRM\includes\SpiceBeans\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItem;

class FullNameHandler extends SpiceDictionaryDomainHandler
{
    public function onRetrieve($item,SpiceDictionaryDomain $domain,array &$fields, SpiceBean $bean): bool
    {

        $fields['full_name']  = $bean->first_name ? "{$bean->first_name} {$bean->last_name}" : $bean->last_name;
        return true;

    }
}