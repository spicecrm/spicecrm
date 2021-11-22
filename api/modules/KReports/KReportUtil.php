<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\KReports;

class KReportUtil {

    /**
     * Checks if value is an integer
     * @param $value
     * @param bool $allow_negative
     * @return false|int
     */
    public static function KReportValueIsIntegerOnly($value, $allow_negative = false){
        if($allow_negative){
            return is_int($value) || preg_match('/^[0-9|-].[0-9]*$/', $value);
        }
        return is_int($value) || preg_match('/^[0-9]*$/', $value);
    }


    /**
     * Check if value is an ID: enabled digit, a-z char, - and _. Starts with char of digit
     * @param $value
     * @param bool $allow_negative
     * @return false|int
     */
    public static function KReportValueIsAnId($value){
        return preg_match('/^[0-9|a-z].[0-9|a-z|-]*$/i', $value);
    }
}
