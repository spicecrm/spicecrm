<?php

namespace SpiceCRM\modules\SystemTenants\hooks;

use SpiceCRM\modules\SystemTenants\SystemTenant;
use SpiceCRM\modules\Users\User;

class TenantUserHooks
{
    /**
     * after_save hook to add the tenant user to the mapping table
     * @param User $bean
     * @return void
     * @throws \Exception
     */
    public static function addUserTOTenantMappingTable(User $bean): void
    {
        if (!SystemTenant::multitenancyEnabled() || $bean->fetched_row || !SystemTenant::isInTenantSystem()) return;

        $tenantId = SystemTenant::$currentTenantID;
        SystemTenant::switchToMaster();

        SystemTenant::addUserTOTenantMappingTable($bean->user_name, $tenantId, $_SERVER['HTTP_HOST']);

        SystemTenant::switchDB($tenantId);
    }

    /**
     * after_delete hook to remove the tenant user from the mapping table
     * @param User $bean
     * @return void
     * @throws \Exception
     */
    public static function removeUserFromTenantMappingTable(User $bean): void
    {
        if (!SystemTenant::multitenancyEnabled() || !SystemTenant::isInTenantSystem()) return;

        $tenantId = SystemTenant::$currentTenantID;
        SystemTenant::switchToMaster();

        SystemTenant::removeUserFromTenantMappingTable($bean->user_name, $tenantId, $_SERVER['HTTP_HOST']);

        SystemTenant::switchDB($tenantId);
    }
}