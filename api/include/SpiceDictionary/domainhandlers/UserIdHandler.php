<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\domainhandlers\SpiceDictionaryDomainHandler;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItem;

class UserIdHandler implements SpiceDictionaryDomainHandler
{

    public function onRetrieve(SpiceDictionaryDomain $domain,array &$fields, SpiceBean $bean)
    {
        if(!$fields['user_id']) {
            $user = $bean->db->fetchOne("SELECT id, status FROM users WHERE parent_type = '{$bean->_module}' AND parent_id = '{$bean->id}' AND deleted = 0");
            $fields['user_id'] = $user['id'];
            $fields['user_status'] = $user['status'];
            return true;
        }
        return false;
    }

    public function onSave(SpiceDictionaryDomain $domain,array &$fields, SpiceBean $bean)
    {
        // TODO: Implement onSave() method.
    }
}