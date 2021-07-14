<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

abstract class OptionValidator
{
    public $paramName;
    public $paramDisplayName;
    public $paramValue;
    public $optionDefinition;

    protected $validationErrors;

    public function validateOption(): bool {
        if (!empty($this->validationErrors)) {
            throw new ValidationException(
                $this->validationErrors[$this->paramDisplayName],
                null,
                $this->paramDisplayName
            );
        }

        return true;
    }
}