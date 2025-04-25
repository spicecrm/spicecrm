<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;

class TagsValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (is_iterable($value)) {
            foreach ($value as $tag) {
                if (!is_string($tag)) {
                    throw new ValidationException(
                        "Parameter " . $this->getName($definition) . " is not a valid tag",
                        null,
                        $this->getName($definition),
                    );
                }
            }
        }
    }
}