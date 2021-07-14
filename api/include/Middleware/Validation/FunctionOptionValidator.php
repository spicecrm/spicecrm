<?php
namespace SpiceCRM\includes\Middleware\Validation;

use ReflectionMethod;
use SpiceCRM\includes\ErrorHandlers\ValidationException;

/**
 * Type validator that forwards the validation to a specific function given as parameter.
 *
 * Class FunctionValidator
 * @package SpiceCRM\includes\Middleware\Validation
 */
class FunctionOptionValidator extends OptionValidator
{
    public function validateOption(): bool {
        if (!isset($this->optionDefinition['class']) || !isset($this->optionDefinition['method'])) {
            throw new ValidationException(
                "Validator class/method details missing.",
                null,
                $this->paramDisplayName
            );
        }
        $className  = $this->optionDefinition['class'];
        $methodName = $this->optionDefinition['method'];

        if (!class_exists($className)) {
            throw new ValidationException(
                "Validator class {$className} does not exist.",
                null,
                $this->paramDisplayName
            );
        }

        if (!method_exists($className, $methodName)) {
            throw new ValidationException(
                "Class {$className} does not have a function called {$methodName}",
                null,
                $this->paramDisplayName
            );
        }

        try {
            $methodChecker = new ReflectionMethod($className, $methodName);

            if ($methodChecker->isStatic()) {
                $className::$methodName($this->paramValue);
            } else {
                $validator = new $className();
                $validator->$methodName($this->paramValue);
            }
        } catch (ValidationException $e) {
            $this->validationErrors[$this->paramDisplayName][] = 'Validator error: ' . $e->getMessage();
        }

        return parent::validateOption();
    }
}