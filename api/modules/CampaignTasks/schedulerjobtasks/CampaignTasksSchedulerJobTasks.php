<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\CampaignTasks\schedulerjobtasks;

use SpiceCRM\includes\SpiceBeans\BeanFactory;

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

    public function sendCampaignTaskNewsletters(): bool {
        $campaignTask = BeanFactory::getBean('CampaignTasks');
        return $campaignTask->sendQueuedEmails('NewsLetter');
    }

    public function sendCampaignTaskTextMessages(): bool {
        $campaignTask = BeanFactory::getBean('CampaignTasks');
        return $campaignTask->sendQueuedTextMessages();
    }

    public function sendCampaignTaskFeedbacks(): bool {
        $campaignTask = BeanFactory::getBean('CampaignTasks');
        $campaignTask->generateServiceFeedbacks();
        return $campaignTask->sendQueuedEmails('Feedback');
    }
}