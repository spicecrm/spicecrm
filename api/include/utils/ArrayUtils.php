<?php
namespace SpiceCRM\includes\utils;


class ArrayUtils
{
    /**
     * Given an array and key names, return a string in the form of $array_name[$key_name[0]][$key_name[1]]... = $value recursively.
     * @params : $key_names - array of keys
     * 			 $array_name- name of the array
     * 			 $value -value of the array
     * 			 $eval - evals the generated string if true, note that the array name must be in the global space!
     * @return : example - string $array_name['a']['b']['c'][.] = 'hello'
     */
    public static function overrideValueToStringRecursive2($arrayName, $valueName, $value, $saveEmpty = true) {
        $quotedVname = var_export($valueName, true);
        if (is_array($value)) {
            $str = '';
            $newArrayName = $arrayName . "[$quotedVname]";
            foreach ($value as $key => $val) {
                $str .= self::overrideValueToStringRecursive2($newArrayName, $key, $val, $saveEmpty);
            }
            return $str;
        } else {
            if (!$saveEmpty && empty($value)) {
                return;
            } else {
                return "\$$arrayName" . "[$quotedVname] = " . var_export($value, true) . ";\n";
            }
        }
    }

    /**
     * This function returns an array of all the key=>value pairs in $array1
     * that are wither not present, or different in $array2.
     * If a key exists in $array2 but not $array1, it will not be reported.
     * Values which are arrays are traced further and reported only if thier is a difference
     * in one or more of thier children.
     *
     * @param array $array1 , the array which contains all the key=>values you wish to check againts
     * @param array $array2 , the array which
     * @param array $allowEmpty , will return the value if it is empty in $array1 and not in $array2,
     * otherwise empty values in $array1 are ignored.
     * @return array containing the differences between the two arrays
     */
    public static function deepArrayDiff($array1, $array2, $allowEmpty = false): array {
        $diff = [];
        foreach ($array1 as $key => $value) {
            if (is_array($value)) {
                if ((!isset($array2[$key]) || !is_array($array2[$key])) && (isset($value) || $allowEmpty)) {
                    $diff[$key] = $value;
                } else {
                    $value = self::deepArrayDiff($array1[$key], $array2[$key], $allowEmpty);
                    if (!empty($value) || $allowEmpty)
                        $diff[$key] = $value;
                }
            } elseif ((!isset($array2[$key]) || $value != $array2[$key]) && (isset($value) || $allowEmpty)) {
                $diff[$key] = $value;
            }
        }
        return $diff;
    }

    /**
     * Search an array for a given value ignorning case sensitivity
     *
     * @param unknown_type $key
     * @param unknown_type $haystack
     */
    public static function arraySearchInsensitive($key, $haystack): bool {
        if (!is_array($haystack)) {
            return false;
        }

        $found = false;
        foreach ($haystack as $k => $v) {
            if (strtolower($v) == strtolower($key)) {
                $found = true;
                break;
            }
        }

        return $found;
    }
}