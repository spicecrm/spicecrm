<?php

require_once('include/SpiceFTSManager/SpiceFTSUtils.php');
require_once('include/SpiceFTSManager/SpiceFTSFilters.php');
require_once('include/SpiceFTSManager/SpiceFTSAggregates.php');
require_once('include/SpiceFTSManager/SpiceFTSBeanHandler.php');
require_once('include/SpiceFTSManager/ElasticHandler.php');
require_once('include/MVC/View/views/view.list.php');

class SpiceFTSHandler
{
    function __construct()
    {
        $this->elasticHandler = new ElasticHandler();
    }

    /*
    * static function to check if a module has a FTE definition
    */
    static function checkModule($module)
    {
        global $db;

        if ($db->fetchByAssoc($db->query("SELECT * FROM sysfts WHERE module = '$module'")))
            return true;
        else
            return false;
    }

    function resetIndexModule($module)
    {
        global $db;

        $seed = BeanFactory::getBean($module);

        $db->query('UPDATE ' . $seed->table_name . ' SET date_indexed = NULL');

    }

    function indexModule($module)
    {
        global $db;

        $seed = BeanFactory::getBean($module);

        $db->query('UPDATE ' . $seed->table_name . ' SET date_indexed = NULL');

        // $ids = $db->limitQuery('SELECT id FROM ' . $seed->table_name . ' WHERE deleted = 0', 0, 5);
        $ids = $db->query('SELECT id FROM ' . $seed->table_name . ' WHERE deleted = 0');
        while ($id = $db->fetchByAssoc($ids)) {
            $seed->retrieve($id['id']);
            $this->indexBean($seed);
        }

    }

    function getGlobalSearchModules()
    {
        global $db, $current_language;

        // so we have the variable -> will then be filled once the metadata is included
        $listViewDefs = array();

        // load the app language
        $appLang = return_application_language($current_language);

        $modArray = array();
        $modLangArray = array();
        $viewDefs = array();

        $modules = $db->query("SELECT * FROM sysfts");
        while ($module = $db->fetchByAssoc($modules)) {
            $settings = json_decode(html_entity_decode($module['settings']), true);

            if (!$settings['globalsearch']) continue;

            // add the module
            $modArray[] = $module['module'];

            // add the language label
            $modLangArray[$module['module']] = $appLang['moduleList'][$module['module']] ?: $module['module'];

            // get the fielddefs
            $metadataFile = null;
            $foundViewDefs = false;
            if (file_exists('custom/modules/' . $module['module'] . '/metadata/listviewdefs.php')) {
                $metadataFile = 'custom/modules/' . $module['module'] . '/metadata/listviewdefs.php';
                $foundViewDefs = true;
            } else {
                if (file_exists('custom/modules/' . $module['module'] . '/metadata/metafiles.php')) {
                    require_once('custom/modules/' . $module['module'] . '/metadata/metafiles.php');
                    if (!empty($metafiles[$module['module']]['listviewdefs'])) {
                        $metadataFile = $metafiles[$module['module']]['listviewdefs'];
                        $foundViewDefs = true;
                    }
                } elseif (file_exists('modules/' . $module['module'] . '/metadata/metafiles.php')) {
                    require_once('modules/' . $module['module'] . '/metadata/metafiles.php');
                    if (!empty($metafiles[$module['module']]['listviewdefs'])) {
                        $metadataFile = $metafiles[$module['module']]['listviewdefs'];
                        $foundViewDefs = true;
                    }
                }
            }
            if (!$foundViewDefs && file_exists('modules/' . $module['module'] . '/metadata/listviewdefs.php')) {
                $metadataFile = 'modules/' . $module['module'] . '/metadata/listviewdefs.php';

            }

            require_once($metadataFile);

            $modLang = return_module_language($current_language, $module['module'], true);


            $totalWidth = 0;
            foreach ($listViewDefs[$module['module']] as $fieldName => $fieldData) {
                if ($fieldData['default']) {
                    $viewDefs[$module['module']][] = array(
                        'name' => $fieldName,
                        'width' => str_replace('%', '', $fieldData['width']),
                        'label' => $modLang[$fieldData['label']] ?: $appLang[$fieldData['label']] ?: $fieldData['label'],
                        'link' => ($fieldData['link'] && empty($fieldData['customCode']) ) ? true : false,
                        'linkid' => $fieldData['id'],
                        'linkmodule' => $fieldData['module']
                    );
                    $totalWidth += str_replace('%', '', $fieldData['width']);
                }
            }

            if($totalWidth != 100){
                foreach($viewDefs[$module['module']] as $fieldIndex => $fieldData)
                    $viewDefs[$module['module']][$fieldIndex]['width'] = $viewDefs[$module['module']][$fieldIndex]['width'] * 100 / $totalWidth;
            }
        }

        return array('modules' => $modArray, 'moduleLabels' => $modLangArray, 'viewdefs' => $viewDefs);

    }

    /*
    * function to get all modules and all indexed fields
    */
    function getGlobalModulesFields()
    {
        global $db;

        $modArray = array();
        $searchFields = array();

        $modules = $db->query("SELECT * FROM sysfts");
        while ($module = $db->fetchByAssoc($modules)) {
            $settings = json_decode(html_entity_decode($module['settings']), true);
            if (!$settings['globalsearch']) continue;

            $fields = json_decode(html_entity_decode($module['ftsfields']), true);
            foreach ($fields as $field) {
                if ($field['indexfieldname'] && $field['index'] == 'analyzed' && $field['search']) {
                    $modArray[$module['module']][] = $field['indexfieldname'];

                    if (array_search($field['indexfieldname'], $searchFields) === false)
                        $searchFields[] = $field['indexfieldname'];
                }
            }
        }

        return array('modules' => $modArray, 'searchfields' => $searchFields);
    }

    /*
     * Function to index one Bean
     */
    function indexBean($bean)
    {
        global $beanList, $timedate, $disable_date_format;

        $beanHandler = new SpiceFTSBeanHandler($bean);

        $beanModule = array_search(get_class($bean), $beanList);
        $indexProperties = SpiceFTSUtils::getBeanIndexProperties($beanModule);
        if ($indexProperties) {
            $indexArray = $beanHandler->normalizeBean();
            $this->elasticHandler->document_index($beanModule, $indexArray);

            // update the date
            $bean->db->query("UPDATE " . $bean->table_name . " SET date_indexed = '" . $timedate->nowDb() . "' WHERE id = '" . $bean->id . "'");


        }

        // check all related beans
        $relatedRecords = $this->elasticHandler->filter('related_ids', $bean->id);
        foreach ($relatedRecords['hits']['hits'] as $relatedRecord) {
            $relatedBean = BeanFactory::getBean($relatedRecord['_type'], $relatedRecord['_id']);
            $relBeanHandler = new SpiceFTSBeanHandler($relatedBean);
            $this->elasticHandler->document_index($relatedRecord['_type'], $relBeanHandler->normalizeBean());
        }

        return true;
    }


    /*
     * function to search in a module
     */
    function searchTerm($searchterm = '', $aggregatesFilters = array(), $size = 25, $from = 0)
    {
        $searchfields = $this->getGlobalModulesFields();


        // build the query
        $queryParam = array(
            'size' => $size,
            'from' => $from
        );
        if (!empty($searchterm)) {
            $queryParam['query'] = array(
                "bool" => array(
                    "must" => array(
                        "multi_match" => array(
                            "query" => "$searchterm",
                            'fields' => $searchfields['searchfields']
                        )
                    )
                )
            );
        }

        // build the searchmodules list
        $modules = array();
        foreach ($searchfields['modules'] as $module => $modulefields) {
            $modules[] = $module;
        }

        // make the search
        $searchresults = $this->elasticHandler->searchModules($modules, $queryParam, $size, $from);

        return $searchresults;

    }

    /*
     * function to search in a module
     */
    function searchModule($module, $searchterm = '', $aggregatesFilters = array(), $size = 25, $from = 0)
    {
        global $current_user;

        // get the app list srtings for the enum processing
        $appListStrings = return_app_list_strings_language($GLOBALS['current_language']);

        $indexProperties = SpiceFTSUtils::getBeanIndexProperties($module);
        $indexSettings = SpiceFTSUtils::getBeanIndexSettings($module);

        $searchFields = array();

        // $aggregateFields = array();
        foreach ($indexProperties as $indexProperty) {
            if ($indexProperty['index'] == 'analyzed' && $indexProperty['search']) {
                $searchFields[] = $indexProperty['indexfieldname'];
            }
        }

        $aggregates = new SpiceFTSAggregates($indexProperties, $aggregatesFilters);

        if (count($searchFields) == 0)
            return array();

        // build the query
        $queryParam = array(
            'size' => $size,
            'from' => $from
        );
        if (!empty($searchterm)) {
            $queryParam['query'] = array(
                "bool" => array(
                    "must" => array(
                        "multi_match" => array(
                            "query" => "$searchterm",
                            // 'operator' => 'or',
                            'fields' => $searchFields,
                        )
                    )
                )
            );

            if ($indexSettings['minimum_should_match'])
                $queryParam['query']['bool']['must']['multi_match']['minimum_should_match'] = $indexSettings['minimum_should_match'] . '%';

            if ($indexSettings['operator'])
                $queryParam['query']['bool']['must']['multi_match']['operator'] = $indexSettings['operator'];
        }

        // check if we have an org management has array
        // add the org management info
        if (!$current_user->is_admin && !empty($GLOBALS['KAuthAccessController']) && $GLOBALS['KAuthAccessController']->orgManaged($GLOBALS['beanList'][$module])) {
            $orgFilters = array();

            $orgHashArrays = $GLOBALS['KAuthAccessController']->getFTSObjectHashArray($GLOBALS['beanList'][$module]);
            if (count($orgHashArrays) > 0) {
                foreach ($orgHashArrays as $orgHashArray) {
                    $thisFilter = array();

                    if ($orgHashArray['owner']) {
                        $thisFilter[] = array(
                            'term' => array(
                                'assigned_user_id' => $current_user->id
                            )
                        );
                    }

                    if (is_array($orgHashArray['hashArray']) && count($orgHashArray['hashArray']) > 0) {

                        $thisFilter[] = array(
                            'terms' => array(
                                'korgobjecthash' => $orgHashArray['hashArray']
                            )
                        );
                    }

                    //only one filter
                    if (count($thisFilter) == 1) {
                        $orgFilters[] = $thisFilter[0];
                    }

                    // multiple filters combine them with an and
                    if (count($thisFilter) > 1) {
                        $orgFilters[] = array(
                            'and' => $thisFilter
                        );
                    }
                }
            }

            $userHashArray = $GLOBALS['KAuthAccessController']->getUserHashArray();
            if (count($userHashArray) > 0) {
                $orgFilters[] = array(
                    'terms' => array(
                        'korguserhash' => $userHashArray
                    )
                );
            }

            if (count($orgFilters) > 0) {
                $queryParam['query']['bool']['filter']['or'] = $orgFilters;
            } else {
                // seems the user has no privileges
                return false;
            }
        } else {

        }

        //add aggregates filters
        $postFiler = $aggregates->buildQueryFilterFromAggregates();
        if ($postFiler !== false)
            $queryParam['post_filter'] = $postFiler;

        $aggs = $aggregates->buildAggregates();
        if ($aggs !== false)
            $queryParam{'aggs'} = $aggs;

        // make the search
        $GLOBALS['log']->fatal(json_encode($queryParam));
        $searchresults = $this->elasticHandler->searchModule($module, $queryParam, $size, $from);

        $aggregates->processAggregations($searchresults['aggregations']);

        foreach ($searchresults['hits']['hits'] as $srIndex => $srData) {
            foreach ($indexProperties as $indexProperty) {
                switch ($indexProperty['metadata']['type']) {
                    case 'enum':
                        $searchresults['hits']['hits'][$srIndex]['_source'][$indexProperty['fieldname']] = $appListStrings[$indexProperty['metadata']['options']][$srData['_source'][$indexProperty['fieldname']]];
                        break;
                    default:
                        break;
                }
            }
        }

        return $searchresults;

    }

    function getRawSearchResultsForListView($module, $searchTerm = '')
    {
        $seed = BeanFactory::getBean($module);

        $searchresults = $this->searchModule($module, $searchTerm, array());

        $rows = array();
        foreach ($searchresults['hits']['hits'] as $searchresult) {
            $rows[] = $seed->convertRow($searchresult['_source']);
        }

        return array(
            'fts_rows' => $rows,
            'fts_total' => $searchresults['hits']['total'],
            'fts_aggregates' => base64_encode($this->getArrgetgatesHTML($searchresults['aggregations']))
        );

    }

    function getArrgetgatesHTML($aggretgates)
    {
        // prepare the aggregates
        $aggSmarty = new Sugar_Smarty();
        $aggSmarty->assign('aggregates', $aggretgates);
        return $aggSmarty->fetch('include/SpiceFTSManager/tpls/aggregates.tpl');
    }

    function getGlobalSearchResults($modules, $searchterm, $params){
        $modArray = explode(',', $modules);
        $searchresults = array();
        foreach($modArray as $module){
            $searchresultsraw = $this->searchModule($module, $searchterm, array(), $params['records'] ?: 5, $params['start'] ?: 0);
            $searchresults[$module] = $searchresultsraw['hits'];
        }
        return $searchresults;
    }

    function getSearchResults($module, $searchTerm, $page = 0, $aggregates)
    {

        $GLOBALS['app_list_strings'] = return_app_list_strings_language($GLOBALS['current_language']);
        $seed = BeanFactory::getBean($module);

        $_REQUEST['module'] = $module;
        $_REQUEST['query'] = true;
        $_REQUEST['searchterm'] = $searchTerm;
        $_REQUEST['search_form_view'] = 'fts_search';
        $_REQUEST['searchFormTab'] = 'fts_search';

        ob_start();
        $vl = new ViewList();
        $vl->bean = $seed;
        $vl->module = $module;
        $GLOBALS['module'] = $module;
        $vl->preDisplay();
        $vl->listViewPrepare();

        // prepare the aggregates
        $aggregatesFilters = array();
        foreach ($aggregates as $aggregate) {
            $aggregateDetails = explode('::', $aggregate);
            $aggregatesFilters[$aggregateDetails[0]][] = $aggregateDetails[1];
        }

        // make the search
        $searchresults = $this->searchModule($module, $searchTerm, $aggregatesFilters, 25, $page * 25);

        $rows = array();
        foreach ($searchresults['hits']['hits'] as $searchresult) {
            // todo: check why we need to decode here
            foreach ($searchresult['_source'] as $fieldName => $fieldValue) {
                $searchresult['_source'][$fieldName] = utf8_decode($fieldValue);
            }

            $rows[] = $seed->convertRow($searchresult['_source']);
        }

        $vl->lv->setup($vl->bean, 'include/ListView/ListViewFTSTable.tpl', '', array('fts' => true, 'fts_rows' => $rows, 'fts_total' => $searchresults['hits']['total'], 'fts_offset' => $page * 25));
        ob_end_clean();

        return array(
            'result' => base64_encode($vl->lv->display()),
            'aggregates' => base64_encode($this->getArrgetgatesHTML($searchresults['aggregations']))
        );
    }

    function indexBeans($counter)
    {
        global $db;

        $beanCounter = 0;
        $beans = $db->query("SELECT * FROM sysfts");
        while ($bean = $db->fetchByAssoc($beans)) {
            echo "indexing " . $bean['module'];
            $seed = BeanFactory::getBean($bean['module']);
            $indexBeans = $db->limitQuery("SELECT id FROM " . $seed->table_name . " WHERE (date_indexed IS NULL OR date_indexed = '' OR date_indexed < date_modified) AND deleted = 0", 0, $counter);

            while ($indexBean = $db->fetchByAssoc($indexBeans)) {
                $seed->retrieve($indexBean['id']);
                $this->indexBean($seed);
                $beanCounter++;
            }

            if ($beanCounter >= $counter)
                return true;
            else
                $counter = $counter - $beanCounter;
        }
    }
}