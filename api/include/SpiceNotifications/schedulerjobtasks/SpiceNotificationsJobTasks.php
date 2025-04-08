<?php

namespace SpiceCRM\includes\SpiceNotifications\schedulerjobtasks;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\modules\Mailboxes\Mailbox;

class SpiceNotificationsJobTasks
{
    /**
     * send summary email notification
     * @param string|null $params
     * @return bool
     * @throws DatabaseException
     * @throws \Exception
     */
    public function sendSummaryEmailNotifications(?string $params = null): bool
    {
        $db = DBManagerFactory::getInstance();
        $dateFrom = date("Y-m-d 23:59:59");
        $dateTo = date("Y-m-d 00:00:00");

        $query = $db->query("select * from spicenotifications s WHERE notification_date >= '$dateFrom' AND notification_date < '$dateTo' ORDER BY user_id, notification_date desc");

        $notificationsPerUser = (object) [];

        while ($row = $db->fetchByAssoc($query)) {

            $bean = BeanFactory::getBean($row['bean_module'], $row['bean_id'], [], false);

            if (!isset($assignedUser) || $row['user_id'] != $assignedUser->id) {
                $assignedUser = BeanFactory::getBean('Users', $row['user_id']);
            }

            if (!$bean?->id || !$assignedUser?->id || !$assignedUser->getPreference('sendSummaryEmailNotifications')) continue;

            $createdBy = BeanFactory::getBean('Users', $row['created_by'], [], false);

            # prepare values and push to the notifications array
            $record = (object)[
                'createdByUserName' => $createdBy->get_summary_text(),
                'notificationBeanSummary' => $bean->get_summary_text(),
                'beanId' => $row['bean_id'],
                'beanModule' => $row['bean_module'],
                'notificationText' => $row['notification_text'],
                'notificationType' => $row['notification_type'],
                'notificationDate' => $this->generateNotificationDate($assignedUser, $row['notification_date'])
            ];

            $notificationsPerUser->{$assignedUser->id}[] = $record;
        }

        $templateId = SpiceConfig::getInstance()->get('system.summary_notification_template_id');

        if (!$templateId) {
            throw new Exception('Misconfiguration summary notification template missing');
        }

        foreach ($notificationsPerUser as $userId => $notifications) {
            $this->sendUserEmailNotifications($userId, $templateId, $notifications);
        }

        return true;
    }

    /**
     * generate an activity date of the notification
     * @param SpiceBean $assignedUser
     * @param string $dateString
     * @return string
     * @throws \Exception
     */
    private function generateNotificationDate(SpiceBean $assignedUser, string $dateString): string
    {
        $date = \DateTime::createFromFormat(
            TimeDate::DB_DATETIME_FORMAT,
            $dateString,
            new \DateTimeZone($assignedUser->getPreference('timezone'))
        );

        if ($date < (new \DateTime('now', new \DateTimeZone($assignedUser->getPreference('timezone'))))->setTime(0, 0)) {
            return $date->format($assignedUser->getPreference('datef') . " " . $assignedUser->getPreference('timef'));
        } else {
            return $date->format($assignedUser->getPreference('timef'));
        }
    }

    /**
     * send user email notifications
     * @param string $userId
     * @param string $templateId
     * @param array $notifications
     * @return void
     * @throws \Exception
     */
    private function sendUserEmailNotifications(string $userId, string $templateId, array $notifications): void
    {
        $assignedUser = BeanFactory::getBean('Users', $userId);
        $template = BeanFactory::getBean('EmailTemplates', $templateId);
        $parsedTpl = $template->parse(null, ['notifications' => $notifications]);

        try {
            $defaultMailbox = Mailbox::getDefaultMailbox();

            $email = BeanFactory::getBean('Emails');
            $email->mailbox_id = $defaultMailbox->id;
            $email->name = $parsedTpl['subject'];
            $email->body = $parsedTpl['body_html'];
            $email->addEmailAddress('to', $assignedUser->email1);
            // add the from address
            $email->addEmailAddress('from', $defaultMailbox->getEmailAddress());
            $sendResults = $email->sendEmail();

            if (isset($sendResults['errors'])) {
                LoggerManager::getLogger()->fatal($sendResults);
            }

        } catch (Exception $e) {
            LoggerManager::getLogger()->fatal('Notifications: No Notification sent. Please check if default mailbox is set.');
        }
    }
}