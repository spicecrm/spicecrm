<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\technical;

use DateTime;
use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\TimeDate;

class DateTimeValidator extends TechnicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        $dateTime = DateTime::createFromFormat(TimeDate::DB_DATETIME_FORMAT, $value);

        if (!$dateTime && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a datetime",
                null,
                $this->getName($definition),
            );
        }
    }
}