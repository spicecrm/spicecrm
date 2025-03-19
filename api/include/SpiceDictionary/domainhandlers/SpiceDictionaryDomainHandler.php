<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItem;

interface SpiceDictionaryDomainHandler
{
    public function onRetrieve(SpiceDictionaryDomain $domain,array &$fields, SpiceBean $bean);
    public function onSave(SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean);
}