<?php
namespace SpiceCRM\modules\Mailboxes;

use SpiceCRM\includes\Logger\LoggerManager;

trait MailboxLogTrait
{
    public function log($level, $message) {
        if ($level == Mailbox::LOG_ERROR || $this->mailbox->log_level >= $level) {
            LoggerManager::getLogger()->error("{$this->mailbox->name} ({$this->mailbox->id}): $message");
        }
    }
}
