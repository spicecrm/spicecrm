<?php

namespace SpiceCRM\modules\SystemTenants\hooks;

use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\modules\SystemTenants\SystemTenant;
use SpiceCRM\modules\Users\User;

class TenantUserHooks
{
    /**
     * before_save hook before creating a new user check if user exists in the master tenant mapping table
     * @param $bean
     * @return void
     * @throws Exception
     */
    public function tenantMappingCheckUserExists(User $bean)
    {
        if ($bean->fetched_row) return;

        SystemTenant::switchToMaster();

        if (SystemTenant::determineUserTenant($bean->user_name, $_SERVER['HTTP_HOST'])) {
            throw (new Exception('User already exists in this tenant or other tenant'))->setErrorCode('duplicateUsername');
        }

        SystemTenant::switchDB(SystemTenant::$currentTenantID);
    }

    /**
     * after_save hook to add the tenant user to the mapping table
     * @param User $bean
     * @return void
     * @throws \Exception
     */
    public function addUserTOTenantMappingTable(User $bean)
    {
        if ($bean->fetched_row) return;

        SystemTenant::switchToMaster();

        SystemTenant::addUserTOTenantMappingTable($bean->user_name, SystemTenant::$currentTenantID, $_SERVER['HTTP_HOST']);

        SystemTenant::switchDB(SystemTenant::$currentTenantID);
    }

    /**
     * after_save hook to add the tenant user to the mapping table
     * @param User $bean
     * @return void
     * @throws \Exception
     */
    public function removeUserTOTenantMappingTable(User $bean)
    {
        SystemTenant::switchToMaster();

        SystemTenant::removeUserTOTenantMappingTable($bean->user_name, SystemTenant::$currentTenantID, $_SERVER['HTTP_HOST']);

        SystemTenant::switchDB(SystemTenant::$currentTenantID);
    }
}