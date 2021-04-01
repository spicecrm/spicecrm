<?php
/* * *******************************************************************************
* This file is part of KReporter. KReporter is an enhancement developed
* by aac services k.s.. All rights are (c) 2016 by aac services k.s.
*
* This Version of the KReporter is licensed software and may only be used in
* alignment with the License Agreement received with this Software.
* This Software is copyrighted and may not be further distributed without
* witten consent of aac services k.s.
*
* You can contact us at info@kreporter.org
******************************************************************************* */

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
