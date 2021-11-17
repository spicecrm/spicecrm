<?php
namespace SpiceCRM\modules\EmailSchedules\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;

class EmailSchedulesSchedulerJobTasks
{
    /**
     * Job 32
     * sendEmailScheduleEmails
     */
    public function sendEmailScheduleEmails(): bool {
        $emailSchedule = BeanFactory::getBean('EmailSchedules');
        return $emailSchedule->sendQueuedEmails();
    }
}