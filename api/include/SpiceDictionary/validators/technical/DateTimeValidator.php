<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\technical;

use DateTime;
use SpiceCRM\includes\ErrorHandlers\ValidationException;

class DateTimeValidator extends TechnicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", $value);
        if ($dateTime === false) {
            $dateTime = DateTime::createFromFormat("Y-m-d\TH:i:s.u\Z", $value);
        }

        if (isset($definition['required']) && $definition['required'] && !$dateTime) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a datetime",
                null,
                $this->getName($definition),
            );
        }
    }
}