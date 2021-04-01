<?php
namespace SpiceCRM\modules\Mailboxes;

use SpiceCRM\includes\Logger\LoggerManager;

trait MailboxLogTrait
{
    public function log($level, $message) {
        if ($this->mailbox->log_level == $level) {
            LoggerManager::getLogger()->error($this->mailbox->name . ': ' . $message);
        }
    }
}
