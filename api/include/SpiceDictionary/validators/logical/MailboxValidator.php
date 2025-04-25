<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\ValidationException;

class MailboxValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (!$this->isMailbox($value) && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid mailbox",
                null,
                $this->getName($definition),
            );
        }
    }

    private function isMailbox(string $value): bool
    {
        $mailboxes = array_column(BeanFactory::getBean('Mailboxes')->get_list()['list'], 'id');
        return in_array($value, $mailboxes);
    }
}