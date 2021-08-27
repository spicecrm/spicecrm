<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\RESTManager;

/**
 * Type validator that checks if a extension is registered within the system.
 *
 * Class ExtensionValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class ExtensionValidator extends Validator
{
    public function validate(): bool {
        if (parent::isRequired() && !RESTManager::getInstance()->extensionExists($this->paramValue)) {
            throw new ValidationException(
                "{$this->paramValue} is not a valid extension",
                null,
                $this->paramDisplayName
            );
        }
        return parent::validate();
    }
}