<?php

namespace SpiceCRM\modules\SystemTenants\schedulerjobtasks;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\modules\SystemTenants\SystemTenant;

class SystemTenantSchedulerJobs
{
    /**
     * process confirmed tenants
     * @return bool
     * @throws Exception
     */
    public function processConfirmedTenants(): bool
    {
        $maxTenantsPerExecution = 5;
        $db = DBManagerFactory::getInstance();

        $query = $db->limitQuery("SELECT id FROM systemtenants WHERE systemtenant_status = 'confirmed' AND deleted != 1", 0, $maxTenantsPerExecution);

        while ($row = $db->fetchByAssoc($query)) {
            /** @var SystemTenant $tenant */
            $tenant = BeanFactory::getBean('SystemTenants', $row['id']);
            $tenant->initializeTenant(true, true);
        }

        return true;
    }
}