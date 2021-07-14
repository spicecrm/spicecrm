<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * Type validator that checks if the value is a boolean.
 *
 * Class BoolValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class BoolValidator extends Validator
{
    public function validate(): bool {
        if (parent::isRequired() && !is_bool($this->paramValue) && $this->paramValue != 0 && $this->paramValue != 1){
            throw new ValidationException(
                "{$this->paramValue} is not a boolean value",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}