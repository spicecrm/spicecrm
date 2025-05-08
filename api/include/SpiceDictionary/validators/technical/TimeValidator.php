<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\technical;

use DateTime;
use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\TimeDate;

class TimeValidator extends TechnicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        $dateTime = DateTime::createFromFormat(TimeDate::DB_TIME_FORMAT, $value);

        if (!$dateTime) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid time",
                null,
                $this->getName($definition),
            );
        }
    }
}