<?php
namespace SpiceCRM\includes\Middleware\Validation;

use DateTime;
use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * Type validator that checks if the value is a valid date.
 * Uses the Y-m-d format.
 *
 * Class DateValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class DateValidator extends Validator
{
    public function validate(): bool {
        $date = DateTime::createFromFormat("Y-m-d", $this->paramValue);
        if (parent::isRequired() && ($date === false || array_sum($date::getLastErrors()))) {
            throw new ValidationException(
                "Invalid date format",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}