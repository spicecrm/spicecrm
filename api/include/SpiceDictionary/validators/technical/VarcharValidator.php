<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\technical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class VarcharValidator extends TechnicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        if (!is_string($value) && $value !== 1) { // todo maybe cast 1 to "1" in rest middleware?
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a string",
                null,
                $this->getName($definition),
            );
        }
    }
}