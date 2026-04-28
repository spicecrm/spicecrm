<?php

namespace SpiceCRM\modules\Emails\schedulerjobtasks;

use SpiceCRM\includes\SpiceBeans\BeanFactory;

class EmailsSchedulerJobTasks
{
    public function sendPlannedEmails()
    {
        $email = BeanFactory::getBean('Emails');
        return $email->sendPlannedEmails();
    }
}