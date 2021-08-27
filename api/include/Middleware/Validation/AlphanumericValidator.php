<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * Type validator that checks if the string is a valid alphanumeric string.
 *
 * Class AlphanumericValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class AlphanumericValidator extends Validator
{
    public function validate(): bool {
        if (parent::isRequired() && !ctype_alnum($this->paramValue)) {
            throw new ValidationException(
                "{$this->paramValue} is not alphanumeric.",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}