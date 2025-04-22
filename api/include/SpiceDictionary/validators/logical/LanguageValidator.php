<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\SugarObjects\LanguageManager;

class LanguageValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (!$this->isLanguage($value) && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid language",
                null,
                $this->getName($definition),
            );
        }
    }

    private function isLanguage(string $value): bool
    {
        $langs = array_column((array) LanguageManager::getLanguages()['available'], 'language_code');
        return in_array($value, $langs);
    }
}