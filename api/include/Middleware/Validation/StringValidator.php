<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * Type validator that checks if the string is a valid string.
 *
 * Class StringValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class StringValidator extends Validator
{
    public function validate(): bool {
        if (parent::isRequired() && !is_string($this->paramValue)) {
            throw new ValidationException(
                'The following value is not a string: ' . json_encode($this->paramValue),
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}