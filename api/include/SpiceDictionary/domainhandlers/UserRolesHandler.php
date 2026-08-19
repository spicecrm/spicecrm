<?php

namespace SpiceCRM\includes\SpiceDictionary\domainhandlers;

use Exception;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\SpiceBeans\SpiceBean;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomain;

class UserRolesHandler extends SpiceDictionaryDomainHandler
{
    /**
     * retrieve the translations and push them to the non-db field on the bean
     * @param array $item
     * @param SpiceDictionaryDomain $domain
     * @param array $fields
     * @param SpiceBean $bean
     * @return bool
     * @throws DatabaseException
     */
    public function onRetrieve(array $item, SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        $fields[$item['name']] = json_encode(DBManagerFactory::getInstance()->fetchAll("SELECT id, sysuirole_id, defaultrole FROM sysuiuserroles WHERE user_id = '$bean->id'") ?: []);
        return true;
    }

    /**
     * get the translations from the array in the non-db JSON field and write them to the translations table
     * previous translations will be deleted before writing new ones
     * @param array $item
     * @param SpiceDictionaryDomain $domain
     * @param array $fields
     * @param SpiceBean $bean
     * @return bool
     * @throws Exception
     */
    public function beforeSave(array $item, SpiceDictionaryDomain $domain, array &$fields, SpiceBean $bean): bool
    {
        if($fields[$item['name']]){
            $roles = json_decode($fields[$item['name']], true);
            if($roles){
                $db = DBManagerFactory::getInstance();
                $db->query("DELETE FROM sysuiuserroles WHERE user_id = '$bean->id'");
                foreach($roles as $role){
                    $db->query("INSERT INTO sysuiuserroles (id, user_id, sysuirole_id, defaultrole) values ('{$role['id']}', '$bean->id', '{$role['sysuirole_id']}', {$role['defaultrole']})");
                }
            }
        }

        return true;
    }
}