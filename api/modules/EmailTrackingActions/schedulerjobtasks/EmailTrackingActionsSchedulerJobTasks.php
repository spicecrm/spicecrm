<?php

namespace SpiceCRM\modules\EmailTrackingActions\schedulerjobtasks;

use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\TimeDate;

class EmailTrackingActionsSchedulerJobTasks
{

    public function updateEmailRelatedLogs()
    {
        $db = DBManagerFactory::getInstance();
        $timedate = TimeDate::getInstance();
        $emailTrackingActions = $db->fetchAll("SELECT * from emailtrackingactions where update_bean = 1 and deleted = 0 ORDER BY date_entered");

        foreach ($emailTrackingActions as $emailTrackingAction) {
            $records = array_merge($db->fetchAll("SELECT 'CampaignLog' module, id FROM campaign_log WHERE external_id '{$emailTrackingAction['message_id']}' AND deleted = 0") ?: [],
                $db->fetchAll("SELECT 'NewsletterLogs' module, id FROM newsletterlogs WHERE external_id '{$emailTrackingAction['message_id']}' AND deleted = 0") ?: [],
                $db->fetchAll("SELECT 'Emails' module, id FROM emails WHERE message_id='{$emailTrackingAction['message_id']}' AND deleted = 0") ?: []);

            $emailTrackingActionBean = BeanFactory::getBean('EmailTrackingActions', $emailTrackingAction['id']);

            foreach ($records as $record) {
                $bean = BeanFactory::getBean($record['module'], $record['id']);

                // update beans
                switch ($record['module']) {
                    case 'Emails':
                        // set the email status
                        switch ($emailTrackingAction['action']) {
                            case 'failed':
                                if ($emailTrackingAction['severity'] == 'permanent') {
                                    $bean->status = 'bounced';
                                } else {
                                    $bean->status = 'deferred';
                                }
                                break;
                            default:
                                $bean->status = $emailTrackingAction['action'];
                                break;
                        }
                        // write email name to the trackingaction
                        $emailTrackingActionBean->name = $bean->name;
                        break;
                    case 'CampaignLog':
                    case 'NewsletterLogs':
                        switch ($emailTrackingAction['action']) {
                            case 'failed':
                                if ($emailTrackingAction['severity'] == 'permanent') {
                                    $bean->activity_type = 'bounced';
                                } else {
                                    $bean->activity_type = 'deferred';
                                }
                                break;
                            default:
                                $bean->activity_type = $emailTrackingAction['action'];
                                break;
                        }
                        $bean->activity_date = $timedate->nowDb();
                        break;
                }
                $bean->save(false);

                // update trackingAction record with parent module and id
                $emailTrackingActionBean->parent_type = $bean->_module;
                $emailTrackingActionBean->parent_id = $bean->id;
                $emailTrackingActionBean->update_bean = 0;
                $emailTrackingActionBean->save();
            }

        }
    }
}