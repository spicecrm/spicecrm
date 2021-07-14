<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * Type validator for the maximum string size.
 *
 * Class MaxSizeOptionValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class MaxSizeOptionValidator extends OptionValidator
{
    public function validateOption(): bool {
        if (strlen($this->paramValue) > $this->optionDefinition[ValidationMiddleware::VOPT_MAX_SIZE]) {
            throw new ValidationException(
                "{$this->paramValue} is too long.",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validateOption();
    }
}