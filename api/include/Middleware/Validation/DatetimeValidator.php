<?php
namespace SpiceCRM\includes\Middleware\Validation;

use DateTime;
use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * Type validator that checks if the value is a valid datetime.
 * Uses the Y-m-d H:i:s format.
 *
 * Class DatetimeValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class DatetimeValidator extends Validator
{
    public function validate(): bool {
        $dateTime = DateTime::createFromFormat("Y-m-d H:i:s", $this->paramValue);
        if (parent::isRequired() && ($dateTime === false || array_sum($dateTime::getLastErrors()))) {
            throw new ValidationException(
                "Invalid date time format",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}