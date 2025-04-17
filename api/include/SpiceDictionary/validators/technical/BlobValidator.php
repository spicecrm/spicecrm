<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\technical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class BlobValidator extends TechnicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        if (strlen($value) > 65535) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is too long",
                null,
                $this->getName($definition),
            );
        }
    }
}