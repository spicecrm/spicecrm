<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * Type validator that checks if the string is a valid base64 string.
 *
 * Class Base64Validator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class Base64Validator extends Validator
{
    public function validate(): bool {
        if (parent::isRequired() && base64_encode(base64_decode($this->paramValue, true)) !== $this->paramValue) {
            throw new ValidationException(
                "Not a valid base64 value",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}