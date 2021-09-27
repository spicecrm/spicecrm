<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * Type validator that checks if the string is a valid GUID.
 *
 * Class GuidValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class GuidValidator extends Validator
{

    /**
     * GUID validation configuration constants
     * in all cases will the GUID 1 allowed in order for the admin logic to work
     */
    const GUID_STRICT = 'strict'; // strict GUID structure 36 characters long
    const GUID_SHORT  = 'short';  // GUIDs shorter than 36 characters allowed

    public function validate(): bool {
        $guidRegex = '/^\{?[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}\}?$/';

        if (isset(SpiceConfig::getInstance()->config['validation']['guid'])) {
            switch (SpiceConfig::getInstance()->config['validation']['guid']) {
                case self::GUID_SHORT:
                    $guidRegex = '/^\{?[A-Z0-9\-_]+\}?$/';
                    break;
                case self::GUID_STRICT:
                default:
                    break;
            }
        }

        if (parent::isRequired() && ($this->paramValue != 1) && ($this->paramValue != '*') && (!preg_match($guidRegex, strtoupper($this->paramValue)))) {
            throw new ValidationException(
                "Not a valid GUID: {$this->paramValue}",
                null,
                $this->paramDisplayName
            );
        }

        return parent::validate();
    }
}