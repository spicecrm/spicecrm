<?php

namespace SpiceCRM\includes\utils;

use DateTime;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

/**
 * Class SpiceUtils
 *
 * A Helper class containing static functions used throughout the system.
 */
class SpiceUtils
{
    /**
     * catches the request_uri and php_self and checks if one of them matches the allowed backend paths
     * @return mixed|string|null
     */
    public static function determineAppBasePath()
    {
        $appBasePath = null;
        if (SpiceConfig::getInstance()->configExists() && isset(SpiceConfig::getInstance()->config['app_base_path'])) {
            $appBasePath = SpiceConfig::getInstance()->config['app_base_path'];
        } else {
            //fallback, check known directory names
            $appBasePath = $currentDirectoryName = dirname($_SERVER['PHP_SELF']);
            if (in_array($currentDirectoryName, ['/api', '/back', '/backend', '/spicecrm_be_factory'])) {
                $appBasePath = $currentDirectoryName;
            }
        }

        /**
         * backwards compatibility trying to determine if we have KREST in the Route
         * if yes add it to the basepath
         * ToDo: remove in later version when we abandon KREST bwd compatibility
         */
        if(strpos($_SERVER['REQUEST_URI'], 'KREST') !== false){
            $appBasePath .= '/KREST';
        }

        return $appBasePath;
    }

    /**
     * A temporary method of generating GUIDs of the correct format for our DB.
     * @return String containing a GUID in the format: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
     *
     * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
     * All Rights Reserved.
     * Contributor(s): ______________________________________..
     */
    public static function createGuid(): string {
        $microTime = microtime();
        list($a_dec, $a_sec) = explode(" ", $microTime);

        $dec_hex = dechex($a_dec * 1000000);
        $sec_hex = dechex($a_sec);

        self::ensureLength($dec_hex, 5);
        self::ensureLength($sec_hex, 6);

        $guid = "";
        $guid .= $dec_hex;
        $guid .= self::createGuidSection(3);
        $guid .= '-';
        $guid .= self::createGuidSection(4);
        $guid .= '-';
        $guid .= self::createGuidSection(4);
        $guid .= '-';
        $guid .= self::createGuidSection(4);
        $guid .= '-';
        $guid .= $sec_hex;
        $guid .= self::createGuidSection(6);

        return $guid;
    }

    public static function createGuidSection($characters): string {
        $return = "";
        for ($i = 0; $i < $characters; $i++) {
            $return .= dechex(mt_rand(0, 15));
        }
        return $return;
    }

    public static function ensureLength(&$string, $length): void {
        $strlen = strlen($string);
        if ($strlen < $length) {
            $string = str_pad($string, $length, "0");
        } else if ($strlen > $length) {
            $string = substr($string, 0, $length);
        }
    }

    /**
     * Returns a translated abbreviation for a week day.
     * In case no translation is provided, just the default english version is returned.
     *
     * @param DateTime $date
     * @param string $language
     * @return string
     */
    public static function getShortWeekdayName(DateTime $date, string $language = 'de_DE'): string
    {
        // todo move that array once it grows.
        $weekdayStrings = [
            'de_DE' => [
                'Mon' => 'Mo',
                'Tue' => 'Di',
                'Wed' => 'Mi',
                'Thu' => 'Do',
                'Fri' => 'Fr',
                'Sat' => 'Sa',
                'Sun' => 'So',
            ],
        ];

        $weekday = $date->format('D');

        return ($weekdayStrings[$language][$weekday]) ?? $weekday;
    }


    /**
     * get max value for property in array of objects
     * @param array $arr
     * @param string $property
     * @return mixed
     */
    public static function getMaxDate($arr, $property)
    {
        return max(array_column($arr, $property));
    }

    /**
     * get min value for property in array of objects
     * @param array $arr
     * @param string $property
     * @return mixed
     */
    public static function getMinDate($arr, $property)
    {
        return min(array_column($arr, $property));
    }
}
