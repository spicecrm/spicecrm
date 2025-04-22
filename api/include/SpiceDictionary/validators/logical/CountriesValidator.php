<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\SpiceUI\Loaders\SpiceUICountriesLoader;

class CountriesValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (!$this->isCountry($value) && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid country",
                null,
                $this->getName($definition),
            );
        }
    }

    private function isCountry(string $value): bool
    {
        $ccs = array_column((array) SpiceUICountriesLoader::getCountries()['countries'], 'cc');
        return in_array($value, $ccs);
    }
}