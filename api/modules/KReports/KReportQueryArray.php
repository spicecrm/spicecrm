<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\KReports;

use DateTime;
use DateTimeZone;
use SpiceCRM\includes\database\DBManagerFactory;

use SpiceCRM\includes\authentication\AuthenticationController;

class KReportQueryArray
{

    public $thisKReport;
    public $root_module;
    public $union_modules;
    public $listArray;
    public $whereArray;
    public $whereAddtionalFilter;
    public $whereGroupsArray;
    public $groupsByLimit;
    public $additionalGroupBy;
    public $evalSQLFunctions;
    public $whereOverrideArray;
    public $unionListArray;
    public $fieldNameMap;
    // the selct strings
    public $selectString;
    public $countSelectString;
    public $totalSelectString;
    public $summarySelectString;
    public $fromString;
    public $whereString;
    public $groupbyString;
    public $havingString;
    public $orderbyString;
    public $queryContext = [];
    public $addParams;
    public $queryArray;
    public $dynamicoptions = false; //fix 2018-02-22 for KReportQuery referencefields looping

    function __construct($rootModule = '', $whereOverride = [], $unionModules = '', $evalSQLFunctions = true, $listFields = [], $unionListFields = [], $whereFields = [], $additonalFilter = '', $whereGroupFields = [], $additionalGroupBy = [], $addParams = [], $dynamicoptions = false)
    {
        // set the various Fields
        $this->root_module = $rootModule;
        $this->union_modules = $unionModules == '{}' ? '' : $unionModules;
        $this->listArray = $listFields;
        $this->unionListArray = $unionListFields;
        $this->whereArray = $whereFields;
        $this->whereAddtionalFilter = $additonalFilter;
        $this->whereGroupsArray = $whereGroupFields;
        // $this->groupByLimit = $groupByLimit;
        $this->additionalGroupBy = $additionalGroupBy;
        $this->evalSQLFunctions = $evalSQLFunctions;
        $this->dynamicoptions = $dynamicoptions; //fix 2018-02-22 for KReportQuery referencefields looping

        $this->addParams = $addParams;

        // handle the context if the value is set
        if (isset($this->addParams['context']) && $this->addParams['context'] != '') {
            $this->queryContext = $this->context_to_array($this->addParams['context']);
        }

        // handle Where Override
        /*
        if (isset($_REQUEST['whereConditions'])) {
            $this->whereOverrideArray = json_decode(html_entity_decode($_REQUEST['whereConditions'], ENT_QUOTES, 'UTF-8'), true);
        }
        */

        if ($whereOverride) {
            $this->whereOverrideArray = $whereOverride;
        }
    }

    /*
     * function to replace all whitspaces in a string and ocnvert to an array with the entries
     */

    function context_to_array($contextString)
    {
        $inputString = preg_replace('/ /', '', $contextString);
        $contextArray = explode(',', $inputString);
        return $contextArray;
    }

    function handle_where_conditions()
    {

        // 2011-10-17 array for ereferences
        $referencedFields = [];
        $referencingFields = [];

        // handle parent bean assignments and see if we need to handle references
        reset($this->whereArray);
        foreach ($this->whereArray as $originalKey => $originalData) {

            // 2011-10-17 build reference arrays
            if (array_key_exists('reference', $originalData) && $originalData['reference'] != '') {
                $referencedFields[$originalData['reference']] = $originalKey;
            }
            if ($originalData['operator'] == 'reference') {
                $referencingFields[$originalKey] = $originalData['value'];
            }

            if ($originalData['operator'] == 'parent_assign') {
                if (!isset($this->addParams['parentbean'])
                    //|| (isset($this->addParams['parentbean']) && $originalData['valuekey'] == '')
                ) {
                    // if we do not have a parentbean we do not evaluate this condition
                    unset($this->whereArray[$originalKey]);
                } else {
                    // get the value from the parentbean
                    $fieldName = (empty($originalData['valuekey']) ? 'id' : $originalData['valuekey']);
                    $thisNewValue = $this->addParams['parentbean']->$fieldName;

                    //set the value
                    $this->whereArray[$originalKey]['operator'] = 'equals';
                    $this->whereArray[$originalKey]['value'] = $thisNewValue;
                    $this->whereArray[$originalKey]['valuekey'] = $thisNewValue;
                }
            }
        }

        // handle whereoverride
        if (is_array($this->whereOverrideArray)) {
            foreach ($this->whereOverrideArray as $overrideKey => $overrideData) {
                reset($this->whereArray);
                foreach ($this->whereArray as $originalKey => $originalData) {
                    if ($originalData['fieldid'] == $overrideData['fieldid']) {
                        // bug 2011-03-12 move corresponding fields
                        $transferFields = ['operator', 'value', 'valuekey', 'valueto', 'valuetokey', 'usereditable'];
                        foreach ($transferFields as $thisFieldName) {
                            $this->whereArray[$originalKey][$thisFieldName] = $overrideData[$thisFieldName];
                        }
                        // need to exit the while loop
                    }
                }
            }
        }

        // handle context and other things
        foreach ($this->whereArray as $whereId => $whereArrayEntry) {

            // 2012-09-19 set valuto and valuekey if not set
            if (!isset($whereArrayEntry['valueto']))
                $this->whereArray[$whereId]['valueto'] = '';
            if (!isset($whereArrayEntry['valuetokey']))
                $this->whereArray[$whereId]['valuetokey'] = '';

            // do time handling treating passed in values as User Timezone converting to UTS
            if($whereArrayEntry['type'] == 'datetime' && $whereArrayEntry['operator'] != 'reference'){
                $userTimezZone = AuthenticationController::getInstance()->getCurrentUser()->getPreference('timezone');
                // check on format
                if($whereArrayEntry['valuekey'] != ''){
                    $fromFormat = 'Y-m-d H:i:s';
                    if(strlen($whereArrayEntry['valuekey']) <= 10){
                        $fromFormat = 'Y-m-d';
                    }
                    $valuefromdate = DateTime::createFromFormat($fromFormat, $whereArrayEntry['valuekey'], new DateTimeZone($userTimezZone));
                    $valuefromdate->setTimezone(new DateTimeZone('UTC'));
                    $this->whereArray[$whereId]['valuekey'] = $valuefromdate->format('Y-m-d H:i:s');
                    $this->whereArray[$whereId]['value'] = $valuefromdate->format('Y-m-d H:i:s');
                }
                if($whereArrayEntry['valuetokey'] != ''){
                    $valuetodate = DateTime::createFromFormat($fromFormat, $whereArrayEntry['valuetokey'],  new DateTimeZone($userTimezZone));
                    $valuetodate->setTimezone(new DateTimeZone('UTC'));
                    $this->whereArray[$whereId]['valuetokey'] = $valuetodate->format('Y-m-d H:i:s');
                    $this->whereArray[$whereId]['valueto'] = $valuetodate->format('Y-m-d H:i:s');
                }
            }

            // check context
            if (array_key_exists('context', $whereArrayEntry) && $whereArrayEntry['context'] != '') { // && trim($whereArrayEntry['context']) != $this->queryContext)
                // by default we delte unless we find a matching context
                $keepCondition = false;

                // build an array with entries
                $thisWhereConditionContextArray = $this->context_to_array($whereArrayEntry['context']);

                foreach ($thisWhereConditionContextArray as $thisContextEntry) {
                    if (in_array($thisContextEntry, $this->queryContext))
                        $keepCondition = true;
                }

                // if we did not find a match remove the condition
                if (!$keepCondition)
                    unset($this->whereArray[$whereId]);
            }

            // see if we need to evaluate based on usereditable setting
            if ($whereArrayEntry['usereditable'] == 'yo2')
                unset($this->whereArray[$whereId]); //['operator'] = 'ignore';


            // 2011-03-25 added function to be evaluated
            if ($whereArrayEntry['operator'] == 'function') {
                global $customFunctionInclude;
                include('modules/KReports/kreportsConfig.php');
                include($customFunctionInclude);

                $customFunctionInclude = 'custom/modules/KReports/KReportCustomFunctions.php';
                if (file_exists($customFunctionInclude)) {
                    include($customFunctionInclude);
                }
                if (function_exists($whereArrayEntry['valuekey'])) {
                    $this->whereArray[$whereId]['operator'] = '';
                    $this->whereArray[$whereId]['value'] = '';
                    $this->whereArray[$whereId]['valuekey'] = '';
                    global $opReturn;
                    eval("\$opReturn=" . $whereArrayEntry['valuekey'] . "(\$whereArrayEntry);");
                    if (is_array($opReturn) && count($opReturn) > 0) {
                        foreach ($opReturn as $thisOpField => $thisOpValue)
                            $this->whereArray[$whereId][$thisOpField] = $thisOpValue;
                    } else
                        unset($this->whereArray[$whereId]);
                } else {
                    // delete the condition if we do not find the function
                    unset($this->whereArray[$whereId]);
                }

            }
        }

        //2011-10-17 manage references
        foreach ($referencingFields as $originalKey => $referenceValue) {
            if (isset($referencedFields[$referenceValue]) && isset($this->whereArray[$referencedFields[$referenceValue]])) {
                $this->whereArray[$originalKey]['operator'] = $this->whereArray[$referencedFields[$referenceValue]]['operator'];
                $this->whereArray[$originalKey]['value'] = $this->whereArray[$referencedFields[$referenceValue]]['value'];
                $this->whereArray[$originalKey]['valuekey'] = $this->whereArray[$referencedFields[$referenceValue]]['valuekey'];
                $this->whereArray[$originalKey]['valueto'] = $this->whereArray[$referencedFields[$referenceValue]]['valueto'];
                $this->whereArray[$originalKey]['valuetokey'] = $this->whereArray[$referencedFields[$referenceValue]]['valuetokey'];
            } // 2012-08-01 use request Parameter
            elseif (isset($_REQUEST[$referenceValue])) {
                $this->whereArray[$originalKey]['operator'] = 'equals';
                $this->whereArray[$originalKey]['value'] = $_REQUEST[$referenceValue];
                $this->whereArray[$originalKey]['valuekey'] = $_REQUEST[$referenceValue];
                $this->whereArray[$originalKey]['valueto'] = '';
                $this->whereArray[$originalKey]['valuetokey'] = '';
            } elseif(!$this->dynamicoptions) //fix 2018-02-22 for KReportQuery referencefields looping
                unset($this->whereArray[$originalKey]);
        }

        // bugfix 2012-02-24
        // handle the ignore settings ... messes upo joins
        foreach ($this->whereArray as $whereId => $whereArrayEntry) {
            // bugfix 2012-08-07 .. refertence to wrong array entry
            if ($whereArrayEntry['operator'] == 'ignore') {
                unset($this->whereArray[$whereId]);
            }
        }

        // bugifx 2011-04-01
        // renumber the array so we make sure we start at 0 again
        $this->whereArray = array_values($this->whereArray);
    }

    /*
     * function to return where array with conditions to be printed in PDF
     */

    function get_where_array()
    {
        $returnArray = [];

        $modStrings = return_module_language('en_us', 'KReports');

        foreach ($this->whereArray as $thisWhereCondition) {
            // 2011-06-05 do not pass over conditions with Operator ignore
            if ($thisWhereCondition['exportpdf'] == 'yes' && $thisWhereCondition['operator'] != 'ignore') {
                //build the string we shoot
                $valueString = '';
                //determine value string
                if ($thisWhereCondition['value'] != '' && $thisWhereCondition['value'] != '---') {
                    if ($thisWhereCondition['valueto'] != '' && $thisWhereCondition['valueto'] != '---')
                        $valueString = $thisWhereCondition['value'] . ' - ' . $thisWhereCondition['valueto'];
                    else
                        $valueString = $thisWhereCondition['value'];
                }

                // add to the array
                $returnArray[] = [
                    'name' => $thisWhereCondition['name'],
                    'operator' => $modStrings['LBL_OP_' . strtoupper($thisWhereCondition['operator'])],
                    'value' => $valueString
                ];
            }
        }

        return $returnArray;
    }

    function build_query_strings()
    {
        // manage special handling of where conditions
        $this->handle_where_conditions();

        // CR1000456 check union_modules content
        //  if ($this->union_modules != '') {
        $buildUnion = false;
        $unionArrayNew = json_decode(html_entity_decode($this->union_modules, ENT_QUOTES, 'UTF-8'), true);
        if(is_array($unionArrayNew) && !empty($unionArrayNew[0])){
            $buildUnion = true;
        }
        if ($buildUnion) {
            // handle root module
            // filter the array to only have root
            $i = 0;
            $this->queryArray['root']['whereArray'] = [];
            while ($i < count($this->whereArray)) {
                if ($this->whereArray[$i]['unionid'] == 'root')
                    $this->queryArray['root']['whereArray'][] = $this->whereArray[$i];
                $i++;
            }

            $i = 0;
            $this->queryArray['root']['whereGroupsArray'] = [];
            while ($i < count($this->whereGroupsArray)) {
                if ($this->whereGroupsArray[$i]['unionid'] == 'root')
                    $this->queryArray['root']['whereGroupsArray'][] = $this->whereGroupsArray[$i];
                $i++;
            }

            $this->queryArray['root']['kQuery'] = new KReportQuery($this->root_module, $this->evalSQLFunctions, $this->listArray, $this->queryArray['root']['whereArray'], $this->whereAddtionalFilter, $this->queryArray['root']['whereGroupsArray'], $this->additionalGroupBy, $this->addParams);

            // set union ID & groupings as well as order clause to be by ID
            $this->queryArray['root']['kQuery']->unionId = 'root';
            $this->queryArray['root']['kQuery']->orderByFieldID = true;
            $this->queryArray['root']['kQuery']->groupByFieldID = true;

            // build the query Strings for the root Query
            $this->queryArray['root']['kQuery']->build_query_strings();
            $this->fieldNameMap = $this->queryArray['root']['kQuery']->fieldNameMap;

            //hanlde union
            //CR1000456 $unionArrayNew already created in condition above
            //$unionArrayNew = json_decode(html_entity_decode($this->union_modules, ENT_QUOTES, 'UTF-8'), true);
            // $unionArray = preg_split('/;/', $this->union_modules);
            foreach ($unionArrayNew as $thisUnionArrayEntry) {

                $thisUnionId = $thisUnionArrayEntry['unionid'];
                $thisUnionModule = $thisUnionArrayEntry['module'];

                //filter where and where groups
                $i = 0;
                $this->queryArray[$thisUnionId]['whereArray'] = [];
                while ($i < count($this->whereArray)) {
                    if ($this->whereArray[$i]['unionid'] == $thisUnionId) {
                        $this->queryArray[$thisUnionId]['whereArray'][] = $this->whereArray[$i];
                        // replace the beginning of the string to make it root
                        $newPath = preg_replace('/unionroot::/', '', $this->queryArray[$thisUnionId]['whereArray'][count($this->queryArray[$thisUnionId]['whereArray']) - 1]['path']);
                        $newPath = preg_replace('/union[A-Za-z0-9]*:/', 'root:', $newPath);
                        $this->queryArray[$thisUnionId]['whereArray'][count($this->queryArray[$thisUnionId]['whereArray']) - 1]['path'] = $newPath;
                    }
                    $i++;
                }

                $i = 0;
                $this->queryArray[$thisUnionId]['whereGroupsArray'] = [];
                while ($i < count($this->whereGroupsArray)) {
                    if ($this->whereGroupsArray[$i]['unionid'] == $thisUnionId)
                        $this->queryArray[$thisUnionId]['whereGroupsArray'][] = $this->whereGroupsArray[$i];
                    $i++;
                }

                //build the list array for this union
                $i = 0;
                while ($i < count($this->listArray)) {
                    $this->queryArray[$thisUnionId]['listArray'][$i] = $this->listArray[$i];

                    foreach ($this->unionListArray as $thisUnionListEntryId => $thisUnionListEntry) {
                        if ($thisUnionListEntry['joinid'] == $thisUnionId && $thisUnionListEntry['fieldid'] == $this->listArray[$i]['fieldid']) {
                            // we have a match
                            if ($thisUnionListEntry['unionfieldpath'] != '' && (!isset($thisUnionListEntry['fixedvalue']) || $thisUnionListEntry['fixedvalue'] == '')) {
                                // also replace the union id with the new root in the fieldpath ...
                                // the union entry is root in the new subquery

                                $newPath = preg_replace('/unionroot::/', '', $thisUnionListEntry['unionfieldpath']);
                                $newPath = preg_replace('/union' . $thisUnionId . '/', 'root', $newPath);
                                $this->queryArray[$thisUnionId]['listArray'][$i]['path'] = $newPath;

                                // make sure we also replace the fixed value
                                $this->queryArray[$thisUnionId]['listArray'][$i]['fixedvalue'] = '';
                            } else {
                                //reset the path in any case
                                // 2012-09-23 ... not sure why this was commented out ... put it in again to avoid fatal error in join
                                // 2012-10-14 ... required for field type ... esp. currency ... need to fix this otherways
                                $this->queryArray[$thisUnionId]['listArray'][$i]['path'] = '';

                                // set a fixed value to '-' if we do not have a fixed value
                                // TODO: change query logic to adopt to empty field if no path is set and then take the fixed value ''

                                if (isset($thisUnionListEntry['fixedvalue']) && $thisUnionListEntry['fixedvalue'] != '')
                                    $this->queryArray[$thisUnionId]['listArray'][$i]['fixedvalue'] = $thisUnionListEntry['fixedvalue'];
                                else
                                    $this->queryArray[$thisUnionId]['listArray'][$i]['fixedvalue'] = '-';
                            }
                        }
                    }

                    $i++;
                    // find the entry in the unionlist fields array
                }

                $this->queryArray[$thisUnionId]['kQuery'] = new KReportQuery($thisUnionModule, $this->evalSQLFunctions, $this->queryArray[$thisUnionId]['listArray'], $this->queryArray[$thisUnionId]['whereArray'], $this->whereAddtionalFilter, $this->queryArray[$thisUnionId]['whereGroupsArray'], $this->additionalGroupBy, $this->addParams);

                // 2012-11-04 set the root fields name map
                // so we know if a field is a cur field
                $this->queryArray[$thisUnionId]['kQuery']->rootfieldNameMap = $this->queryArray['root']['kQuery']->fieldNameMap;

                // set the unionid & grouping as well as order clause
                $this->queryArray[$thisUnionId]['kQuery']->unionId = $thisUnionId;
                $this->queryArray[$thisUnionId]['kQuery']->orderByFieldID = true;
                $this->queryArray[$thisUnionId]['kQuery']->groupByFieldID = true;

                // build the query strings
                $this->queryArray[$thisUnionId]['kQuery']->build_query_strings();
            }

            // enrich the kqueries by all joinsegments and reporcess the select to get all join segments in (nned that for the ids for the various records
            $totalJoinSegments = [];
            foreach ($this->queryArray as $thisUnionId => $thisUnionQuery) {
                foreach ($thisUnionQuery['kQuery']->joinSegments as $thisPath => $thisPathProperties) {
                    $totalJoinSegments[$thisPathProperties['alias']] = ['level' => $thisPathProperties['level'], 'path' => $thisPath, 'unionid' => $thisUnionId];
                }
            }

            // rebuild all select strings
            // first for root
            $this->queryArray['root']['kQuery']->build_select_string($totalJoinSegments);
            // then for all the joins
            foreach ($unionArrayNew as $thisUnionArrayEntry) {
                $this->queryArray[$thisUnionArrayEntry['unionid']]['kQuery']->build_select_string($totalJoinSegments);
            }

            // build the root string
            $queryString = '';
            foreach ($this->queryArray as $id => $queryArrayData) {
                if ($queryString != '')
                    $queryString .= ' UNION ';
                $queryString .= $queryArrayData['kQuery']->selectString . ' ' . $queryArrayData['kQuery']->fromString . ' ' . $queryArrayData['kQuery']->whereString . ' ' . $queryArrayData['kQuery']->groupbyString;
            }
            $fullQuery = $queryString;

            // specific Union handling
            // $queryString .= ' ' . /*$this->queryArray['root']['kQuery']->groupbyString .*/ ' ' . $this->queryArray['root']['kQuery']->havingString . ' ' . $this->queryArray['root']['kQuery']->orderbyString;
            // changes for MSSQL Support see if we need to limit the query
            // get a sort string by ID
            $this->queryArray['root']['kQuery']->orderByFieldID = true;
            $this->queryArray['root']['kQuery']->build_orderby_string();

            if (isset($this->addParams['start']) && isset($this->addParams['limit'])) {
                // add a count query
                // build a limited query
                switch (DBManagerFactory::getInstance()->dbType) {
                    case 'mssql':
                        $this->countSelectString = 'SELECT COUNT(sugarRecordId) as totalCount from (' . $queryString . ') as origCountSQL';
                        $limitSelect = preg_replace('/SELECT/', 'SELECT row_number() OVER(' . $this->queryArray['root']['kQuery']->orderbyString . ') AS row_number, ', $this->queryArray['root']['kQuery']->unionSelectString);
                        $queryString = 'SELECT TOP(' . $this->addParams['limit'] . ') * FROM (' . $limitSelect . ' FROM (' . $queryString . ') unionResult ' . $this->queryArray['root']['kQuery']->groupbyString . ') AS topSelect WHERE row_number > ' . $this->addParams['start'];
                        break;
                    case 'oci8':
                        $this->countSelectString = 'SELECT COUNT(*) as totalCount from (' . $queryString . ') ';
                        $queryString = "SELECT * FROM (
				SELECT sorted_tmp.*, ROWNUM AS rnum FROM (" . $this->queryArray['root']['kQuery']->unionSelectString . ' FROM (' . $queryString . ') unionResult ' . $this->queryArray['root']['kQuery']->groupbyString . ' ' . $this->queryArray['root']['kQuery']->havingString . ' ' . $this->queryArray['root']['kQuery']->orderbyString . ") sorted_tmp 
				WHERE ROWNUM <= " . ($this->addParams['start'] + $this->addParams['limit'] - 1) . ") 
				WHERE rnum >= " . $this->addParams['start'];
                        // $queryString = 'SELECT * FROM (' . $this->queryArray['root']['kQuery']->unionSelectString . ' FROM (' . $queryString . ') unionResult ' . $this->queryArray['root']['kQuery']->groupbyString . ' ' . $this->queryArray['root']['kQuery']->havingString . ' ' . $this->queryArray['root']['kQuery']->orderbyString . ') WHERE rownum >=  ' . $this->addParams['start'] . ' AND rownum < ' . ($this->addParams['start'] + $this->addParams['limit']);
                        break;
                    case 'mysql':
                        $this->countSelectString = 'SELECT COUNT(sugarRecordId) as totalCount from (' . $queryString . ') as origCountSQL';
                        $queryString = $this->queryArray['root']['kQuery']->unionSelectString . ' FROM (' . $queryString . ') unionResult ' . $this->queryArray['root']['kQuery']->groupbyString . ' ' . $this->queryArray['root']['kQuery']->havingString . ' ' . $this->queryArray['root']['kQuery']->orderbyString . ' LIMIT ' . $this->addParams['start'] . ',' . $this->addParams['limit'];
                        break;
                }
            } else {
                switch (DBManagerFactory::getInstance()->dbType) {
                    case 'mssql':
                        $this->countSelectString = 'SELECT COUNT(*) as totalCount from (' . $queryString . ') as origCountSQL';
                        break;
                    case 'oci8':
                        $this->countSelectString = 'SELECT COUNT(*) as totalCount from (' . $queryString . ')';
                        break;
                    default:
                        $this->countSelectString = 'SELECT COUNT(sugarRecordId) as totalCount from (' . $queryString . ') as origCountSQL';
                }
                $queryString = $this->queryArray['root']['kQuery']->unionSelectString . ' FROM (' . $queryString . ') unionResult ' . $this->queryArray['root']['kQuery']->groupbyString . ' ' . $this->queryArray['root']['kQuery']->havingString . ' ' . $this->queryArray['root']['kQuery']->orderbyString;
            }
            // build the unions
            // build the total Select Sting if we need to calculate Percentage Values
            $this->buildTotalSelectString($fullQuery);

            // return the main query string
            return $queryString;
        } else {
            // handle root module
            // filter the array to only have root
            $i = 0;
            while ($i < count($this->whereArray)) {
                if ($this->whereArray[$i]['unionid'] == 'root')
                    $this->queryArray['root']['whereArray'][] = $this->whereArray[$i];
                $i++;
            }

            $i = 0;
            while ($i < count($this->whereGroupsArray)) {
                if ($this->whereGroupsArray[$i]['unionid'] == 'root')
                    $this->queryArray['root']['whereGroupsArray'][] = $this->whereGroupsArray[$i];
                $i++;
            }

            $this->queryArray['root']['kQuery'] = new KReportQuery($this->root_module, $this->evalSQLFunctions, $this->listArray, $this->queryArray['root']['whereArray'], $this->whereAddtionalFilter, $this->queryArray['root']['whereGroupsArray'], $this->additionalGroupBy, $this->addParams);
            //temp see if this works

            $this->queryArray['root']['kQuery']->build_query_strings();
            $this->fieldNameMap = $this->queryArray['root']['kQuery']->fieldNameMap;

            $this->selectString = $this->queryArray['root']['kQuery']->selectString;
            $this->fromString = $this->queryArray['root']['kQuery']->fromString;
            $this->whereString = $this->queryArray['root']['kQuery']->whereString;
            $this->groupbyString = $this->queryArray['root']['kQuery']->groupbyString;
            $this->havingString = $this->queryArray['root']['kQuery']->havingString;
            $this->orderbyString = $this->queryArray['root']['kQuery']->orderbyString;

            //if($this->queryArray['root']['kQuery']->totalSelectString != '')
            //	$this->totalSelectString = $this->queryArray['root']['kQuery']->totalSelectString . ' ' . $this->fromString . ' ' . $this->whereString;
            // build the total Select Sting if we need to calculate Percentage Values
            $this->buildTotalSelectString($this->selectString . ' ' . $this->fromString . ' ' . $this->whereString . ' ' . $this->groupbyString . ' ' . $this->havingString);

            if ($this->queryArray['root']['kQuery']->countSelectString != '') {
                switch (DBManagerFactory::getInstance()->dbType) {
                    case 'oci8':
                        $this->countSelectString = 'SELECT COUNT(*) as "totalCount" from (' . $this->queryArray['root']['kQuery']->countSelectString . ' ' . $this->fromString . ' ' . $this->whereString . ' ' . $this->groupbyString . ')';
                        break;case 'oci8':
                    case 'mssql':
                        $this->countSelectString = 'SELECT COUNT(*) as "totalCount" from (' . $this->queryArray['root']['kQuery']->countSelectString . ' ' . $this->fromString . ' ' . $this->whereString . ' ' . $this->groupbyString . ') as origCountSQL';
                        break;
                    default:
                        $this->countSelectString = 'SELECT COUNT(sugarRecordId) as totalCount from (' . $this->queryArray['root']['kQuery']->countSelectString . ' ' . $this->fromString . ' ' . $this->whereString . ' ' . $this->groupbyString . ') as origCountSQL';
                        // quickfix Stueber
                        $this->countSelectString = '';
                        break;
                }
            }
            // changes for MSSQL Support see if we need to limit the query
            if (isset($this->addParams['start']) && isset($this->addParams['limit'])) {
                switch (DBManagerFactory::getInstance()->dbType) {
                    case 'mssql':
                        $limitSelect = preg_replace('/SELECT/', 'SELECT row_number() OVER(' . $this->orderbyString . ') AS row_number, ', $this->selectString);
                        return 'SELECT TOP(' . $this->addParams['limit'] . ') * FROM (' . $limitSelect . ' ' . $this->fromString . ' ' . $this->whereString . ' ' . $this->groupbyString . ') AS topSelect WHERE row_number > ' . $this->addParams['start'];
                        break;
                    case 'oci8':
                        return "SELECT * FROM (
				SELECT  sorted_tmp.*, ROWNUM AS rnum FROM (" . $this->selectString . ' ' . $this->fromString . ' ' . $this->whereString . ' ' . $this->groupbyString . ' ' . $this->havingString . ' ' . $this->orderbyString . ") sorted_tmp 
				WHERE ROWNUM <= " . ($this->addParams['start'] + $this->addParams['limit'] - 1) . ") 
				WHERE rnum >= " . $this->addParams['start'];

                        // return 'SELECT * FROM (' . $this->selectString . ' ' . $this->fromString . ' ' . $this->whereString . ' ' . $this->groupbyString . ' ' . $this->havingString . ' ' . $this->orderbyString . ') WHERE rownum >= ' . $this->addParams['start'] . ' AND rownum <' . ($this->addParams['start']  + $this->addParams['limit']);
                        break;
                    case 'mysql':
                        return $this->selectString . ' ' . $this->fromString . ' ' . $this->whereString . ' ' . $this->groupbyString . ' ' . $this->havingString . ' ' . $this->orderbyString . ' LIMIT ' . $this->addParams['start'] . ',' . $this->addParams['limit'];
                        break;
                }
            } else
                return $this->selectString . ' ' . $this->fromString . ' ' . $this->whereString . ' ' . $this->groupbyString . ' ' . $this->havingString . ' ' . $this->orderbyString;
        }
    }

    function buildTotalSelectString($fullQuery, $valueBase = 'valuetype')
    {

        //2014-06-27 support for Oracle
        $fromArray = [];
        $toArray = [];

        $this->totalSelectString = '';
        $this->summarySelectString = '';
        foreach ($this->listArray as $thisListEntry) {
            if ($valueBase == 'valuetype') {
                if (isset($thisListEntry['valuetype']) && $thisListEntry['valuetype'] != '' && $thisListEntry['valuetype'] != '-') {
                    $funcArray = explode('OF', $thisListEntry['valuetype']);
                    if ($this->totalSelectString == '')
                        $this->totalSelectString = 'SELECT ';
                    else
                        $this->totalSelectString .= ', ';

                    //2014-06-27 support for Oracle with " instead of '
                    $this->totalSelectString .= ' ' . $funcArray[1] . '(' . $thisListEntry['fieldid'] . ")  as \"" . $thisListEntry['fieldid'] . "_total\"";

                    //2014-06-27 support for Oracle
                    $fromArray[] = $thisListEntry['fieldid'];
                    $toArray[] = strtoupper($thisListEntry['fieldid']);
                }

                if (isset($thisListEntry['summaryfunction']) && $thisListEntry['summaryfunction'] != '' && $thisListEntry['summaryfunction'] != '-') {

                    if ($this->summarySelectString == '')
                        $this->summarySelectString = 'SELECT ';
                    else
                        $this->summarySelectString .= ', ';
                    //2014-06-27 support for Oracle with " instead of '
                    $this->summarySelectString .= ' ' . $thisListEntry['summaryfunction'] . '(' . $thisListEntry['fieldid'] . ")  as \"" . $thisListEntry['fieldid'] . "\"";

                    //2014-06-27 support for Oracle
                    $fromArray[] = $thisListEntry['fieldid'];
                    $toArray[] = strtoupper($thisListEntry['fieldid']);
                }
            }
        }

        // check if we have any fgield we found
        if ($this->totalSelectString != '') {
            $this->totalSelectString .= ' FROM (' . $fullQuery . ') fullSelect';
        }

        if ($this->summarySelectString != '') {
            $this->summarySelectString .= ' FROM (' . $fullQuery . ') fullSelect';
        }

        //2014-06-27 support for Oracle
        if (DBManagerFactory::getInstance()->dbType == 'oci8') {
            $this->summarySelectString = str_replace($fromArray, $toArray, $this->summarySelectString);
        }
    }

}
