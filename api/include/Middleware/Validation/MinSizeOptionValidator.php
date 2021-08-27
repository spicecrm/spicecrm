<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * Type validator for the minimum string size.
 *
 * Class MinSizeValidation
 * @package SpiceCRM\includes\Middleware\Validation
 */
class MinSizeOptionValidator extends OptionValidator
{
    public function validateOption(): bool {
        if (strlen($this->paramValue) < $this->optionDefinition[ValidationMiddleware::VOPT_MIN_SIZE]) {
            throw new ValidationException(
                "{$this->paramValue} is too short.",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validateOption();
    }
}