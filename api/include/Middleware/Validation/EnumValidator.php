<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * Type validator that checks if the string is a valid enum value.
 * The enum can be defined in one of two ways:
 * 1) as an array directly in the extension file
 * 2) as a string - the name of a domain field that can be found in the DB.
 *
 * Class EnumValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class EnumValidator extends Validator
{
    public function validate(): bool {
        if (!isset($this->paramDefinition['options']) || !is_array($this->paramDefinition['options'])) {
            throw new ValidationException(
                "No enum options set for: {$this->paramDisplayName}",
                null,
                $this->paramDisplayName
            );
        }

        if (parent::isRequired() && !in_array($this->paramValue, $this->paramDefinition['options'])) {
            throw new ValidationException(
                "Not allowed enum value: {$this->paramValue}",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}