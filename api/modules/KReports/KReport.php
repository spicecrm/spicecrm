<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\KReports;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\Campaigns\Campaign;
use SpiceCRM\modules\ProspectLists\ProspectList;

require_once('modules/KReports/utils.php');

global $dictionary;

//2013-05-14 include files with custom functions .. Bug #478
//2013-10-19 check if file exists before .. Bug #507
if (file_exists('./custom/modules/KReports/includes')) {
    $dirHandle = opendir('./custom/modules/KReports/includes');
    while (false !== ($nextFile = readdir($dirHandle))) {
        if (preg_match('/.php/', $nextFile)) {
            require_once('custom/modules/KReports/includes/' . $nextFile);
        }
    }
}


class KReport extends SugarBean
{

    public $field_name_map;
    // Stored fields
    public $id;
    public $date_entered;
    public $date_modified;
    public $assigned_user_id;
    public $modified_user_id;
    public $created_by;
    public $created_by_name;
    public $modified_by_name;
    public $report_module = '';
    public $reportoptions = '';
    public $team_id;
    public $description;
    public $name;
    public $status;
    public $assigned_user_name;
    public $team_name;
    public $category_id;
    public $category_name;
    public $category_priority;
    public $table_name = "kreports";
    public $object_name = "KReport";
    public $module_dir = 'KReports';
    public $importable = true;
    public $dynamicoptions = false; //fix 2018-02-22 for KReportQuery referencefields looping
    // This is used to retrieve related fields from form posts.
    // var $additional_column_fields = Array('assigned_user_name', 'assigned_user_id', 'contact_name', 'contact_phone', 'contact_email', 'parent_name');


    /*
      //what we need to build the where join string
      var $tablePath;
      var $joinSegments;
      var $rootGuid;
      var $fromString;
     */
    public $whereOverride;
    //2010-02-10 add Field name Mapping
    public $fieldNameMap;
    // the query Array
    public $kQueryArray;
    //2011-02-03 for the total values
    public $totalResult = '';
    // 2011-03-29 array for the formula evaluation
    public $formulaArray = '';
    // variable taht allows to turn off the evaluation of SQL Functions
    // needed if we let the Grid do this
    public $evalSQLFunctions = true;
    // varaible to hold the depth of the join tree
    public $maxDepth;
    // var to hold an array of all list fields with index fieldid
    public $listFieldArrayById = [];
    // for the context handling
    public $hasContext = false;
    public $contextFields = [];
    public $contexts = [];
    //for csv export
    public $tocsv = false;
    public $presentation_params;
    public $visualization_params;
    public $integration_params;
    public $listfields;
    public $whereconditions;

    function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL' :
                return true;
        }
        return false;
    }

    function get_summary_text()
    {
        return $this->name;
    }

    function set_notification_body($xtpl, $kreport)
    {
        $xtpl->assign("KREPORT_NAME", $kreport->name);
        return $xtpl;
    }

    /**
     * @param int $id
     * @param false $encode
     * @param bool $deleted
     * @param bool $relationships
     * @return $this|false|KReport|null
     */
    function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {

        // return false just like parent
        if(!parent::retrieve($id, $encode, $deleted, $relationships)){
            return false;
        }

        if(empty($this->wheregroups))
            $this->wheregroups = "[]";
        if(empty($this->whereconditions))
            $this->whereconditions = "[]";

        if ($this->id != '') {
            $arrayList = json_decode(html_entity_decode($this->listfields, ENT_QUOTES, 'UTF-8'), true);
            foreach ($arrayList as $listFieldData)
                $this->listFieldArrayById [$listFieldData ['fieldid']] = $listFieldData;
        }

        //get kreportcategory
//        if(!empty($this->category_id) && file_exists('modules/KReports/views/view.categories.php')){
//            $q = "SELECT name FROM kreportcategories WHERE id='".$this->category_id."' AND deleted=0";
//            if($res = $this->db->query($q)){
//                while($row = $this->db->fetchByAssoc($res)){
//                    $this->category_name = $row['name'];
//                }
//            }
//        }

        return $this;
    }

    function save($notify = true, $fts_index_bean = true)
    {


        // just to make sure ... PRO needs this .. if we are not in PRO it does not hurt
        // just to make sure ... PRO needs this .. if we are not in PRO it does not hurt
        if (empty($this->team_id)) {
            $this->team_id = '1';
        } else {
            $this->team_set_id = '';
        }

        parent::save($notify, $fts_index_bean);
    }

    /*
     * Function to get the enum values for a field
     */

    function getEnumValues($fieldId)
    {
        global $app_list_strings, $current_language;
        if (!is_array($app_list_strings)) {
            $app_list_strings = return_app_list_strings_language($current_language);
        }

        // fix 2010-10-25 .. enums not found for charts
        // fix 2011-03-07 ... in a union scenario we might have different enums and need to merge them
        /*
          if(isset($this->fieldNameMap[$fieldId]['fields_name_map_entry']['options']))
          {
          return $app_list_strings[$this->fieldNameMap[$fieldId]['fields_name_map_entry']['options']];
          }
          else
          {
          return '';
          }
         */
        // loop over all kquery entries in teh query array and merge Options from the $app_list_strings
        $retArray = [];
        foreach ($this->kQueryArray->queryArray as $unionid => $unionkQuery) {
            if (isset($unionkQuery ['kQuery']->fieldNameMap [$fieldId] ['fields_name_map_entry'] ['options'])
                //Begin BugFix 2017-01-18: Opportunities.date_closed has options set! Check on field type!
                && preg_match("/enum/i",$unionkQuery ['kQuery']->fieldNameMap [$fieldId] ['fields_name_map_entry'] ['type'])) {
                //end
                if (is_array($app_list_strings [$unionkQuery ['kQuery']->fieldNameMap [$fieldId] ['fields_name_map_entry'] ['options']]))
                    foreach ($app_list_strings [$unionkQuery ['kQuery']->fieldNameMap [$fieldId] ['fields_name_map_entry'] ['options']] as $key => $value)
                        $retArray [$key] = $value;
            }
        }

        if (count($retArray) > 0)
            return $retArray;
        else
            return '';
    }

    function fill_in_additional_detail_fields()
    {
        parent::fill_in_additional_detail_fields();
        if ($this->report_module != '') {
            //$sqlArray = $this->build_sql_string();
            //$this->sql_statement = $sqlArray['select'] . ' ' . $sqlArray['from'] . ' ' . $sqlArray['where'] . ' ' . $sqlArray['groupby'] . ' ' . $sqlArray['orderby'] ;
        }

        //CockpitView: get category name
        if(!empty($this->category_id)){
            $q= "SELECT name category_name FROM kreportcategories WHERE id='".$this->category_id."' AND deleted=0";
            $row = $this->db->fetchByAssoc($this->db->query($q));
            $this->category_name = $row['category_name'];
        }
    }

    /*
     * Function to return the Fielname from a given Path
     */

    function getFieldNameFromPath($pathName)
    {
        return substr($pathName, strrpos($pathName, "::") + 2, strlen($pathName));
    }

    /*
     * Function to return the Pathname from a given Path
     */

    function getPathNameFromPath($pathName)
    {
        return substr($pathName, 0, strrpos($pathName, "::"));
    }

    function get_report_main_sql_query($evalSQLFunctions = true, $additionalFilter = '', $additionalGroupBy = [], $parameters = [])
    {
        //global $app_list_strings;
        $db = DBManagerFactory::getInstance();
        // bugfix add ENT_QUOTES so we get proper translation of also single quotes 2010-25-12
        $arrayWhere = json_decode(html_entity_decode($this->whereconditions, ENT_QUOTES), true);
        $arrayList = json_decode(html_entity_decode($this->listfields, ENT_QUOTES), true);
        $arrayWhereGroups = json_decode(html_entity_decode($this->wheregroups, ENT_QUOTES), true);
        $arrayUnionList = json_decode(html_entity_decode($this->unionlistfields, ENT_QUOTES), true);

        // evaluate report Options and pass them along to the Query Array
        $reportOptions = json_decode(html_entity_decode($this->reportoptions, ENT_QUOTES), true);

        if (isset($reportOptions ['authCheck']))
            $paramsArray ['authChecklevel'] = $reportOptions ['authCheck'];
        if (isset($reportOptions ['showDeleted']))
            $paramsArray ['showDeleted'] = $reportOptions ['showDeleted'];

        // pass along the context of the report query for additional filtering of selection criteria
        if (isset($parameters ['context']))
            $paramsArray ['context'] = $parameters ['context'];
        if (isset($parameters ['parentbean']))
            $paramsArray ['parentbean'] = $parameters ['parentbean'];

        if (isset($parameters ['sortseq']))
            $paramsArray ['sortseq'] = $parameters ['sortseq'];
        if (isset($parameters ['sortid']))
            $paramsArray ['sortid'] = $parameters ['sortid'];

        if (isset($parameters ['exclusiveGrouping']))
            $paramsArray ['exclusiveGrouping'] = $parameters ['exclusiveGrouping'];

        if (isset($parameters['start']) && isset($parameters['limit'])) {
            //handle start not set and start content (added maretval 2019-05-03)
            if (isset($parameters['start']) && !KReportUtil::KReportValueIsIntegerOnly($parameters['start']))
                $paramsArray['start'] = 0;
            //handle limit not set and limit content (added maretval 2019-05-03)
            if (isset($parameters['limit']) && !KReportUtil::KReportValueIsIntegerOnly($parameters['limit']))
                $paramsArray['limit'] = 0;
        }


        $this->kQueryArray = new KReportQueryArray($this->report_module, $this->whereOverride, $this->union_modules, $evalSQLFunctions, $arrayList, $arrayUnionList, $arrayWhere, $additionalFilter, $arrayWhereGroups, $additionalGroupBy, $paramsArray);
        $sqlString = $this->kQueryArray->build_query_strings();
        $this->fieldNameMap = $this->kQueryArray->fieldNameMap;

        return $sqlString;

        // return array('select' => $this->kQueryArray->selectString, 'from' => $this->kQueryArray->fromString, 'where' => $this->kQueryArray->whereString ,'fields' => '', 'groupby' => $this->kQueryArray->groupbyString, 'having' => $this->kQueryArray->havingString , 'orderby' => $this->kQueryArray->orderbyString);
    }

    /*
     * build the SQL String
     * deprecated will be removed
     */

    function build_sql_string()
    {
        global $app_list_strings;
        $db = DBManagerFactory::getInstance();

        $arrayWhere = json_decode(html_entity_decode($this->whereconditions, ENT_QUOTES, 'UTF-8'), true);
        $arrayList = json_decode(html_entity_decode($this->listfields, ENT_QUOTES, 'UTF-8'), true);
        $arrayWhereGroups = json_decode(html_entity_decode($this->wheregroups, ENT_QUOTES, 'UTF-8'), true);

        $kQuery = new KReportQuery($this->report_module, $this->evalSQLFunctions, $arrayList, $arrayWhere, $arrayWhereGroups);

        $kQuery->build_query_strings();
        $this->fieldNameMap = $kQuery->fieldNameMap;

        return ['select' => $kQuery->selectString, 'from' => $kQuery->fromString, 'where' => $kQuery->whereString, 'fields' => '', 'groupby' => $kQuery->groupbyString, 'orderby' => $kQuery->orderbyString];
    }

    // 2010-12-18 added function for formatting based on FieldType
    function getFieldTypeById($fieldID)
    {
        if ($this->fieldNameMap == null)
            $this->get_report_main_sql_query('', true, '');
        return $this->fieldNameMap [$fieldID] ['type'];
    }

    function buildLinks($fieldArray, $excludeFields = [])
    {

        foreach ($fieldArray as $fieldID => $fieldValue) {
            if (isset($this->fieldNameMap [$fieldID]) && $this->fieldNameMap [$fieldID] ['islink'] && !in_array($fieldID, $excludeFields)) {
                // swith if we have aunion query
                if (isset($fieldArray ['unionid']))
                    $fieldValue = '<a href="index.php?module=' . $this->kQueryArray->queryArray [$fieldArray ['unionid']] ['kQuery']->fieldNameMap [$fieldID] ['module'] . '&action=DetailView&record=' . $fieldArray [$this->kQueryArray->queryArray [$fieldArray ['unionid']] ['kQuery']->fieldNameMap [$fieldID] ['tablealias'] . 'id'] . '" target="_new" class="tabDetailViewDFLink">' . $fieldValue . '</a>';
                else
                    $fieldValue = '<a href="index.php?module=' . $this->kQueryArray->queryArray ['root'] ['kQuery']->fieldNameMap [$fieldID] ['module'] . '&action=DetailView&record=' . $fieldArray [$this->fieldNameMap [$fieldID] ['tablealias'] . 'id'] . '" target="_new" class="tabDetailViewDFLink">' . $fieldValue . '</a>';
            }
            $returnArray [$fieldID] = $fieldValue;
        }
        return $returnArray;
    }

    /*
     * function that loops thourgh all fieldids passed in checks if they are links and returns modules and id fields in the record
     * used to build an arra that is passed to the view so the renderer can create links in the frontend
     */

    function buildLinkArray($fieldArray)
    {
        global $app_list_strings, $timedate;

        $linkArray = [];

        foreach ($fieldArray as $fieldId => $fieldName) {
            if (isset($this->fieldNameMap [$fieldId]) && $this->fieldNameMap [$fieldId] ['islink']) {
                $linkFieldArray = [];

                foreach ($this->kQueryArray->queryArray as $unionid => $unionQuery) {
                    $linkFieldArray[$unionid] = [
                        'module' => $unionQuery['kQuery']->fieldNameMap[$fieldId]['module'],
                        // 2013-08-21 BUG #491 .. check if custom field and trake root path alias
                        'idfield' => ($unionQuery['kQuery']->fieldNameMap[$fieldId]['fields_name_map_entry']['source'] == 'custom_fields' ? $unionQuery['kQuery']->fieldNameMap[$fieldId]['pathalias'] : $unionQuery['kQuery']->fieldNameMap[$fieldId]['tablealias']) . 'id'
                    ];
                }

                $linkArray[$fieldId] = $linkFieldArray;
            }
        }
        return $linkArray;
    }

    /* widgets removed
    function evaluateWidgets($fieldArray, $excludeFields = array()) {
        global $app_list_strings, $timedate;

        $listFieldArray = json_decode(html_entity_decode($this->listfields, ENT_QUOTES, 'UTF-8'), true);

        foreach ($fieldArray as $fieldID => $fieldValue) {
            if (isset($this->listFieldArrayById [$fieldID] ['widget']) && $this->listFieldArrayById [$fieldID] ['widget'] != '') {
                require_once ('modules/KReports/KReporterWidgets/' . $this->listFieldArrayById [$fieldID] ['widget'] . '.php');
                $widgetClass = new $this->listFieldArrayById[$fieldID]['widget']();
                $fieldValue = $widgetClass->renderField($fieldValue);
            }
            $returnArray [$fieldID] = $fieldValue;
        }
        return $returnArray;
    }
    */

    function calculateValueOfTotal($fieldArray, &$cumulatedArray = [])
    {
        // set the returnarray
        $returnArray = $fieldArray;

        // this is ugly .. whould bring this to the front
        foreach ($this->kQueryArray->queryArray ['root'] ['kQuery']->listArray as $thisFieldData) {
            if ($thisFieldData ['valuetype'] != '' && $thisFieldData ['valuetype'] != '-' && isset($this->totalResult[$thisFieldData['fieldid'] . '_total']) && $this->totalResult[$thisFieldData['fieldid'] . '_total'] > 0) {
                $valuetypeArray = explode('OF', $thisFieldData ['valuetype']);
                switch ($valuetypeArray [0]) {
                    case 'P' :
                        // calculate the value
                        $returnArray [$thisFieldData['fieldid']] = round((double)$returnArray [$thisFieldData['fieldid']] / (double)$this->totalResult[$thisFieldData['fieldid'] . '_total'] * 100, 2);

                        // set the format to float so we interpret this as number
                        $this->fieldNameMap [$thisFieldData['fieldid']] ['type'] = 'float';
                        $this->fieldNameMap [$thisFieldData['fieldid']] ['format_suffix'] = '%';
                        break;
                    case 'D' :
                        // calculate the value
                        $returnArray[$thisFieldData ['fieldid']] = round((double)$returnArray[$thisFieldData['fieldid']] - (double)$this->totalResult[$thisFieldData['fieldid'] . '_total'], 2);
                        break;
                    case 'C':
                        if (!empty($cumulatedArray[$thisFieldData ['fieldid']])) {
                            $returnArray[$thisFieldData['fieldid']] += $cumulatedArray[$thisFieldData['fieldid']];
                            $cumulatedArray[$thisFieldData['fieldid']] += $fieldArray[$thisFieldData['fieldid']];
                        } else
                            $cumulatedArray[$thisFieldData['fieldid']] = $fieldArray[$thisFieldData['fieldid']];
                        break;
                }
            }
        }

        // return the Results
        return $returnArray;
    }

    function formatFields($fieldArray, $excludeFields = [], $toPdf = false, $forceUTF8 = false)
    {
        //require_once('modules/Currencies/Currency.php');

        global $app_list_strings, $mod_strings, $timedate;

        // 2012-03-29 memorize the complete fields ... has issues with the currencies
        $completeFieldArray = $fieldArray;

        $thisRenderer = new KReportRenderer($this);

        foreach ($fieldArray as $fieldID => $fieldValue) {
            // get the FieldDetails from the Query
            $fieldDetails = $this->kQueryArray->queryArray['root']['kQuery']->get_listfieldentry_by_fieldid($fieldID);
            if ($fieldDetails !== false && isset($this->fieldNameMap [$fieldID]) && !in_array($fieldID, $excludeFields) && (!isset($fieldDetails ['customsqlfunction']) || (isset($fieldDetails ['customsqlfunction']) && $fieldDetails ['customsqlfunction'] == ''))) {

                // 2013-05-18 individual rendering removed - handled by the Renderer Object
                $thisFieldRenderer = 'k' . (!empty($fieldDetails['overridetype']) ? $fieldDetails['overridetype'] : $this->fieldNameMap [$fieldID] ['type']) . 'Renderer';
                if (method_exists($thisRenderer, $thisFieldRenderer)) {
                    $fieldValue = $thisRenderer->$thisFieldRenderer($fieldID, $completeFieldArray);
                }
            }

            $returnArray [$fieldID] = $fieldValue;
        }

        return $returnArray;
    }

    /*
     * only render enums to the language depended values - if we do not format
     */

    function formatEnums($fieldArray, $excludeFields = [])
    {
        //require_once('modules/Currencies/Currency.php');

        global $app_list_strings, $current_language;

        $app_list_strings = return_app_list_strings_language($current_language);

        foreach ($fieldArray as $fieldID => $fieldValue) {
            // get the FieldDetails from the Query
            $fieldDetails = $this->kQueryArray->queryArray ['root'] ['kQuery']->get_listfieldentry_by_fieldid($fieldID);

            if (isset($this->fieldNameMap [$fieldID]) && !in_array($fieldID, $excludeFields) && (!isset($fieldDetails ['customsqlfunction']) || (isset($fieldDetails ['customsqlfunction']) && $fieldDetails ['customsqlfunction'] == ''))) {
                switch ($this->fieldNameMap [$fieldID] ['kreporttype'] ?: $this->fieldNameMap [$fieldID] ['type']) {

                    case 'enum' :
                    case 'radioenum' :
                    case 'dynamicenum' :  //added 2019-02-13 contribution by fibrecrm for SuiteCRM dynamic dropdowns support
                        //2013-03-15 check if we have a group concat then translate the individual values
                        if (in_array($this->fieldNameMap [$fieldID]['sqlFunction'], ['GROUP_CONCAT', 'GROUP_CONASC', 'GROUP_CONDSC'])) {
                            $valArray = explode(',', $fieldValue);
                            $fieldValue = '';
                            foreach ($valArray as $thisValue) {
                                if ($fieldValue != '')
                                    $fieldValue .= ', ';
                                if (trim($thisValue) != '' && isset($this->kQueryArray->queryArray [(isset($fieldArray ['unionid']) ? $fieldArray ['unionid'] : 'root')] ['kQuery']->fieldNameMap [$fieldID] ['fields_name_map_entry'] ['options']))
                                    $fieldValue .= $app_list_strings [$this->kQueryArray->queryArray [(isset($fieldArray ['unionid']) ? $fieldArray ['unionid'] : 'root')] ['kQuery']->fieldNameMap [$fieldID] ['fields_name_map_entry'] ['options']] [trim($thisValue)];
                            }
                        } else {
                            // 2011-03-07 add the orig value for the treeid
                            $returnArray [$fieldID . '_val'] = $fieldValue;
                            // chek if we have a function set
                            if (is_array($this->fieldNameMap[$fieldID]['fields_name_map_entry']['function']) && isset($this->fieldNameMap[$fieldID]['fields_name_map_entry']['function']['include'])) {
                                $fielName = $this->fieldNameMap[$fieldID]['fields_name_map_entry']['function']['include'];
                                require_once ($fielName);
                                $functionName = $this->fieldNameMap[$fieldID]['fields_name_map_entry']['function']['name'];
                                $fieldValue = $functionName(null, $this->fieldNameMap[$fieldID]['fieldname'], $fieldValue);
                            } else {
                                // bug 2011-03-07 fields might have different options if in a join
                                //$fieldValue = $app_list_strings[$this->fieldNameMap[$fieldID]['fields_name_map_entry']['options']][$fieldValue];
                                if ($fieldValue != '' && isset($this->kQueryArray->queryArray [(isset($fieldArray ['unionid']) ? $fieldArray ['unionid'] : 'root')] ['kQuery']->fieldNameMap [$fieldID] ['fields_name_map_entry'] ['options']))
                                    $fieldValue = $app_list_strings [$this->kQueryArray->queryArray [(isset($fieldArray ['unionid']) ? $fieldArray ['unionid'] : 'root')] ['kQuery']->fieldNameMap [$fieldID] ['fields_name_map_entry'] ['options']] [$fieldValue];
                            }
                        }

                        // bug 2011-05-25
                        // if value is empty we return the original value
                        if ($fieldValue == '')
                            $fieldValue = $returnArray [$fieldID . '_val'];
                        break;
                    case 'multienum' :
                        // do not format if we have a function (Count ... etc ... )
                        if ($this->fieldNameMap [$fieldID] ['sqlFunction'] == '') {
                            $fieldArray = preg_split('/\^,\^/', $fieldValue);
                            //bugfix 2010-09-22 if only one value is selected
                            if (is_array($fieldArray) && count($fieldArray) > 1) {
                                $fieldValue = '';
                                foreach ($fieldArray as $thisFieldValue) {
                                    if ($fieldValue != '')
                                        $fieldValue .= ', ';

                                    //bugfix 2010-09-22 trim the prefix since this is starting and ending with
                                    // bug 2011-03-07 fields might have different options if in a join
                                    //$fieldValue .= 	$app_list_strings[$this->fieldNameMap[$fieldID]['fields_name_map_entry']['options']][trim($thisFieldValue, '^')];
                                    $fieldValue .= $app_list_strings [$this->kQueryArray->queryArray [(isset($fieldArray ['unionid']) ? $fieldArray ['unionid'] : 'root')] ['kQuery']->fieldNameMap [$fieldID] ['fields_name_map_entry'] ['options']] [trim($thisFieldValue, '^')];
                                }
                            } else {
                                // bug 2011-03-07 fields might have different options if in a join
                                // $fieldValue = $app_list_strings[$this->fieldNameMap[$fieldID]['fields_name_map_entry']['options']][trim($fieldValue, '^')];
                                $fieldValue = $app_list_strings [$this->kQueryArray->queryArray [(isset($fieldArray ['unionid']) ? $fieldArray ['unionid'] : 'root')] ['kQuery']->fieldNameMap [$fieldID] ['fields_name_map_entry'] ['options']] [trim($fieldValue, '^')];
                            }
                        }
                        break;
                }
            }

            $returnArray [$fieldID] = $fieldValue;
        }

        return $returnArray;
    }


    /*
     * only render time Fields
     */

    function formateDateTime($fieldArray, $excludeFields = [])
    {

        global $app_list_strings, $timedate;

        foreach ($fieldArray as $fieldID => $fieldValue) {
            // get the FieldDetails from the Query
            $fieldDetails = $this->kQueryArray->queryArray ['root'] ['kQuery']->get_listfieldentry_by_fieldid($fieldID);

            $returnArray [$fieldID] = $fieldValue;
        }

        return $returnArray;
    }

    function getXtypeRenderer($fieldType, $fieldID = '')
    {
        global $mod_strings;
$current_user = AuthenticationController::getInstance()->getCurrentUser();

        // check if we have a custom SQL function -- then reset the value .. we do  not know how to format
        if($this->kQueryArray->queryArray['root']['kQuery']){
            $listFieldArray = $this->kQueryArray->queryArray['root']['kQuery']->get_listfieldentry_by_fieldid($fieldID);
        }

        // 2013-05-16 ... bug #480 since we might query for fields that are not in the report
        // those fields are created dynamically in the pivot for the grid ...
        // there the formatter set in the Pivot Parameters is then used
        // if we do not find the field return false
        if ($listFieldArray === false)
            return false;

        // manage switching of Fieldtypes
        // TODO: this is ugly here but currently required - no better solution available
        if (isset($listFieldArray['sqlfunction']) && $listFieldArray ['sqlfunction'] == 'COUNT')
            $fieldType = 'int';
        if (isset($listFieldArray ['customsqlfunction']) && $listFieldArray ['customsqlfunction'] != '')
            $fieldType = '';
        if (isset($listFieldArray ['valuetype']) && $listFieldArray ['valuetype'] != '-' && $listFieldArray ['valuetype'] != '' && substr($listFieldArray ['valuetype'], 0, 1) == 'P')
            $fieldType = 'percentage';

        // 2012-12-30 properly hande ovverride type
        if (!empty($listFieldArray ['overridetype']) && $listFieldArray ['overridetype'] != "-")
            $fieldType = $listFieldArray ['overridetype'];

        // process thee fieldtypes
        switch ($fieldType) {
            case 'currencyint':
                return 'kcurrencyintRenderer';
            case 'currency':
                return 'kcurrencyRenderer';
            case 'percentage':
                return 'kpercentageRenderer';
            // bug 2011-03-25 format double & float properly
            case 'double' :
            case 'float' :
                // 2013-03-01 add number
            case 'number':
                //2013-04-06 type decimal
            case 'decimal':
                return 'knumberRenderer';
            case 'int' :
                return 'kintRenderer';
            // return ', renderer: function(value){return value;}';
            case 'date' :
                return 'kdateRenderer';
            case 'datetime' :
            case 'datetimecombo' :
                return 'kdatetimeRenderer';
            case 'datetutc':
                return 'kdatetutcRenderer';
            case 'bool' :
                return 'kboolRenderer';
            case 'text' :
                return 'ktextRenderer';
            default :
                return '';
        }

        // if we end up here we return an empty string
        return '';
    }

    function getXtypeAlignment($fieldType, $fieldID)
    {

        // check if we have a custom SQL function -- then reset the value .. we do  not know how to format
		if($this->kQueryArray->queryArray['root']['kQuery']) //fix 20171128 check if object!
			$listFieldArray = $this->kQueryArray->queryArray['root']['kQuery']->get_listfieldentry_by_fieldid($fieldID);

        //2013-03-01 maual alignmetn setting rules
        if (!empty($listFieldArray ['overridealignment']) && $listFieldArray ['overridealignment'] != "-")
            return $listFieldArray ['overridealignment'];

        // manage switching of Fieldtypes
        // TODO: this is ugly here but currently required - no better solution available
        if (isset($listFieldArray['sqlfunction']) && $listFieldArray ['sqlfunction'] == 'COUNT')
            $fieldType = 'int';
        if (isset($listFieldArray ['customsqlfunction']) && $listFieldArray ['customsqlfunction'] != '')
            $fieldType = '';
        if (isset($listFieldArray ['valuetype']) && $listFieldArray ['valuetype'] != '-' && $listFieldArray ['valuetype'] != '' && substr($listFieldArray ['valuetype'], 0, 1) == 'P')
            $fieldType = 'percentage';

        // 2012-12-30 properly hande ovverride type
        if (!empty($listFieldArray ['overridetype']) && $listFieldArray ['overridetype'] != "-")
            $fieldType = $listFieldArray ['overridetype'];

        // get XtypeAlignment config if available
        $configXtypeAlignment = "";
        if(isset(SpiceConfig::getInstance()->config['KReports']['getXtypeAlignment'][$fieldType])){
            $configXtypeAlignment = SpiceConfig::getInstance()->config['KReports']['getXtypeAlignment'][$fieldType];
        }

        // process the fieldtypes
        switch ($fieldType) {
            case 'currencyint':
            case 'currency':
            case 'number':
                return ((!empty($configXtypeAlignment) ) ? $configXtypeAlignment : 'right');
            case 'double' :
            case 'float' :
            case 'int' :
            case 'percentage':
                //2013-04-06 type decimal
            case 'decimal':
                return ((!empty($configXtypeAlignment) ) ? $configXtypeAlignment : 'center');
            default :
                return 'left';
        }
    }

    function createCSV($dynamicolsOverride = '', $parentbean = null)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $this->tocsv = true;

        $header = '';
        $rows = '';

        // SPICEUI-325 fallback delimiter when user pref is not set
        $export_delimiter = (!empty($current_user->getPreference('export_delimiter')) ? $current_user->getPreference('export_delimiter') : (SpiceConfig::getInstance()->config['export_delimiter'] ?: ";"));

        $reportParams = ['toCSV' => true];
        if ($dynamicolsOverride != '') {
            if(!is_array($dynamicolsOverride))
                $dynamicolsOverride = json_decode(html_entity_decode($dynamicolsOverride), true);
            foreach ($dynamicolsOverride as $thisOverrideKey => $thisOverrideEntry) {
                if (!empty($thisOverrideEntry['sortState'])) {
                    $reportParams['sortseq'] = $thisOverrideEntry['sortState'];
                    $reportParams['sortid'] = $thisOverrideEntry['dataIndex'];
                }
            }
        }

        // set a parentbean if we have one
        if($parentbean) $reportParams['parentbean'] = $parentbean;

        $results = $this->getSelectionResults($reportParams);
        //handel the selection parameters for Excel
        $selParam = '';
        $whereSelectionArray = $this->kQueryArray->get_where_array();
        foreach ($whereSelectionArray as $thisArrayEntry) {
            $selParam .= $thisArrayEntry['name'] . '/' . $thisArrayEntry['operator'] . '/' . $thisArrayEntry['value'];
            $selParam .= "\n";
        }

//        $selParam .= "\n"; //will add a empty first line in CSV export

        $arrayList = json_decode(html_entity_decode($this->listfields, ENT_QUOTES, 'UTF-8'), true);

        //see if we have dynamic cols in the Request ...
        $dynamicolsOverrid = [];
        if ($dynamicolsOverride != '') {
            $dynamicolsOverride = json_decode(html_entity_decode($dynamicolsOverride, ENT_QUOTES, 'UTF-8'), true);
            $overrideMap = [];
            foreach ($dynamicolsOverride as $thisOverrideKey => $thisOverrideEntry) {
                $overrideMap[$thisOverrideEntry['dataIndex']] = $thisOverrideKey;
            }

            //loop over the listfields
            for ($i = 0; $i < count($arrayList); $i++) {
                if (isset($overrideMap[$arrayList[$i]['fieldid']])) {
                    // set the display flag
                    if ($dynamicolsOverride[$overrideMap[$arrayList[$i]['fieldid']]]['isHidden'] == 'true')
                        $arrayList[$i]['display'] = 'no';
                    else
                        $arrayList[$i]['display'] = 'yes';

                    // set the width
                    $arrayList[$i]['width'] = $dynamicolsOverride[$overrideMap[$arrayList[$i]['fieldid']]]['width'];

                    // set the sequence
                    $arrayList[$i]['sequence'] = $dynamicolsOverride[$overrideMap[$arrayList[$i]['fieldid']]]['sequence'];
                }
            }

            // resort the array
            usort($arrayList, 'sortFieldArrayBySequence');
        }

        $fieldArray = [];
        $fieldIdArray = [];
        foreach ($arrayList as $thisList) {
            if ($thisList['display'] == 'yes') {
                $fieldArray[] = ['label' => utf8_decode($thisList ['name']), 'width' => (isset($thisList['width']) && $thisList ['width']!= '' && $thisList['width'] != '0') ? $thisList['width'] : '100', 'display' => $thisList['display']];
                $fieldIdArray[] = $thisList['fieldid'];
            }
        }

        $spiceLanguageHandler = new \SpiceCRM\includes\SpiceLanguages\SpiceLanguagesRESTHandler();
        if (count($results) > 0) {
            foreach ($results as $record) {
                $getHeader = ($header == '') ? true : false;
                foreach ($record as $key => $value) {

                    //if($key != 'sugarRecordId')
                    $arrayIndex = array_search($key, $fieldIdArray);
                    if (array_search($key, $fieldIdArray) !== false) {
                        if ($getHeader) {
                            foreach ($arrayList as $fieldId => $fieldArray)
                                if ($fieldArray['fieldid'] == $key){
                                    $translation = $spiceLanguageHandler->getTranslationLabelDataByName($fieldArray['name'], $current_language);
                                    $header .= '"' .iconv("UTF-8", $current_user->getPreference('default_export_charset'), $translation) . '"' . $export_delimiter;
                                }
                        }

                        $rows .= '"' . iconv("UTF-8", $current_user->getPreference('default_export_charset') . '//IGNORE', preg_replace(['/"/'], ['""'], strip_tags(html_entity_decode($value, ENT_QUOTES)))) . '"' . $export_delimiter;
                    }
                }
                if ($getHeader)
                    $header .= "\n";
                $rows .= "\n";
            }
        }

        return $selParam . $header . $rows;
    }

    function createTargeList($listname, $campaign_id = '')
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
$db = DBManagerFactory::getInstance();

        $results = $this->getSelectionResults([]);

        if (count($results > 0)) {
            require_once('modules/ProspectLists/ProspectList.php');
            $newProspectList = new ProspectList ();

            $newProspectList->name = $listname;
            $newProspectList->list_type = 'default';
            $newProspectList->assigned_user_id = $current_user->id;
            $newProspectList->save();

            // add to campaign
            if ($campaign_id != '') {
                require_once('modules/Campaigns/Campaign.php');
                $thisCampaign = new Campaign();
                $thisCampaign->retrieve($campaign_id);
                $thisCampaign->load_relationships();
                $campaignLinkedFields = $thisCampaign->get_linked_fields();
                foreach ($campaignLinkedFields as $linkedField => $linkedFieldData) {
                    if ($thisCampaign->$linkedField->_relationship->rhs_module == 'ProspectList')
                        $thisCampaign->$linkedField->add($newProspectList->id);
                }
            }

            // fill with results:
            $newProspectList->load_relationships();

            $linkedFields = $newProspectList->get_linked_fields();

            foreach ($linkedFields as $linkedField => $linkedFieldData) {
                if ($newProspectList->$linkedField->_relationship->rhs_module == $this->report_module) {
                    foreach ($results as $thisRecord) {
                        $newProspectList->$linkedField->add($thisRecord ['sugarRecordId']);
                    }
                } elseif ($newProspectList->$linkedField->_relationship->rhs_module == 'Campaigns' and $campaign_id != '') {
                    $newProspectList->$linkedField->add($campaign_id);
                }
            }
        }
    }

    /*
     * function to fetch Selection Results based on switch of Context
     */

    function getContextselectionResult($parameters, $getcount = false, $additionalFilter = '', $additionalGroupBy = [])
    {
        $query = '';

        //handle start not set and start content (added maretval 2019-05-03)
        if (!isset($parameters['start']) || !KReportUtil::KReportValueIsIntegerOnly((int)$parameters['start']))
            $parameters['start'] = 0;
        //handle limit not set and limit content (added maretval 2019-05-03)
        if (!isset($parameters['limit']) || !KReportUtil::KReportValueIsIntegerOnly((int)$parameters['limit']))
            $parameters['limit'] = 0;


        if (!empty(SpiceConfig::getInstance()->config['k_dbconfig_clone'])) {
            $dbManagerName= SpiceConfig::getInstance()->config['k_dbconfig_clone']['db_manager'];
            $db = new $dbManagerName();

            // switch the db
            $db->connect(SpiceConfig::getInstance()->config['k_dbconfig_clone']);
        } else {
            $db = DBManagerFactory::getInstance();
        }

        // disable ONLY_FULL_GROUP_BY if this is set
        $db->query("SET sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))");

        // retun an empty array
        $retArray = [];

        // process the list
        /*
          if (isset($parameters ['grouping']) && $parameters ['grouping'] == 'off') {
          $query = $this->get_report_main_sql_query(false, $additionalFilter, $additionalGroupBy, $parameters);

          //$query = $sqlArray['select'] . ' ' . $sqlArray['from'] . ' ' . $sqlArray['where'] . ' ' . $sqlArray['having'] . ' ' . $sqlArray['orderby'];
          } else {
          $query = $this->get_report_main_sql_query(true, $additionalFilter, $additionalGroupBy, $parameters);

          //$query = $sqlArray['select'] . ' ' . $sqlArray['from'] . ' ' . $sqlArray['where'] . ' ' . $sqlArray['groupby'] . ' ' . $sqlArray['having'] . ' ' . $sqlArray['orderby'];
          }
         */
        // cehck if we only need the count than we shortcut here
        if ($getcount) {
            unset($parameters ['start']);
            unset($parameters ['limit']);
            $query = $this->get_report_main_sql_query(false, $additionalFilter, $additionalGroupBy, $parameters);
            // limit the query if a limit is set ...
            // 2012-10-28 .. handle limit
            //

            if ($this->selectionlimit != '') {
                $isPercentage = false;
                $selectionLimit = trim($this->selectionlimit);
                if (strpos($selectionLimit, 'p') > 0) {
                    $isPercentage = true;
                    $selectionLimit = trim(str_replace('p', '', $this->selectionlimit));
                    $totalRows = $db->getRowCount($queryResults = $db->query($query));
                    $selectionLimit = round($totalRows / 100 * $selectionLimit, 0);
                }
                if ($this->kQueryArray->countSelectString != '') {
                    $queryResults = $db->fetchByAssoc($db->limitquery($this->kQueryArray->countSelectString, 0, $selectionLimit));
                    echo $this->kQueryArray->countSelectString;
                    //BEGIN fix maretval 2019-03-07
                    //return $queryResults ['totalcount'];
                    return $queryResults ['totalCount'];
                    //END
                } else {
                    return $db->getRowCount($db->limitquery($query, 0, $selectionLimit));
                }

            } else {
                if ($this->kQueryArray->countSelectString != '') {
                    $queryResults = $db->fetchByAssoc($db->query($this->kQueryArray->countSelectString));
                    //BEGIN fix maretval 2019-03-07
                    //return $queryResults['totalcount'];
                    return $queryResults['totalCount'];
                    //END
                } else {
                    return $db->getRowCount($queryResults = $db->query($query));
                }
            }
        }

        // process seleciton limit and run the main query
        if ($this->selectionlimit != '') {
            $isPercentage = false;
            $selectionLimit = trim($this->selectionlimit);
            // 2013-02-26 check for p and not %
            if (strpos($selectionLimit, 'p') > 0) {
                $isPercentage = true;
                $selectionLimit = trim(str_replace('p', '', $this->selectionlimit));

                // 2013-02-26 if we do not yet have a query ... get it
                if ($query == '') {
                    $countParameters = $parameters;
                    unset($countParameters['start']);
                    unset($countParameters['limit']);
                    $query = $this->get_report_main_sql_query(false, $additionalFilter, $additionalGroupBy, $countParameters);
                }

                $totalRows = $db->getRowCount($queryResults = $db->query($query));
                $selectionLimit = round($totalRows / 100 * $selectionLimit, 0);
            } //2013-02-26 ... r for records indicator was hurting .. cut off
            else
                $selectionLimit = trim(str_replace('r', '', $this->selectionlimit));

            if (isset($parameters ['limit']) && $parameters ['limit'] != '' && isset($parameters ['start']))
                if ($parameters ['limit'] < $selectionLimit)
                    $selectionLimit = $parameters ['limit'];


            //$queryResults = $db->limitquery($query, $parameters ['start'], $selectionLimit);
            // 2014-08-18 bug #521 if stzart is not set set start to zero for selection from Charts
            if (empty($parameters ['start']))
                $parameters ['start'] = 0;

            $parameters ['limit'] = $selectionLimit;
        } else {
            if (isset($parameters ['limit']) && $parameters ['limit'] != '' && isset($parameters ['start'])) {
                // $queryResults = $db->limitquery($query, $parameters ['start'], $parameters ['limit']);
            } else {
                unset($parameters ['start']);
                unset($parameters ['limit']);
                //$queryResults = $db->query($query);
            }
        }
//        file_put_contents("sugarcrm.log", "#######". print_r($this->whereOverride, true)."\n", FILE_APPEND);

        $query = $this->get_report_main_sql_query(true, $additionalFilter, $additionalGroupBy, $parameters);

        $queryResults = $db->query($query);

        if ($_REQUEST['kreportdebugquery'] == true)
            echo $query;

        // 2011-02-03 added for percentage calculation of total
        //see if we need to query the totals
        if ($this->kQueryArray->totalSelectString != '') {
            $this->totalResult = $db->fetchByAssoc($db->query($this->kQueryArray->totalSelectString));
        }

        // preprocess Formulas
        $this->preProcessFormulas();

        // 2013-02-12 for cumulated fields
        $cumulatedArray = [];

        // get the restul rows and process them
        while ($queryRow = $db->fetchByAssoc($queryResults)) {
            // process formulas
            $this->processFormulas($queryRow);

            // just the basic Row
            $formattedRow = $queryRow;

            // calculate the percentage or dealtavalues
            if ($this->totalResult != '')
                $formattedRow = $this->calculateValueOfTotal($formattedRow, $cumulatedArray);

            // format the Fields
            if (!isset($parameters ['noFormat']) || (isset($parameters ['noFormat']) && !$parameters ['noFormat']))
                $formattedRow = $this->formatFields($formattedRow, isset($parameters ['dontFormat']) ? $parameters ['dontFormat'] : [], isset($parameters ['toPDF']) || isset($parameters ['toCSV']) ? true : false, isset($parameters ['toPDF']) ? true : false);
            else {
                // bug 2011-03-07 ... for charts enums should not be translated - Chart is handling this
                if (!isset($parameters ['noEnumTranslation']) || (isset($parameters ['noEnumTranslation']) && !$parameters ['noEnumTranslation']))
                    $formattedRow = $this->formatEnums($formattedRow, isset($parameters ['dontFormat']) ? $parameters ['dontFormat'] : []);

                // 2011-12-07 translate times to local time per usersetting
                // $formattedRow = $this->formatDates($formattedRow, isset($parameters ['dontFormat']) ? $parameters ['dontFormat'] : array());
            }

            //build the links
            //bugfix 2011-05-18 for links in export .. changed || to &&
            //     if ((!isset($parameters ['toPDF']) || (isset($parameters ['toPDF']) && !$parameters ['toPDF'])) && (!isset($parameters ['toCSV']) || (isset($parameters ['toCSV']) && !$parameters ['noLinks'])) && (!isset($parameters ['noLinks']) || (isset($parameters ['noLinks']) && !$parameters ['noLinks'])))
            //         $formattedRow = $this->buildLinks($formattedRow, isset($parameters ['dontFormat']) ? $parameters ['dontFormat'] : [] );
            // widget formatting
            //2013-09-07 Widgets only if explicitly set in Sugar Config Bug #497

            /* widgets removed
            if ($GLOBALS['sugarconfig']['evaluateWidgets'] == true)
                $formattedRow = $this->evaluateWidgets($formattedRow);
            */

            // return the formatted row
            $retArray [] = $formattedRow;
        }
        //$db->connect();


        return $retArray;
    }

    /*
     * Parameters:
     * 	- grouping: set to off to not have grouping
     *  - start: start from record
     *  - limit: limit to n records from start
     *  - addSQLFunction: array with fields and custom function that should be used to
     *    add/override the basic sql functions
     *  - noFormat: no formatting done
     *  - toPDF: formatting is doen but no links are built (not useful in PDF)
     *  - dontFormat: array with fieldids that should not be formatted when returing
     *    e.g. nbeeded for geocoding
     */

    function getSelectionResults($parameters, $snapshotid = '0', $getcount = false, $additionalFilter = '', $additionalGroupBy = [])
    {

        // parameter overrid listtype used for Charts
        $db = DBManagerFactory::getInstance();

        // set a configurable time limit ...
        //set_time_limit(10);
        // return an empty array if we have nothing else
        $retArray = [];

        //handle start not set and start content (added maretval 2019-05-03)
        if (!isset($parameters['start']) || !KReportUtil::KReportValueIsIntegerOnly($parameters['start']))
            $parameters['start'] = 0;
        //handle limit not set and limit content (added maretval 2019-05-03)
        if (!isset($parameters['limit']) || !KReportUtil::KReportValueIsIntegerOnly($parameters['limit']))
            $parameters['limit'] = 0;
        //handle snapshot_id content (added maretval 2019-05-03)
        if ($snapshotid != '0' && !KReportUtil::KReportValueIsAnId($snapshotid))
            $snapshotid = '0';


        // get the sql array or retrieve from snapshot if set
        if ($snapshotid == '0' || $snapshotid == 'current') {
            $retArray = $this->getContextselectionResult($parameters, $getcount, $additionalFilter, $additionalGroupBy);
        } else {
            $query = 'SELECT data FROM kreportsnapshotsdata WHERE snapshot_id = \'' . $snapshotid . '\'';

            // check if we only need the count than we shortcut here
            if ($getcount)
                return $this->db->getRowCount($db->query($query));

            // limit the query if requested
            if (isset($parameters ['start']) && $parameters ['start'] != '') {
                $query .= ' AND record_id >= ' . $parameters ['start'];
            }

            if (isset($parameters ['limit']) && $parameters ['limit'] != '') {
                $query .= ' AND record_id < ' . ($parameters ['start'] + $parameters ['limit']);
            }

            $query .= ' ORDER BY record_id ASC';

            $snapshotResults = $db->query($query);

            // still need to process this to have all teh setting for theformat
            $sqlArray = $this->get_report_main_sql_query('', true, '');

            //2017-06-28 bug fix load snapshot queryArray and overwrite current one
            $query = 'SELECT data FROM kreportsnapshots WHERE id = \'' . $snapshotid . '\'';
            $srow = $db->fetchByAssoc($db->query($query));
            $this->kQueryArray->queryArray = unserialize(base64_decode(html_entity_decode($srow['data'])));

            while ($snapshotRecordData = $db->fetchByAssoc($snapshotResults)) {

                // just the basic Row
                // 2012-12-05 ... we might find inks in the returned data not properly escaped. Fixed that so the json is not broken
                // $formattedRow = json_decode(html_entity_decode($snapshotRecordData ['data'], ENT_QUOTES, 'UTF-8'));
                // 2017-06-27 bug fix unicode not saved properly. NOw json saved as base64. Decode
                $jsonstring = base64_decode(html_entity_decode($snapshotRecordData['data']));
                //backward compatibility before base64_encode (KReporter < 4.2)
                if(!$jsonstring)
                    $jsonstring = html_entity_decode($snapshotRecordData['data']);

                preg_match_all("/\<a(.*)a\>/U", $jsonstring, $matches);
                foreach ($matches[0] as $key => $value)
                    $jsonstring = str_replace($value, urlencode($value), $jsonstring);

                $formattedRow = json_decode($jsonstring, true);


                // format the Fields
                if (!isset($parameters ['noFormat']) || (isset($parameters ['noFormat']) && !$parameters ['noFormat']))
                    $formattedRow = $this->formatFields($formattedRow, isset($parameters ['dontFormat']) ? $parameters ['dontFormat'] : []);

                //build the links unless we can conserve the ids with the snapshot this will not work ...
                //if(!isset($parameters['toPDF']) || (isset($parameters['toPDF']) && !$parameters['toPDF']))
                //	$formattedRow = $this->buildLinks($formattedRow, isset($parameters['dontFormat']) ? $parameters['dontFormat'] : array());
                // return the formatted row
                $retArray [] = $formattedRow;
            }
        }
        return $retArray;
    }

    /**
     * retrieve the where clause used when taking the snapshot to update where clause display when snapshotdata is loaded
     * @param $snapshot_id
     */
    public static function getSnapshotWhereClause($snapshot_id){
        $db = DBManagerFactory::getInstance();
        if($res = $db->query("SELECT snapshotquery FROM kreportsnapshots WHERE id='".$snapshot_id."'")){
            while($row = $db->fetchByAssoc($res)){
                if(!empty($row['snapshotquery'])){
                    return json_decode(html_entity_decode($row['snapshotquery'], ENT_QUOTES), true);
                }
            }
        }
        return [];
    }

    /*
     * evaluate if we have listfields with a context
     */

    function reportHasContextFields()
    {
        $hasContext = false;

        $arrayList = json_decode(html_entity_decode($this->listfields, ENT_QUOTES), true);
        foreach ($arrayList as $thisListEntry) {
            if ($thisListEntry ['context'] != '') {
                // make sure we set that we have context
                $hasContext = true;

                // set the field context and the context settings
                $this->contextFields [$thisListEntry ['fieldid']] = $thisListEntry ['context'];
                // sett the context we found ... replacing spaces as we handle it later on
                $this->contexts [preg_replace('/ /', '', $thisListEntry ['context'])] = preg_replace('/ /', '', $thisListEntry ['context']);
            }
        }

        return $hasContext;
    }

    /*
     * Preprocessor for Formulas
     */

    function preProcessFormulas($arrayName = 'row')
    {
        $arrayList = json_decode(html_entity_decode($this->listfields, ENT_QUOTES), true);

        $logicalNameToIdMap = [];

        // map the fields to ids
        foreach ($arrayList as $thisListEntry) {
            if (isset($thisListEntry['assigntovalue']) && $thisListEntry['assigntovalue'] != '')
                $logicalNameToIdMap[$thisListEntry['assigntovalue']] = $thisListEntry['fieldid'];
        }

        $sequencedFormulas = [];
        $unsequencedFormulas = [];

        // get the formulas
        foreach ($arrayList as $thisListEntry) {
            if (isset($thisListEntry['formulavalue']) && $thisListEntry['formulavalue'] != '') {
                // parse the fieldids into the formula
                //2012-09-18 base64 encode the Formula so we can have funny characters and not break the json encoding
                //2012-10-02 legacy handling checking if the string is a valid base64 string
                //2013-01-22 changed to rawurldecode
                //$formulaRaw = urldecode(base64_decode($thisListEntry ['formulavalue'], true));
                $formulaRaw = rawurldecode(base64_decode($thisListEntry ['formulavalue'], true));

                // if the value is not base 64
                if (!$formulaRaw)
                    $formulaRaw = $thisListEntry ['formulavalue'];

                foreach ($logicalNameToIdMap as $valuekey => $fieldid) {
                    $formulaRaw = preg_replace('/\{' . $valuekey . '\}/', '\$' . $arrayName . '[\'' . $fieldid . '\']', $formulaRaw);
                }

                // add the target field id
                $formulaRaw = '$' . $arrayName . '[\'' . $thisListEntry ['fieldid'] . '\'] = ' . $formulaRaw;

                // make sure all expressions are matched
                if (preg_match('/\{/', $formulaRaw) == 0 && preg_match('/\}/', $formulaRaw) == 0) {
                    if (isset($thisListEntry ['formulasequence']) && $thisListEntry ['formulasequence'] != '')
                        $sequencedFormulas [$thisListEntry ['formulasequence']] = $formulaRaw;
                    else
                        $unsequencedFormulas [] = $formulaRaw;
                }
            }
        }

        // sort and merge the array
        ksort($sequencedFormulas);
        $this->formulaArray = array_merge($sequencedFormulas, $unsequencedFormulas);
    }

    /*
     * process the variious functions for a row
     */

    function processFormulas(&$row)
    {

        if (is_array($this->formulaArray)) {
            foreach ($this->formulaArray as $sequence => $formula) {
                //2013-03-06 suppress error messages
                @eval($formula . ';');
            }
        }
    }

    function takeSnapshot()
    {
        $db = DBManagerFactory::getInstance();

        $snapshotID = create_guid();

        // go get the results
        $results = $this->getSelectionResults(['toPDF' => true, 'noFormat' => true]);

        $i = 0;
        foreach ($results as $resultsrow) {
            //2017-06-28 bug fix save data to DB by using bsae64_encode
            $query = 'INSERT INTO kreportsnapshotsdata SET record_id=\'' . $i . '\', snapshot_id = \'' . $snapshotID . '\', data=\'' . DBManagerFactory::getInstance()->quote(base64_encode(json_encode($resultsrow) )). '\'';
            $db->query($query);
            $i++;
        }

        // create the snapshot record
        //2017-06-28 bug fix missing id matching for snapshotdata. Save queryArray
        $queryArray = $this->kQueryArray->queryArray;
        $query = 'INSERT INTO kreportsnapshots SET id=\'' . $snapshotID . '\', snapshotdate =\'' . gmdate('Y-m-d H:i:s') . '\', report_id=\'' . $this->id . '\', data=\''. DBManagerFactory::getInstance()->quote(base64_encode(serialize($queryArray) )).'\', snapshotquery = '.(!empty($this->whereOverride) ? '\''.$db->quote(json_encode($this->whereOverride)).'\'' : 'NULL');
        $db->query($query);
    }

    function getSnapshots($withoutActual = false)
    {
        // 2012-11-21 change so a label can be used
        global $mod_strings;
        $mod_strings = return_module_language($_SESSION['authenticated_user_language'], 'KReports');

        $retArray = [];

        $query = 'SELECT id, snapshotdate FROM kreportsnapshots WHERE report_id = \'' . $this->id . '\' ORDER BY snapshotdate DESC';

        $snapShotsResults = $this->db->query($query);

        // 2012-11-21 change so a label can be used
        if ($withoutActual == 'true')
            $retArray [] = ['snapshot' => '0', 'description' => $mod_strings['LBL_CURRENT_SNAPSHOT']];

        while ($thisSnapshot = $this->db->fetchByAssoc($snapShotsResults)) {
            $retArray [] = ['snapshot' => $thisSnapshot ['id'], 'description' => $thisSnapshot ['snapshotdate']];
        }
        return $retArray;
    }

    function deleteSnapshot($snapshotId)
    {
        $errors = [];
        $success = true;
        if(!$this->db->query("DELETE FROM kreportsnapshotsdata WHERE snapshot_id = '$snapshotId'")){
            $errors[] = $this->db->lastError();
            $success = false;
        }
        if(!$this->db->query("DELETE FROM kreportsnapshots WHERE id = '$snapshotId'")){
            $errors[] = $this->db->lastError();
            $success = false;
        }
        return ['success' => $success, 'errors' => $errors ];
    }

    function getListFields()
    {

        // anlyze all the pathes we have
        //$this->build_path();
        // build the from clause and all join segments
        //$this->build_joinsegments();


        $arrayList = json_decode(html_entity_decode($this->listfields, ENT_QUOTES, 'UTF-8'), true);

        $retArray [] = ['fieldid' => '-', 'fieldname' => '-'];

        if (is_array($arrayList)) {
            foreach ($arrayList as $thisList) {
                //$pathName = $this->getPathNameFromPath($thisList['path']);
                //$fieldName = explode(':', $this->getFieldNameFromPath($thisList['path']));
                //if($this->joinSegments[$pathName]['object']->field_name_map[$fieldname[1]]->type == 'currency')
                $retArray [] = ['fieldid' => $thisList ['fieldid'], 'fieldname' => $thisList ['name']];
            }
        } else {
            $retArray = '';
        }

        return $retArray;
    }

    function getListFieldsArray()
    {
        $fieldArray = json_decode(html_entity_decode($this->listfields, ENT_QUOTES, 'UTF-8'), true);

        foreach ($fieldArray as $fieldCount => $fieldData)
            $returnArray [$fieldData ['fieldid']] = $fieldData;

        return $returnArray;
    }


    // for the GeoCoding
    function massGeoCode()
    {
        global $app_list_strings, $mod_strings;

        require_once('modules/KReports/BingMaps/BingMaps.php');

        // flag to memorize if we hjave different beans for longitude and latiitude
        // not sure when this would happen buit it could happen
        $longlatDiff = false;

        // get the map details for the report
        $mapDetails = json_decode(html_entity_decode($this->mapoptions, ENT_QUOTES, 'UTF-8'));

        $serverName = dirname($_SERVER ['HTTP_HOST'] . $_SERVER ['SCRIPT_NAME']);

        // get the report results
        $results = $this->getSelectionResults([]);

        // get the ids for longitude and latitude
        $long_bean_id = $this->kQueryArray->queryArray ['root'] ['kQuery']->joinSegments [$this->kQueryArray->fieldNameMap [$mapDetails->longitude] ['path']] ['alias'];
        $lat_bean_id = $this->kQueryArray->queryArray ['root'] ['kQuery']->joinSegments [$this->kQueryArray->fieldNameMap [$mapDetails->latitude] ['path']] ['alias'];

        // get the beans
        $long_bean = $this->kQueryArray->queryArray ['root'] ['kQuery']->joinSegments [$this->kQueryArray->fieldNameMap [$mapDetails->longitude] ['path']] ['object'];
        if ($long_bean_id != $lat_bean_id) {
            $longlatDiff = true;
            $lat_bean = $this->kQueryArray->queryArray ['root'] ['kQuery']->joinSegments [$this->kQueryArray->fieldNameMap [$mapDetails->latitude] ['path']] ['object'];
        }

        if (count($results) > 0) {

            $mapService = new kReportBingMaps ();
            require_once(get_custom_file_if_exists('modules/Accounts/Account.php'));

            foreach ($results as $thisResult) {
                if (($thisResult [$mapDetails->latitude] == '' || $thisResult [$mapDetails->latitude] == null || $thisResult [$mapDetails->latitude] == '0,00') || ($thisResult [$mapDetails->longitude] == '' || $thisResult [$mapDetails->longitude] == null || $thisResult [$mapDetails->longitude] == '0,00')) {

                    //$query = $thisResult[$mapDetails->geocodeStreet] . ', ' .  $thisResult[$mapDetails->geocodePostalcode] . ' ' .  $thisResult[$mapDetails->geocodeCity] . ' ' .  $thisResult[$mapDetails->geocodeCountry];
                    $addressArray = ['AddressLine' => $thisResult [$mapDetails->geocodeStreet], 'PostalCode' => $thisResult [$mapDetails->geocodePostalcode], 'Locality' => $thisResult [$mapDetails->geocodeCity], 'CountryRegion' => $thisResult [$mapDetails->geocodeCountry]];
                    $geoCodeResult = $mapService->geocode($addressArray);

                    // update object
                    $long_bean->retrieve($thisResult [$long_bean_id . 'id']);
                    $long_bean->{$this->kQueryArray->fieldNameMap [$mapDetails->longitude] ['fieldname']} = $geoCodeResult ['longitude'];

                    //2010-12-6 format numbers after mass geocode
                    $long_bean->format_field($long_bean->field_defs [$this->kQueryArray->fieldNameMap [$mapDetails->longitude] ['fieldname']]);

                    // see if we have different beans
                    // should be the exceptionbut we never know
                    if (!$longlatDiff) {
                        $long_bean->{$this->kQueryArray->fieldNameMap [$mapDetails->latitude] ['fieldname']} = $geoCodeResult ['latitude'];

                        //2010-12-6 format numbers after mass geocode
                        $long_bean->format_field($long_bean->field_defs [$this->kQueryArray->fieldNameMap [$mapDetails->latitude] ['fieldname']]);
                    } else {
                        $lat_bean->retrieve($thisResult [$lat_bean_id . 'id']);
                        $lat_bean->{$this->kQueryArray->fieldNameMap [$mapDetails->latitude] ['fieldname']} = $geoCodeResult ['latitude'];

                        //2010-12-6 format numbers after mass geocode
                        $lat_bean->format_field($lat_bean->field_defs [$this->kQueryArray->fieldNameMap [$mapDetails->latitude] ['fieldname']]);

                        $lat_bean->save();
                    }

                    $long_bean->save();
                }
            }
        }
    }

    function getGeoCodes()
    {
        global $app_list_strings, $mod_strings;

        $mapDetails = json_decode(html_entity_decode($this->mapoptions, ENT_QUOTES, 'UTF-8'));
        // $jsonerror = json_last_error();
        //build an array with the field value and the image name if we have entries set
        if ($mapDetails->imageMap != '') {
            $imageMapArray = json_decode($mapDetails->imageMap, true);
            foreach ($imageMapArray as $imageMapentry)
                $imageMapRecArray[$imageMapentry['value']] = $imageMapentry['image'];
        }

        // an empty array to return
        $returnArray = [];

        // get the report results
        $results = $this->getSelectionResults(['dontFormat' => [$mapDetails->longitude, $mapDetails->latitude]]);

        $categoryArray = [];
        $categoryCount = 1;

        $mapBounds = ['topLeft' => ['x' => 0, 'y' => 0], 'bottomRight' => ['x' => 0, 'y' => 0]];

        if (count($results > 0)) {
            foreach ($results as $thisRecord) {
                //see if we have a category

                if (isset($mapDetails->typeimages) && $mapDetails->typeimages == 'true' && isset($thisRecord [$mapDetails->type]) && $thisRecord [$mapDetails->type] != '') {
                    //	if (isset ( $mapDetails->type ) && $mapDetails->type != '' && isset ( $thisRecord [$mapDetails->type] ) && $thisRecord [$mapDetails->type] != '') {
                    if (!isset($categoryArray [$thisRecord [$mapDetails->type]])) {
                        $categoryArray [$thisRecord [$mapDetails->type]] = $categoryCount;
                        $categoryCount++;
                    }
                    $returnArray ['data'] [] = ['id' => $thisRecord ['sugarRecordId'], 'geox' => $thisRecord [$mapDetails->longitude], 'geoy' => $thisRecord [$mapDetails->latitude], 'category_id' => (string)$categoryArray [$thisRecord [$mapDetails->type]], 'category' => $thisRecord [$mapDetails->type], 'image' => $imageMapRecArray[$thisRecord [$mapDetails->type]], 'line1' => /* $thisRecord[$mapDetails->longitude] . '/' . $thisRecord[$mapDetails->latitude] . '<br>' . */
                        $thisRecord [$mapDetails->line1] . '<br>' . $thisRecord [$mapDetails->line2] . '<br>' . $thisRecord [$mapDetails->line3] . '<br>' . $thisRecord [$mapDetails->line4] . '<br>'];
                } else {
                    // $elementRecord[] = $thisRecord['sugarRecordId'];
                    $returnArray ['data'] [] = ['id' => $thisRecord ['sugarRecordId'], 'geox' => $thisRecord [$mapDetails->longitude], 'geoy' => $thisRecord [$mapDetails->latitude], 'category' => '', 'image' => '', 'line1' => /* $thisRecord[$mapDetails->longitude] . '/' . $thisRecord[$mapDetails->latitude] . '<br>' . */
                        $thisRecord [$mapDetails->line1] . '<br>' . $thisRecord [$mapDetails->line2] . '<br>' . $thisRecord [$mapDetails->line3] . '<br>' . $thisRecord [$mapDetails->line4] . '<br>'];
                }

                // set bounds
                if (floatval($thisRecord [$mapDetails->longitude]) != 0 && floatval($thisRecord [$mapDetails->latitude]) != 0) {
                    if ($mapBounds ['topLeft'] ['x'] == 0 || floatval($thisRecord [$mapDetails->longitude]) < floatval($mapBounds ['topLeft'] ['x']))
                        $mapBounds ['topLeft'] ['x'] = floatval($thisRecord [$mapDetails->longitude]);

                    if ($mapBounds ['topLeft'] ['y'] == 0 || floatval($thisRecord [$mapDetails->latitude]) > floatval($mapBounds ['topLeft'] ['y']))
                        $mapBounds ['topLeft'] ['y'] = floatval($thisRecord [$mapDetails->latitude]);

                    if ($mapBounds ['bottomRight'] ['x'] == 0 || floatval($thisRecord [$mapDetails->longitude]) > floatval($mapBounds ['bottomRight'] ['x']))
                        $mapBounds ['bottomRight'] ['x'] = floatval($thisRecord [$mapDetails->longitude]);

                    if ($mapBounds ['bottomRight'] ['y'] == 0 || floatval($thisRecord [$mapDetails->latitude]) < floatval($mapBounds ['bottomRight'] ['y']))
                        $mapBounds ['bottomRight'] ['y'] = floatval($thisRecord [$mapDetails->latitude]);
                }
            }

            // add two record for the bounds
            $returnArray ['data'] [] = ['id' => 'topLeft', 'geox' => $mapBounds ['topLeft'] ['x'], 'geoy' => $mapBounds ['topLeft'] ['y'], 'category' => 'TL', 'line1' => 'topLeft' . $mapBounds ['topLeft'] ['x'] . '/' . $mapBounds ['topLeft'] ['y']];

            $returnArray ['data'] [] = ['id' => 'bottomRight', 'geox' => $mapBounds ['bottomRight'] ['x'], 'geoy' => $mapBounds ['bottomRight'] ['y'], 'category' => 'BR', 'line1' => 'bottomRight' . $mapBounds ['bottomRight'] ['x'] . '/' . $mapBounds ['bottomRight'] ['y']];
        }

        return json_encode($returnArray);
    }

    /*
     * funtion to tranbslate certain operators if required to switch values at runtime
     */

    function get_runtime_wherefilters()
    {
        // return Array
        $editableWhereFields = [];

        // get the Where Fields
        $whereFieldsList = json_decode(html_entity_decode($this->whereconditions, ENT_QUOTES), true);

        // loop over the Fields
        foreach ($whereFieldsList as $whereFieldKey => $whereField) {
            if ($whereField ['usereditable'] != 'no') {
                // 2011-03-10 for values where pe parse for the editview differently
                // special handling for specific types
                switch ($whereField ['operator']) {
                    case 'lastnddays' :
                        switch ($whereField['type']) {
                            case 'datetimecombo':
                            case 'datetime':
                                $origValue = $whereField ['value'];
                                $whereField ['value'] = date($GLOBALS ['timedate']->get_date_format(), time() - $origValue * 86400) . ' 00:00:00';
                                $whereField ['valuekey'] = date($GLOBALS ['timedate']->get_db_date_format(), time() - $origValue * 86400) . ' 00:00:00';
                                break;
                            default:
                                $origValue = $whereField ['value'];
                                $whereField ['value'] = date($GLOBALS ['timedate']->get_date_format(), time() - $origValue * 86400);
                                $whereField ['valuekey'] = date($GLOBALS ['timedate']->get_db_date_format(), time() - $origValue * 86400);
                                break;
                        }
                        break;
                    case 'nextnddays' :
                        switch ($whereField['type']) {
                            case 'datetimecombo':
                            case 'datetime':
                                $origValue = $whereField ['value'];
                                $whereField ['value'] = date($GLOBALS ['timedate']->get_date_format(), time() + $origValue * 86400) . ' 00:00:00';
                                $whereField ['valuekey'] = date($GLOBALS ['timedate']->get_db_date_format(), time() + $origValue * 86400) . ' 00:00:00';
                                break;
                            default:
                                $origValue = $whereField ['value'];
                                $whereField ['value'] = date($GLOBALS ['timedate']->get_date_format(), time() + $origValue * 86400);
                                $whereField ['valuekey'] = date($GLOBALS ['timedate']->get_db_date_format(), time() + $origValue * 86400);
                                break;
                        }
                        break;
                    case 'betwnddays' :
                        switch ($whereField['type']) {
                            case 'datetimecombo':
                            case 'datetime':
                                $origValue = $whereField ['value'];
                                $origValueto = $whereField ['valueto'];
                                $whereField ['value'] = date($GLOBALS ['timedate']->get_date_format(), time() + $origValue * 86400) . ' 00:00:00';
                                $whereField ['valuekey'] = date($GLOBALS ['timedate']->get_db_date_format(), time() + $origValue * 86400) . ' 00:00:00';
                                $whereField ['valueto'] = date($GLOBALS ['timedate']->get_date_format(), time() + $origValueto * 86400) . ' 00:00:00';
                                $whereField ['valuetokey'] = date($GLOBALS ['timedate']->get_db_date_format(), time() + $origValueto * 86400) . ' 00:00:00';
                                break;
                            default:
                                $origValue = $whereField ['value'];
                                $origValueto = $whereField ['valueto'];
                                $whereField ['value'] = date($GLOBALS ['timedate']->get_date_format(), time() + $origValue * 86400);
                                $whereField ['valuekey'] = date($GLOBALS ['timedate']->get_db_date_format(), time() + $origValue * 86400);
                                $whereField ['valueto'] = date($GLOBALS ['timedate']->get_date_format(), time() + $origValueto * 86400);
                                $whereField ['valuetokey'] = date($GLOBALS ['timedate']->get_db_date_format(), time() + $origValueto * 86400);

                                break;
                        }
                        break;
                    case 'lastndays':
                    case 'lastnfdays':
                    case 'lastnweeks':
                    case 'lastnfmonth':
                    case 'lastnfweeks':
                    case 'nextndays':
                    case 'nextnweeks':
                    case 'betwndays':
                        break;
                    default:
                        // handle date formating for datetime fields
                        switch ($whereField['type']) {
                            case 'datetimecombo':
                            case 'datetime':
                                if (isset($whereField ['valuekey'])) {
                                    $valKeyArray = explode(' ', $whereField ['valuekey']);
                                    $whereField ['value'] = $GLOBALS ['timedate']->to_display_date($valKeyArray[0]) . ' ' . $valKeyArray[1];
                                }
                                if (isset($whereField ['valuetokey'])) {
                                    $valKeyArray = explode(' ', $whereField ['valuetokey']);
                                    $whereField ['valueto'] = $GLOBALS ['timedate']->to_display_date($valKeyArray[0]) . ' ' . $valKeyArray[1];
                                }
                                break;
                            case 'date':
                                if (isset($whereField ['valuekey']))
                                    $whereField ['value'] = $GLOBALS ['timedate']->to_display_date($whereField ['valuekey']);
                        }
                        break;
                }

                // return the Fields
                $editableWhereFields [] = $whereField;
            }
        }

        return $editableWhereFields;
    }

    /*
     * function to return values for the Dashlet Where Clause
     * parsed afterwards dynamically into a toolbar in the Dashlet
     */

    function getDashletWhereClause()
    {
        //generic return array
        $returnArray = [];

        // get the where fields
        $arrayWhere = $this->get_runtime_wherefilters(); // json_decode( html_entity_decode($this->whereconditions, ENT_QUOTES), true);
        //parse them
        foreach ($arrayWhere as $thisWhereField) {
            if (isset($thisWhereField ['dashleteditable']) && $thisWhereField ['dashleteditable'] != 'no') {
                // reset '---'
                if ($thisWhereField ['valuekey'] == '---')
                    $thisWhereField ['valuekey'] = '';
                if ($thisWhereField ['value'] == '---')
                    $thisWhereField ['value'] = '';

                // if needed switch the type for the dashlet
                switch ($thisWhereField ['operator']) {
                    case 'lastndays' :
                    case 'nextndays' :
                        $thisWhereField ['type'] = 'int';
                        break;
                }

                // get a return array
                $returnArray [] = ['fieldid' => $thisWhereField ['fieldid'], 'operator' => $thisWhereField ['operator'], 'sequence' => isset($thisWhereField ['sequence']) ? $thisWhereField ['sequence'] : '', 'options' => in_array($thisWhereField ['type'], ['enum', 'radioenum', 'multienum', 'user_name', 'assigned_user_name']) ? $this->get_enum_from_path($thisWhereField ['path']) : '', 'type' => $thisWhereField ['type'], 'renderType' => $thisWhereField ['usereditable'] == 'yo1' || $thisWhereField ['usereditable'] == 'yo2' ? 'checkbox' : '', 'name' => $thisWhereField ['name'], 'value' => (isset($thisWhereField ['valuekey']) && $thisWhereField ['valuekey'] != '' ? $thisWhereField ['valuekey'] : $thisWhereField ['value'])];
            }
        }

        return $returnArray;
    }

    function get_enum_from_path($path)
    {

        global $app_list_strings;
$db = DBManagerFactory::getInstance();

        // explode the path
        $pathArray = explode('::', $path);

        // get Field and Module from the path
        $fieldArray = explode(':', $pathArray [count($pathArray) - 1]);
        $moduleArray = explode(':', $pathArray [count($pathArray) - 2]);

        // load the parent module
        $parentModule = BeanFactory::getBean($moduleArray[1]);

        if ($moduleArray [0] == 'link') {
            // load the Relationshop to get the module
            $parentModule->load_relationship($moduleArray[2]);

            //PHP7 - 5.6 COMPAT: use creaetd variable as dynamic property
            $moduleArrayEl = $moduleArray[2];

            // load the Module
            $thisModuleName = $parentModule->$moduleArrayEl->getRelatedModuleName();
            $thisModule = BeanFactory::getBean($parentModule->$moduleArrayEl->getRelatedModuleName());

            // pars the otpions into the return array
            switch ($thisModule->field_name_map [$fieldArray[1]] ['type']) {
                case 'enum' :
                case 'radioenum' :
                case 'multienum' :
                    foreach ($app_list_strings [$thisModule->field_name_map [$fieldArray [1]] ['options']] as $value => $text) {
                        $returnArray [] = ['value' => $value, 'text' => $text];
                    }
                    break;
                case 'user_name' :
                case 'assigned_user_name' :
                    $returnArray [] = ['value' => 'current_user_id', 'text' => 'active user'];
                    $usersResult = $db->query('SELECT id, user_name FROM users WHERE deleted = \'0\' AND status = \'Active\'');
                    while ($userRecord = $db->fetchByAssoc($usersResult)) {
                        // bugfix 2010-09-28 since id was asisgned and not user name ..  no properly evaluates active user
                        $returnArray [] = ['value' => $userRecord ['user_name'], 'text' => $userRecord ['user_name']];
                    }
                    break;
            }
        } else {
            // we have the root module
            switch ($parentModule->field_name_map [$fieldArray [1]] ['type']) {
                case 'enum' :
                case 'radioenum' :
                case 'multienum' :
                    foreach ($app_list_strings [$parentModule->field_name_map [$fieldArray [1]] ['options']] as $value => $text) {
                        $returnArray [] = ['value' => $value, 'text' => $text];
                    }
                    break;
                case 'user_name' :
                case 'assigned_user_name' :
                    $returnArray [] = ['value' => 'current_user_id', 'text' => 'active user'];
                    $usersResult = $db->query('SELECT id, user_name FROM users WHERE deleted = \'0\' AND status = \'Active\'');
                    while ($userRecord = $db->fetchByAssoc($usersResult)) {
                        // bugfix 2010-09-28 since id was asisgned and not user name ..  no properly evaluates active user
                        $returnArray [] = ['value' => $userRecord ['user_name'], 'text' => $userRecord ['user_name']];
                    }
                    break;
            }
        }

        return $returnArray;
    }

    static function getMenuReports($module, &$module_menu)
    {
        $db = DBManagerFactory::getInstance();

        $thisReport = new KReport();

        $reportsArray = [];


        $repQuery = "select kreports.id, name from kreports ";
        $repQuery .= " where kreports.deleted = false and publishoptions like '%\"publishMenuModule\":\"" . $module . "\"%'";
        $reportsObj = $db->query($repQuery);


        while ($report = $db->fetchByAssoc($reportsObj)) {
            $module_menu[] = [
                "index.php?module=KReports&action=DetailView&record=" . $report['id'],
                $report['name'],
                "KReports",
                'KReports'];
        }

        return true;
    }

    // for the listing (exclude utility Reports unless we ae admin
    function create_new_list_query($order_by, $where, $filter = [], $params = [], $show_deleted = 0, $join_type = '', $return_array = false, $parentbean = null, $singleSelect = false, $ifListForExport = false)
        {
        $ret_array = parent::create_new_list_query($order_by, $where, $filter, $params, $show_deleted, $join_type, true, $parentbean, $singleSelect, $ifListForExport);

        // add selection clause to $ret:array['where']

        if ($return_array) {
            return $ret_array;
        }
        return $ret_array['select'] . $ret_array['from'] . $ret_array['where'] . $ret_array['order_by'];
    }

}
