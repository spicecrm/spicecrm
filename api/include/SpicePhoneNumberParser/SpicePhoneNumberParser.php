<?php
namespace SpiceCRM\includes\SpicePhoneNumberParser;

use libphonenumber\NumberParseException;
use libphonenumber\PhoneNumberFormat;
use libphonenumber\PhoneNumberUtil;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;

/**
 * Class SpicePhoneNumberParser
 *
 * implements the phone number util and pareses phone numbers
 *
 * @package SpiceCRM\includes\SpicePhoneNumberParser
 */
class SpicePhoneNumberParser
{
    /**
     * convertToE164
     *
     * Converts the phone number string given by the user into the E164 standard.
     * If it's not possible it just returns the user input.
     *
     * @param $phoneNumberString
     * @return string
     */
    public static function convertToE164($phoneNumberString) {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if ($phoneNumberString == '') {
            return '';
        }

        $phoneNumberString = preg_replace('/\D/',"",$phoneNumberString);

        $phoneUtil = PhoneNumberUtil::getInstance();

        $country = SpiceConfig::getInstance()->config['telephony']['default_country'];
        if($current_user->address_country){
            $country = $current_user->address_country;
        }

        try {
            // todo recognize the country code from the bean address data if possible
            $conversion = $phoneUtil->parse($phoneNumberString, $country);
            if ($phoneUtil->isValidNumber($conversion)) {
                return $phoneUtil->format($conversion, PhoneNumberFormat::E164);
            } else {
                return $phoneNumberString;
            }
        } catch (NumberParseException $e) {
            return $phoneNumberString;
        }
    }

    /**
     * convertToInternational
     *
     * Converts the phone number string given by the user into the E164 standard.
     * If it's not possible it just returns the user input.
     *
     * @param $phoneNumberString
     * @return string
     */
    public static function convertToInternational($phoneNumberString, $default_country = null) {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if ($phoneNumberString == '') {
            return '';
        }

        // try to dtermine a deault country if none is passed in
        if(!$default_country) $default_country = $current_user->address_country;
        if(!$default_country) $default_country = SpiceConfig::getInstance()->config['telephony']['default_country'];

        $phoneUtil = PhoneNumberUtil::getInstance();
        try {
            // todo recognize the country code from the bean address data if possible
            $conversion = $phoneUtil->parse($phoneNumberString, $default_country);
            if ($phoneUtil->isValidNumber($conversion)) {
                return $phoneUtil->format($conversion, PhoneNumberFormat::INTERNATIONAL);
            } else {
                return $phoneNumberString;
            }
        } catch (NumberParseException $e) {
            return $phoneNumberString;
        }
    }
}
