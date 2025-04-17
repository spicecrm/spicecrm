<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class UrlValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        if (!filter_var($value, FILTER_VALIDATE_URL)) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid URL",
                null,
                $this->getName($definition),
            );
        }
    }
}