<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class ObjectValidator extends Validator
{
    public function validate(): bool {
        foreach ($this->paramValue as $name => $value) {
            if (!isset($this->paramDefinition['parameters'][$name])) {
                $this->validationErrors[$this->paramDisplayName][] = "{$name} is not defined";
                continue;
            }

            $validator = ValidatorFactory::createValidator($name, $value, $this->paramDefinition['parameters'][$name]);
            try {
                $validator->validate();
            } catch (ValidationException $e) {
                $this->validationErrors[$e->getParamName()][] = $e->getValidationErrors();
            }
        }

        if (!empty($this->validationErrors)) {
            throw new ValidationException($this->validationErrors);
        }

        return parent::validate();
    }
}