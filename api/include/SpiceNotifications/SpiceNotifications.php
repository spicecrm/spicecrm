<?php
namespace SpiceCRM\includes\SpiceNotifications;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\modules\Mailboxes\Mailbox;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\authentication\AuthenticationController;
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

    const TYPE_ASSIGNMENT = 'assignment';

    public function __construct($bean) {
        global $timedate;

        $this->id = create_guid();
        $this->beanModule = $bean->module_name; // get_class($bean); // todo change it to the actual module name
        $this->beanId = $bean->id;
        $this->userId = $bean->assigned_user_id;
        $this->notificationDate = $timedate->nowDb();
        $this->notificationType = self::TYPE_ASSIGNMENT;

        $this->bean = $bean;
        $this->assignedUser = BeanFactory::getBean('Users', $bean->assigned_user_id);
    }

    public function saveNotification() {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();

        $sql = "INSERT INTO spicenotifications (id, bean_module, bean_id, created_by, user_id, notification_date, notification_type)
                VALUES ('{$this->id}', '{$this->beanModule}', '{$this->beanId}', '{$current_user->id}', '{$this->userId}', '{$this->notificationDate}', '{$this->notificationType}')";
        $db->query($sql);

        if ($this->assignedUser->receive_notifications) {
            $this->sendEmailNotification();
        }
    }

    private function sendEmailNotification() {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $parsedTpl = $this->getParsedTpl();

        if($parsedTpl === false) return;

        $sendToEmail = $this->assignedUser->emailAddress->getPrimaryAddress($this->assignedUser);
        if ( empty( $sendToEmail )) {
            LoggerManager::getLogger()->warn("Notifications: No e-mail address set for user '{$this->assignedUser->user_name}', cancelling send.");
            return false;
        }

        try {
            $defaultMailbox = Mailbox::getDefaultMailbox();

            $email = BeanFactory::getBean( 'Emails' );
            $email->mailbox_id = $defaultMailbox->id;
            $email->name = $parsedTpl['subject'];
            $email->body = $parsedTpl['body_html'];
            $email->addEmailAddress( 'to', $sendToEmail );
            // add the from address
            $email->addEmailAddress( 'from', $current_user->emailAddress->getPrimaryAddress( $current_user ) );
            $sendResults = $email->sendEmail();
            if ( isset( $sendResults['errors'] ) ) {
                LoggerManager::getLogger()->fatal('Error sending notification email over Mailbox in SugarBean on file '.__FILE__.', line '.__LINE__.'.');
                LoggerManager::getLogger()->fatal( $sendResults );
            }
            return true;
        } catch (Exception $e) {
            LoggerManager::getLogger()->fatal('Notifications: No Notification sent. Please check if default mailbox is set.');
            return false;
        }
    }

    private function getParsedTpl() {
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

    private function initNotificationTemplates() {
        $db = DBManagerFactory::getInstance();
        if ( !isset( $_SESSION['notification_templates'] ) || empty( $_SESSION['notification_templates'] )) {
            $_SESSION['notification_templates'] = [];
            $restpl = $db->query('SELECT * FROM email_templates WHERE (type="notification" OR type="notification_custom") AND deleted=0 ORDER BY type ASC');
            while ( $row = $db->fetchByAssoc( $restpl )) {
                $_SESSION['notification_templates'][$row['for_bean']][$row['language']] = $row;
            }
        }
    }
}
