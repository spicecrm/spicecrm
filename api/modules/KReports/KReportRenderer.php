<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\KReports;

/*
 * separate class that handles formatting fd field bnased on the fieldrenderer and the record
 * renderes are returned from getXtyperenderer and are the sames as in the userinterface in Sencha
 */

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\TimeDate;

class KReportRenderer
{

    var $report = null;

    public function __construct($thisReport = null)
    {
        $this->report = $thisReport;
    }

    public static function kcurrencyRenderer($fieldid, $record)
    {
        if ($record[$fieldid] == '' || $record[$fieldid] == 0)
            return '';
        // 2014-02-25 .. set teh default system currency .. otherwise sugar might take the default users currency
        if (empty($record [$fieldid . '_curid']))
            $record [$fieldid . '_curid'] = '-99';
        return currency_format_number($record[$fieldid], ['currency_id' => $record [$fieldid . '_curid'], 'currency_symbol' => true]);
    }

    public static function kcurrencyintRenderer($fieldid, $record)
    {
        if ($record[$fieldid] == '' || $record[$fieldid] == 0)
            return '';
        // 2014-02-25 .. set teh default system currency .. otherwise sugar might take the default users currency
        if (empty($record [$fieldid . '_curid']))
            $record [$fieldid . '_curid'] = '-99';
        return currency_format_number($record[$fieldid], ['round' => 0, 'decimals'=> 0, 'currency_id' => $record [$fieldid . '_curid'], 'currency_symbol' => true]);
    }

    public function kenumRenderer($fieldid, $record)
    {
        global $app_list_strings;
        //2013-03-15 check if we have a group concat then translate the individual values
        if (in_array($this->report->fieldNameMap [$fieldid]['sqlFunction'], ['GROUP_CONCAT', 'GROUP_CONASC', 'GROUP_CONDSC'])) {
            $valArray = explode(',', $record[$fieldid]);
            $fieldValue = '';
            foreach ($valArray as $thisValue) {
                if ($fieldValue != '')
                    $fieldValue .= ', ';
                if (trim($thisValue) != '' && isset($this->report->kQueryArray->queryArray [(isset($record ['unionid']) ? $record ['unionid'] : 'root')] ['kQuery']->fieldNameMap [$fieldid] ['fields_name_map_entry'] ['options'])) {
                    if (is_array($this->report->fieldNameMap[$fieldid]['fields_name_map_entry']['function']) && isset($this->report->fieldNameMap[$fieldid]['fields_name_map_entry']['function']['include'])) {
                        $fielName = $this->report->fieldNameMap[$fieldid]['fields_name_map_entry']['function']['include'];
                        require_once($fielName);
                        $functionName = $this->report->fieldNameMap[$fieldid]['fields_name_map_entry']['function']['name'];
                        $fieldValue = $functionName(null, $this->report->fieldNameMap [$fieldid]['fieldname'], $record[$thisValue]);
                    } else
                        $fieldValue .= $app_list_strings [$this->report->kQueryArray->queryArray [(isset($record ['unionid']) ? $record ['unionid'] : 'root')]['kQuery']->fieldNameMap[$fieldid]['fields_name_map_entry']['options']][trim($thisValue)];
                }
            }
        } else {
            if (is_array($this->report->fieldNameMap[$fieldid]['fields_name_map_entry']['function']) && isset($this->report->fieldNameMap[$fieldid]['fields_name_map_entry']['function']['include'])) {
                $fielName = $this->report->fieldNameMap [$fieldid]['fields_name_map_entry'] ['function']['include'];
                require_once($fielName);
                $functionName = $this->report->fieldNameMap [$fieldid]['fields_name_map_entry'] ['function']['name'];
                $fieldValue = $functionName(null, $this->report->fieldNameMap [$fieldid]['fieldname'], $record[$fieldid]);
            } else
                $fieldValue = $app_list_strings [$this->report->kQueryArray->queryArray [(isset($record ['unionid']) ? $record ['unionid'] : 'root')] ['kQuery']->fieldNameMap[$fieldid]['fields_name_map_entry']['options']][$record[$fieldid]];
        }

        // if value is empty we return the original value
        if (empty($fieldValue))
            $fieldValue = $record [$fieldid];

        return $fieldValue;
    }

    public function kradioenumRenderer($fieldid, $record)
    {
        return $this->kenumRenderer($fieldid, $record);
    }

    public function kmultienumRenderer($fieldid, $record)
    {
        global $app_list_strings;
        if ($this->report->fieldNameMap [$fieldid] ['sqlFunction'] == '') {
            $fieldArray = preg_split('/\^,\^/', $record [$fieldid]);
            //bugfix 2010-09-22 if only one value is selected
            if (is_array($fieldArray) && count($fieldArray) > 1) {
                $fieldValue = '';
                foreach ($fieldArray as $thisFieldValue) {
                    if ($fieldValue != '')
                        $fieldValue .= ', ';
                    $fieldValue .= $app_list_strings [$this->report->kQueryArray->queryArray [(isset($fieldArray ['unionid']) ? $fieldArray ['unionid'] : 'root')] ['kQuery']->fieldNameMap [$fieldid] ['fields_name_map_entry'] ['options']] [trim($thisFieldValue, '^')];
                }
            } else {
                $fieldValue = $app_list_strings [$this->report->kQueryArray->queryArray [(isset($fieldArray ['unionid']) ? $fieldArray ['unionid'] : 'root')] ['kQuery']->fieldNameMap [$fieldid] ['fields_name_map_entry'] ['options']] [trim($record [$fieldid], '^')];
            }
        }
        return $fieldValue;
    }

    public static function kpercentageRenderer($fieldid, $record)
    {
        return round($record[$fieldid], 2) . '%';
    }

    public static function knumberRenderer($fieldid, $record)
    {
        return round($record[$fieldid], 2);
//        return format_number($record[$fieldid], \SpiceCRM\includes\authentication\AuthenticationController::getInstance()->getCurrentUser()->getPreference('default_currency_significant_digits'));
    }

    public static function kintRenderer($fieldid, $record)
    {

//        return round($record[$fieldid]);
        return format_number($record[$fieldid], 0, 0);
    }

    public static function kdateRenderer($fieldid, $record)
    {
        $timedate = TimeDate::getInstance();
        // 2013-10-03 no Date TZ Conversion Bug#504
        return ($record[$fieldid] != '' ? $timedate->to_display_date($record[$fieldid], false) : '');
    }

    public static function kdatetimeRenderer($fieldid, $record)
    {
        $timedate = TimeDate::getInstance();
$db = DBManagerFactory::getInstance();
        return ($record[$fieldid] != '' ? $db->fromConvert($record[$fieldid], 'datetime') : '');
    }

    public static function kdatetutcRenderer($fieldid, $record)
    {
        $timedate = TimeDate::getInstance();
        return ($record[$fieldid] != '' ? $record[$fieldid] : '');
    }

    public function kboolRenderer($fieldid, $record)
    {
        if($this->report->tocsv)
            return $record[$fieldid];
        global $mod_strings;
        return ($record[$fieldid] == '1' ? ($mod_strings['LBL_BOOL_1'] ?: 1) : ($mod_strings['LBL_BOOL_0'] ?: 0));
    }

    public static function ktextRenderer($fieldid, $record)
    {
        return $record[$fieldid];
    }

}
