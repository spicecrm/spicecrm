<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class ArrayValidator extends Validator
{
    public function validate(): bool {
        /**
         * Basic indexed arrays with a simple subtype.
         */
        if (isset($this->paramDefinition['subtype']) && is_string($this->paramDefinition['subtype'])) {
            foreach ($this->paramValue as $value) {
                $validator = ValidatorFactory::createValidator(
                    $this->paramDisplayName,
                    $value,
                    ['type' => $this->paramDefinition['subtype']]
                );
                try {
                    $validator->validate();
                } catch (ValidationException $e) {
                    $this->validationErrors[$e->getParamName()][] = $e->getValidationErrors();
                }
            }

            if (!empty($this->validationErrors)) {
                throw new ValidationException($this->validationErrors);
            }
        }

        /**
         * Arrays with a subtype that has a complex definition.
         */
        if (isset($this->paramDefinition['subtype']) && is_array($this->paramDefinition['subtype'])) {
            foreach ($this->paramValue as $value) {
                $validator = ValidatorFactory::createValidator(
                    $this->paramDisplayName,
                    $value,
                    $this->paramDefinition['subtype']
                );

                try {
                    $validator->validate();
                } catch (ValidationException $e) {
                    $this->validationErrors[$e->getParamName()][] = $e->getValidationErrors();
                }

                if (!empty($this->validationErrors)) {
                    throw new ValidationException($this->validationErrors);
                }
            }
        }

        return parent::validate();
    }
}