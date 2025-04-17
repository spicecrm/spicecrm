<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use DateTime;
use SpiceCRM\includes\ErrorHandlers\ValidationException;

class DateValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        $date = DateTime::createFromFormat("Y-m-d", $value);

        if (isset($definition['required']) && $definition['required'] && !$date) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a date",
                null,
                $this->getName($definition),
            );
        }
    }
}