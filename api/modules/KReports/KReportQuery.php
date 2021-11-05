<?php
/***** SPICE-KREPORTER-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\KReports;

use DateInterval;
use DateTime;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\modules\KReports\KReportUtil;
use SpiceCRM\modules\KReports\KReportQueryArray;

global $dictionary;


// require_once('modules/ACL/ACLController.php');

// class for the query Array if we have multiple query we join

// basic class for the query itself
class KReportQuery
{
    /*
     * Min things to know
     * first initialize the class
     * call build_ath to explode the various fields we might look at and build the path
     * call build_from_string to build all the join_segments and build the from string
     * after tha you can call the other functions
     */

    var $root_module;
    var $unionId = '';
    var $whereArray;
    var $whereAddtionalFilter = '';
    var $whereOverrideArray;
    var $listArray;
    var $whereGroupsArray;
    var $fieldNameMap;
    // 2012-11-04 a var for the root field name map Array
    // will feed that so we now in union what types the root field is ... to react properly on that
    // especially required for the currency handling since we need to ensure we have the same number of fields
    var $rootfieldNameMap;
    var $tablePath;
    var $rootGuid;
    var $joinSegments;
    var $unionJoinSegments;
    var $maxDepth;
    var $queryID = '';
    var $orderByFieldID = false;
    var $groupByFieldID = false;
    // parts of the SQL Query
    var $selectString;
    var $countSelectString;
    var $totalSelectString;
    //2010-03-28 add a select for the union with cosndieration of functions
    var $unionSelectString;
    var $fromString;
    var $whereString;
    var $havingString;
    var $groupbyString;
    var $additionalGroupBy;
    var $orderbyString;
    // Parameters
    var $evalSQLFunctions = true;
    // auth Check level (full, top, none)
    var $authChecklevel = 'full';
    var $showDeleted = false;
    //for a custom sort
    var $sortOverride = [];
    // for the exclusive Groping required for the tree if add grouping params are sent in
    var $exclusiveGroupinbgByAddParams = false;
    // array for all fields we are selcting from the database
    var $fieldArray = [];
    // for MSSQL
    var $isGrouped = false;

    // constructor
    /*
     *  Additonal Filter = array with Fieldid and value .. wich is then applied to the where clause
     *  $addParams - AuthCheckLevel = full, top none
     *  			 showDeleted = true, false
     */
    function __construct($rootModule = '', $evalSQLFunctions = true, $listFields = [], $whereFields = [], $additonalFilter = '', $whereGroupFields = [], $additionalGroupBy = [], $addParams = [])
    {
        // set the various Fields
        $this->root_module = $rootModule;
        $this->listArray = $listFields;
        $this->whereArray = $whereFields;
        $this->whereAddtionalFilter = $additonalFilter;
        $this->whereGroupsArray = $whereGroupFields;
        $this->additionalGroupBy = $additionalGroupBy;
        $this->evalSQLFunctions = $evalSQLFunctions;


        // handle additional parameters
        if (isset($addParams['authChecklevel']))
            $this->authChecklevel = $addParams['authChecklevel'];

        if (isset($addParams['showDeleted']))
            $this->showDeleted = $addParams['showDeleted'];

        //2011-03-21 sort override params
        if (isset($addParams['sortid']) && isset($addParams['sortseq'])) {
            $this->sortOverride = array(
                'sortid' => $addParams['sortid'],
                'sortseq' => $addParams['sortseq']
            );
        }

        if (isset($addParams['exclusiveGrouping']))
            $this->exclusiveGroupinbgByAddParams = $addParams['exclusiveGrouping'];

    }

    function build_query_strings()
    {
        // if (\SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'mssql' || \SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'oci8')
        $this->check_groupby($this->additionalGroupBy);

        $this->build_path();
        $this->build_from_string();
        $this->build_select_string();
        $this->build_where_string();
        $this->build_orderby_string();
        $this->build_groupby_string($this->additionalGroupBy);
    }

    /*
     * Function to build the JOin Type form th type in the Report
     */

    function switchJoinType($jointype)
    {
        // TODO handle not existing join type
        switch ($jointype) {
            case "optional":
                return ' LEFT JOIN ';
                break;
            case "required":
                return ' INNER JOIN ';
                break;
            case "notexisting":
                // 2011-12-29 retun no jointype
                //return ' LEFT JOIN ';
                return '';
                break;
        }
    }

    /*
     * Build Path:
     * function to extract all the path informatios out of the JSON Array we store
     */

    function build_path()
    {

        if ((is_array($this->whereArray) && count($this->whereArray) > 0) || (is_array($this->listArray) && count($this->listArray) > 0)) {
            /*
             * Build the path array with all valid comkbinations (basically joins we can meet
             */
            // collect Path entries for the Where Clauses
            if (!is_array($this->whereArray))
                $this->whereArray = [];
            foreach ($this->whereArray as $thisWhere) {
                // $this->addPath($thisWhere['path'], $this->switchJoinType($thisWhere['jointype']));
                // check if the group this belongs to is a notexits group
                $flagNotExists = false;
                if (is_array($this->whereGroupsArray)) {
                    reset($this->whereGroupsArray);
                    foreach ($this->whereGroupsArray as $thisWhereGroupEntry) {
                        if ($thisWhereGroupEntry['id'] == $thisWhere['groupid'] && array_key_exists('notexists', $thisWhereGroupEntry) && $thisWhereGroupEntry['notexists'] == '1')
                            $flagNotExists = false;
                    }
                }
                // if the flag is set -> LEFT JOIN ...
                //$this->addPath($thisWhere['path'], ($flagNotExists) ? 'LEFT JOIN' : 'INNER JOIN');
                // revert ..
                $this->addPath($thisWhere['path'], $this->switchJoinType($thisWhere['jointype']));
            }

            // same for the List Clauses
            foreach ($this->listArray as $thisListEntry) {
                $this->addPath($thisListEntry['path'], $this->switchJoinType($thisListEntry['jointype']));
            }
        }
    }

    /*
     * Helper function to add the path we found
     */

    function addPath($path, $jointype)
    {
        if ($path != '') {
            // require_once('include/utils.php');
            $fieldPos = strpos($path, "::field");
            $path = substr($path, 0, $fieldPos);

            if (!isset($this->tablePath[$path])) {
                $this->tablePath[$path] = $jointype;
            } else {
                // if we have an inner join now ... upgrade ..
                // 2011-12-29 proper seeuence and upgrading ... added empty join
                if ($this->tablePath[$path] == '' || ($this->tablePath[$path] == 'LEFT JOIN' && $jointype == 'INNER JOIN'))
                    $this->tablePath[$path] = $jointype;
            }

            // check if we have more to add
            // required if we have roiutes where there is no field used in between
            // search for a separator from the end and add the path if we do not yet know it
            // the join build will pick this up in the next step
            while ($sepPos = strrpos($path, "::")) {
                // cut down the path
                $path = substr($path, 0, $sepPos);

                // see if we have to add the path
                if (!isset($this->tablePath[$path])) {
                    $this->tablePath[$path] = $jointype;
                } else {
                    // if we have an inner join now ... upgrade ..
                    // 2011-12-29 proper seeuence and upgrading ... added empty join
                    if ($this->tablePath[$path] == '' || ($this->tablePath[$path] == 'LEFT JOIN' && $jointype == 'INNER JOIN'))
                        $this->tablePath[$path] = $jointype;
                }
            }
        }
    }

    /*
     * Function that evaluates the path and then build the join segments
     * need that later on to identify the segmets of the select statement
     */

    function build_from_string()
    {
        global $app_list_strings;
$current_user = \SpiceCRM\includes\authentication\AuthenticationController::getInstance()->getCurrentUser();
$db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();

        // Create a root GUID
        $this->rootGuid = randomstring();

        $this->joinSegments = [];
        $this->maxDepth = 0;

        $kOrgUnits = false;

        //check if we do the Org Check
/*
        if (file_exists('modules/KOrgObjects/KOrgObject.php') && $GLOBALS['sugarconfig']['orgmanaged']) {
            require_once('modules/KOrgObjects/KOrgObject.php');
            $thisKOrgObject = new KOrgObject();
            $kOrgUnits = true;
        }*/

        /*
         * Build the array for the joins based on the various Path we have
         */
        if (count($this->tablePath) > 0)
            foreach ($this->tablePath as $thisPath => $thisPathJoinType) {
                // Process backcutting until we have found the node going upwards
                // in the segments array or we are on the root segment
                // (when no '::' can be found)
                if (substr_count($thisPath, '::') > $this->maxDepth)
                    $this->maxDepth = substr_count($thisPath, '::');

                while (strpos($thisPath, '::') && !isset($this->joinSegments[$thisPath])) {
                    // add the segment to the segments table
                    $this->joinSegments[$thisPath] = array('alias' => randomstring(), 'linkalias' => randomstring(), 'level' => substr_count($thisPath, '::'), 'jointype' => $thisPathJoinType);

                    // find last occurence of '::' in the string and cut off there
                    $thisPath = substr($thisPath, strrpos($thisPath, "::"));
                }
            }

        // Get the main Table we select from
        $this->fromString = 'FROM ' . $this->get_table_for_module($this->root_module) . ' ' . $this->rootGuid;
        // check if this is an array so we need to add joins ...
        // add an entry for the root Object ...
        // needed as reference for the GUID
        $this->joinSegments['root:' . $this->root_module] = array('alias' => $this->rootGuid, 'level' => 0);

        // get ther root Object
        //require_once(SpiceModules::getInstance()->getBeanFiles()[$beanList[$this->root_module]]);
        //$this->joinSegments['root:' . $this->root_module]['object'] = new $beanList[$this->root_module]();
        $this->joinSegments['root:' . $this->root_module]['object'] = \SpiceCRM\data\BeanFactory::getBean($this->root_module);


        // changed so we spport teams in Pro
        if ($this->authChecklevel != 'none') {
            $selectArray = array('where' => '', 'from' => '', 'select' => '');
            if(method_exists(SpiceACL::getInstance(), 'addACLAccessToListArray'))
                SpiceACL::getInstance()->addACLAccessToListArray($selectArray, $this->joinSegments['root:' . $this->root_module]['object'], $this->joinSegments['root:' . $this->root_module]['alias'], true);
            if (!empty($selectArray['where'])) {
                if (empty($this->whereString)) {
                    $this->whereString = " " . $selectArray['where'] . " ";
                } else {
                    $this->whereString .= " AND " . $selectArray['where'] . " ";
                }
            }
            if (!empty($selectArray['join'])) {
                $this->fromString .= ' ' . $selectArray['join'] . ' ';
            }
        }


        // Index to iterate through the join table building the joins
        // from the root object outward going
        $levelCounter = 1;
        if (is_array($this->joinSegments)) {

            while ($levelCounter <= $this->maxDepth) {
                // set the array back to the first element in the array
                reset($this->joinSegments);

                foreach ($this->joinSegments as $thisPath => $thisPathDetails) {
                    // process only entries for the respective levels
                    if ($thisPathDetails['level'] == $levelCounter) {
                        // get the last enrty and the one before and the relevant arrays
                        $rightPath = substr($thisPath, strrpos($thisPath, "::") + 2, strlen($thisPath));
                        $leftPath = substr($thisPath, 0, strrpos($thisPath, "::"));

                        // explode into the relevant arrays
                        $rightArray = explode(':', $rightPath);
                        $leftArray = explode(':', $leftPath);

                        // 2011-07-21 add check for audit records
                        if ($rightArray[2] == 'audit') {
                            //handle audit link
                            $this->fromString .= $thisPathJoinType . $this->joinSegments[$leftPath]['object']->table_name . '_audit ' . $this->joinSegments[$thisPath]['alias'] . ' ON ' . $this->joinSegments[$thisPath]['alias'] . '.parent_id = ' . $this->joinSegments[$leftPath]['alias'] . '.id';
                        } //2011-08-17 reacht to a relationship record and replace the alias in the path
                        elseif ($rightArray[0] == 'relationship') {
                            // set alias for the path to the linkalias of the connected bean
                            $this->joinSegments[$thisPath]['alias'] = $this->joinSegments[$leftPath]['linkalias'];
                        } //2013-01-09 add support for Studio Relate Fields
                        elseif ($rightArray[0] == 'relate') {
                            //left Path Object must be set since we process from the top
                            if ($this->joinSegments[$leftPath]['object']->_module != $rightArray[1]) {
                                 die('fatal Error in Join');
                            }
                            // load the module on the right hand side
                            $this->joinSegments[$thisPath]['object'] = \SpiceCRM\data\BeanFactory::getBean($this->joinSegments[$leftPath]['object']->field_defs[$rightArray[2]]['module']);

                            // join on the id = relate id .. on _cstm if custom field .. on main if regular
                            $this->fromString .= ' ' . $thisPathDetails['jointype'] . ' ' . $this->joinSegments[$thisPath]['object']->table_name . ' AS ' . $this->joinSegments[$thisPath]['alias'] . ' ON ' . $this->joinSegments[$thisPath]['alias'] . '.id=' . ($this->joinSegments[$leftPath]['object']->field_defs[$this->joinSegments[$leftPath]['object']->field_defs[$rightArray[2]]['id_name']]['source'] == 'custom_fields' ? $this->joinSegments[$leftPath]['customjoin'] : $this->joinSegments[$leftPath]['alias']) . '.' . $this->joinSegments[$leftPath]['object']->field_defs[$rightArray[2]]['id_name'] . ' ';

                        } else {
                            if ($this->joinSegments[$leftPath]['object']->_module != $rightArray[1]) {
                               die('fatal Error in Join ' . $thisPath);
                            }

                            // load the relationship .. resp link
                            $this->joinSegments[$leftPath]['object']->load_relationship($rightArray[2]);
                            // set aliases for left and right .. will be processed properly anyway in the build of the link
                            // ... funny enough so
                            //PHP7 - 5.6 COMPAT: used created variable as dynamic property name
                            $rightArrayEl = $rightArray[2];

                            //2011-12-29 check if we have a jointpye
                            if ($thisPathDetails['jointype'] != '') {
                                //2011-12-29 see if the relationship vuilds on a custom field
                                if (isset($this->joinSegments[$leftPath]['object']->field_name_map[$this->joinSegments[$leftPath]['object']->$rightArrayEl->_relationship->rhs_key]['source']) && ($this->joinSegments[$leftPath]['object']->field_name_map[$this->joinSegments[$leftPath]['object']->$rightArrayEl->_relationship->rhs_key]['source'] == 'custom_fields' || $this->joinSegments[$leftPath]['object']->field_name_map[$this->joinSegments[$leftPath]['object']->$rightArrayEl->_relationship->lhs_key]['source'] == 'custom_fields')) { ////$rightArray[2]
                                    $join_params = array(
                                        'join_type' => $thisPathDetails['jointype'],
                                        'right_join_table_alias' => $this->joinSegments[$leftPath]['customjoin'],
                                        'left_join_table_alias' => $this->joinSegments[$leftPath]['customjoin'],
                                        'join_table_link_alias' => $this->joinSegments[$thisPath]['linkalias'], // randomstring() ,
                                        'join_table_alias' => $this->joinSegments[$thisPath]['alias']
                                    );
                                } else {
                                    $join_params = array(
                                        'join_type' => $thisPathDetails['jointype'],
                                        'right_join_table_alias' => $this->joinSegments[$leftPath]['alias'],
                                        'left_join_table_alias' => $this->joinSegments[$leftPath]['alias'],
                                        'join_table_link_alias' => $this->joinSegments[$thisPath]['linkalias'], // randomstring() ,
                                        'join_table_alias' => $this->joinSegments[$thisPath]['alias']
                                    );
                                }

                                //2010-09-09 Bug to handle left side join relationship
                                if (isset($this->joinSegments[$leftPath]['object']->field_defs[$rightArray[2]]['side']) && $this->joinSegments[$leftPath]['object']->field_defs[$rightArray[2]]['side'] == 'left' && !$this->joinSegments[$leftPath]['object']->$rightArray[2]->_swap_sides)
                                    $this->joinSegments[$leftPath]['object']->$rightArrayEl->_swap_sides = true; //$rightArray[2]

                                $linkJoin = $this->joinSegments[$leftPath]['object']->$rightArrayEl->getJoin($join_params); //$rightArray[2]

                                $this->fromString .= ' ' . $linkJoin;
                            }
                            // load the module on the right hand side
                            $this->joinSegments[$thisPath]['object'] = \SpiceCRM\data\BeanFactory::getBean($this->joinSegments[$leftPath]['object']->$rightArrayEl->getRelatedModuleName()); //$rightArray[2]

                            //bugfix 2010-08-19, respect ACL role access for owner reuqired in select
                            if ($this->joinSegments[$leftPath]['object']->bean_implements('ACL') && SpiceACL::getInstance()->requireOwner($this->joinSegments[$leftPath]['object']->module_dir, 'list')) {
                                //2013-02-22 missing check if we have a wherestring at all
                                if ($this->whereString != '')
                                    $this->whereString .= ' AND ';
                                $this->whereString .= $this->joinSegments[$leftPath]['alias'] . '.assigned_user_id=\'' . $current_user->id . '\'';
                            }

                            // append join for Orgobjects if Object is OrgManaged
                            if ($this->authChecklevel != 'none' && $this->authChecklevel != 'top') {
                                $selectArray = array('where' => '', 'from' => '', 'select' => '');
                                if(method_exists(SpiceACL::getInstance(), 'addACLAccessToListArray'))
                                    SpiceACL::getInstance()->addACLAccessToListArray($selectArray, $this->joinSegments['root:' . $this->root_module]['object'], $this->joinSegments['root:' . $this->root_module]['alias'], true);
                                if (!empty($selectArray['where'])) {
                                    if (empty($this->whereString)) {
                                        $this->whereString = " " . $selectArray['where'] . " ";
                                    } else {
                                        $this->whereString .= " AND " . $selectArray['where'] . " ";
                                    }
                                }
                                if (!empty($selectArray['join'])) {
                                    $this->fromString .= ' ' . $selectArray['join'] . ' ';
                                }
                            }
                        }
                    }
                }

                // increase Counter to tackle next level
                $levelCounter++;
            }
        }
    }

    /*
     * function that build the selct string
     * parameter unionJoinSegments to hand in more join segments to include
     * in select stamenet when we are in a union join mode - then this function gets
     * processed twice
     */

    function build_select_string($unionJoinSegments = '')
    {
        // require_once('include/utils.php');
        global $app_list_strings;
$db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();
        /*
         * Block to build the selct clause with all fields selected
         */
        // reset the Fiels Array
        $this->fieldArray = [];

        //handle additional currency field in union (at least one of unioned modules uses a currency field)
        //this creates an additional field dor select and crashes union query
        $atLeast1CurrencyInSelect = false;

        // build select
        // 2016-11-23 added count select stzring into the swicth for mssql and oci8
        if ($this->isGrouped && !\SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['KReports']['olderMySqlVersion'] /* && (\SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'mssql' || \SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'oci8')*/) {
            $this->selectString = 'SELECT MIN(' . $this->rootGuid . '.id) as sugarRecordId';
            $this->countSelectString = 'SELECT MIN(' . $this->rootGuid . '.id) as sugarRecordId';
        }
        else {
            $this->selectString = 'SELECT ' . $this->rootGuid . '.id as "sugarRecordId"';
            $this->countSelectString = 'SELECT ' . $this->rootGuid . '.id as "sugarRecordId"';
        }

        $this->unionSelectString = 'SELECT sugarRecordId';

        $this->fieldArray['sugarRecordId'] = 'sugarRecordId';

        // add rootmodule for this record
        $this->selectString .= ", '" . $this->root_module . "' as \"sugarRecordModule\" ";
        $this->unionSelectString .= ', sugarRecordModule';

        $this->fieldArray['sugarRecordModule'] = 'sugarRecordModule';

        // see if we are in a union statement then we select the unionid as well
        if ($this->unionId != '') {
            $this->selectString .= ', \'' . $this->unionId . '\' as "unionid"';
            $this->unionSelectString .= ', unionid';

            $this->fieldArray['unionid'] = 'unionid';

            //check if one of the fields is currency. In that case add '-99' to select on line
            foreach($this->listArray as $idx => $fielddef)
                if($fielddef['type'] == 'currency' || $fielddef['overridetype'] == 'currency')
                    $atLeast1CurrencyInSelect = true;
        }

        // select the ids for the various linked tables
        // check if we have joins for a union passed in ...
        if ($unionJoinSegments != '' && is_array($unionJoinSegments)) {
            $this->unionJoinSegments = $unionJoinSegments;

            foreach ($unionJoinSegments as $thisAlias => $thisJoinIdData) {
                if ($thisJoinIdData['unionid'] == $this->unionId) {
                    // this is for this join ... so we select the id
                    if ($this->isGrouped && !\SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['KReports']['olderMySqlVersion'] /*&& (\SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'mssql' || \SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'oci8')*/)
                        $this->selectString .= ', MIN(' . $thisAlias . '.id) as ' . $thisAlias . 'id';
                    else
                    $this->selectString .= ', ' . $thisAlias . '.id as "' . $thisAlias . 'id"';

                    $this->selectString .= ', \'' . $thisJoinIdData['path'] . '\' as "' . $thisAlias . 'path"';
                } else {
                    // this is for another join ... so we select an empty field
                    $this->selectString .= ', \'\' as "' . $thisAlias . 'id"';
                    $this->selectString .= ', \'\'  as "' . $thisAlias . 'path"';
                }

                $this->unionSelectString .= ', ' . $thisAlias . 'id';
                $this->unionSelectString .= ', ' . $thisAlias . 'path';

                $this->fieldArray[$thisAlias . 'id'] = $thisAlias . 'id';
                $this->fieldArray[$thisAlias . 'path'] = $thisAlias . 'path';
            }
        } else {
            // standard processing ... we simply loop through the joinsegments
            foreach ($this->joinSegments as $joinpath => $joinsegment) {
                // 2012-02-3 cant take this out sinceit breaks the links!!!!
                // 2011-12-29 check if Jointype is set
                //if( $joinsegment['jointype'] != '')
                //{
                if ($this->isGrouped && (\SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'mssql' || \SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'oci8'))
                    $this->selectString .= ', MIN(' . $joinsegment['alias'] . '.id) as ' . $joinsegment['alias'] . 'id';
                else
                    $this->selectString .= ', ' . $joinsegment['alias'] . '.id as "' . $joinsegment['alias'] . 'id"';
                $this->selectString .= ', \'' . $joinpath . '\' as "' . $joinsegment['alias'] . 'path"';
                $this->unionSelectString .= ', ' . $joinsegment['alias'] . 'id';
                $this->unionSelectString .= ', ' . $joinsegment['alias'] . 'path';
                //}

                $this->fieldArray[$joinsegment['alias'] . 'id'] = $joinsegment['alias'] . 'id';
                $this->fieldArray[$joinsegment['alias'] . 'path'] = $joinsegment['alias'] . 'path';
            }
        }

        if (is_array($this->listArray)) {
            foreach ($this->listArray as $thisListEntry) {
                // $this->addPath($thisList['path'], $this->switchJoinType($thisList['jointype']));
                $fieldName = substr($thisListEntry['path'], strrpos($thisListEntry['path'], "::") + 2, strlen($thisListEntry['path']));
                $pathName = substr($thisListEntry['path'], 0, strrpos($thisListEntry['path'], "::"));

                $fieldArray = explode(':', $fieldName);


                // process an SQL Function if one is set and the eval trigger is set to true
                // if we have a fixed value select that value
                if ($thisListEntry['path'] == '' || (isset($thisListEntry['fixedvalue']) && $thisListEntry['fixedvalue'] != '')) {
                    //if($thisListEntry['sqlfunction'] != '-' && $this->evalSQLFunctions )
                    //	$this->selectString .= ', ' . $thisListEntry['sqlfunction'] . '(' . $thisListEntry['fixedvalue'] . ') as ' . $thisListEntry['fieldid'];
                    // else
                    $this->selectString .= ", '" . $thisListEntry['fixedvalue'] . "' as \"" . $thisListEntry['fieldid'] . "\"";


                    // required handling foir sql function also needed for
                    if ($thisListEntry['sqlfunction'] != '-' && $this->evalSQLFunctions && ($this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['type'] != 'kreporter' || ($this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['type'] == 'kreporter' && $this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['evalSQLFunction'] == 'X'))) {
                        if ($thisListEntry['sqlfunction'] == 'GROUP_CONCAT') {
                            $this->unionSelectString .= ', ' . $thisListEntry['sqlfunction'] . '(DISTINCT ' . $thisListEntry['fieldid'] . ' SEPARATOR \', \')';
                        } //2013-03-01 Sort function for Group Concat
                        elseif ($thisListEntry['sqlfunction'] == 'GROUP_CONASC') {
                            $this->unionSelectString .= ', GROUP_CONCAT(DISTINCT ' . $thisListEntry['fieldid'] . ' ORDER BY ' . $thisListEntry['fieldid'] . ' ASC SEPARATOR \', \')';
                        } elseif ($thisListEntry['sqlfunction'] == 'GROUP_CONDSC') {
                            $this->unionSelectString .= ', GROUP_CONCAT(DISTINCT ' . $thisListEntry['fieldid'] . ' ORDER BY ' . $thisListEntry['fieldid'] . ' DESC SEPARATOR \', \')';
                        }
                        // 2012-10-11 add count distinct
                        //2013-04-22 also for Count Distinct ... Bug #469
                        //elseif ($thisListEntry['sqlfunction'] == 'COUNT_DISTINCT') {
                        //    $this->unionSelectString .= ', COUNT(DISTINCT ' . $thisListEntry['fieldid'] . ')';
                        // }
                        else {
                            //2011-05-31 if function is count - sum in union
                            //2013-04-22 also for Count Distinct ... Bug #469
                            $this->unionSelectString .= ', ' . ($thisListEntry['sqlfunction'] == 'COUNT' || $thisListEntry['sqlfunction'] == 'COUNT_DISTINCT' ? 'SUM' : $thisListEntry['sqlfunction']) . '(' . $thisListEntry['fieldid'] . ')';
                        }
                        $this->unionSelectString .= ' as "' . $thisListEntry['fieldid'] . '"';
                    } else
                        $this->unionSelectString .= ', ' . $thisListEntry['fieldid'];

                    // add this to the fieldName Map in case we link a fixed
                    $this->fieldNameMap[$thisListEntry['fieldid']] = array(
                        'fieldname' => '',
                        'path' => '',
                        'islink' => ($thisListEntry['link'] == 'yes') ? true : false,
                        'sqlFunction' => '',
                        'tablealias' => $this->rootGuid,
                        'fields_name_map_entry' => '',
                        'type' => /* 'fixedvalue' */
                            (isset($this->joinSegments[$pathName]) ?  $this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['kreporttype'] ?: $this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['type'] : 'fixedvalue'),
                        //BEGIN ticket 0000926 maretval: pass overridetype needed later on for proper sorting
                        'overridetype' => $thisListEntry['overridetype'],
                        //END
                        'module' => $this->root_module,
                        'fields_name_map_entry' => (isset($this->joinSegments[$pathName]) ? $this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]] : array()));
                } else {
                    if ($thisListEntry['sqlfunction'] != '-' && $this->evalSQLFunctions && ($this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['type'] != 'kreporter' || ($this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['type'] == 'kreporter' && (array_key_exists('evalSQLFunction', $this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]) && $this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['evalSQLFunction'] == 'X')))) {
                        if ($thisListEntry['sqlfunction'] == 'GROUP_CONCAT') {
                            $this->selectString .= ', ' . $thisListEntry['sqlfunction'] . '(DISTINCT ' . $this->get_field_name($pathName, $fieldArray[1], $thisListEntry['fieldid'], ($thisListEntry['link'] == 'yes') ? true : false, $thisListEntry['sqlfunction']) . ' SEPARATOR \', \')';
                            $this->unionSelectString .= ', ' . $thisListEntry['sqlfunction'] . '(DISTINCT ' . $thisListEntry['fieldid'] . ' SEPARATOR \', \')';
                        } //2013-03-01 Sort function for Group Concat
                        elseif ($thisListEntry['sqlfunction'] == 'GROUP_CONASC') {
                            $this->selectString .= ', GROUP_CONCAT(DISTINCT ' . $this->get_field_name($pathName, $fieldArray[1], $thisListEntry['fieldid'], ($thisListEntry['link'] == 'yes') ? true : false, $thisListEntry['sqlfunction']) . ' ORDER BY ' . $this->get_field_name($pathName, $fieldArray[1], $thisListEntry['fieldid'], ($thisListEntry['link'] == 'yes') ? true : false, $thisListEntry['sqlfunction']) . ' ASC SEPARATOR \', \')';
                            $this->unionSelectString .= ', GROUP_CONCAT(DISTINCT ' . $thisListEntry['fieldid'] . ' ORDER BY ' . $thisListEntry['fieldid'] . ' ASC SEPARATOR \', \')';
                        } elseif ($thisListEntry['sqlfunction'] == 'GROUP_CONDSC') {
                            $this->selectString .= ', GROUP_CONCAT(DISTINCT ' . $this->get_field_name($pathName, $fieldArray[1], $thisListEntry['fieldid'], ($thisListEntry['link'] == 'yes') ? true : false, $thisListEntry['sqlfunction']) . ' ORDER BY ' . $this->get_field_name($pathName, $fieldArray[1], $thisListEntry['fieldid'], ($thisListEntry['link'] == 'yes') ? true : false, $thisListEntry['sqlfunction']) . ' ASC SEPARATOR \', \')';
                            $this->unionSelectString .= ', GROUP_CONCAT(DISTINCT ' . $thisListEntry['fieldid'] . ' ORDER BY ' . $thisListEntry['fieldid'] . ' DESC SEPARATOR \', \')';
                        } // 2012-10-11 add count distinct
                        elseif ($thisListEntry['sqlfunction'] == 'COUNT_DISTINCT') {
                            $this->selectString .= ', COUNT(DISTINCT ' . $this->get_field_name($pathName, $fieldArray[1], $thisListEntry['fieldid'], ($thisListEntry['link'] == 'yes') ? true : false, $thisListEntry['sqlfunction']) . ')';
                            //2013-04-22 also for Count Distinct ... Bug #469
                            //$this->unionSelectString .= ', COUNT(DISTINCT ' . $thisListEntry['fieldid'] . ')';
                            $this->unionSelectString .= ', SUM(' . $thisListEntry['fieldid'] . ')';
                        } else {
                            $this->selectString .= ', ' . $thisListEntry['sqlfunction'] . '(' . $this->get_field_name($pathName, $fieldArray[1], $thisListEntry['fieldid'], ($thisListEntry['link'] == 'yes') ? true : false, $thisListEntry['sqlfunction']) . ')';
                            // 2011-05-31 if function is count - sum in union
                            $this->unionSelectString .= ', ' . ($thisListEntry['sqlfunction'] == 'COUNT' ? 'SUM' : $thisListEntry['sqlfunction']) . '(' . $thisListEntry['fieldid'] . ')';
                        }
                    } else {
                        //if(isset($thisListEntry['customsqlfunction']) && $thisListEntry['customsqlfunction'] != '')
                        //	$this->selectString .= ', ' . str_replace('$', $this->get_field_name($pathName, $fieldArray[1], $thisListEntry['fieldid'], ($thisListEntry['link'] == 'yes') ? true : false), $thisListEntry['customsqlfunction']);
                        //else
                        $this->selectString .= ', ' . $this->get_field_name($pathName, $fieldArray[1], $thisListEntry['fieldid'], ($thisListEntry['link'] == 'yes') ? true : false);
                        $this->unionSelectString .= ', ' . $thisListEntry['fieldid'];
                    }


                    if (isset($thisListEntry['fieldid']) && $thisListEntry['fieldid'] != '') {
                        $this->selectString .= " as \"" . $thisListEntry['fieldid'] . "\"";
                        $this->unionSelectString .= " as \"" . $thisListEntry['fieldid'] . "\"";
                    }


                    //2011-03-05 moved to the query array so we can also handle unions
                    /*
                      //2011-02-03 for calculating percentages
                      if(isset($thisListEntry['valuetype']) && $thisListEntry['valuetype'] != '' && $thisListEntry['valuetype'] != '-')
                      {
                      // first part of value is calulated what to do with the alue ... 2nd part is SQL function we need
                      // 'OF' separates
                      $funcArray = split('OF', $thisListEntry['valuetype']);
                      if($this->totalSelectString == '') $this->totalSelectString = 'SELECT '; else $this->totalSelectString .= ', ';
                      $this->totalSelectString .= ' ' . $funcArray[1] . '(' . $this->get_field_name($pathName, $fieldArray[1], $thisListEntry['fieldid'], ($thisListEntry['link'] == 'yes') ? true : false) . ")  as '" . $thisListEntry['fieldid'] . "_total'";
                      }
                     */
                }

                $this->fieldArray[$thisListEntry['fieldid']] = $thisListEntry['fieldid'];

                // 2010-12-18 handle currencies if value is set in vardefs
                // 2011-03-28 handle curencies in any case
                // 2012-11-04 also check the rootfieldNameMap
                // 2017-06-20 handle currencies in union if value is set in vardefs: see $atLeast1CurrencyInSelect
                if (isset($this->joinSegments[$pathName]) && ($this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['type'] == 'currency' || (isset($this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['kreporttype']) && $this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['kreporttype'] == 'currency')) || $this->rootfieldNameMap[$thisListEntry['fieldid']]['type'] == 'currency' || $atLeast1CurrencyInSelect) {
                    // if we have a currency id and no SQL function select the currency .. if we have an SQL fnction select -99 for the system currency
                    if (isset($this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['currency_id']) && ($thisListEntry['sqlfunction'] == '-' || strtoupper($thisListEntry['sqlfunction']) == 'SUM')){
                        $this->selectString .= ", " . $this->joinSegments[$pathName]['alias'] . "." . $this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['currency_id'] . " as '" . $thisListEntry['fieldid'] . "_curid'";
                    }
                    // BEGIN currency id value for kreporter field: field contains a currency conversion.
                    // Currency symbol will not be from record but from conversion
                    // Use new property kreportcurrency_id and enter currency id in kreporter field vardefs
                    elseif ($this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['type'] == 'kreporter' && isset($this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['kreportcurrency_id'])) {
                        $this->selectString .= ", '" . $this->joinSegments[$pathName]['object']->field_name_map[$fieldArray[1]]['kreportcurrency_id'] . "' as '" . $thisListEntry['fieldid'] . "_curid'";
                    }
                    // END
                    // BEGIN CR1000035 currency field might not be linked to amount field.
                    elseif (isset($this->joinSegments[$pathName]['object']->field_name_map['currency_id']) ) {
                        $this->selectString .= ", " . $this->joinSegments[$pathName]['alias'] . ".currency_id as '" . $thisListEntry['fieldid'] . "_curid'";
                    }// END
                    else {
                        $this->selectString .= ", '-99' as '" . $thisListEntry['fieldid'] . "_curid'";
                    }
                    $this->unionSelectString .= ', ' . $thisListEntry['fieldid'] . "_curid";

                    $this->fieldArray[$thisListEntry['fieldid'] . "_curid"] = $thisListEntry['fieldid'] . "_curid";
                }

                // whatever we need this for?
                // TODO: check if we still need this and if what for
                //$selectFields[] = trim($thisListEntry['name'], ':');
            }
        } else {
            $this->selectString .= '*';
        }
    }

    /*
     * Function to build the where String
     */

    function build_where_string()
    {
        global $app_list_strings;
$current_user = \SpiceCRM\includes\authentication\AuthenticationController::getInstance()->getCurrentUser();
$db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();

        /*
         * Block to build the Where Clause
         */
        // see if we need to ovveride
        /*
          if(is_array($this->whereOverrideArray))
          {
          foreach($this->whereOverrideArray as $overrideKey => $overrideData)
          {
          reset($this->whereArray);
          foreach($this->whereArray as $originalKey => $originalData)
          {
          if($originalData['fieldid'] == $overrideData['fieldid'])
          {
          $this->whereArray[$originalKey] = $overrideData;
          // need to exit the while loop
          }
          }
          }
          }
         */
        // initialize
        $arrayWhereGroupsIndexed = [];
        // $arrayWhereGroupsIndexed['root'] = [];
        // build the where String for each Group
        foreach ($this->whereGroupsArray as $whereGroupIndex => $thisWhereGroup) {
            $thisWhereString = '';
            // reset the Where fields and loop over all fields to see if any is in our group
            reset($this->whereArray);
            foreach ($this->whereArray as $thisWhere) {
                //2012-11-24 cater for a potential empty where string
                $tempWhereString = '';
                // check if this is for the current group
                // 2011--01-24 add ignore filter
                if (($thisWhere['groupid'] == $thisWhereGroup['groupid'] || $thisWhere['groupid'] == $thisWhereGroup['id']) && $thisWhere['operator'] != 'ignore') {

                    // process the Field and link with the joinalias
                    $fieldName = substr($thisWhere['path'], strrpos($thisWhere['path'], "::") + 2, strlen($thisWhere['path']));
                    $pathName = substr($thisWhere['path'], 0, strrpos($thisWhere['path'], "::"));
                    $fieldArray = explode(':', $fieldName);

                    if ($thisWhere['jointype'] != 'notexisting') {
                        //getWhereOperatorClause($operator, $fieldname, $alias,  $value, $valuekey, $valueto)
                        //$thisWhereString .= $this->getWhereOperatorClause($thisWhere['operator'], $fieldArray[1], $this->joinSegments[$pathName]['alias'],  $thisWhere['value'], $thisWhere['valuekey'], $thisWhere['valueto']);
                        //2012-11-24 ... changed to fill into temnpWherestring
                        //2013-08-07 .. process fixed value
                        if (!empty($thisWhere['fixedvalue']))
                            $tempWhereString = $this->getWhereOperatorClause($thisWhere['operator'], $fieldArray[1], '\'' . $thisWhere['fixedvalue'] . '\'', $pathName, $thisWhere['value'], $thisWhere['valuekey'], $thisWhere['valueto'], $thisWhere['valuetokey'], $thisWhere['jointype']);
                        elseif (!empty($pathName))
                            $tempWhereString = $this->getWhereOperatorClause($thisWhere['operator'], $fieldArray[1], $thisWhere['fieldid'], $pathName, $thisWhere['value'], $thisWhere['valuekey'], $thisWhere['valueto'], $thisWhere['valuetokey'], $thisWhere['jointype'], $thisWhere['customSqlQuery']);
                    } else {
                        // we have a not esists clause
                        $tempWhereString .= 'not exists(';

                        // get the last enrty and the one before and the relevant arrays
                        $rightPath = substr($pathName, strrpos($pathName, "::") + 2, strlen($pathName));
                        $leftPath = substr($pathName, 0, strrpos($pathName, "::"));

                        // explode into the relevant arrays
                        $rightArray = explode(':', $rightPath);
                        $leftArray = explode(':', $leftPath);

                        // set aliases for left and right .. will be processed properly anyway in the build of the link
                        // ... funny enough so
                        $join_params = array(
                            'right_join_table_alias' => $this->joinSegments[$leftPath]['alias'],
                            'left_join_table_alias' => $this->joinSegments[$leftPath]['alias'],
                            'join_table_link_alias' => randomstring(),
                            'join_table_alias' => $this->joinSegments[$pathName]['alias']
                        );

                        $tempWhereString .= $this->joinSegments[$leftPath]['object']->{$rightArray[2]}->getWhereExistsStatement($join_params); //$rightArray[2]

                        // add the standard Where Clause
                        // $thisWhereString .= $this->getWhereOperatorClause($thisWhere['operator'], $fieldArray[1], $this->joinSegments[$pathName]['alias'],  $thisWhere['value'], $thisWhere['valuekey'], $thisWhere['valueto']);
                        $tempWhereString .= 'AND ' . $this->getWhereOperatorClause($thisWhere['operator'], $fieldArray[1], $thisWhere['fieldid'], $pathName, $thisWhere['value'], $thisWhere['valuekey'], $thisWhere['valueto'], $thisWhere['valuetokey']);

                        // close the select clause
                        $tempWhereString .= ')';
                    }

                    //2012-11-24 moved to cehck if the where string returned something at all
                    if ($tempWhereString != '') {
                        // if we have an where string already concetanate with the type for the group AND or OR
                        if ($thisWhereString != '')
                            $thisWhereString .= ' ' . $thisWhereGroup['type'] . ' (';
                        else
                            $thisWhereString .= '(';

                        $thisWhereString .= $tempWhereString;

                        // close this condition
                        $thisWhereString .= ')';
                    }
                }
            }
            $thisWhereGroup['whereClause'] = $thisWhereString;

            // write into an array with the id as index in the array (will need that tobuild the hierarchy
            $arrayWhereGroupsIndexed[$thisWhereGroup['group'] ?: $thisWhereGroup['groupid']] = $thisWhereGroup;
        }

        // 2013-01-16 check if we have a where string already from the auth check
        // 2013-02-22 moved into the adding of the where clause ...
        //if ($this->whereString != '')
        //    $this->whereString .= ' AND ';
        // process now topDown
        if (isset($arrayWhereGroupsIndexed['root'])) {
            $levelWhere = $this->buildWhereClauseForLevel($arrayWhereGroupsIndexed['root'], $arrayWhereGroupsIndexed);
            if ($levelWhere != '') {
                if ($this->whereString != '')
                    $this->whereString .= ' AND ';
                $this->whereString .= $levelWhere;
            }
        }
        // 2010-07-18 additonal Filter mainly for the treeview
        if (is_array($this->whereAddtionalFilter)) {
            foreach ($this->whereAddtionalFilter as $filterFieldId => $filterFieldValue) {
                //special treatment for fied values where we do not have a path
                if ($this->get_fieldname_by_fieldid($filterFieldId) == '') {
                    ($this->havingString == '') ? $this->havingString = 'HAVING ' : $this->havingString .= ' AND ';
                    $this->havingString .= $filterFieldId . " = '" . $filterFieldValue . "'";
                } else {
                    $whereOperatorWhere = $this->getWhereOperatorClause('equals', $this->get_fieldname_by_fieldid($filterFieldId), $filterFieldId, $this->get_fieldpath_by_fieldid($filterFieldId), $filterFieldValue, '', '', '');
                    if ($whereOperatorWhere != '') {
                        if ($this->whereString != '')
                            $this->whereString .= ' AND ';
                        $this->whereString .= $whereOperatorWhere;
                    }
                }
                // $this->whereString .= ' ' . $this->fieldNameMap[$filterFieldId]['tablealias'] . '.' . $this->fieldNameMap[$filterFieldId]['fieldname'] . ' = \'' . $filterFieldValue . '\'';
            }
        }

        // bugfix 2010-06-14 exclude deleted items
        // add feature fcheck if we shod show deleted records
        if (!$this->showDeleted) {
            if ($this->whereString != '')
                $this->whereString = 'WHERE ' . $this->rootGuid . '.deleted = \'0\' AND ' . $this->whereString;
            else
                $this->whereString = 'WHERE ' . $this->rootGuid . '.deleted = \'0\'';
        } else {
            if ($this->whereString != '')
                $this->whereString = 'WHERE ' . $this->whereString;
            else
                $this->whereString = '';
        }

        // bugfix 2010-08-19, respect ACL access for owner required
        // check for Role based access on root module
        // 2013-02-22 ... added anyway for each segment ... no need to add here again ...
        /*
          if (!$current_user->is_admin && $this->joinSegments['root:' . $this->root_module]['object']->bean_implements('ACL') && SpiceACL::getInstance()->requireOwner($this->joinSegments['root:' . $this->root_module]['object']->module_dir, 'list')) {
          $this->whereString .= ' AND ' . $this->rootGuid . '.assigned_user_id=\'' . $current_user->id . '\'';
          }
         */
    }

    /*
     * Function to build the Where Clause for one level
     * calls build for Children and get calls recursively
     */

    function buildWhereClauseForLevel($thisLevel, $completeArray = array())
    {
        $whereClause = '';

        //find Children
        foreach ($completeArray as $currentEntry) {
            if ($currentEntry['parent'] == $thisLevel['id']) {
                $thisLevel['children'][$currentEntry['id']] = $currentEntry;
            }
        }

        // if we have Children build the Where Clause for the Children
        if (isset($thisLevel['children']) && is_array($thisLevel['children']))
            $whereClauseChildren = $this->buildWhereClauseForChildren($thisLevel['children'], $thisLevel['type'], $completeArray);
        else
            $whereClauseChildren = '';

        // build the combined Whereclause
        if (isset($thisLevel['whereClause']) && $thisLevel['whereClause'] != '') {
            $whereClause = $thisLevel['whereClause'];
        }

        // add the Children Where Clauses if there is any
        if ($whereClauseChildren != '') {
            if ($whereClause != '')
                $whereClause .= ' ' . $thisLevel['type'] . ' ' . $whereClauseChildren;
            else
                $whereClause = $whereClauseChildren;
        }

        // if there is a where clause encapsulate it
        if ($whereClause != '')
            $whereClause = '(' . $whereClause . ')';

        // return whatever we have built
        return $whereClause;
    }

    /*
     * Function to build the Where Clause for the Children and return it
     */

    function buildWhereClauseForChildren($thisChildren, $thisOperator, $completeArray)
    {
        $whereClause = '';
        foreach ($thisChildren as $thisChild) {
            // recursively build the clause for this level and if we have
            // children we get called again ... loop top down ...
            $childWhereClause = $this->buildWhereClauseForLevel($thisChild, $completeArray);

            // check if there is something to add
            if ($childWhereClause != '') {
                if ($whereClause != '')
                    $whereClause .= ' ' . $thisOperator . ' ' . $childWhereClause;
                else
                    $whereClause = $childWhereClause;
            }
        }

        // check if we have a where Clause at all and if encapsulate
        return $whereClause;
    }

    /*
     * process the where operator
     */

    function getWhereOperatorClause($operator, $fieldname, $fieldid, $path, $value, $valuekey, $valueto, $valuetokey = '', $jointype = '', $customSql = '')
    {
        $current_user = \SpiceCRM\includes\authentication\AuthenticationController::getInstance()->getCurrentUser();

        // initialize
        $thisWhereString = '';

        // add ignore Operator 2011-01-24
        // in this case we simply jump back out returning an empty string.
        if ($operator == 'ignore')
            return '';


        //change if valuekey is set
        //ticket 0000914 bug fix 2018-04-18 maretval: value might be 0, check on value type!
        if (isset($valuekey) && ( (is_string($valuekey) && $valuekey !== '' && $valuekey != 'undefined') || is_numeric($valuekey)))
            $value = $valuekey;
        if (isset($valuetokey) && ( (is_string($valuetokey) && $valuetokey !== '' && $valuetokey != 'undefined') || is_numeric($valuetokey)))
            $valueto = $valuetokey;

        // replace the current _user_id if that one is set
        // bugfix 2010-09-28 since id was asisgned and not user name ..  no properly evaluates active user
        if (is_string($value) && $value == 'current_user_id') { //ticket 0000914 bug fix 2018-04-18 maretval: check on string!
            $value = $current_user->user_name;
        }
        //bug fix 2018-06-13: $value might be an array!
        if (is_array($value) && $value[0] == 'current_user_id') {
            $value = $current_user->user_name;
        }


        // 2011-07-15 manage Date & DateTime Fields
        if (
            $operator != 'lastndays' &&
            $operator != 'lastnfdays' &&
            $operator != 'lastnweeks' &&
            $operator != 'notlastnweeks' &&
            $operator != 'lastnfweeks' &&
            $operator != 'nextndays' &&
            $operator != 'nextnweeks' &&
            $operator != 'notnextnweeks' &&
            $operator != 'betwndays' &&
            ($operator != 'lastnddays' && !is_numeric($value)) &&
            ($operator != 'nextnddays' && !is_numeric($value)) &&
            ($operator != 'betwnddays' && !is_numeric($value))
        ) {
            if ($this->fieldNameMap[$fieldid]['type'] == 'date') {
                //2011-07-17 ... get db formatted field from key field
                //else try legacy handliung with date interpretation
                if ($valuekey != '')
                    $value = str_replace('T', ' ', $valuekey);
                else
                    $value = $GLOBALS['timedate']->to_db_date(str_replace('T', ' ' ,$value), false);


                if ($valuetokey != '')
                    $valueto = str_replace('T', ' ' ,$valuetokey);
                else
                    $valueto = $GLOBALS['timedate']->to_db_date(str_replace('T', ' ' ,$valueto), false);
            }
            if ($this->fieldNameMap[$fieldid]['type'] == 'datetime' || $this->fieldNameMap[$fieldid]['type'] == 'datetimecombo') {
                //2011-07-17 .. db formated dtae stroed in key field
                if ($valuekey != '')
                    $value = str_replace('T', ' ', $valuekey);
                else {
                    // legacy handling ... try to interpret date
                    $timeArray = explode(' ', str_replace('T', ' ', $value));
                    $value = $GLOBALS['timedate']->to_db_date($timeArray[0], false) . ' ' . $timeArray[1];
                }

                if ($valueto != '' || $valuetokey != '') {
                    if ($valuetokey != '')
                        $valueto = str_replace('T', ' ' ,$valuetokey);
                    else {
                        // legacy handling ... try to interpret date
                        $timeArray = explode(' ', str_replace('T', ' ', $valueto));
                        $valueto = $GLOBALS['timedate']->to_db_date($timeArray[0], false) . ' ' . $timeArray[1];
                    }
                }
            }
        }


        // 2012-11-24 special handling for kreporttype fields that have a select eval set
        if (($this->joinSegments[$path]['object']->field_name_map[$fieldname]['type'] == 'kreporter') && is_array($this->joinSegments[$path]['object']->field_name_map[$fieldname]['eval'])) {
            //2013-01-22 added {tc}replacement with custom join
            $selString = preg_replace(array('/{t}/', '/{tc}/', '/{p1}/', '/{p2}/'), array($this->joinSegments[$path]['alias'], $this->joinSegments[$path]['customjoin'], $value, $valueto), $this->joinSegments[$path]['object']->field_name_map[$fieldname]['eval']['selection'][$operator]);
            return $selString;
        }

        switch ($operator) {
            case 'autocomplete':
                $thisWhereString .= $this->joinSegments[$path]['alias'] . '.id';
                break;
            default:
                $thisWhereString .= $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql);
                break;
        }
        // process the operator
        switch ($operator) {
            case 'autocomplete':
                $thisWhereString .= ' = \'' . $value . '\'';
                break;
            case 'equals':
            case 'eqgrouped':
                // bug 2011-03-07 .. handle multienums
                // bug 2011-03-10 .. fixed date handling
                // bug 2011-03-21 fixed custom sql function
                // bug 2011-03-25 ... date handling no managed in client

                // 2017/08/14 reset iof we have an array .. might be for multiple values
                if(is_array($value)){
                    $value = reset($value);
                }

                if ($this->fieldNameMap[$fieldid]['customFunction'] == '' && $this->fieldNameMap[$fieldid]['sqlFunction'] == '') {
                    switch ($this->fieldNameMap[$fieldid]['type']) {
                        case 'multienum':
                            $thisWhereString .= ' LIKE \'%^' . $value . '^%\'';
                            $thisWhereString .= ' OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql);
                            $thisWhereString .= ' LIKE \'' . $value . '^%\'';
                            $thisWhereString .= ' OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql);
                            $thisWhereString .= ' LIKE \'%^' . $value . '\'';
                            $thisWhereString .= ' OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql);
                            $thisWhereString .= ' = \'' . $value . '\'';
                            break;
                        //		case 'date':
                        //		case 'datetime':
                        //			$thisWhereString .= ' = \'' . $GLOBALS['timedate']->to_db_date($value, false) . '\'';
                        //			break;
                        default:
                            //BEGIN ticket 0001025 maretval 2019-11-26 implement grouping in where clause
                            if (isset($this->fieldNameMap[$fieldid]['grouping']) && !empty($this->fieldNameMap[$fieldid]['grouping'])) {
                                $groupingValues = $this->where_field_grouping($this->fieldNameMap[$fieldid]['grouping']);
                                if(count($value) > 1 || (count($value) == 1 && !in_array('other', $value))) {
                                    $thisWhereString .= ' IN (\'' . implode("','", $groupingValues) . '\')';
                                }
                                $groupingValuesOther = $this->where_field_grouping_other($this->fieldNameMap[$fieldid]['grouping'], $value);
                                if(!empty($groupingValuesOther)){
                                    $thisWhereString .= ' NOT IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $groupingValuesOther) : $value)) . '\')';
                                }
                            }
                            else
                                //END
                                $thisWhereString .= ' = \'' . $value . '\'';
                            break;
                    }
                } else{
                    //BEGIN ticket 0001025 maretval 2019-11-26 implement grouping in where clause
                    if (isset($this->fieldNameMap[$fieldid]['grouping']) && !empty($this->fieldNameMap[$fieldid]['grouping'])) {
                        $groupingValues = $this->where_field_grouping($this->fieldNameMap[$fieldid]['grouping']);
                        if(count($value) > 1 || (count($value) == 1 && !in_array('other', $value))) {
                            $thisWhereString .= ' IN (\'' . implode("','", $groupingValues) . '\')';
                        }
                        $groupingValuesOther = $this->where_field_grouping_other($this->fieldNameMap[$fieldid]['grouping'], $value);
                        if(!empty($groupingValuesOther)){
                            $thisWhereString .= ' NOT IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $groupingValuesOther) : $value)) . '\')';
                        }

                    }
                    else
                        //END
                        $thisWhereString .= ' = \'' . $value . '\'';
                }
                break;
            case 'soundslike':
                $thisWhereString .= ' SOUNDS LIKE \'' . $value . '\'';
                break;
            case 'notequal':
                // 2017/08/14 reset iof we have an array .. might be for multiple values
                if(is_array($value)){
                    $value = reset($value);
                }
                //BEGIN ticket 0001025 maretval 2019-11-26 implement grouping in where clause
                if (isset($this->fieldNameMap[$fieldid]['grouping']) && !empty($this->fieldNameMap[$fieldid]['grouping'])) {
                    $groupingValues = $this->where_field_grouping($this->fieldNameMap[$fieldid]['grouping'], $value);
                    if(count($value) > 1 || (count($value) == 1 && !in_array('other', $value))) {
                        $thisWhereString .= ' NOT IN (\'' . implode("','", $groupingValues) . '\')';
                    }
                    $groupingValuesOther = $this->where_field_grouping_other($this->fieldNameMap[$fieldid]['grouping'], $value);
                    if(!empty($groupingValuesOther)){
                        $thisWhereString .= ' IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $groupingValuesOther) : $value)) . '\')';
                    }
                }
                else
                    //END
                    $thisWhereString .= ' <> \'' . $value . '\'';
                break;
            case 'greater':
                $thisWhereString .= ' > \'' . $value . '\'';
                break;
            case 'after':
                // bug 2011-03-10 .. fixed date handling
                // bug 2011-03-25 date no handled in client
                // $thisWhereString .= ' > \'' . $GLOBALS['timedate']->to_db_date($value, false) . '\'';
                $thisWhereString .= ' > \'' . $value . '\'';
                break;
            case 'less':
                $thisWhereString .= ' < \'' . $value . '\'';
                break;
            case 'before':
                // bug 2011-03-10 .. fixed date handling
                // bug 2011-03-25 date no handled in client
                // $thisWhereString .= ' < \'' . $GLOBALS['timedate']->to_db_date($value, false) . '\'';
                $thisWhereString .= ' < \'' . $value . '\'';
                break;
            case 'greaterequal':
                $thisWhereString .= ' >= \'' . $value . '\'';
                break;
            case 'lessequal':
                $thisWhereString .= ' <= \'' . $value . '\'';
                break;
            case 'starts':
                $thisWhereString .= ' LIKE \'' . $value . '%\'';
                break;
            case 'notstarts':
                $thisWhereString .= ' NOT LIKE \'' . $value . '%\'';
                break;
            case 'contains':
                $thisWhereString .= ' LIKE \'%' . $value . '%\'';
                break;
            case 'notcontains':
                $thisWhereString .= ' NOT LIKE \'%' . $value . '%\'';
                break;
            case 'between':
                // bug 2011-03-10 .. fixed date handling
                // bug 2011-03-25 date handling now on client side
                if ($this->fieldNameMap[$fieldid]['type'] == 'date' || $this->fieldNameMap[$fieldid]['type'] == 'datetime' || $this->fieldNameMap[$fieldid]['type'] == 'datetimecombo')
                    // $thisWhereString .= ' >= \'' . $GLOBALS['timedate']->to_db_date($value, false) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . '<=\'' . $GLOBALS['timedate']->to_db_date($valueto, false) . '\'';
                    $thisWhereString .= ' >= \'' . $value . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . '<=\'' . $valueto . '\'';
                elseif ($this->fieldNameMap[$fieldid]['type'] == 'varchar' || $this->fieldNameMap[$fieldid]['type'] == 'name') {
                    //2012-11-24 change so we increae the last char by one ord numkber and change to a smaller than
                    // this is more in the logic of the user
                    $valueto = substr($valueto, 0, strlen($valueto) - 1) . chr(ord($valueto[strlen($valueto) - 1]) + 1);
                    $thisWhereString .= ' >= \'' . $value . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . '<\'' . $valueto . '\'';
                } else
                    $thisWhereString .= ' >= \'' . $value . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . '<=\'' . $valueto . '\'';
                break;
            case 'isempty':
                $thisWhereString .= ' = \'\'';
                break;
            case 'isemptyornull':
                $thisWhereString .= ' = \'\' OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' IS NULL';
                break;
            case 'isnull':
                $thisWhereString .= ' IS NULL';
                break;
            case 'isnotempty':
                $thisWhereString .= ' <> \'\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' is not null';
                break;
            case 'oneof':
                if ($this->fieldNameMap[$fieldid]['type'] == 'multienum') {
                    //BEGIN ticket 0001025 maretval 2019-03-27 implement grouping in where clause
                    if (isset($this->fieldNameMap[$fieldid]['grouping']) && !empty($this->fieldNameMap[$fieldid]['grouping'])) {
                        $valueArray = $this->where_field_grouping($this->fieldNameMap[$fieldid]['grouping'], $value);
                    }
                    else
                        //END
                        $valueArray = (is_array($value) ? $value : preg_split('/,/', $value));


                    $multienumWhereString = '';
                    foreach ($valueArray as $thisMultiEnumValue) {
                        if ($multienumWhereString != '')
                            $multienumWhereString .= ' OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql);

                        $multienumWhereString .= ' LIKE \'%' . $thisMultiEnumValue . '%\'';
                    }
                    $thisWhereString .= $multienumWhereString;
                } else {
                    //BEGIN ticket 0001025 maretval 2019-03-27 implement grouping in where clause
                    if (isset($this->fieldNameMap[$fieldid]['grouping']) && !empty($this->fieldNameMap[$fieldid]['grouping'])) {
                        $groupingValues = $this->where_field_grouping($this->fieldNameMap[$fieldid]['grouping'], $value);
                        if(count($value) > 1 || (count($value) == 1 && !in_array('other', $value))) {
                            $thisWhereString .= ' IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $groupingValues) : $value)) . '\')';
                        }
                        $groupingValuesOther = $this->where_field_grouping_other($this->fieldNameMap[$fieldid]['grouping'], $value);
                        if(!empty($groupingValuesOther)){
                            $thisWhereString .= ' NOT IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $groupingValuesOther) : $value)) . '\')';
                        }
                    }
                    else
                        //END
                        $thisWhereString .= ' IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $value) : $value)) . '\')';
                }
                break;
            case 'oneofnot':
                if ($this->fieldNameMap[$fieldid]['type'] == 'multienum') {
                    //BEGIN ticket 0001025 maretval 2019-03-27 implement grouping in where clause
                    if (isset($this->fieldNameMap[$fieldid]['grouping']) && !empty($this->fieldNameMap[$fieldid]['grouping'])) {
                        $valueArray = $this->where_field_grouping($this->fieldNameMap[$fieldid]['grouping']);
                    }
                    else
                        //END
                        $valueArray = (is_array($value) ? $value : preg_split('/,/', $value));

                    $multienumWhereString = '';
                    foreach ($valueArray as $thisMultiEnumValue) {
                        if ($multienumWhereString != '')
                            $multienumWhereString .= ' OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql);

                        $multienumWhereString .= ' NOT LIKE \'%' . $thisMultiEnumValue . '%\'';
                    }
                    $thisWhereString .= $multienumWhereString;
                } else {
                    //BEGIN ticket 0001025 maretval 2019-03-27 implement grouping in where clause
                    if (isset($this->fieldNameMap[$fieldid]['grouping']) && !empty($this->fieldNameMap[$fieldid]['grouping'])) {
                        $groupingValues = $this->where_field_grouping($this->fieldNameMap[$fieldid]['grouping'], $value);
                        if(count($value) > 1 || (count($value) == 1 && !in_array('other', $value))) {
                            $thisWhereString .= ' NOT IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $groupingValues) : $value)) . '\')';
                        }
                        $groupingValuesOther = $this->where_field_grouping_other($this->fieldNameMap[$fieldid]['grouping'], $value);
                        if(!empty($groupingValuesOther)){
                            $thisWhereString .= ' IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $groupingValuesOther) : $value)) . '\')';
                        }
                    }
                    else
                        //END
                        $thisWhereString .= ' NOT IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $value) : $value)) . '\')';
                }
                break;
            case 'oneofnotornull':
                if ($this->fieldNameMap[$fieldid]['type'] == 'multienum') {
                    //BEGIN ticket 0001025 maretval 2019-03-27 implement grouping in where clause
                    if (isset($this->fieldNameMap[$fieldid]['grouping']) && !empty($this->fieldNameMap[$fieldid]['grouping'])) {
                        $valueArray = $this->where_field_grouping($this->fieldNameMap[$fieldid]['grouping']);
                    }
                    else
                        //END
                        $valueArray = (is_array($value) ? $value : preg_split('/,/', $value));

                    $multienumWhereString = '';
                    foreach ($valueArray as $thisMultiEnumValue) {
                        if ($multienumWhereString != '')
                            $multienumWhereString .= ' OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql);

                        $multienumWhereString .= ' NOT LIKE \'%' . $thisMultiEnumValue . '%\'';
                    }
                    $thisWhereString .= $multienumWhereString . 'OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' IS NULL';
                } else {
                    //BEGIN ticket 0001025 maretval 2019-03-27 implement grouping in where clause
                    if (isset($this->fieldNameMap[$fieldid]['grouping']) && !empty($this->fieldNameMap[$fieldid]['grouping'])) {
                        $groupingValues = $this->where_field_grouping($this->fieldNameMap[$fieldid]['grouping']);
                        if(count($value) > 1 || (count($value) == 1 && !in_array('other', $value))) {
                            $thisWhereString .= ' NOT IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $groupingValues) : $value)) . '\')';
                        }
                        $groupingValuesOther = $this->where_field_grouping_other($this->fieldNameMap[$fieldid]['grouping'], $value);
                        if(!empty($groupingValuesOther)){
                            $thisWhereString .= ' IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $groupingValuesOther) : $value)) . '\')';
                        }
                    }
                    else
                        //END
                        $thisWhereString .= ' NOT IN (\'' . str_replace(',', '\',\'', (is_array($value) ? implode(',', $value) : $value)) . '\') OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' IS NULL';
                }
                break;
            case 'today':
                $todayDate = date('Y-m-d', time());
                $thisWhereString .= ' >= \'' . $todayDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' <= \'' . $todayDate . ' 23:59:59\'';
                break;
            case 'past':
                $thisWhereString .= ' <= \'' . date('Y-m-d H:i:s', time()) . '\'';
                break;
            case 'future':
                $thisWhereString .= ' >= \'' . date('Y-m-d H:i:s', time()) . '\'';
                break;
            case 'lastndays':
                $date = time();
                $thisWhereString .= ' >= \'' . date('Y-m-d H:i:s', time() - $value * 86400) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . date('Y-m-d H:i:s', time()) . '\'';
                break;
            case 'lastnfdays':
                $date = gmmktime(0, 0, 0, date('m', time()), date('d', time()), date('Y', time()));
                $thisWhereString .= ' >= \'' . gmdate('Y-m-d H:i:s', $date - $value * 86400) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . gmdate('Y-m-d H:i:s', $date) . '\'';
                break;
            case 'lastnddays':
                // if numeric we still have the number of days .. else we have a date
                if (is_numeric($value)) {
                    $date = time();
                    $thisWhereString .= ' >= \'' . date('Y-m-d H:i:s', time() - $value * 86400) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . date('Y-m-d H:i:s', time()) . '\'';
                } else
                    // 2011-03-25 date handling no on client side
                    //$thisWhereString .= ' >= \'' . $GLOBALS['timedate']->to_db_date($value, false) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . date('Y-m-d H:i:s', time()) . '\'';
                    $thisWhereString .= ' >= \'' . $value . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . date('Y-m-d H:i:s', time()) . '\'';
                break;
            case 'lastnweeks':
                $date = time();
                $thisWhereString .= ' >= \'' . date('Y-m-d H:i:s', time() - $value * 604800) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . date('Y-m-d H:i:s', time()) . '\'';
                break;
            case 'notlastnweeks':
                $date = time();
                $thisWhereString .= ' <= \'' . date('Y-m-d H:i:s', time() - $value * 604800) . '\' OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' > \'' . date('Y-m-d H:i:s', time()) . '\'';
                break;
            case 'lastnfweeks':
                $dayofWeek = date('N');
                $todayMidnight = gmmktime('23', '59', '59', date('n'), date('d'), date('Y'));
                $endStamp = gmmktime('23', '59', '59', date('n'), date('d'), date('Y')) - (date('N') * 3600 * 24);
                $thisWhereString .= ' >= \'' . gmdate('Y-m-d H:i:s', $endStamp - $value * 604800 + 1) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . gmdate('Y-m-d H:i:s', $endStamp) . '\'';
                break;
            case 'lastnmonthDaily':
                $currentDate = new DateTime(gmdate('Y-m-d'));
                $toDate = $currentDate->format('Y-m-d');
                $currentDate->sub(new DateInterval('P'.$value.'M'));
                $fromDate = $currentDate->format('Y-m-d');
                $thisWhereString .= ' >= \''.$fromDate.'\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \''.$toDate.'\'';
                break;

            case 'lastnfmonth':
                $endMonth = date('n');
                $endYear = date('Y');
                $endMonth = $endMonth - 1;
                if ($endMonth == 0) {
                    $endMonth = 12;
                    $endYear--;
                }

                $endStamp = gmmktime('23', '59', '59', $endMonth, date('t', mktime(0, 0, 0, $endMonth, 1, $endYear)), $endYear);

                // get the startdate
                $startMonth = $endMonth;
                $startYear = $endYear;
                $value = $value - 1;
                if ($value >= 12) {
                    $startMonth = $startMonth - ($value % 12);
                    if ($startMonth <= 0) {
                        $startMonth += 12;
                        $startYear--;
                    }
                    $startYear = $startYear - (($value - ($value % 12)) / 12);
                } else {
                    $startMonth = $startMonth - $value;
                    if ($startMonth <= 0) {
                        $startMonth += 12;
                        $startYear--;
                    }
                }
                $startStamp = gmmktime('0', '0', '0', $startMonth, '1', $startYear);

                $thisWhereString .= ' >= \'' . gmdate('Y-m-d H:i:s', $startStamp) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . gmdate('Y-m-d H:i:s', $endStamp) . '\'';
                break;
            case 'thisweek':
                $dayofWeek = date('N');
                $todayMidnight = gmmktime('23', '59', '59', date('n'), date('d'), date('Y'));
                $startStamp = gmmktime('00', '00', '00', date('n'), date('d'), date('Y')) - ((date('N') - 1) * 3600 * 24);
                $thisWhereString .= ' >= \'' . gmdate('Y-m-d H:i:s', $startStamp) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . gmdate('Y-m-d H:i:s', $startStamp + 604800 - 1) . '\'';
                break;
            case 'nextndays':
                $date = time();
                $thisWhereString .= ' <= \'' . date('Y-m-d H:i:s', time() + $value * 86400) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' > \'' . date('Y-m-d H:i:s', time()) . '\'';
                break;
            case 'nextnddays':
                // if numeric we still have the number of days .. else we have a date
                if (is_numeric($value)) {
                    $date = time();
                    $thisWhereString .= ' <= \'' . date('Y-m-d H:i:s', time() + $value * 86400) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' > \'' . date('Y-m-d H:i:s', time()) . '\'';
                } else {
                    //$conCatAdd = ' <= \'' . $GLOBALS['timedate']->to_db_date($value) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' > \'' . date('Y-m-d H:i:s') . '\'';
                    // 2011-03-25 date handling now on client side
                    // $thisWhereString .= ' <= \'' . $GLOBALS['timedate']->to_db_date($value, false) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' > \'' . date('Y-m-d H:i:s', time()) . '\'';
                    $thisWhereString .= ' <= \'' . $value . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' > \'' . date('Y-m-d H:i:s', time()) . '\'';
                }
                break;
            //2011-05-20 added between n days option
            case 'betwndays':
                $date = gmmktime(0, 0, 0, date('m', time()), date('d', time()), date('Y', time()));
                $thisWhereString .= ' >= \'' . gmdate('Y-m-d H:i:s', $date + $value * 86400) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . gmdate('Y-m-d H:i:s', $date + $valueto * 86400) . '\'';
                break;
                break;
            case 'betwnddays':
                if (is_numeric($value)) {
                    $date = gmmktime(0, 0, 0, date('m', time()), date('d', time()), date('Y', time()));
                    $thisWhereString .= ' >= \'' . gmdate('Y-m-d H:i:s', $date + $value * 86400) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . gmdate('Y-m-d H:i:s', $date + $valueto * 86400) . '\'';
                } else {
                    $thisWhereString .= ' >= \'' . $value . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $valueto . '\'';
                }
                break;
            case 'nextnweeks':
                $date = time();
                $thisWhereString .= ' <= \'' . date('Y-m-d H:i:s', time() + $value * 604800) . '\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' > \'' . date('Y-m-d H:i:s', time()) . '\'';
                break;
            case 'notnextnweeks':
                $date = time();
                $thisWhereString .= ' >= \'' . date('Y-m-d H:i:s', time() + $value * 604800) . '\' OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . date('Y-m-d H:i:s', time()) . '\'';
                break;
            case 'firstdayofmonth':
                $dateArray = getdate();
                $fromDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' <= \'' . $fromDate . ' 23:59:59\'';
                break;
            case 'firstdaynextmonth':
                $dateArray = getdate();
                $fromDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] == '12' ? 1 : $dateArray['mon'] + 1, 1, $dateArray['mon'] == '12' ? $dateArray['year'] + 1 : $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' <= \'' . $fromDate . ' 23:59:59\'';
                break;
            case 'nthdayofmonth':
                $dateArray = getdate();
                $fromDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], $value, $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' <= \'' . $fromDate . ' 23:59:59\'';
                break;
            case 'thismonth':
                $dateArray = getdate();
                $fromDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $toDate = (($dateArray['mon'] + 1) > 12) ? date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] - 11, 1, $dateArray['year'] + 1)) : date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] + 1, 1, $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                break;
            case 'notthismonth':
                $dateArray = getdate();
                $fromDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $toDate = (($dateArray['mon'] + 1) > 12) ? date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] - 11, 1, $dateArray['year'] + 1)) : date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] + 1, 1, $dateArray['year']));
                $thisWhereString .= ' <= \'' . $fromDate . ' 00:00:00\' OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' > \'' . $toDate . ' 00:00:00\'';
                break;
            case 'nextnmonth':
                //MySQL way
                //$thisWhereString .= ' >= \'DATE_ADD(LAST_DAY(CURDATE()), INTERVAL 1 DAY)\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'DATE_ADD(LAST_DAY(DATE_ADD(CURDATE(), INTERVAL '.$value.' MONTH)), INTERVAL 1 DAY)\'';
                //do it per dates to be comaptible with other databases
                $calcDate = new DateTime(gmdate('Y-m-d'));
                $calcDate->add(new DateInterval('P1M')); //Add 1 month
                $fromDate = $calcDate->format('Y-m-01');   //Get the first day of the next month as string
                $calcDate->add(new DateInterval('P'.$value.'M'));
                $toDate = $calcDate->format('Y-m-01');
                $thisWhereString .= ' >= \''.$fromDate.'\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \''.$toDate.'\'';
                break;
            case 'nextnmonthDaily':
                //MySQL way
                //$thisWhereString .= ' >= \'CURDATE()\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'DATE_ADD(CURDATE(), INTERVAL '.$value.' MONTH)\'';
                //do it per dates to be comaptible with other databases
                $calcDate = new DateTime(gmdate('Y-m-d'));
                $fromDate = $calcDate->format('Y-m-d');
                $calcDate->add(new DateInterval('P'.$value.'M'));
                $toDate = $calcDate->format('Y-m-d');
                $thisWhereString .= ' >= \''.$fromDate.'\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \''.$toDate.'\'';
                break;
            case 'next3month':
                $dateArray = getdate();
                $fromDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $toDate = (($dateArray['mon'] + 3) > 12) ? date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] - 8, 1, $dateArray['year'] + 1)) : date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] + 3, 1, $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                break;
            // added mor where Opertors Bug #486
            case 'next3monthDaily':
                $dateArray = getdate();
                $fromDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $toDate = (($dateArray['mon'] + 3) > 12) ? date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] - 9, $dateArray['mday'], $dateArray['year'] + 1)) : date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] + 3, $dateArray['mday'], $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                break;
            case 'next6month':
                $dateArray = getdate();
                $fromDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $toDate = (($dateArray['mon'] + 6) > 12) ? date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] - 5, 1, $dateArray['year'] + 1)) : date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] + 6, 1, $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                break;
            case 'next6monthDaily':
                $dateArray = getdate();
                $fromDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $toDate = (($dateArray['mon'] + 6) > 12) ? date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] - 6, $dateArray['mday'], $dateArray['year'] + 1)) : date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] + 6, $dateArray['mday'], $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                break;
            case 'last3monthDaily':
                $dateArray = getdate();
                $fromDate = (($dateArray['mon'] - 3) < 1) ? date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] + 9, $dateArray['mday'], $dateArray['year'] - 1)) : date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] - 3, $dateArray['mday'], $dateArray['year']));
                $toDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                break;
            case 'last6month':
                $dateArray = getdate();
                $fromDate = (($dateArray['mon'] - 6) < 1) ? date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] + 6, 1, $dateArray['year'] - 1)) : date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] - 6, 1, $dateArray['year']));
                $toDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                break;
            case 'last6monthDaily':
                $dateArray = getdate();
                $fromDate = (($dateArray['mon'] - 6) < 1) ? date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] + 6, $dateArray['mday'], $dateArray['year'] - 1)) : date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] - 6, $dateArray['mday'], $dateArray['year']));
                $toDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                break;
            case 'lastnfquarter':
                $calcDate = new DateTime(gmdate('Y-m-d'));
                $subToGetLastQuarterEnd = array(
                    1 => 1,
                    2 => 2,
                    3 => 3,
                    4 => 1,
                    5 => 2,
                    6 => 3,
                    7 => 1,
                    8 => 2,
                    9 => 3,
                    10 => 1,
                    11 => 2,
                    12 => 3,
                );

                $calcDate->sub(new DateInterval('P'.($subToGetLastQuarterEnd[date('n')]-1).'M')); //calculate next quarter start
                $toDate = $calcDate->format('Y-m-01');   //Get the first day of the next month as string
                $calcDate->sub(new DateInterval('P'.($value*3).'M'));
                $fromDate = $calcDate->format('Y-m-01');
                $thisWhereString .= ' >= \''.$fromDate.'\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \''.$toDate.'\'';
                break;
            case 'nextnfquarter':
                $calcDate = new DateTime(gmdate('Y-m-d'));
                $addToGetNextQuarterStart = array(
                    1 => 3,
                    2 => 2,
                    3 => 1,
                    4 => 3,
                    5 => 2,
                    6 => 1,
                    7 => 3,
                    8 => 2,
                    9 => 1,
                    10 => 3,
                    11 => 2,
                    12 => 1,
                );

                $calcDate->add(new DateInterval('P'.$addToGetNextQuarterStart[date('n')].'M')); //calculate next quarter start
                $fromDate = $calcDate->format('Y-m-01');   //Get the first day of the next month as string
                $calcDate->add(new DateInterval('P'.($value*3).'M'));
                $toDate = $calcDate->format('Y-m-01');
                $thisWhereString .= ' >= \''.$fromDate.'\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \''.$toDate.'\'';
                break;

            case 'thisyear':
                $dateArray = getdate();
                $fromDate = date('Y-m-d', mktime(0, 0, 0, 1, 1, $dateArray['year']));
                $toDate = date('Y-m-d', mktime(0, 0, 0, 1, 1, $dateArray['year'] + 1));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                break;
            case 'lastmonth':
                $dateArray = getdate();
                //bug 2011-08-09 removed h:i:s from format
                $fromDate = (($dateArray['mon'] - 1) < 1) ? date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] + 11, 1, $dateArray['year'] - 1)) : date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] - 1, 1, $dateArray['year']));
                $toDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                break;
            case 'last3month':
                $dateArray = getdate();
                // bug 2011-08-09 removed h:i:s from format
                // BEGIN SPICEUI-331 fix calculation
//                $fromDate = (($dateArray['mon'] - 3) < 1) ? date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] + 8, 1, $dateArray['year'] - 1)) : date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'] - 3, 1, $dateArray['year']));
//                $toDate = date('Y-m-d', mktime(0, 0, 0, $dateArray['mon'], 1, $dateArray['year']));
                $dayStartThisMonth = new \DateTime(gmdate('Y-m-01'));
                $toDate = $dayStartThisMonth->format('Y-m-d');
                $dayStart3MonthsBefore = $dayStartThisMonth->sub(new \DateInterval("P3M"));
                $fromDate = $dayStart3MonthsBefore->format('Y-m-d');
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                // END
                break;
            case 'lastyear':
                $dateArray = getdate();
                $fromDate = date('Y-m-d', mktime(0, 0, 0, 1, 1, $dateArray['year'] - 1));
                $toDate = date('Y-m-d', mktime(0, 0, 0, 1, 1, $dateArray['year']));
                $thisWhereString .= ' >= \'' . $fromDate . ' 00:00:00\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \'' . $toDate . ' 00:00:00\'';
                break;
            case 'lastnyear':
                $firstOfYearDate = new DateTime(gmdate('Y-01-01'));
                $toDate = $firstOfYearDate->format('Y-m-d');
                $firstOfYearDate->sub(new DateInterval('P'.$value.'Y'));
                $fromDate = $firstOfYearDate->format('Y-m-01');
                $thisWhereString .= ' >= \''.$fromDate.'\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \''.$toDate.'\'';
                break;
            case 'lastnyearDaily':
                $currentDate = new DateTime(gmdate('Y-m-d'));
                $toDate = $currentDate->format('Y-m-d');
                $currentDate->sub(new DateInterval('P'.$value.'Y'));
                $fromDate = $currentDate->format('Y-m-d');
                $thisWhereString .= ' >= \''.$fromDate.'\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \''.$toDate.'\'';
                break;
            case 'nextnyear':
                $calcDate = new DateTime(gmdate('Y-m-d'));
                $calcDate->add(new DateInterval('P1Y')); //Add 1 Year
                $fromDate = $calcDate->format('Y-01-01');   //Get the first day of the next year as string
                $calcDate->add(new DateInterval('P'.$value.'Y'));
                $toDate = $calcDate->format('Y-01-01');
                $thisWhereString .= ' >= \''.$fromDate.'\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \''.$toDate.'\'';
                break;
            case 'nextnyearDaily':
                $calcDate = new DateTime(date('Y-m-d'));
                $fromDate = $calcDate->format('Y-m-d');   //Get the first day of the next year as string
                $calcDate->add(new DateInterval('P'.$value.'Y'));
                $toDate = $calcDate->format('Y-m-d');
                $thisWhereString .= ' >= \''.$fromDate.'\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' < \''.$toDate.'\'';
                break;
            case 'tyytd':
                $year = date('Y');
                $thisWhereString .= ' >= \'' . $year . '-1-1\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . '<=\'' . date('Y-m-d') . '\'';
                break;
            case 'lyytd':
                $year = date('Y') - 1;
                $thisWhereString .= ' >= \'' . $year . '-1-1\' AND ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . '<=\'' . $year . '-' . date('m-d') . '\'';
                break;
        }

        //check on custom operators and their handler
        if(file_exists('custom/modules/KReports/KReportQueryCustom.php')){
            require_once 'custom/modules/KReports/KReportQueryCustom.php';
            if(function_exists('getKReportQueryCustomOperatorWhereString')){
                    getKReportQueryCustomOperatorWhereString($operator, $thisWhereString, $this, $path, $fieldname, $fieldid);
            }
        }

        //2011-07-20 handle jointype
        if ($jointype == 'optional' && $operator != 'isnull') {
            $thisWhereString = '( ' . $thisWhereString . ' ) OR ' . $this->get_field_name($path, $fieldname, $fieldid, false, '',  $customSql) . ' IS NULL';
        }

        return $thisWhereString;
    }

    /*
     * function to biuild the Group By Clause
     */

    function check_groupby($additionalGroupBy = array())
    {
        //2013-07-22 always an array .. cuased issues on MSSQL and Oracle
        if (is_array($additionalGroupBy) && count($additionalGroupBy) > 0) {
            $this->isGrouped = true;
        } else {
            foreach ($this->listArray as $thisList) {
                if ($thisList['groupby'] != 'no') {
                    $this->isGrouped = true;
                }
            }
        }
        if ($this->isGrouped)
            foreach ($this->listArray as $listArrayIndex => $thisList) {
                if ($thisList['groupby'] == 'no' && !\SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['KReports']['olderMySqlVersion'] && /*(\SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'mssql' || \SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'oci8') &&*/ $this->evalSQLFunctions && ($thisList['sqlfunction'] == '' || $thisList['sqlfunction'] == '-'))
                    $this->listArray[$listArrayIndex]['sqlfunction'] = 'MIN';
            }
    }

    function build_groupby_string($additionalGroupBy = array())
    {
        global $app_list_strings;
$db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();

        /*
         * Block to build the Group By Clause
         */
        // build Group By
        reset($this->listArray);

        // empty String
        $this->groupbyString = '';
        if (is_array($additionalGroupBy)) {
            foreach ($additionalGroupBy as $thisFieldData)
                $groupedFields[] = $thisFieldData['fieldid'];
        } else
            $additionalGroupBy = [];

        if (is_array($this->listArray)) {

            foreach ($this->listArray as $thisList) {
                // 2011-03-25 add check on exclusive grouping - called from the tree
                if ((!$this->exclusiveGroupinbgByAddParams && $thisList['groupby'] != 'no') || in_array($thisList['fieldid'], $additionalGroupBy)) {

                    // if we are first add GROUP By to the Group By String else a comma
                    if ($this->groupbyString == '')
                        $this->groupbyString .= 'GROUP BY ';
                    else
                        $this->groupbyString .= ', ';

                    // $this->addPath($thisList['path'], $this->switchJoinType($thisList['jointype']));
                    $fieldName = substr($thisList['path'], strrpos($thisList['path'], "::") + 2, strlen($thisList['path']));
                    $pathName = substr($thisList['path'], 0, strrpos($thisList['path'], "::"));

                    $fieldArray = explode(':', $fieldName);

                    // if we have a fixed value or we simply group by the fields
                    if ((isset($thisList['fixedvalue']) && $thisList['fixedvalue'] != '') || $this->groupByFieldID)
                        $this->groupbyString .= $thisList['fieldid'];
                    else {
                        // process custom SQL functions here
                        //if(isset($thisList['customsqlfunction']) && $thisList['customsqlfunction'] != '')
                        //	$this->groupbyString .= str_replace('$', $this->get_field_name($pathName, $fieldArray[1], $fieldArray[0]), $thisList['customsqlfunction']);
                        //else
                        $this->groupbyString .= $this->get_field_name($pathName, $fieldArray[1], $thisList['fieldid']);
                    }

                    // $this->groupbyString .= $this->get_field_name($pathName, $fieldArray[1], $fieldArray[0]);
                    //$groupbyString .=  (isset($thisList['name'])) ? "'" . trim($thisList['name'], ':') . "'" : $this->joinSegments[$pathName]['alias'] . '.' . $fieldArray[1];
                }
            }
        }

        //2011-05-02 select max id when we have a grouping
        //if($this->groupbyString != '')
        //	$this->selectString =  str_replace($this->rootGuid . '.id', 'MAX(' . $this->rootGuid . '.id)', $this->selectString);
    }

    function build_orderby_string()
    {
        global $app_list_strings;
$db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();

        /*
         * Block to Build the Order by Clause
         */
        $sortArray = [];

        // build Order By
        reset($this->listArray);

        // empty String
        $this->orderbyString = '';

        if (is_array($this->listArray)) {

            if (count($this->sortOverride) > 0) {
                if ($this->orderByFieldID)
                    $sortArray['1'][] = $this->sortOverride['sortid'] . ' ' . strtoupper($this->sortOverride['sortseq']);
                else {
                    //2013-11-12 bugfix to include SWL function when sorting. Bug #510
                    if ($this->fieldNameMap[$this->sortOverride['sortid']]['sqlFunction'] == '-' || $this->fieldNameMap[$this->sortOverride['sortid']]['sqlFunction'] == '' || !$this->evalSQLFunctions)
                        $sortArray['1'][] = $this->get_field_name($this->get_fieldpath_by_fieldid($this->sortOverride['sortid']), $this->get_fieldname_by_fieldid($this->sortOverride['sortid']), $this->sortOverride['sortid']) . ' ' . strtoupper($this->sortOverride['sortseq']);
                    elseif ($this->fieldNameMap[$this->sortOverride['sortid']]['sqlFunction'] == 'COUNT_DISTINCT')
                        $sortArray['100'][] = 'COUNT(DISTINCT ' . $this->get_field_name($this->get_fieldpath_by_fieldid($this->sortOverride['sortid']), $this->get_fieldname_by_fieldid($this->sortOverride['sortid']), $this->sortOverride['sortid']) . ')' . ' ' . strtoupper($this->sortOverride['sortseq']);
                    else
                        $sortArray[$this->fieldNameMap[$this->sortOverride['sortid']]['sortpriority']][] = $this->fieldNameMap[$this->sortOverride['sortid']]['sqlFunction'] . '(' . $this->get_field_name($this->get_fieldpath_by_fieldid($this->sortOverride['sortid']), $this->get_fieldname_by_fieldid($this->sortOverride['sortid']), $this->sortOverride['sortid']) . ')' . ' ' . strtoupper($this->sortOverride['sortseq']);
                }
            } else {
                foreach ($this->listArray as $thisList) {
                    if ($thisList['sort'] == 'asc' || $thisList['sort'] == 'desc') {

                        $fieldName = substr($thisList['path'], strrpos($thisList['path'], "::") + 2, strlen($thisList['path']));
                        $pathName = substr($thisList['path'], 0, strrpos($thisList['path'], "::"));

                        $fieldArray = explode(':', $fieldName);

                        if ($thisList['sortpriority'] != '') {
                            // check if we should build a sort string based on ID (mainly for the Union Joins)
                            if ($this->orderByFieldID) {
                                $sortArray[$thisList['sortpriority']][] = $thisList['fieldid'] . ' ' . strtoupper($thisList['sort']);
                            } else {
                                if ($thisList['sqlfunction'] == '-' || !$this->evalSQLFunctions) {
                                    // 2013-01-20 change in call paramteres
                                    //$sortArray[$thisList['sortpriority']][] = $this->get_field_name($pathName, $fieldArray[1], $fieldArray[0]) . ' ' . strtoupper($thisList['sort']);
                                    $sortArray[$thisList['sortpriority']][] = $this->get_field_name($pathName, $fieldArray[1], $thisList['fieldid']) . ' ' . strtoupper($thisList['sort']);
                                } elseif ($thisList['sqlfunction'] == 'COUNT_DISTINCT') {
                                    $sortArray['100'][] = 'COUNT(DISTINCT ' . $this->get_field_name($pathName, $fieldArray[1], $thisList['fieldid']) . ')' . ' ' . strtoupper($thisList['sort']);
                                } else {
                                    // 2013-01-20 change in call paramteres
                                    //$sortArray[$thisList['sortpriority']][] = $thisList['sqlfunction'] . '(' . $this->get_field_name($pathName, $fieldArray[1], $fieldArray[0]) . ')' . ' ' . strtoupper($thisList['sort']);
                                    $sortArray[$thisList['sortpriority']][] = $thisList['sqlfunction'] . '(' . $this->get_field_name($pathName, $fieldArray[1], $fieldArray[0]) . ')' . ' ' . strtoupper($thisList['sort']);
                                }
                            }
                        } else {
                            if ($this->orderByFieldID) {
                                $sortArray['100'][] = $thisList['fieldid'] . ' ' . strtoupper($thisList['sort']);
                            } else {
                                if ($thisList['sqlfunction'] == '-' || !$this->evalSQLFunctions) {
                                    // 2013-01-20 change in call paramteres
                                    //$sortArray['100'][] = $this->get_field_name($pathName, $fieldArray[1], $fieldArray[0]) . ' ' . strtoupper($thisList['sort']);
                                    $sortArray['100'][] = $this->get_field_name($pathName, $fieldArray[1], $thisList['fieldid']) . ' ' . strtoupper($thisList['sort']);
                                } elseif ($thisList['sqlfunction'] == 'COUNT_DISTINCT') {
                                    $sortArray['100'][] = 'COUNT(DISTINCT ' . $this->get_field_name($pathName, $fieldArray[1], $thisList['fieldid']) . ')' . ' ' . strtoupper($thisList['sort']);
                                } else {
                                    // 2013-01-20 change in call paramteres
                                    // $sortArray['100'][] = $thisList['sqlfunction'] . '(' . $this->get_field_name($pathName, $fieldArray[1], $fieldArray[0]) . ')' . ' ' . strtoupper($thisList['sort']);
                                    $sortArray['100'][] = $thisList['sqlfunction'] . '(' . $this->get_field_name($pathName, $fieldArray[1], $thisList['fieldid']) . ')' . ' ' . strtoupper($thisList['sort']);
                                }
                            }
                        }
                    }
                }
            }

            //2013-02-05 add deault sort to support MSSQL
            if (is_array($sortArray) && count($sortArray) > 0) {
                // set flag since we are first Entry
                $isFirst = true;

                // sort the array by the sort priority
                ksort($sortArray);

                foreach ($sortArray as $sortStrings) {
                    foreach ($sortStrings as $sortString) {
                        if ($isFirst) {
                            $this->orderbyString .= 'ORDER BY ' . $sortString;
                            $isFirst = false;
                        } else {
                            $this->orderbyString .= ', ' . $sortString;
                        }
                    }
                }
            } else {
                if ($this->isGrouped && (\SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'mssql' || \SpiceCRM\includes\database\DBManagerFactory::getInstance()->dbType == 'oci8') ) {
                    if ($this->orderByFieldID)
                        $this->orderbyString .= 'ORDER BY MIN(sugarRecordId) ASC';
                    else
                        $this->orderbyString .= 'ORDER BY MIN(' . $this->rootGuid . '.id) ASC';
                } else {
                    if ($this->orderByFieldID)
                        $this->orderbyString .= 'ORDER BY sugarRecordId ASC';
                    else
                        $this->orderbyString .= 'ORDER BY ' . $this->rootGuid . '.id ASC';
                }
            }
            //else
            //    $this->orderbyString .= 'ORDER BY sugarRecordId';
        }
    }

    /*
     * Function that gets the table for a module
     */

    function get_table_for_module($module)
    {
        $thisModule = \SpiceCRM\data\BeanFactory::getBean($module);
        return $thisModule->table_name;
    }


    /**
     * ticket 0001025
     * Helper to  parse values corresponding to content bucket contents
     * @param $grouping
     * @param array $selectedMappings
     * @return array
     */
    private function where_field_grouping($grouping, $selectedMappings = array())
    {
        $db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();

        $groupingValues = [];
        $groupingDetail = $db->fetchByAssoc($db->query("SELECT * FROM kreportgroupings WHERE id = '$grouping'"));
        $groupingMapping = json_decode(html_entity_decode($groupingDetail['mapping']), true);
        foreach ($groupingMapping['mappings'] as $mappingDetail) {
            if(!empty($selectedMappings) && !in_array($mappingDetail['mappingvalue'], $selectedMappings)){
                continue; //skip value
            }
            foreach ($mappingDetail['children'] as $mappedValue)
                $groupingValues[] =  $mappedValue;
        }
        return $groupingValues;
    }

    /**
     * ticket 0001025
     * Helper to  parse values corresponding to content bucket contents
     * @param $grouping
     * @param array $selectedMappings
     * @return array
     */
    private function where_field_grouping_other($grouping, $selectedMappings = array())
    {
        $db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();

        $groupingValues = [];
        $groupingDetail = $db->fetchByAssoc($db->query("SELECT * FROM kreportgroupings WHERE id = '$grouping'"));
        $groupingMapping = json_decode(html_entity_decode($groupingDetail['mapping']), true);

        // check if "other" is selected. If so send back all mapped values and parse as NOT IN
        if(!empty($selectedMappings) && in_array('other', $selectedMappings)){
            foreach ($groupingMapping['mappings'] as $mappingDetail) {
                foreach ($mappingDetail['children'] as $mappedValue)
                    $groupingValues[] =  $mappedValue;
            }
        }
        return $groupingValues;
    }

    /*
     * Helper function to get the Field name
     */

    function get_field_name($path, $field, $fieldid, $link = false, $sqlFunction = '', $customSql = '')
    {
        // if we do not have a path we have a fixed value field so do not return a name
        if ($path != '') {
            // normal processing
            $thisAlias = (isset($this->joinSegments[$path]['object']->field_name_map[$field]['source']) && $this->joinSegments[$path]['object']->field_name_map[$field]['source'] == 'custom_fields') ? $this->joinSegments[$path]['customjoin'] : $this->joinSegments[$path]['alias'];


            // 2010-25-10 replace the -> object name with get_class function to handle also the funny aCase obejcts
            //$thisModule = array_search(get_class($this->joinSegments[$path]['object']));
            $thisModule = $this->joinSegments[$path]['object']->_module;

            // bugfix 2011-03-21 moved up to allow proper value handling in tree
            // get the field details
            $thisFieldIdEntry = $this->get_listfieldentry_by_fieldid($fieldid);

            // set the FieldName Map entries
            if (!isset($this->fieldNameMap[$fieldid]))
                $this->fieldNameMap[$fieldid] = array(
                    'fieldname' => $field,
                    'path' => $path,
                    // 2013-08-21 BUG #491 adding path alias ... required for custom fields
                    'pathalias' => $this->joinSegments[$path]['alias'],
                    'islink' => $link,
                    'sqlFunction' => $sqlFunction,
                    'customFunction' => (is_array($thisFieldIdEntry) && array_key_exists('customsqlfunction', $thisFieldIdEntry) ? $thisFieldIdEntry['customsqlfunction'] : ''),
                    'tablealias' => $thisAlias,
                    'fields_name_map_entry' => $this->joinSegments[$path]['object']->field_name_map[$field],
                    'type' => $this->joinSegments[$path]['object']->field_name_map[$field]['kreporttype'] ?: $this->joinSegments[$path]['object']->field_name_map[$field]['type'],
                    'module' => $thisModule);

            if (!empty($customSql)) {
                $customSql = base64_decode($customSql);
                return '(' . preg_replace(array('/\$/', '/{t}/'), $thisAlias, $customSql) . ')';
            }

            // check for custom function
            if ($this->joinSegments[$path]['object']->field_name_map[$field]['type'] == 'kreporter') {
                //2012-12-24 checkif eval is an array ... then we have to do more
                $thisEval = '';
                if (is_array($this->joinSegments[$path]['object']->field_name_map[$field]['eval']))
                    $thisEval = $this->joinSegments[$path]['object']->field_name_map[$field]['eval']['presentation']['eval'];
                else
                    $thisEval = $this->joinSegments[$path]['object']->field_name_map[$field]['eval'];

                // 2010-12-06 add § for custom Fields to be evaluated
                // 2012-11-24 changed to pregreplace and also included {t}
                if (array_key_exists('customjoin', $this->joinSegments[$path]))
                    //2013-01-22 also replace {tc}with the custom table join
                    //return '(' . str_replace('§', $this->joinSegments[$path]['customjoin'], preg_replace(array('/\$/', '/{t}/'), $thisAlias, $thisEval)) . ')';
                    // 2013-02-20 change to set proper alias if field is a cstm field
                    //return '(' . preg_replace(array('/§/', '/{tc}/'), $this->joinSegments[$path]['customjoin'], preg_replace(array('/\$/', '/{t}/'), $thisAlias, $thisEval)) . ')';
                    return '(' . preg_replace(array('/\$/', '/{t}/', '/§/', '/{tc}/'), array($this->joinSegments[$path]['alias'], $this->joinSegments[$path]['alias'], $this->joinSegments[$path]['customjoin'], $this->joinSegments[$path]['customjoin']), $thisEval) . ')';
                else
                    return '(' . preg_replace(array('/\$/', '/{t}/'), $thisAlias, $thisEval) . ')';
            } elseif (isset($thisFieldIdEntry['customsqlfunction']) && $thisFieldIdEntry['customsqlfunction'] != '') {
                {
                    //2012-11-28 srip unicode characters with the pregreplace [^(\x20-\x7F)]* from the string ..
                    //2013-01-22 changed to rawurldecode
                    //$functionRaw = preg_replace('/[^(\x20-\x7F)]*/', '', urldecode(base64_decode($thisFieldIdEntry['customsqlfunction'], true)));
                    $functionRaw = preg_replace('/[^(\x20-\x7F)]*/', '', rawurldecode(base64_decode($thisFieldIdEntry['customsqlfunction'], true)));

                    // if the value is not base 64
                    if (!$functionRaw)
                        $functionRaw = $thisFieldIdEntry['customsqlfunction'];

                    //2012-10-03 add support to use the field and table explicit using {f} & {t}
                    //2013-01-22 also replace {tc}with custom table
                    //$functionRaw = trim(preg_replace(array('/{t}/', '/{f}/', '/\$/'), array($thisAlias, $field, $thisAlias), $functionRaw));
                    //2013-02-20 change to set proper alias if field is a cstm field
                    //$functionRaw = trim(preg_replace(array('/{t}/', '/{tc}/', '/{f}/', '/\$/'), array($thisAlias, $this->joinSegments[$path]['customjoin'], $field, $thisAlias), $functionRaw));
                    $functionRaw = trim(preg_replace(array('/{t}/', '/{tc}/', '/{f}/', '/\$/'), array($this->joinSegments[$path]['alias'], $this->joinSegments[$path]['customjoin'], $field, $this->joinSegments[$path]['alias']), $functionRaw));
                    return '(' . $functionRaw . ')';
                }
            } else {
                return $this->wrap_field_grouping($thisAlias, $field, $thisFieldIdEntry['grouping']);
            }
        } else
            return $fieldid;
    }

    private function wrap_field_grouping($alias, $field, $grouping = '')
    {
        $db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();

        $fieldVal = $alias . '.' . $field;

        if (empty($grouping))
            return $fieldVal;

        $groupingString = '';
        $groupingDetail = $db->fetchByAssoc($db->query("SELECT * FROM kreportgroupings WHERE id = '$grouping'"));
        $groupingMapping = json_decode(html_entity_decode($groupingDetail['mapping']), true);
        foreach ($groupingMapping['mappings'] as $mappingDetail) {
            foreach ($mappingDetail['children'] as $mappedValue)
                $groupingString .= "WHEN '$mappedValue' THEN '" . $mappingDetail['mappingvalue'] . "' ";
        }

        if ($groupingString != '') {
            $groupingString .= 'ELSE ' . ($groupingMapping['others'] ? "'other'" : $fieldVal);
            return 'CASE ' . $fieldVal . ' ' . $groupingString . ' END';
        }

        return $fieldVal;
    }

    function get_fieldname_by_fieldid($fieldid)
    {
        return isset($this->fieldNameMap[$fieldid]) ? $this->fieldNameMap[$fieldid]['fieldname'] : '';
    }

    function get_fieldpath_by_fieldid($fieldid)
    {
        return isset($this->fieldNameMap[$fieldid]) ? $this->fieldNameMap[$fieldid]['path'] : '';
    }

    function get_listfieldentry_by_fieldid($fieldid)
    {
        foreach ($this->listArray as $thisIndex => $listFieldEntry) {
            if ($listFieldEntry['fieldid'] == $fieldid)
                return $listFieldEntry;
        }
        // 2013-05-16 ... bug #480 since we might query for fields that are not in the report
        // those fields are created dynamically in the pivot for the grid ...
        // there the formatter set in the Pivot Paraeters is then used
        // if we do not find the field return false
        foreach ($this->whereArray as $thisIndex => $listFieldEntry) {
            if ($listFieldEntry['fieldid'] == $fieldid)
                return $listFieldEntry;
        }

        return false;
    }

}

