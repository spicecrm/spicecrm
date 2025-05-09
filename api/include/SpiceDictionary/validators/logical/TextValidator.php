<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class TextValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        if (!is_string($value) && $value !== 1) { // todo maybe cast 1 to "1" in rest middleware?
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a string",
                null,
                $this->getName($definition),
            );
        }

        if (strlen($value) > 65535) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is too long",
                null,
                $this->getName($definition),
            );
        }
    }
}