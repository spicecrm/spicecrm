<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class ColorValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (!$this->isHexColor($value) && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not an color in the hex notation",
                null,
                $this->getName($definition),
            );
        }
    }

    private function isHexColor(string $color): bool
    {
        return preg_match('/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/', $color) === 1;
    }
}