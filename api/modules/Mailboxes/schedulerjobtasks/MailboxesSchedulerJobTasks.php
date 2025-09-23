<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\Mailboxes\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use Throwable;

class MailboxesSchedulerJobTasks
{
    /**
     * Job 23
     * fetchEmails
     * @param null $mailboxGUIDs can be one guid or a coma separated list of guids
     * @throws Exception
     */
    public function fetchEmails( $mailboxGUIDs = null ): bool {

        set_time_limit(1200);

        $mailboxes = [];
        $errors = [];
        $successCount = 0;

        if (empty($mailboxGUIDs)) {
            $mailboxes = BeanFactory::getBean('Mailboxes')
                ->get_full_list(
                    'mailboxes.name',
                    'inbound_comm=1 AND active=1'
                );
        } else {
            $mailboxIDs = $this->parseMailboxGuids($mailboxGUIDs);
            $mailboxes = $this->fetchMailboxesByGuids($mailboxIDs);
        }

        if (empty($mailboxes)) {
            throw new Exception('No mailboxes found to process');
        }
        foreach ($mailboxes as $mailbox) {
            try {
                $mailbox->initTransportHandler();
                $mailbox->transport_handler->fetchEmails();
                $successCount++;
            } catch (Exception $e) {
                $errors[] = "Failed to process mailbox '{$mailbox->name}' (ID: {$mailbox->id}): " . $e->getMessage();
                error_log("Error processing mailbox {$mailbox->name} (ID: {$mailbox->id}): " . $e->getMessage());
            } catch (Throwable $e) {
                $errors[] = "Critical error processing mailbox '{$mailbox->name}' (ID: {$mailbox->id}): " . $e->getMessage();
                error_log("Critical error processing mailbox {$mailbox->name} (ID: {$mailbox->id}): " . $e->getMessage());
            }
        }

        if ($successCount === 0) {
            throw new Exception("All mailboxes failed to process. Errors: " . implode('; ', $errors));
        }


        // return true so the job gets set as properly
        return true;
    }

    private function parseMailboxGuids(string $mailboxes): array
    {
        $guids = array_map('trim', explode(',', $mailboxes));

        return array_filter($guids, function ($guid) {
            return !empty($guid);
        });
    }

    /**
     * Fetch mailboxes by their GUIDs
     * @param array $guids
     * @return array
     * @throws Exception
     */
    private function fetchMailboxesByGuids(array $guids): array
    {
        $mailboxes = [];
        $notFoundGuids = [];

        foreach ($guids as $guid) {
            $mailbox = BeanFactory::getBean('Mailboxes', $guid);

            if ($mailbox && !empty($mailbox->id)) {
                // Verify the mailbox is active and configured for inbound communication
                if ($mailbox->active == 1 && $mailbox->inbound_comm == 1) {
                    $mailboxes[] = $mailbox;
                } else {
                    $notFoundGuids[] = $guid . ' (inactive or not configured for inbound)';
                }
            } else {
                $notFoundGuids[] = $guid;
            }
        }

        if (!empty($notFoundGuids)) {
            throw new Exception('Could not find active inbound mailboxes for GUIDs: ' . implode(', ', $notFoundGuids));
        }

        return $mailboxes;
    }
}