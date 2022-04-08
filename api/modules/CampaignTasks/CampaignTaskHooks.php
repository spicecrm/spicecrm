<?php

namespace SpiceCRM\modules\CampaignTasks;

use SpiceCRM\data\BeanFactory;


class CampaignTaskHooks
{
    /**
     * change activity_type if bean is inactive
     * @param $bean
     * @param $event
     * @param $args
     */
    public function changeActivityType(&$bean, $event, $args)
    {
        // load the campaign task
        $campaignTask = BeanFactory::getBean('CampaignTasks', $bean->id);

        foreach ($campaignTask->getProspectBeans() as $prospectBean){
            // check whether bean is inactive if true
            if ($prospectBean->is_inactive == 1) {
                $campaignLog = BeanFactory::getBean('CampaignLog');
                // get specific fields related to the campaign log
                $campaignLog->retrieve_by_string_fields(['target_id' => $prospectBean->id, 'campaigntask_id' => $campaignTask->id]);

                // change status to inactive
                $campaignLog->activity_type = 'inactive';
                $campaignLog->save();
            }
        }
    }

}