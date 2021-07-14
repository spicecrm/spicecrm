<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * Type validator that checks if the string is a valid email address.
 *
 * Class EmailValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class EmailValidator extends Validator
{
    public function validate(): bool {
        if (parent::isRequired() && !filter_var($this->paramValue, FILTER_VALIDATE_EMAIL)) {
            throw new ValidationException(
                "{$this->paramValue} is not a valid email address.",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}