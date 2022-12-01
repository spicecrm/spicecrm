<?php
namespace SpiceCRM\includes\SpicePhoneNumberParser;

use libphonenumber\NumberParseException;
use libphonenumber\PhoneNumberFormat;
use libphonenumber\PhoneNumberUtil;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;

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
     * +43189083610
     * Used FTS to index phone number
     * If it's not possible it just returns the user input.
     *
     * @param $phoneNumberString
     * @return string
     */
    public static function convertToE164($phoneNumberString, $bean = null) {

        if ($phoneNumberString == '') {
            return '';
        }

        $phoneNumberString = preg_replace('/\D/',"",$phoneNumberString);

        $phoneUtil = PhoneNumberUtil::getInstance();

        $country = self::determinePhoneCountry($bean);

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
     * Converts the phone number string given by the user into the E164 standard including readable format
     * +43 1 89083610
     * If it's not possible it just returns the user input.
     *
     * @param $phoneNumberString
     * @return string
     */
    public static function convertToInternational($phoneNumberString, $default_country = null) {

        if ($phoneNumberString == '') {
            return '';
        }

        // try to determine a default country if none is passed in
        if(!$default_country) $default_country = self::determinePhoneCountry($default_country);

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

    /*
     * try to determine the country
     * 1. country value from an address_country field found containing a value
     * 2. user country
     * 3. system default phone country
     * @param $mixed a SpiceBean or a String
     * @return string
     */
    public static function determinePhoneCountry($mixed){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $country = '';

        if(is_string($mixed)){
            $country = $mixed;
        }
        elseif(is_object($mixed) && $mixed instanceof SpiceBean){
            $bean = $mixed;
            $countryFields = SpiceUtils::getListOfCountryFields($bean);
            foreach($countryFields as $fieldName){
                if(!empty($bean->$fieldName)){
                    $country = $bean->$fieldName;
                    break;
                }
            }
        }

        if(!$country) $country = $current_user->address_country;
        if(!$country) $country = SpiceConfig::getInstance()->config['telephony']['default_country'];

        return $country;
    }


}
