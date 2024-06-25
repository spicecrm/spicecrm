<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\AccountVATIDs\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\modules\AccountVATIDs\AccountVATID;

class AccountVATIDsSchedulerJobTasks
{

    public function validateVATIDs(): bool {
        set_time_limit(300);
        $vatIDs = BeanFactory::getBean('AccountVATIDs')->get_list('', "vatid_status IS NULL", 0, 250);
        /** @var AccountVATID $vatID */
        foreach ($vatIDs['list'] as $vatID) {
            $vatID->validate()->save();
        }
        return true;
    }

}