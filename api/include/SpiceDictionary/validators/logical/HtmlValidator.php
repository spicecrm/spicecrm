<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use DOMDocument;
use SpiceCRM\includes\ErrorHandlers\ValidationException;

class HtmlValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void {
        $dom = new DOMDocument();
        $dom->loadHTML($value);
        if (!$dom->validate()) {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not valid HTML",
                null,
                $this->getName($definition),
            );
        }
    }
}