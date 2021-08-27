<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * Type validator that checks if the string is a valid numeric string.
 *
 * Class NumericValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class NumericValidator extends Validator
{
    public function validate(): bool {
        if (parent::isRequired() && !is_numeric($this->paramValue)) {
            throw new ValidationException(
                "{$this->paramValue} is not numeric",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}