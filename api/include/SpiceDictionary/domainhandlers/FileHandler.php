<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use SpiceCRM\includes\SpiceBeans\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;

class FileHandler extends SpiceDictionaryDomainHandler
{
    public function onRetrieve($item,SpiceDictionaryDomain $domain,array &$fields, SpiceBean $bean): bool
    {
        if($fields[$item['name'] . '_name']) {
            $fields[$item['name']] = $fields[$item['name'] . '_name'];
            return true;
        }
        return false;
    }
}