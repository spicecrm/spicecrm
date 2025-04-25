<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * the field type "file" is used for both the filename plus extension
 * and for the file content (base64)
 */
class FileValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (!$this->isBase64($value) && !$this->isFilename($value) && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid file",
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

    private function isFilename(string $name): bool
    {
        return preg_match('/^[^\\\\\/:*?"<>|]+(\.[a-zA-Z0-9]+)?$/', $name) === 1;
    }
}