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
class FileValidator extends Validator
{
    public function validate(): bool {
        return parent::validate();
    }
}