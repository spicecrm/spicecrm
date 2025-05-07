<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\technical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class TinyIntValidator extends TechnicalValidator
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
        if (isset($definition['unsigned']) && $definition['unsigned']) {
            if ($value < 0) {
                throw new ValidationException(
                    "Parameter " . $this->getName($definition) . " value too low",
                    null,
                    $this->getName($definition),
                );
            }

            if ($value > 255) {
                throw new ValidationException(
                    "Parameter " . $this->getName($definition) . " value too high",
                    null,
                    $this->getName($definition),
                );
            }
        }

        if ($value < -127) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " value too low",
                null,
                $this->getName($definition),
            );
        }

        if ($value > 128) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " value too high",
                null,
                $this->getName($definition),
            );
        }
    }
}