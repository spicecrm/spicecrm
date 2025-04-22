<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\SugarObjects\SpiceModules;

class ModuleEnumValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (!$this->isModule($value) && $value !== "*" && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid module",
                null,
                $this->getName($definition),
            );
        }
    }

    private function isModule(string $value): bool
    {
        return in_array($value, SpiceModules::getInstance()->getModuleList());
    }
}