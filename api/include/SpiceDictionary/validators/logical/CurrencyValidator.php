<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\SysCurrencies\SysCurrencies;

class CurrencyValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (!$this->isCurrency($value) && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid currency",
                null,
                $this->getName($definition),
            );
        }
    }

    private function isCurrency(string $value): bool
    {
        $curr = array_column((array) SysCurrencies::getInstance()->getAllCurrencies(), 'id');
        return in_array($value, $curr);
    }
}