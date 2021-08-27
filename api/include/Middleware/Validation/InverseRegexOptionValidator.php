<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * Type validator of a inversion of a regular expression.
 *
 * Class InverseRegexOptionValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class InverseRegexOptionValidator extends OptionValidator
{
    public function validateOption(): bool {
        if (preg_match($this->optionDefinition, $this->paramValue[ValidationMiddleware::VOPT_INVERSE_REGEX])) {
            throw new ValidationException(
                "{$this->paramValue} matches the disallowed pattern.",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validateOption();
    }
}