<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\technical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class LongBlobValidator extends TechnicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        if (strlen($value) > 4294967295) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is too long",
                null,
                $this->getName($definition),
            );
        }
    }
}