<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class JsonValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        if (version_compare(PHP_VERSION, '8.3.0', '>=')) {
            if (!json_validate($value)) {
                throw new ValidationException(
                    "Parameter " . $this->getName($definition) . " is not a valid JSON",
                    null,
                    $this->getName($definition),
                );
            }
        }

        if (!$this->isJson($value)) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid JSON",
                null,
                $this->getName($definition),
            );
        }
    }

    private function isJson($value): bool {
        json_decode($value);

        return json_last_error() == JSON_ERROR_NONE;
    }
}