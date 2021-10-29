<?php

namespace SpiceCRM\includes\SpiceNotifications;

use SpiceCRM\includes\TimeDate;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceSocket\SpiceSocket;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Mailboxes\Mailbox;
use SpiceCRM\modules\UserPreferences\UserPreference;

class SpiceNotifications
{
    private $id;
    private $beanModule;
    private $beanId;
    private $userId;
    private $notificationDate;
    private $notificationType;

    private $bean;
    private $assignedUser;

    const TYPE_ASSIGNMENT = 'assign';
    const TYPE_CHANGE     = 'change';
    const TYPE_DELETE     = 'delete';
    const TYPE_RELATE     = 'relate';

    public function __construct(SugarBean $bean, string $type = self::TYPE_ASSIGNMENT, string $userId = null) {
        $timedate = TimeDate::getInstance();

        $this->id = SpiceUtils::createGuid();
        $this->beanModule = $bean->module_dir; // todo change it to the actual module name
        $this->beanId = $bean->id;
        $this->userId = $userId ?? $bean->assigned_user_id;
        $this->notificationDate = $timedate->nowDb();
        $this->notificationType = $type;

        $this->bean = $bean;
        $this->assignedUser = BeanFactory::getBean('Users', $this->userId);
    }

    /**
     * save the notification data to the database
     * @throws \Exception
     */
    public function saveNotification()
    {
        if (empty($this->beanId) || empty($this->beanModule)) {
            return;
        }

        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $data = [
            'id' => $this->id,
            'bean_module' => $this->beanModule,
            'bean_id' => $this->beanId,
            'created_by' => $current_user->id,
            'user_id' => $this->userId,
            'notification_date' => $this->notificationDate,
            'notification_type' => $this->notificationType,
            'additional_infos' => $this->additional_infos
            ];

        $sql = "INSERT INTO spicenotifications (id, bean_module, bean_id, created_by, user_id, notification_date, notification_type, additional_infos)
                VALUES ('{$data['id']}', '{$data['bean_module']}', '{$data['bean_id']}', '{$data['created_by']}', '{$data['user_id']}', '{$data['notification_date']}', '{$data['notification_type']}', '{$data['additional_infos']}')";
        $db->query($sql);

        if ($this->assignedUser->receive_notifications) {
            $this->sendEmailNotification();
        }

        $bean = BeanFactory::getBean($data['bean_module'], $data['bean_id']);
        if ($bean) {
            $data['bean_name'] = $bean->get_summary_text();
        }

        if (!empty($data['created_by'])) {
            $createdByUser = BeanFactory::getBean('Users', $data['created_by']);
            if ($createdByUser) {
                $data['created_by_name'] = $createdByUser->get_summary_text();
            }
        }

        SpiceSocket::getInstance()->emit('notifications', 'new', $data['user_id'], $data);
    }

    private function sendEmailNotification()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $parsedTpl = $this->getParsedTpl();

        if ($parsedTpl === false) return;

        $sendToEmail = $this->assignedUser->email1;
        if (empty($sendToEmail)) {
            LoggerManager::getLogger()->warn("Notifications: No e-mail address set for user '{$this->assignedUser->user_name}', cancelling send.");
            return false;
        }

        try {
            $defaultMailbox = Mailbox::getDefaultMailbox();

            $email = BeanFactory::getBean('Emails');
            $email->mailbox_id = $defaultMailbox->id;
            $email->name = $parsedTpl['subject'];
            $email->body = $parsedTpl['body_html'];
            $email->addEmailAddress('to', $sendToEmail);
            // add the from address
            $email->addEmailAddress('from', $current_user->email1);
            $sendResults = $email->sendEmail();
            if (isset($sendResults['errors'])) {
                LoggerManager::getLogger()->fatal('Error sending notification email over Mailbox in SugarBean on file ' . __FILE__ . ', line ' . __LINE__ . '.');
                LoggerManager::getLogger()->fatal($sendResults);
            }
            return true;
        } catch (Exception $e) {
            LoggerManager::getLogger()->fatal('Notifications: No Notification sent. Please check if default mailbox is set.');
            return false;
        }
    }

    private function getParsedTpl()
    {
        $destUserPrefs = new UserPreference($this->assignedUser);
        $destUserPrefs->reloadPreferences();
        $destLang = $destUserPrefs->getPreference('language');

        $this->initNotificationTemplates();

        if (isset($_SESSION['notification_templates'][$this->beanModule][$destLang])) {
            $tplId = $_SESSION['notification_templates'][$this->beanModule][$destLang]['id'];
        } else if (isset($_SESSION['notification_templates'][$this->beanModule]['en_us'])) {
            $tplId = $_SESSION['notification_templates'][$this->beanModule]['en_us']['id'];
        } else {
            LoggerManager::getLogger()->fatal("Notifications: No suitable template available in DB (in the langue of the destination user or in english) for module '{$this->beanModule}', cancelling send.");
            return false;
        }

        $tpl = BeanFactory::getBean('EmailTemplates', $tplId);
        $parsedTpl = $tpl->parse($this->bean);

        return $parsedTpl;
    }

    private function initNotificationTemplates()
    {
        $db = DBManagerFactory::getInstance();
        if (!isset($_SESSION['notification_templates']) || empty($_SESSION['notification_templates'])) {
            $_SESSION['notification_templates'] = [];
            $restpl = $db->query('SELECT * FROM email_templates WHERE (type="notification" OR type="notification_custom") AND deleted=0 ORDER BY type ASC');
            while ($row = $db->fetchByAssoc($restpl)) {
                $_SESSION['notification_templates'][$row['for_bean']][$row['language']] = $row;
            }
        }
    }
}
