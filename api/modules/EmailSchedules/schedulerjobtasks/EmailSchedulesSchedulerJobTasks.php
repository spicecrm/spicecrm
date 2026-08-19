<?php
namespace SpiceCRM\modules\EmailSchedules\schedulerjobtasks;

use SpiceCRM\includes\SpiceBeans\BeanFactory;

class EmailSchedulesSchedulerJobTasks
{
    /**
     * Job 32
     * sendEmailScheduleEmails
     */
    public function sendEmailScheduleEmails(): bool {

        set_time_limit(900);

        $emailSchedule = BeanFactory::getBean('EmailSchedules');
        return $emailSchedule->sendQueuedEmails();
    }
}