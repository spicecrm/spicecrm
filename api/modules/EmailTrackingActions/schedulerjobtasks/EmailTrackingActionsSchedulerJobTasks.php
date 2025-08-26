<?php

namespace SpiceCRM\modules\EmailTrackingActions\schedulerjobtasks;

use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;

class EmailTrackingActionsSchedulerJobTasks
{

    public function updateEmailRelatedLogs()
    {
        $db = DBManagerFactory::getInstance();
        $timedate = TimeDate::getInstance();
        $limit = SpiceConfig::getInstance()->get('emailtracking.update_logs_limit') ?: 500;
        $emailTrackingActions = $db->limitQuery("SELECT * from emailtrackingactions where update_bean = 1 and deleted = 0 and action != 'link' ORDER BY date_entered", 0, $limit);

        $items = [];

        while ($emailTrackingAction = $db->fetchByAssoc($emailTrackingActions)) {

            $records = array_merge($db->fetchAll("SELECT 'CampaignLog' module, id FROM campaign_log WHERE external_id = '<{$emailTrackingAction['message_id']}>' AND deleted = 0") ?: [],
                $db->fetchAll("SELECT 'NewsletterLogs' module, id FROM newsletterlogs WHERE external_id = '<{$emailTrackingAction['message_id']}>' AND deleted = 0") ?: [],
                $db->fetchAll("SELECT 'Emails' module, id FROM emails WHERE message_id='<{$emailTrackingAction['message_id']}>' AND deleted = 0") ?: []);

            foreach ($records as $record) {
                $items[$emailTrackingAction['id']] = [
                    'record_id' => $record['id'],
                    'record_module' => $record['module'],
                    'action' => $emailTrackingAction['action'],
                    'message_id' => $emailTrackingAction['message_id'],
                    'action_id' => $emailTrackingAction['id'],
                    'severity' => $emailTrackingAction['severity']
                ];
            }

        }
        foreach ($items as $item){
            $emailTrackingActionBean = BeanFactory::getBean('EmailTrackingActions', $item['action_id']);

            $bean = BeanFactory::getBean($item['record_module'], $item['record_id']);

            // update beans
            switch ($item['record_module']) {
                case 'Emails':
                    // set the email status
                    switch ($item['action']) {
                        case 'failed':
                            if ($item['severity'] == 'permanent') {
                                $bean->status = 'bounced';
                            } else {
                                $bean->status = 'deferred';
                            }
                            break;
                        default:
                            $bean->status = $item['action'];
                            break;
                    }
                    // write email name to the trackingaction
                    $emailTrackingActionBean->name = $bean->name;
                    break;
                case 'CampaignLog':
                case 'NewsletterLogs':
                    switch ($item['action']) {
                        case 'failed':
                            if ($item['severity'] == 'permanent') {
                                $bean->activity_type = 'bounced';
                            } else {
                                $bean->activity_type = 'deferred';
                            }
                            break;
                        default:
                            $bean->activity_type = $item['action'];
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
        return true;
    }
}