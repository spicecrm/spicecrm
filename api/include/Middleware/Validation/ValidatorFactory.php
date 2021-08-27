<?php
namespace SpiceCRM\includes\Middleware\Validation;

use SpiceCRM\includes\ErrorHandlers\Exception;

class ValidatorFactory
{
    public static function createValidator(string $paramName, $paramValue, array $paramDefinition): Validator {
        if (!isset($paramDefinition['type'])) {
            throw new Exception("Parameter {$paramName} has an unknown type.");
        }

        $validator                   = self::getValidator($paramDefinition['type']);
        $validator->paramName        = $paramName;
        $validator->paramDisplayName = $paramName; // todo change for anonymous arrays and generally for hierarchical structures
        $validator->paramValue       = $paramValue;
        $validator->paramDefinition  = $paramDefinition;

        return $validator;
    }

    private static function getValidator($paramType): Validator {
        $validatorClassName = 'SpiceCRM\\includes\\Middleware\\Validation\\' . ucfirst($paramType) . 'Validator';

        if (class_exists($validatorClassName)) {
            return new $validatorClassName();
        }

        throw new Exception("Parameter type {$paramType} not supported.");
    }

    public static function createOptionValidator(string $paramName, $paramValue, array $optionDefinition, string $optionType): OptionValidator {
        $optionValidator                   = self::getOptionValidator($optionType);
        $optionValidator->paramName        = $paramName;
        $optionValidator->paramDisplayName = $paramName; // todo change for anonymous arrays and generally for hierarchical structures
        $optionValidator->paramValue       = $paramValue;
        $optionValidator->optionDefinition = $optionDefinition;

        return $optionValidator;
    }

    protected static function getOptionValidator($optionType): OptionValidator {
        $optionValidatorClassName = 'SpiceCRM\\includes\\Middleware\\Validation\\' . ucfirst($optionType) . 'OptionValidator';
        if (class_exists($optionValidatorClassName)) {
            return new $optionValidatorClassName();
        }

        throw new Exception("Parameter option type {$optionType} not supported.");
    }
}