<?php

namespace SpiceCRM\modules\CampaignTasks;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;


class CampaignTaskHooks
{
    /**
     * change activity_type if bean is inactive
     * @param $bean SpiceBean
     * @param $event
     * @param $args
     * @return void
     * @throws \Exception
     */

    public function changeActivityType(&$bean, $event, $args)
    {
        foreach ($bean->getProspectBeans() as $prospectBean){
            // check whether bean is inactive if true
            if ($prospectBean->is_inactive == 1) {
                $campaignLog = BeanFactory::getBean('CampaignLog');
                // get specific fields related to the campaign log
                $campaignLog->retrieve_by_string_fields(['target_id' => $prospectBean->id, 'campaigntask_id' => $bean->id]);

                // change status to inactive
                $campaignLog->activity_type = 'inactive';
                $campaignLog->save();
            }
        }
    }

}