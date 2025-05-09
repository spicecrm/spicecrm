<?php

namespace SpiceCRM\includes\SpiceDictionary\validators\logical;

use libphonenumber\NumberParseException;
use libphonenumber\PhoneNumberFormat;
use libphonenumber\PhoneNumberUtil;
use SpiceCRM\includes\ErrorHandlers\ValidationException;

class PhoneValidator extends LogicalValidator
{
    protected function validate(mixed $value, array $definition): void
    {
        if (!$this->isPhoneNumber($value) && $value !== "") {
            throw new ValidationException(
                "Parameter " . $this->getName($definition) . " is not a valid E164 phone number",
                null,
                $this->getName($definition),
            );
        }
    }

    private function isPhoneNumber(string $phone): bool
    {
        $phoneUtil = PhoneNumberUtil::getInstance();

        try {
            // Parse the number assuming it's in E.164 format (starts with +)
            $phoneNumber = $phoneUtil->parse($phone, null);

            // Check if it's a valid number
            if (!$phoneUtil->isValidNumber($phoneNumber)) {
                return false;
            }

            // Ensure it is in E.164 format exactly
            $formatted = $phoneUtil->format($phoneNumber, PhoneNumberFormat::E164);
            return $formatted === $phone;
        } catch (NumberParseException $e) {
            return false;
        }
    }
}