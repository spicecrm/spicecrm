<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\Middleware\ValidationMiddleware;

/**
 * Type validator against a regular expression.
 *
 * Class RegexOptionValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class RegexOptionValidator extends OptionValidator
{
    public function validateOption(): bool {
        if (!preg_match($this->optionDefinition, $this->paramValue[ValidationMiddleware::VOPT_REGEX])) {
            throw new ValidationException(
                "{$this->paramValue} does not match the allowed pattern.",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validateOption();
    }
}