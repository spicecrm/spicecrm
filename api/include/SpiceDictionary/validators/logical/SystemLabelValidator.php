<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\SugarObjects\LanguageManager;

class SystemLabelValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (!$this->isLabel($value) && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid label",
                null,
                $this->getName($definition),
            );
        }
    }

    private function isLabel(string $value): bool
    {
        $labels = array_values(LanguageManager::getAllLabels());
        return in_array(strtoupper($value), $labels);
    }
}