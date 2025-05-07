<?php

namespace SpiceCRM\includes\SpiceDictionary\validators;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * An abstract root class for all technical and logical validators.
 */
abstract class SpiceValidator
{
    /**
     * This function will be invoked during all validations done by technical and logical validators.
     * It checks the validity of null values and the maximum length of the value.
     * Afterward the logic specific to the instantiated validator is executed.
     *
     * @param mixed $value
     * @param array $definition
     * @return bool
     * @throws ValidationException
     */
    public function __invoke(mixed $value, array $definition): bool {
        if (!isset($definition['required']) && is_null($value)) {
            return true;
        }

        if (isset($definition['required']) && $definition['required'] == false && is_null($value)) {
            return true;
        }

        if (isset($definition['required']) && $definition['required'] && is_null($value)) {
            throw new ValidationException(
                "Required parameter missing",
                null,
                $this->getName($definition),
            );
        }

        if (isset($definition['len']) && (strlen($value) > $definition['len'])) {
            throw new ValidationException(
                "Parameter too long",
                null,
                $this->getName($definition),
            );
        }

        $this->validate($value, $definition);

        return true;
    }

    /**
     * Validator specific validation logic goes here.
     *
     * @param mixed $value
     * @param array $definition
     * @return void
     */
    abstract protected function validate(mixed $value, array $definition): void;

    protected function getName(array $definition): string {
        return $definition['name'] ?? $definition['vname'] ?? "";
    }
}