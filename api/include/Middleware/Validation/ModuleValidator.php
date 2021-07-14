<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\utils\SpiceUtils;

/**
 * Type validator that checks if a module exists in the system.
 *
 * Class ModuleValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class ModuleValidator extends Validator
{
    public function validate(): bool {
        if (parent::isRequired() && !SpiceUtils::isValidModule($this->paramValue)) {
            throw new ValidationException(
                "{$this->paramValue} is not a valid module.",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}