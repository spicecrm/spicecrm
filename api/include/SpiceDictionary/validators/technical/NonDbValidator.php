<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\technical;

/**
 * This validator does nothing as the non DB fields are never saved in the DB.
 */
class NonDbValidator extends TechnicalValidator
{
    protected function validate(mixed $value, array $definition): void {}
}