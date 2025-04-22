<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class ImageValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (!$this->isBase64($value) && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid base64 image",
                null,
                $this->getName($definition),
            );
        }
    }

    private function isBase64(string $string): bool
    {
        // Check if the string is base64 encoded
        $decoded = base64_decode($string, true);
        if ($decoded === false) {
            return false;
        }

        // Re-encode and compare to original (removes false positives)
        return base64_encode($decoded) === rtrim($string, '=');
    }
}