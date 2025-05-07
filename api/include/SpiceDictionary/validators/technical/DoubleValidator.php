<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\technical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class DoubleValidator extends TechnicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        if (!is_double($value) && $value != '') {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a double",
                null,
                $this->getName($definition),
            );
        }
    }
}