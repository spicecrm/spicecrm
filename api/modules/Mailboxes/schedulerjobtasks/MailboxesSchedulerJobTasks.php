<?php
namespace SpiceCRM\modules\Mailboxes\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;

class MailboxesSchedulerJobTasks
{
    /**
     * Job 23
     * fetchEmails
     */
    public function fetchEmails(): bool {
        $mailboxes = BeanFactory::getBean('Mailboxes')
            ->get_full_list(
                'mailboxes.name',
                'inbound_comm=1 AND active=1'
            );

        foreach ($mailboxes as $mailbox) {
            $mailbox->initTransportHandler();

            $mailbox->transport_handler->fetchEmails();
        }

        // return true so the job gets set as properly
        return true;
    }
}