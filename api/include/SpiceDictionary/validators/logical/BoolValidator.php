<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class BoolValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        if (!is_bool($value) && $value != "0" && $value != "1" && $value == 0 && $value == 1) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a boolean",
                null,
                $this->getName($definition),
            );
        }
    }
}