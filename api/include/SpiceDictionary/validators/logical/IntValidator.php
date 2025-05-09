<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class IntValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        if (!is_integer($value) && (intval($value) != $value)) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not an integer",
                null,
                $this->getName($definition),
            );
        }

        // todo is unsigned used? is it defined in the dictionary?
        if (isset($definition['unsigned']) && $definition['unsigned'] && ($value <= 0 || $value > 4294967295) ) {
            if ($value < 0) {
                throw new ValidationException(
                    "Parameter " . $this->getName($definition) . " value too low",
                    null,
                    $this->getName($definition),
                );
            }

            if ($value > 4294967295) {
                throw new ValidationException(
                    "Parameter " . $this->getName($definition) . " value too high",
                    null,
                    $this->getName($definition),
                );
            }
        }

        if ($value < -2147483648) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " value too low",
                null,
                $this->getName($definition),
            );
        }

        if ($value > 2147483647) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " value too high",
                null,
                $this->getName($definition),
            );
        }
    }
}