<?php
namespace SpiceCRM\includes\utils;

class DBUtils
{
    private static $toHTML = [
        '"' => '&quot;',
        '<' => '&lt;',
        '>' => '&gt;',
        "'" => '&#039;',
    ];

    /**
     * Return a version of $proposed that can be used as a column name in any of our supported databases
     * Practically this means no longer than 25 characters as the smallest identifier length for our supported DBs is 30 chars for Oracle plus we add on at least four characters in some places (for indices for example)
     * @param string $name Proposed name for the column
     * @param string $ensureUnique
     * @return string Valid column name trimmed to right length and with invalid characters removed
     */
    public static function getValidDBName(string $name, $ensureUnique = false): string {
        return DBManagerFactory::getInstance()->getValidDBName($name, $ensureUnique);
    }

    /**
     * Replaces specific characters with their HTML entity values
     * @param string $string String to check/replace
     * @param bool $encode Default true
     * @return string
     *
     * @todo Make this utilize the external caching mechanism after re-testing (see
     *       log on r25320).
     *
     * Bug 49489 - removed caching of to_html strings as it was consuming memory and
     * never releasing it
     */
    public static function toHtml($string, $encode = true) {
        if (empty($string)) {
            return $string;
        }

        if ($encode && is_string($string)) {
            /*
             * cn: bug 13376 - handle ampersands separately
             * credit: ashimamura via bug portal
             */
            //$string = str_replace("&", "&amp;", $string);

            if (is_array(self::$toHTML)) { // cn: causing errors in i18n test suite ($toHTML is non-array)
                $string = str_ireplace($GLOBALS['toHTML_keys'], $GLOBALS['toHTML_values'], $string);
            }
        }

        return $string;
    }

    /**
     * Replaces specific HTML entity values with the true characters
     * @param string $string String to check/replace
     * @param bool $encode Default true
     * @return string
     */
    public static function fromHtml($string, $encode = true): string {
        if (!is_string($string) || !$encode) {
            return $string;
        }

        static $toHTML_values = null;
        static $toHTML_keys = null;
        static $cache = [];
        if (!empty(self::$toHTML) && is_array(self::$toHTML) && (!isset($toHTML_values) || !empty($GLOBALS['from_html_cache_clear']))) {
            $toHTML_values = array_values(self::$toHTML);
            $toHTML_keys = array_keys(self::$toHTML);
        }

        // Bug 36261 - Decode &amp; so we can handle double encoded entities
        $string = str_ireplace("&amp;", "&", $string);

        if (!isset($cache[$string])) {
            $cache[$string] = str_ireplace($toHTML_values, $toHTML_keys, $string);
        }
        return $cache[$string];
    }
}