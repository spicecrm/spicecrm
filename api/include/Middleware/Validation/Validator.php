<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

abstract class Validator
{
    public $paramName;
    public $paramDisplayName;
    public $paramValue;
    public $paramDefinition;

    protected $validationErrors;

    public function isRequired(): bool {
        //required and null
        if (($this->paramValue === null || $this->paramValue === "") && $this->paramDefinition['required'] === false) {
            return false;
        }

        return true;
    }

    public function validate(): bool {
        foreach ($this->paramDefinition['validationOptions'] as $optionName => $optionDefinition) {
            if (!is_array($optionDefinition)) {
                $optionDefinition = [$optionName => $optionDefinition];
            }

            $optionValidator = ValidatorFactory::createOptionValidator(
                $this->paramName,
                $this->paramValue,
                $optionDefinition,
                $optionName
            );

            try {
                $optionValidator->validateOption();
            } catch (ValidationException $e) {
                $this->validationErrors[$e->getParamName()] = $e->getValidationErrors();
            }
        }

        if (!empty($this->validationErrors)) {
            throw new ValidationException(
                $this->validationErrors
            );
        }

        return true;
    }
}