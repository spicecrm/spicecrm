<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;

interface SpiceDictionaryDomainHandler
{
    public function onRetrieve(SpiceDictionaryDomain $domain, $bean);
    public function onSave(SpiceDictionaryDomain $domain, $bean);
}