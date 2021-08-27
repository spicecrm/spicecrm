<?php
namespace SpiceCRM\includes\Middleware\Validation;

class ComplexValidator extends Validator
{
    public function validate(): bool {
        return parent::validate();
    }
}