<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class VarcharValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (!is_string($value) && $value !== 1) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a string",
                null,
                $this->getName($definition),
            );
        }
    }
}