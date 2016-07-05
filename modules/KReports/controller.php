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




if (!defined('sugarEntry') || !sugarEntry)
    die('Not A Valid Entry Point');

require_once('modules/KReports/KReport.php');
require_once('include/MVC/Controller/SugarController.php');
require_once('modules/Contacts/Contact.php');
require_once('modules/KReports/utils.php');
require_once('include/utils/db_utils.php');
require_once('include/utils.php');

class KReportsController extends SugarController {

    //2013-02-18 make sure we disable display_errors
    public function KReportsController() {
        ini_set('display_errors', '0');
        parent::SugarController();
    }


    function action_edit(){
        $ss = new Sugar_Smarty();
        $ss->display('modules/KReports/tpls/EdiViewFooter.tpl');
        exit;
    }

    function action_BucketmanagerView(){
        $this->view = 'bucketmanager';
    }
    
    function action_DListManagerView(){
        $this->view = 'dlistmanager';
        
    }
        
    function action_check_access_level() {

        global $current_user;
        require_once('modules/KReports/KReport.php');
        $thisReport = new KReport();
        $thisReport->retrieve($_REQUEST['record']);

        require_once('modules/ACL/ACLController.php');

        if (ACLController::checkAccess($thisReport->module_dir, 'edit', $thisReport->assigned_user_id == $current_user->id ? true : false)) {
            if (ACLController::checkAccess($thisReport->module_dir, 'delete', $thisReport->assigned_user_id == $current_user->id ? true : false))
                print 2;
            else
                print 1;
        }
        else {
            print 0;
        }
    }

    function action_get_teamids() {
        global $db;

        $returnArray['count'] = $db->getRowCount($db->query('SELECT id, name FROM teams WHERE deleted = \'0\'  AND name like \'' . $_REQUEST['query'] . '%\''));

        //if(isset($_REQUEST['query']) && $_REQUEST['query'] != '')
        $teamResult = $db->query('SELECT id, name, name_2 FROM teams WHERE deleted = \'0\' AND name like \'' . $_REQUEST['query'] . '%\' LIMIT ' . $_REQUEST['start'] . ',' . $_REQUEST['limit']);
        //else
        //	$usersResult = $db->query('SELECT id, user_name FROM users WHERE deleted = \'0\' AND status = \'Active\'');

        while ($teamRecord = $db->fetchByAssoc($teamResult)) {
            // bugfix 2010-09-28 since id was asisgned and not user name ..  no properly evaluates active user
            $returnArray['data'][] = array('value' => $teamRecord['id'], 'text' => $teamRecord['name'] . ' ' . $teamRecord['name_2']);
        }

        echo json_encode($returnArray);
    }

    function action_get_securitygroups() {
        global $db;

        $returnArray['count'] = $db->getRowCount($db->query('SELECT id, name FROM securitygroups WHERE deleted = \'0\'  AND name like \'' . $_REQUEST['query'] . '%\''));

        //if(isset($_REQUEST['query']) && $_REQUEST['query'] != '')
        $teamResult = $db->query('SELECT id, name FROM securitygroups WHERE deleted = \'0\' AND name like \'' . $_REQUEST['query'] . '%\' LIMIT ' . $_REQUEST['start'] . ',' . $_REQUEST['limit']);
        //else
        //	$usersResult = $db->query('SELECT id, user_name FROM users WHERE deleted = \'0\' AND status = \'Active\'');

        while ($teamRecord = $db->fetchByAssoc($teamResult)) {
            // bugfix 2010-09-28 since id was asisgned and not user name ..  no properly evaluates active user
            $returnArray['data'][] = array('value' => $teamRecord['id'], 'text' => $teamRecord['name']);
        }

        echo json_encode($returnArray);
    }

    function action_get_korgobjects() {
        global $db;
        require_once('modules/KOrgObjects/KOrgObject.php');
        $thisOrgObject = new KOrgObject();
        $returnArray['count'] = $db->getRowCount($db->query($thisOrgObject->getEditViewOrgUnitQuery('KReports', $_REQUEST['query'])));
        $queryObj = $db->query($thisOrgObject->getEditViewOrgUnitQuery('KReports', $_REQUEST['query']) . ' LIMIT ' . $_REQUEST['start'] . ',' . $_REQUEST['limit']);
        while ($korgobjectrecord = $db->fetchByAssoc($queryObj)) {
            $returnArray['data'][] = array('value' => $korgobjectrecord['id'], 'text' => $korgobjectrecord['name']);
        }
        echo json_encode($returnArray);
    }

    function action_get_autocompletevalues() {
        global $beanFiles, $beanList, $db;

        $returnArray = array();
        $fieldArray = array();


        // explode the path
        $pathArray = explode('::', $_REQUEST['path']);

        // get Field and Module from the path
        $fieldArray = explode(':', $pathArray[count($pathArray) - 1]);
        $moduleArray = explode(':', $pathArray[count($pathArray) - 2]);

        // load the parent module
        require_once($beanFiles[$beanList[$moduleArray[1]]]);
        $parentModule = new $beanList[$moduleArray[1]];

        if ($moduleArray[0] == 'link') {
            // load the Relationshop to get the module
            $parentModule->load_relationship($moduleArray[2]);

            // load the Module
            //PHP7 - 5.6 COMPAT
            $moduleArrayEl = $moduleArray[2];
            $thisModuleName = $parentModule->$moduleArrayEl->getRelatedModuleName(); //$moduleArray[2]
            require_once($beanFiles[$beanList[$parentModule->$moduleArrayEl->getRelatedModuleName()]]); //$moduleArray[2]
            $thisModule = new $beanList[$parentModule->$moduleArrayEl->getRelatedModuleName()]; //$moduleArray[2]
        } else
            $thisModule = $parentModule;

        if ($thisModule->table_name != '') {

            // determine the field name we need to go for
            $fieldName = 'name';
            // #bug 520 changed to object rather than array.
            if ($fieldArray[0] == 'field' && isset($thisModule->field_name_map[$fieldArray[1]]) && $fieldArray[1] != 'id')
                $fieldName = $fieldArray[1];

            $query_res = $db->limitQuery("SELECT id, " . $fieldName . " FROM $thisModule->table_name WHERE " . (!empty($_REQUEST['query']) ? "name like '%" . $_REQUEST['query'] . "%' AND" : "") . " deleted='0' ORDER BY name ASC", (!empty($_REQUEST['start']) ? $_REQUEST['start'] : 0), (!empty($_REQUEST['limit']) ? $_REQUEST['limit'] : 25));
            while ($thisEntry = $db->fetchByAssoc($query_res)) {
                $returnArray['data'][] = array('itemid' => $thisEntry['id'], 'itemtext' => $thisEntry[$fieldName]);
            }

            // get count
            $totalRec = $db->fetchByAssoc($db->query("SELECT count(*) as count FROM $thisModule->table_name WHERE " . (!empty($_REQUEST['query']) ? "name like '%" . $_REQUEST['query'] . "%' AND" : "") . " deleted='0'"));
            $returnArray['total'] = $totalRec['count'];
        }

        echo json_encode($returnArray);
    }


    function action_getVisualizationPreview() {
        require_once('modules/KReports/KReportVisualizationManager.php');
        $thisVisualizationmanager = new KReportVisualizationManager();
        echo $thisVisualizationmanager->generateLayoutPreview($_REQUEST['layout']);
    }


    // for the maps integration
    function action_get_report_geocodes() {

        $thisReport = new KReport();
        $thisReport->retrieve($_REQUEST['record']);

        // check if we have set dynamic Options
        if (isset($_REQUEST['whereConditions']))
            $thisReport->whereOverride = json_decode_kinamu(html_entity_decode($_REQUEST['whereConditions']));

        echo $thisReport->getGeoCodes();
    }

    /*
     * Function to generate Target List
     */

    function action_geocode_report_results() {
        $thisReport = new KReport();
        $thisReport->retrieve($_REQUEST['record']);

        // check if we have set dynamic Options
        if (isset($_REQUEST['whereConditions']))
            $thisReport->whereOverride = json_decode_kinamu(html_entity_decode($_REQUEST['whereConditions']));

        $thisReport->massGeoCode();

        return true;
    }

    /*
     * function to deliuver html data for Rpeort and Dashlet
     */

    function action_getReportHtmlResults() {
        require_once('modules/KReports/views/view.htmlpremium.php');
        $thisReport = new KReport();
        $thisReport->retrieve($_REQUEST['record']);

        // see if we have custom Dashlet Filters
        if (isset($_REQUEST['whereClause'])) {
            $whereClause = json_decode(html_entity_decode($_REQUEST['whereClause']), true);

            foreach ($whereClause as $whereClauseData) {
                $dashletWhereClause[$whereClauseData['fieldid']] = $whereClauseData;
            }

            // get and update Report where Clause
            $repWhereClause = json_decode(html_entity_decode($this->bean->whereconditions), true);

            foreach ($repWhereClause as $repWhereClauseIndex => $repWhereClauseData) {
                if (isset($dashletWhereClause[$repWhereClauseData['fieldid']]) && $dashletWhereClause[$repWhereClauseData['fieldid']]['value'] !== 'KRignoreFilter') {
                    switch ($repWhereClause[$repWhereClauseIndex]['usereditable']) {
                        // if we are a checkbox set either on or off ...
                        // still not happy with this but it works
                        case 'yo2':
                        case 'yo1':
                            if ($dashletWhereClause[$repWhereClauseData['fieldid']]['value'] == true)
                                $repWhereClause[$repWhereClauseIndex]['usereditable'] = 'yo1';
                            else
                                $repWhereClause[$repWhereClauseIndex]['usereditable'] = 'yo2';
                            break;
                        // default handling
                        default:
                            switch ($repWhereClause[$repWhereClauseIndex]['type']) {
                                case 'enum':
                                case 'radioenum':
                                case 'date':
                                case 'datetime':
                                    $repWhereClause[$repWhereClauseIndex]['value'] = $dashletWhereClause[$repWhereClauseData['fieldid']]['value'];
                                    $repWhereClause[$repWhereClauseIndex]['valuekey'] = $dashletWhereClause[$repWhereClauseData['fieldid']]['value'];

                                    // if clause has not been set we assume it has to be equal
                                    if ($repWhereClause[$repWhereClauseIndex]['operator'] == 'ignore')
                                        $repWhereClause[$repWhereClauseIndex]['operator'] = 'equals';
                                    break;
                                default:
                                    $repWhereClause[$repWhereClauseIndex]['value'] = $dashletWhereClause[$repWhereClauseData['fieldid']]['value'];
                                    if ($repWhereClause[$repWhereClauseIndex]['operator'] == 'ignore')
                                        $repWhereClause[$repWhereClauseIndex]['operator'] = 'contains';
                                    break;
                            }
                            break;
                    }
                }
                elseif (isset($dashletWhereClause[$repWhereClauseData['fieldid']]) && $dashletWhereClause[$repWhereClauseData['fieldid']]['value'] == 'KRignoreFilter') {
                    $repWhereClause[$repWhereClauseIndex]['operator'] = 'ignore';
                }
            }

            $this->bean->whereconditions = json_encode_kinamu($repWhereClause);
        }

        echo json_encode(
                array(
                    'content' => reportResultsToHTML($_REQUEST['divID'], $this->bean, array('start' => $_REQUEST['start'], 'limit' => $_REQUEST['limit'], 'dashletLinks' => true)),
                    'divId' => $_REQUEST['divID'],
                    'reloadInterval' => 3000,
                    'reportId' => $_REQUEST['record'],
                    'start' => $_REQUEST['start'],
                    'limit' => $_REQUEST['limit']
                )
        );
    }

    /**
     * Save controller function
     * @see SugarController::action_save()
     */
    function action_save() {
        global $mod_strings;

        if (empty($this->bean->name)) {
            $this->bean->name = $mod_strings['LBL_DEFAULT_NAME'];
        }

        $this->bean->save();
    }

    /*
      function action_get_new_sql() {
      require_once('modules/KReports/KReport.php');
      require_once('modules/KReports/KReportQuery.php');

      $thisReport = new KReport();
      $thisReport->retrieve($_REQUEST['record']);

      if (isset($_REQUEST['whereConditions'])) {
      $thisReport->whereOverride = json_decode_kinamu(html_entity_decode($_REQUEST['whereConditions']));
      }

      $sqlArray = $thisReport->get_report_main_sql_query();

      return $sqlArray['select'] . ' ' . $sqlArray['from'] . ' ' . $sqlArray['where'] . ' ' . $sqlArray['groupby'] . ' ' . $sqlArray['having'] . ' ' . $sqlArray['orderby'];
      }
     */

    function action_get_pushpinimages() {
        //open the pushpin directory
        $retArray = array();
        if ($handle = opendir('modules/KReports/images/pushpins')) {

            while (false !== ($file = readdir($handle))) {
                if (substr($file, 0, 1) != '.')
                    $retArray[] = array('filename' => $file);
            }

            closedir($handle);
        }
        echo json_encode($retArray);
    }

}

/*
 * function for array sorting
 */

function arraySortBySequence($a, $b) {
    return ($a['sequence'] < $b['sequence']) ? -1 : 1;
}

// 2013-08-21 BUG #492 function to be called from usort to sort by Text
function arraySortByText($a, $b) {
    if (strtolower($a['text']) > strtolower($b['text']))
        return 1;
    elseif (strtolower($a['text']) == strtolower($b['text']))
        return 0;
    else
        return -1;
}

// 2013-08-21 Bug#493 sorting name for the fields
function arraySortByName($a, $b) {
    if (strtolower($a['name']) > strtolower($b['name']))
        return 1;
    elseif (strtolower($a['name']) == strtolower($b['name']))
        return 0;
    else
        return -1;
}

// 2014-03-26 sorting of modules Bug #517
function arraySortByDescription($a, $b) {
    if (strtolower($a['description']) > strtolower($b['description']))
        return 1;
    elseif (strtolower($a['description']) == strtolower($b['description']))
        return 0;
    else
        return -1;
}
