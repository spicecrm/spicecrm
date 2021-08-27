<?php
namespace SpiceCRM\includes\SpiceNotifications;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSubscriptions\SpiceSubscriptionsLoader;

class SpiceNotificationsLoader
{
    private $fieldNamesExcludedFromChange = [
        'assigned_user_id', 'deleted',
    ];

    /**
     * Returns the notifications for the current user and the number of all notifications for that user.
     *
     * @param int $offset
     * @param int $limit
     * @return array
     * @throws \Exception
     */
    public function loadUserNotificationsAndCount(int $offset = 0, int $limit = 50): array {
        return [
            'count'   => $this->getUserNotificationCount(),
            'records' => $this->loadUserNotifications($offset, $limit),
        ];
    }

    /**
     * load the user notification from the database
     *
     * @param int $offset
     * @param int $limit
     * @return array
     * @throws \Exception
     */
    public function loadUserNotifications(int $offset, int $limit): array {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $notifications = [];
        $query = $db->query("SELECT * FROM spicenotifications WHERE deleted <> 1 AND user_id = '{$current_user->id}'
                            ORDER BY notification_date desc LIMIT {$limit} OFFSET {$offset}");

        while ($notification = $db->fetchByAssoc($query)) {
            if (empty($notification['bean_id']) || empty($notification['bean_module'])) {
                continue;
            }

            $bean = BeanFactory::getBean($notification['bean_module'], $notification['bean_id']);
            if ($bean) {
                $notification['bean_name'] = $bean->get_summary_text();
            }

            if (!empty($notification['created_by'])) {
                $createdByUser = BeanFactory::getBean('Users', $notification['created_by']);
                if ($createdByUser) {
                    $notification['created_by_name'] = $createdByUser->get_summary_text();
                }
            }

            $notifications[] = $notification;
        }
        return $notifications;
    }

    /**
     * Returns the number of all notifications for a user.
     *
     * @return int
     * @throws \Exception
     */
    public function getUserNotificationCount(): int {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $query = $db->query("SELECT COUNT(*) AS cnt FROM spicenotifications WHERE deleted <> 1 AND user_id = '{$current_user->id}'");
        $notificationCount = $db->fetchRow($query)['cnt'];

        return $notificationCount;
    }

    /**
     * Creates a change type notification.
     * It adds the names of the changed fields into additional_infos.
     *
     * @param SugarBean $bean
     * @param bool $checkNotify
     * @throws \Exception
     */
    public function createChangeNotifications(SugarBean $bean, bool $checkNotify): void {
        if (empty($bean->auditDataChanges)) {
            return;
        }

        $subscriptionLoader = new SpiceSubscriptionsLoader();

        if ($subscriptionLoader->hasSubscription($bean->id)) {
            $changes = [];

            foreach ($bean->auditDataChanges as $change) {
                if (!in_array($change['field_name'], $this->fieldNamesExcludedFromChange)) {
                    $changes[] = $change['field_name'];
                }
            }

            foreach ($subscriptionLoader->loadSubscriptionsForBean($bean->id) as $subscription) {
                $notification = new SpiceNotifications($bean, SpiceNotifications::TYPE_CHANGE, $subscription['user_id']);
                $notification->additional_infos = json_encode(['fieldsNames' => $changes]);
                $notification->saveNotification();
            }
        }
    }

    /**
     * Creates an assignment type notification.
     *
     * @param SugarBean $bean
     * @param bool $checkNotify
     * @throws \Exception
     */
    public function createAssignNotification(SugarBean $bean, bool $checkNotify): void {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        // notification will be sent if the assigned user has been changed AND the new assigned user is not the current user
        if ($checkNotify && $bean->assigned_user_id != $bean->fetched_row['assigned_user_id']
            && $bean->assigned_user_id != $currentUser->id) {
            $notification = new SpiceNotifications($bean, SpiceNotifications::TYPE_ASSIGNMENT);
            $notification->saveNotification();
        }
    }

    /**
     * Creates a delete type notification.
     *
     * @param SugarBean $bean
     * @throws \Exception
     */
    public function createDeleteNotification(SugarBean $bean): void {
        $notification = new SpiceNotifications($bean, SpiceNotifications::TYPE_DELETE);
        $notification->saveNotification();

        // delete the subscription on the deleted bean
        $subscriptionLoader = new SpiceSubscriptionsLoader();
        $subscriptionLoader->deleteSubscription($bean->_module, $bean->id);
    }
}
