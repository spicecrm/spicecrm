<?php

namespace SpiceCRM\includes\utils;

use DateTime;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\LogicHook\LogicHook;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SpiceUI\api\controllers\SpiceUIModulesController;

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
        if (strpos($_SERVER['REQUEST_URI'], 'KREST') !== false) {
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
    public static function createGuid(): string
    {
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

    public static function createGuidSection($characters): string
    {
        $return = "";
        for ($i = 0; $i < $characters; $i++) {
            $return .= dechex(mt_rand(0, 15));
        }
        return $return;
    }

    public static function ensureLength(&$string, $length): void
    {
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

    /**
     * An example validation rule for the validation middleware.
     * An exception is thrown if the string length is odd.
     * Otherwise the validation is passed.
     *
     * @param $value
     * @throws Exception
     */
    public static function exampleValidationRule($value)
    {
        if (strlen($value) % 2) {
            throw new ValidationException('String length is odd.');
        }
    }

    /**
     * Checks if a module name string corresponds to a module name that is registered in the system.
     *
     * @param string $moduleName
     * @return bool
     */
    public static function isValidModule(string $moduleName): bool
    {
        $controller = new SpiceUIModulesController();
        $moduleList = $controller->geUnfilteredModules();
        if (array_key_exists($moduleName, $moduleList)) {
            return true;
        }
        return false;
    }

    /**
     * A cleanup function that is registered to run after a script has finished or exit() was called.
     *
     * @param bool $exit
     */
    public static function spiceCleanup(bool $exit = false)
    {
        // todo check if there's even a database
        if (!$GLOBALS['installing']) { // workaround for installer for now. variable is set in SpiceInstallerController ... find a better way
            $db = DBManagerFactory::getInstance();
            $db->disconnect();
        }
        if ($exit) {
            exit;
        }
    }

    /**
     * returns the current client IP
     *
     * @return mixed|string
     */
    public static function getClientIP()
    {
        if ($_SERVER['HTTP_CLIENT_IP'])
            return $_SERVER['HTTP_CLIENT_IP'];
        else if ($_SERVER['HTTP_X_FORWARDED_FOR'])
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if ($_SERVER['HTTP_X_FORWARDED'])
            return $_SERVER['HTTP_X_FORWARDED'];
        else if ($_SERVER['HTTP_FORWARDED_FOR'])
            return $_SERVER['HTTP_FORWARDED_FOR'];
        else if ($_SERVER['HTTP_FORWARDED'])
            return $_SERVER['HTTP_FORWARDED'];
        else if ($_SERVER['REMOTE_ADDR'])
            return $_SERVER['REMOTE_ADDR'];
        else
            return 'UNKNOWN';

    }
}
