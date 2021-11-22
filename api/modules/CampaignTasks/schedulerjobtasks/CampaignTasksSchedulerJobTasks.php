<?php
namespace SpiceCRM\modules\CampaignTasks\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;

class CampaignTasksSchedulerJobTasks
{
    /**
     * Job 22
     * sendCampaignTaskEmails
     */
    public function sendCampaignTaskEmails(): bool {
        $campaignTask = BeanFactory::getBean('CampaignTasks');
        return $campaignTask->sendQueuedEmails();
    }

    public function sendCampaignTaskFeedbacks(): bool {
        $campaignTask = BeanFactory::getBean('CampaignTasks');
        return $campaignTask->genereateServiceFeedbacks();
    }
}