<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * Only for json in path params
 *
 * Class JsonValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class JsonValidator extends Validator
{
    public function validate(): bool {
        $jsonD = json_decode($this->paramValue);
        $errors = json_last_error();
        if (parent::isRequired() && $errors != JSON_ERROR_NONE) {
            throw new ValidationException(
                "Not a valid JSON. " . json_last_error_msg(),
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}