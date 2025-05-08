<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDomainValidation;

class EnumValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (empty($definition['sysdomainfieldvalidation_id'])) {
            return; // No enums are defined, there is nothing to check.
        }

        if (!$this->isEnum($value, $definition['sysdomainfieldvalidation_id']) && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid enum value",
                null,
                $this->getName($definition),
            );
        }
    }

    private function isEnum(mixed $value, string $domainFieldValidationId): bool
    {
        $options = array_values((new SpiceDictionaryDomainValidation($domainFieldValidationId))->getValidationOptions());
        return in_array($value, $options);
    }
}