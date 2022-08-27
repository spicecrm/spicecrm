<?php
/*********************************************************************************
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 *
 * You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
 * SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by SugarCRM".
 ********************************************************************************/



use SpiceCRM\data\SpiceBean;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarCache\SugarCache;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\includes\authentication\AuthenticationController;

/* * *******************************************************************************

 * Description:  Includes generic helper functions used throughout the application.
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
 * All Rights Reserved.
 * Contributor(s): ______________________________________..
 * ****************************************************************************** */


/**
 * @deprecated - Module Language no longer exisats
 *
 * This function retrieves a module's language file and returns the array of strings included.
 *
 * @param string $language specific language to load
 * @param string $module module name to load strings for
 * @param bool $refresh optional, true if you want to rebuild the language strings
 * @return array lang strings
 */
function return_module_language($language, $module, $refresh = false) {

    return [];
}



/**
 * Call this method instead of die().
 * We print the error message and then die with an appropriate
 * exit code.
 */
function sugar_die($error_message, $exit_code = 1) {
    SpiceUtils::spiceCleanup();
    throw new Exception( $error_message , 500) ;
}



/**
 * @deprecated moved to SpiceUtils
 * Designed to take a string passed in the URL as a parameter and clean all "bad" data from it
 *
 * @param string $str
 * @param string $filter which corresponds to a regular expression to use; choices are:
 * 		"STANDARD" ( default )
 * 		"STANDARDSPACE"
 * 		"FILE"
 * 		"NUMBER"
 * 		"SQL_COLUMN_LIST"
 * 		"PATH_NO_URL"
 * 		"SAFED_GET"
 * 		"UNIFIED_SEARCH"
 * 		"AUTO_INCREMENT"
 * 		"ALPHANUM"
 * @param boolean $dieOnBadData true (default) if you want to die if bad data if found, false if not
 */
function clean_string($str, $filter = "STANDARD", $dieOnBadData = true) {


    $filters = [
        "STANDARD" => '#[^A-Z0-9\-_\.\@]#i',
        "STANDARDSPACE" => '#[^A-Z0-9\-_\.\@\ ]#i',
        "FILE" => '#[^A-Z0-9\-_\.]#i',
        "NUMBER" => '#[^0-9\-]#i',
        "SQL_COLUMN_LIST" => '#[^A-Z0-9\(\),_\.]#i',
        "PATH_NO_URL" => '#://#i',
        "SAFED_GET" => '#[^A-Z0-9\@\=\&\?\.\/\-_~+]#i', /* range of allowed characters in a GET string */
        "UNIFIED_SEARCH" => "#[\\x00]#", /* cn: bug 3356 & 9236 - MBCS search strings */
        "AUTO_INCREMENT" => '#[^0-9\-,\ ]#i',
        "ALPHANUM" => '#[^A-Z0-9\-]#i',
    ];

    if (preg_match($filters[$filter], $str)) {
        if ((LoggerManager::getLogger()) ) {
            LoggerManager::getLogger()->fatal("SECURITY[$filter]: bad data passed in; string: {$str}");
        }
        if ($dieOnBadData) {
            die("Bad data passed in;");
        }
        return false;
    } else {
        return $str;
    }
}


/**
 * @deprecated moved to SpiceUtils
 * @param $value
 * @return array|string|string[]
 */
function securexss($value) {
    if (is_array($value)) {
        $new = [];
        foreach ($value as $key => $val) {
            $new[$key] = securexss($val);
        }
        return $new;
    }
    static $xss_cleanup = ["&quot;" => "&#38;", '"' => '&quot;', "'" => '&#039;', '<' => '&lt;', '>' => '&gt;'];
    $value = preg_replace(['/javascript:/i', '/\0/'], ['java script:', ''], $value);
    $value = preg_replace('/javascript:/i', 'java script:', $value);
    return str_replace(array_keys($xss_cleanup), array_values($xss_cleanup), $value);
}

/**
 * @deprecated moved to SpiceUtils
 * @param $category
 * @param $name
 * @param $value
 */
function set_register_value($category, $name, $value) {
    return SugarCache::sugar_cache_put("{$category}:{$name}", $value);
}

/**
 * @deprecated moved to SpiceUtils
 * @param $category
 * @param $name
 * @return mixed
 */
function get_register_value($category, $name) {
    return SugarCache::sugar_cache_retrieve("{$category}:{$name}");
}

/**
 * @deprecated moved to SpiceUtils
 * @param false $msg
 */
function display_notice($msg = false) {
    global $error_notice;
    //no error notice - lets just display the error to the user
    if (!isset($error_notice)) {
        echo '<br>' . $msg . '<br>';
    } else {
        $error_notice .= $msg . '<br>';
    }
}


/*
if (isset(SpiceConfig::getInstance()->config['stack_trace_errors']) && SpiceConfig::getInstance()->config['stack_trace_errors']) {
    set_error_handler('\SpiceCRM\includes\utils\SpiceUtils::StackTraceErrorHandler');
}
*/


/**
 * @deprecated moved to SpiceUtils
 * Identical to sugarArrayMerge but with some speed improvements and used specifically to merge
 * language files.  Language file merges do not need to account for null values so we can get some
 * performance increases by using this specialized function. Note this merge function does not properly
 * handle null values.
 *
 * @param $gimp
 * @param $dom
 * @return array
 */
function sugarLangArrayMerge($gimp, $dom) {
    if (is_array($gimp) && is_array($dom)) {
        foreach ($dom as $domKey => $domVal) {
            if (isset($gimp[$domKey])) {
                if (is_array($domVal)) {
                    $tempArr = [];
                    foreach ($domVal as $domArrKey => $domArrVal)
                        $tempArr[$domArrKey] = $domArrVal;
                    foreach ($gimp[$domKey] as $gimpArrKey => $gimpArrVal)
                        if (!isset($tempArr[$gimpArrKey]))
                            $tempArr[$gimpArrKey] = $gimpArrVal;
                    $gimp[$domKey] = $tempArr;
                }
                else {
                    $gimp[$domKey] = $domVal;
                }
            } else {
                $gimp[$domKey] = $domVal;
            }
        }
    }
    // if the passed value for gimp isn't an array, then return the $dom
    elseif (is_array($dom)) {
        return $dom;
    }

    return $gimp;
}

/**
 * @deprecated moved to SpiceUtils
 * Similiar to sugarArrayMerge except arrays of N depth are merged.
 *
 * @param array gimp the array whose values will be overloaded
 * @param array dom the array whose values will pwn the gimp's
 * @return array beaten gimp
 */
function sugarArrayMergeRecursive($gimp, $dom) {
    if (is_array($gimp) && is_array($dom)) {
        foreach ($dom as $domKey => $domVal) {
            if (array_key_exists($domKey, $gimp)) {
                if (is_array($domVal) && is_array($gimp[$domKey])) {
                    $gimp[$domKey] = sugarArrayMergeRecursive($gimp[$domKey], $domVal);
                } else {
                    $gimp[$domKey] = $domVal;
                }
            } else {
                $gimp[$domKey] = $domVal;
            }
        }
    }
    // if the passed value for gimp isn't an array, then return the $dom
    elseif (is_array($dom))
        return $dom;

    return $gimp;
}



/**
 * @deprecated moved to SpiceUtils
 * @param $a
 * @param $b
 * @return int
 */
function cmp_beans($a, $b) {
    global $sugar_web_service_order_by;
    //If the order_by field is not valid, return 0;
    if (empty($sugar_web_service_order_by) || !isset($a->$sugar_web_service_order_by) || !isset($b->$sugar_web_service_order_by)) {
        return 0;
    }
    if (is_object($a->$sugar_web_service_order_by) || is_object($b->$sugar_web_service_order_by) || is_array($a->$sugar_web_service_order_by) || is_array($b->$sugar_web_service_order_by)) {
        return 0;
    }
    if ($a->$sugar_web_service_order_by < $b->$sugar_web_service_order_by) {
        return -1;
    } else {
        return 1;
    }
}



//check to see if custom utils exists
if (file_exists('custom/include/custom_utils.php')) {
    include_once('custom/include/custom_utils.php');
}

//check to see if custom utils exists in Extension framework
if (file_exists('custom/application/Ext/Utils/custom_utils.ext.php')) {
    include_once('custom/application/Ext/Utils/custom_utils.ext.php');
}




/**
 * @deprecated moved to SpiceUtils
 * Remove vars marked senstitive from array
 * @param array $defs
 * @param SpiceBean|array $data
 * @return mixed $data without sensitive fields
 */
function clean_sensitive_data($defs, $data) {
    foreach ($defs as $field => $def) {
        if (!empty($def['sensitive'])) {
            if (is_array($data)) {
                $data[$field] = '';
            }
            if ($data instanceof SpiceBean) {
                $data->$field = '';
            }
        }
    }
    return $data;
}

/**
 * @deprecated moved to SpiceUtils
 * Gets the list of "*type_display*".
 * 
 * @return array
 */
function getTypeDisplayList() {
    return ['record_type_display', 'parent_type_display', 'record_type_display_notes'];
}

/**
 * @deprecated moved to SpiceUtils
 * get any Relationship between two modules as raw table rows
 *
 * @param unknown $lhs_module        	
 * @param unknown $rhs_module        	
 * @param string $type        	
 * @return array $rels
 */
function findRelationships($lhs_module, $rhs_module, $name = "", $type = "") {
    $db = DBManagerFactory::getInstance();

    $rels = [];
    // copied from Relationship module, but needed to modifiy, if there are more than one relationships of that combination
    $sql = "SELECT * FROM relationships
            WHERE deleted = 0
            AND (
            (lhs_module = '" . $lhs_module . "' AND rhs_module = '" . $rhs_module . "')
            OR
            (lhs_module = '" . $rhs_module . "' AND rhs_module = '" . $lhs_module . "')
            )
            ";
    if (!empty($type)) {
        $sql .= " AND relationship_type = '$type'";
    }
    if (!empty($name)) {
        $sql .= " AND relationship_name = '$name'";
    }
    $result = $db->query($sql, true, " Error searching relationships table...");
    while ($row = $db->fetchByAssoc($result)) {
        $rels [] = $row;
    }
    return $rels;
}





/**
 * @deprecated moved to SpiceUtils
 * format_number(deprecated)
 *
 * This method accepts an amount and formats it given the user's preferences.
 * Should the values set in the user preferences be invalid then it will
 * apply the system wide Sugar configuration values.  Calls to
 * getPrecendentPreference() method in Localization.php are made that
 * handle this logic.
 *
 * Going forward with Sugar 4.5.0e+ implementations, users of this class should
 * simple call this function with $amount parameter and leave it to the
 * class to locate and apply the appropriate formatting.
 *
 * One of the problems is that there is considerable legacy code that is using
 * this method for non currency formatting.  In other words, the format_number
 * method may be called to just display a number like 1,000 formatted appropriately.
 *
 * Also, issues about responsibilities arise.  Currently the callers of this function
 * are responsible for passing in the appropriate decimal and number rounding digits
 * as well as parameters to control displaying the currency symbol or not.
 *
 * @param $amount The currency amount to apply formatting to
 * @param $round Integer value for number of places to round to
 * @param $decimals Integer value for number of decimals to round to
 * @param $params Array of additional parameter values
 *
 *
 * The following are passed in as an array of params:
 *        boolean $params['currency_symbol'] - true to display currency symbol
 *        boolean $params['convert'] - true to convert from USD dollar
 *        boolean $params['percentage'] - true to display % sign
 *        boolean $params['symbol_space'] - true to have space between currency symbol and amount
 *        String  $params['symbol_override'] - string to over default currency symbol
 *        String  $params['type'] - pass in 'pdf' for pdf currency symbol conversion
 *        String  $params['currency_id'] - currency_id to retreive, defaults to current user
 *        String  $params['human'] - formatting that truncates the first thousands and appends "k"
 * @return String formatted currency value
 * @see include/Localization/Localization.php
 */
function format_number($amount, $round = null, $decimals = null, $params = []) {
    global $app_strings,  $locale;
    $current_user = AuthenticationController::getInstance()->getCurrentUser();
    static $current_users_currency = null;
    static $last_override_currency = null;
    static $override_currency_id = null;
    static $currency;

    $seps = get_number_seperators();
    $num_grp_sep = $seps[0];
    $dec_sep = $seps[1];

    // cn: bug 8522 - sig digits not honored in pdfs
    if(is_null($decimals)) {
        $decimals = $locale->getPrecision();
    }
    if(is_null($round)) {
        $round = $locale->getPrecision();
    }

    // only create a currency object if we need it
    if((!empty($params['currency_symbol']) && $params['currency_symbol']) ||
        (!empty($params['convert']) && $params['convert']) ||
        (!empty($params['currency_id']))) {
        // if we have an override currency_id
        if(!empty($params['currency_id'])) {
            if($override_currency_id != $params['currency_id']) {
                $override_currency_id = $params['currency_id'];
                $currency = BeanFactory::getBean('Currencies');
                $currency->retrieve($override_currency_id);
                $last_override_currency = $currency;
            } else {
                $currency = $last_override_currency;
            }

        } elseif(!isset($current_users_currency)) { // else use current user's
            $current_users_currency = BeanFactory::getBean('Currencies');
            if($current_user->getPreference('currency')) $current_users_currency->retrieve($current_user->getPreference('currency'));
            else $current_users_currency->retrieve('-99'); // use default if none set
            $currency = $current_users_currency;
        }
    }
    if(!empty($params['convert']) && $params['convert']) {
        $amount = $currency->convertFromBase($amount, 6);
    }

    if(!empty($params['currency_symbol']) && $params['currency_symbol']) {
        if(!empty($params['symbol_override'])) {
            $symbol = $params['symbol_override'];
        }
        elseif(!empty($params['type']) && $params['type'] == 'pdf') {
            $symbol = $currency->getPdfCurrencySymbol();
            $symbol_space = false;
        } else {
            if(empty($currency->symbol))
                $symbol = $currency->getDefaultCurrencySymbol();
            else
                $symbol = $currency->symbol;
            $symbol_space = true;
        }
    } else {
        $symbol = '';
    }

    if(isset($params['charset_convert'])) {
        $symbol = $locale->translateCharset($symbol, 'UTF-8', $locale->getExportCharset());
    }

    if(empty($params['human'])) {
        $amount = number_format(round($amount, $round), $decimals, $dec_sep, $num_grp_sep);
        $amount = format_place_symbol($amount, $symbol,(empty($params['symbol_space']) ? false : true));
    } else {
        // If amount is more greater than a thousand(positive or negative)
        if(strpos($amount, '.') > 0) {
            $checkAmount = strlen(substr($amount, 0, strpos($amount, '.')));
        }

        if($checkAmount >= 1000 || $checkAmount <= -1000) {
            $amount = round(($amount / 1000), 0);
            $amount = number_format($amount, 0, $dec_sep, $num_grp_sep); // add for SI bug 52498
            $amount = $amount . 'k';
            $amount = format_place_symbol($amount, $symbol,(empty($params['symbol_space']) ? false : true));
        } else {
            $amount = format_place_symbol($amount, $symbol,(empty($params['symbol_space']) ? false : true));
        }
    }

    if(!empty($params['percentage']) && $params['percentage']) $amount .= $app_strings['LBL_PERCENTAGE_SYMBOL'];
    return $amount;

} //end function format_number


/**
 * @deprecated moved to SpiceUtils
 * @param $amount
 * @param $symbol
 * @param $symbol_space
 * @param string $symbol_position : added in Winter release 2017
 * @return string
 */
function format_place_symbol($amount, $symbol, $symbol_space, $symbol_position = 'left') {
    if($symbol != '') {
        //get symbol_position from sugar_config
        if (isset(SpiceConfig::getInstance()->config['default_currency_symbol_position']))
            $symbol_position = SpiceConfig::getInstance()->config['default_currency_symbol_position'];

        switch ($symbol_position) {
            case 'right':
                if ($symbol_space == true) {
                    $amount = $amount . ( function_exists('mb_chr') ? mb_chr(160):' ' ) . $symbol; # mb_chr() exists from PHP 7.2, 160 ... No-Break Space (nbsp)
                } else {
                    $amount = $amount . $symbol;
                }
                break;
            default:
                if ($symbol_space == true) {
                    $amount = $symbol . ( function_exists('mb_chr') ? mb_chr(160):' ' ) . $amount; # mb_chr() exists from PHP 7.2, 160 ... No-Break Space (nbsp)
                } else {
                    $amount = $symbol . $amount;
                }
        }
    }
    return $amount;
}


/**
 * @deprecated moved to SpiceUtils
 * Returns user/system preference for number grouping separator character(default ",") and the decimal separator
 *(default ".").  Special case: when num_grp_sep is ".", it will return NULL as the num_grp_sep.
 * @return array Two element array, first item is num_grp_sep, 2nd item is dec_sep
 */
function get_number_seperators($reset_sep = false)
{
    $current_user = AuthenticationController::getInstance()->getCurrentUser();

    static $dec_sep = null;
    static $num_grp_sep = null;

    // This is typically only used during unit-tests
    // TODO: refactor this. unit tests should not have static dependencies
    if ($reset_sep)
    {
        $dec_sep = $num_grp_sep = null;
    }

    if ($dec_sep == null)
    {
        $dec_sep = SpiceConfig::getInstance()->config['default_decimal_seperator'];
        if (!empty($current_user->id))
        {
            $user_dec_sep = $current_user->getPreference('dec_sep');
            $dec_sep = (empty($user_dec_sep) ? SpiceConfig::getInstance()->config['default_decimal_seperator'] : $user_dec_sep);
        }
    }

    if ($num_grp_sep == null)
    {
        $num_grp_sep = SpiceConfig::getInstance()->config['default_number_grouping_seperator'];
        if (!empty($current_user->id))
        {
            $user_num_grp_sep = $current_user->getPreference('num_grp_sep');
            $num_grp_sep = (empty($user_num_grp_sep) ? SpiceConfig::getInstance()->config['default_number_grouping_seperator'] : $user_num_grp_sep);
        }
    }

    return [$num_grp_sep, $dec_sep];
}
