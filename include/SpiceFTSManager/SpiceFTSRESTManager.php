<?php

require_once('include/SpiceFTSManager/SpiceFTSUtils.php');
require_once('include/SpiceFTSManager/SpiceFTSHandler.php');
require_once('include/SpiceFTSManager/ElasticHandler.php');

class SpiceFTSRESTManager
{

    var $elasticHandler = null;

    function __construct()
    {
        $this->elasticHandler = new ElasticHandler();
        $this->spiceFTSHandler = new SpiceFTSHandler();
    }

    public function checkAdmin()
    {
        global $current_user;

        if(!$current_user->is_admin) {
            http_response_code(401);
            header('HTTP/1.0 401', true, 401);

            header("Access-Control-Allow-Origin: *");
            HttpResponse::send('admin access only');
            exit;
        }
    }

    function initialize()
    {
        global $db;

        $this->checkAdmin();

        $modules = $db->query("SELECT module FROM sysfts");
        while($module = $db->fetchByAssoc($modules)){
            $this->elasticHandler->deleteIndex($module['module']);
            $this->elasticHandler->putMapping($module['module'], SpiceFTSBeanHandler::mapModule($module['module']));
            $this->spiceFTSHandler->resetIndexModule($module['module']);
        }

        return array('status' => 'success');

    }

    function setCronJob()
    {
        $this->checkAdmin();

        $scheduler = BeanFactory::getBean('Schedulers');
        $scheduler->retrieve_by_string_fields(array('job' => 'function::fullTextIndex', 'deleted' => 0));
        if($scheduler && isset($scheduler->id)) {
            $scheduler->status = "Active";
            $scheduler->date_time_end = "";
        }
        else{
            if(!function_exists('create_date')) require_once 'install/install_utils.php';
            $scheduler = BeanFactory::newBean('Schedulers');
            $scheduler->name = "SpiceCRM Full Text Indexing";
            $scheduler->date_time_start = create_date(date('Y'),date('n'),date('d')) . ' ' . create_time(0,0,1);
            $scheduler->job = "function::fullTextIndex";
            $scheduler->job_interval = '*/1::*::*::*::*';
            $scheduler->status = "Active";
            $scheduler->created_by = '1';
            $scheduler->modified_user_id = '1';
            $scheduler->catch_up = '0';
        }
        if(!$scheduler->save())
            die('could not save scheduler');

        return array('status' => 'success');

    }

    function getIndex()
    {
        $this->checkAdmin();

        $checkIndex = json_decode($this->elasticHandler->getIndex(), true);
        if ($checkIndex['error']) {
            $this->elasticHandler->createIndex();
            $checkIndex = json_decode($this->elasticHandler->getIndex(), true);
        }
        return $checkIndex;
    }

    function deleteIndex($module)
    {
        $this->checkAdmin();

        $deleteIndex = json_decode($this->elasticHandler->deleteIndex($module), true);
        return $deleteIndex;
    }

    function getFTSFields($module)
    {
        global $db;

        $this->checkAdmin();

        $seed = BeanFactory::getBean($module);

        // check if we have a mapping
        $mapping = json_decode($this->elasticHandler->getMapping($module));

        $ftsFields = array();
        $record = $db->fetchByAssoc($db->query("SELECT * FROM sysfts WHERE module = '$module'"));
        if ($record && $ftsFields = json_decode(html_entity_decode($record['ftsfields']), true)) {
            foreach ($ftsFields as &$ftsField) {
                $ftsField['indexfieldname'] = SpiceFTSUtils::getFieldIndexName($seed, $ftsField['path']);
            }
        }

        return $ftsFields;
    }

    function getAnalyzers()
    {
        $analyzers = array();

        $this->checkAdmin();

        foreach ($this->elasticHandler->standardSettings['analysis']['analyzer'] as $analyzer => $analyzerData)
            $analyzers[] = array('value' => $analyzer, 'text' => $analyzer);

        return $analyzers;
    }

    function getFTSSettings($module)
    {
        global $db;

        $this->checkAdmin();

        // check if we have a mapping
        $mapping = json_decode($this->elasticHandler->getMapping($module));

        $ftsFields = array();
        $record = $db->fetchByAssoc($db->query("SELECT * FROM sysfts WHERE module = '$module'"));
        if ($record && $ftsFields = json_decode(html_entity_decode($record['settings']), true)) {
            $ftsFields = json_decode(html_entity_decode($record['settings']), true);
        }

        $ftsFields['index_priority'] = $record['index_priority'] ?: 100;

        return $ftsFields;
    }

    function mapModule($module)
    {
        $this->checkAdmin();

        $response = $this->elasticHandler->putMapping($module, SpiceFTSBeanHandler::mapModule($module));
    }

    function setFTSFields($module, $items)
    {
        global $db;

        $this->checkAdmin();

        $record = $db->fetchByAssoc($db->query("SELECT * FROM sysfts WHERE module = '$module'"));

        if ($record) {

            $setFields = [];
            if ($items["fields"] != '') {
                $setFields[] = "ftsfields = '" . json_encode($items["fields"]) . "'";
            }
            if ($items["settings"] != '') {
                $setFields[] = "index_priority='" . $items["settings"]["index_priority"] . "'";
                $setFields[] = "settings = '" . json_encode($items["settings"]) . "'";
            }
            if (count($setFields) > 0) {
                $db->query("UPDATE sysfts SET " . implode(', ', $setFields) . " WHERE module = '$module'");
            }
        } else
            $db->query("INSERT INTO sysfts (module, ftsfields, settings) VALUES('$module', '" . json_encode($items['fields']) . "', '" . json_encode($items['settings']) . "')");

        return true;
    }

    function getFields($nodeid)
    {
        $this->checkAdmin();

        global $_REQUEST, $beanFiles, $beanList;
        $pathArray = explode('::', $nodeid);
        //print_r($pathArray);
        $pathEnd = end($pathArray);
        //print_r($pathEnd);
        $nodeArray = explode(':', end($pathArray));

        $returnArray = array();

        // check if we have the root module or a union module ...
        if ($nodeArray[0] == 'root' || preg_match('/union/', $nodeArray[0]) == 1) {
            return $this->buildFieldArray($nodeArray['1']);
        }
        if ($nodeArray[0] == 'link') {
            $nodeModule = BeanFactory::getBean($nodeArray['1']);
            $nodeModule->load_relationship($nodeArray['2']);

            //PHP7 - 5.6 COMPAT
            //ORIGINAL: $this->buildFieldArray(nodeModule->$nodeArray['2']->getRelatedModuleName());
            $nodeArrayEl = $nodeArray['2'];
            $returnArray = $this->buildFieldArray($nodeModule->$nodeArrayEl->getRelatedModuleName());
            //END
        }

        //2013-01-09 add support for Studio Relate Fields
        if ($nodeArray[0] == 'relate') {
            require_once($beanFiles[$beanList[$nodeArray['1']]]);
            $nodeModule = new $beanList[$nodeArray['1']];

            $returnArray = $this->buildFieldArray($nodeModule->field_defs[$nodeArray[2]]['module']);
        }

        if ($nodeArray[0] == 'relationship') {
            require_once($beanFiles[$beanList[$nodeArray['1']]]);
            $nodeModule = new $beanList[$nodeArray['1']];
            $nodeModule->load_relationship($nodeArray['2']);

            //PHP7 - 5.6 COMPAT
            //ORIGINAL $returnArray = $this->buildLinkFieldArray($nodeModule->$nodeArray['2']);
            $nodeArrayEl = $nodeArray['2'];
            $returnArray = $this->buildLinkFieldArray($nodeModule->$nodeArrayEl);
            //END
        }
        if ($nodeArray[0] == 'audit') {
            $returnArray = $this->buildAuditFieldArray();
        }

        return $returnArray;
    }

    function getNodes($nodeid)
    {

        $this->checkAdmin();

        // main processing
        global $beanFiles, $beanList;

        $pathArray = explode('::', $nodeid);
        //print_r($pathArray);
        $pathEnd = end($pathArray);
        //print_r($pathEnd);
        $nodeArray = explode(':', end($pathArray));

        $returnArray = array();

        if ($nodeArray[0] == 'root' || preg_match('/union/', $nodeArray[0]) > 0) {
            return $this->buildNodeArray($nodeArray['1']);
        }

        if ($nodeArray[0] == 'link') {
            require_once($beanFiles[$beanList[$nodeArray['1']]]);
            $nodeModule = new $beanList[$nodeArray['1']];
            $nodeModule->load_relationship($nodeArray['2']);
            //PHP7 - 5.6 COMPAT
            //ORIGINAL $returnArray = return $this->buildNodeArray($nodeModule->$nodeArray['2']->getRelatedModuleName(), $nodeModule->{$nodeArray['2']});
            $nodeArrayEl = $nodeArray['2'];
            return $this->buildNodeArray($nodeModule->$nodeArrayEl->getRelatedModuleName(), $nodeModule->$nodeArrayEl);
            //END
        }

        //2013-01-09 add support for Studio Relate Fields
        if ($nodeArray[0] == 'relate') {
            require_once($beanFiles[$beanList[$nodeArray['1']]]);
            $nodeModule = new $beanList[$nodeArray['1']];

            return $this->buildNodeArray($nodeModule->field_defs[$nodeArray[2]]['module']);
        }
    }

    /*
     * Helper function to get the Fields for a module
     */

    private function buildNodeArray($module, $thisLink = '')
    {


        global $beanFiles, $beanList;
        require_once('include/utils.php');

        include('modules/KReports/kreportsConfig.php');

        $returnArray = array();

        // 2013-08-21 BUG #492 create a functional eleent holding the leafs for audit and relationships to make sure they stay on top after sorting
        $functionsArray = array();

        if (file_exists($beanFiles[$beanList[$module]])) {
            $nodeModule = BeanFactory::getBean($module);

            $nodeModule->load_relationships();
            // print_r($GLOBALS['dictionary']);//
            // 2011-07-21 add audit table
            if (isset($GLOBALS['dictionary'][$nodeModule->object_name]['audited']) && $GLOBALS['dictionary'] [$nodeModule->object_name]['audited'])
                $functionsArray[] = array(
                    'path' => /* ($requester != '' ? $requester. '#': '') . */
                        'audit:' . $module . ':audit',
                    'module' => 'auditRecords',
                    'leaf' => true);

            //2011-08-15 add relationship fields in many-to.many relationships
            //2012-03-20 change for 6.4
            if (
                $thisLink != '' && get_class($thisLink) == 'Link2'
            ) {
                if ($thisLink != '' && $thisLink->_relationship->relationship_type == 'many-to-many')
                    $functionsArray[] = array(
                        'path' => /*  ($requester != '' ? $requester. '#': '') . */
                            'relationship:' . $thisLink->focus->module_dir /* $module */ . ':' . $thisLink->name,
                        'module' => 'relationship Fields',
                        'leaf' => true
                    );
            } else {
                if ($thisLink != '' && $thisLink->_relationship->relationship_type == 'many-to-many')
                    $functionsArray[] = array(
                        'path' => /*  ($requester != '' ? $requester. '#': '') . */
                            'relationship:' . $thisLink->_bean->module_dir /* $module */ . ':' . $thisLink->name, 'name' => 'relationship Fields',
                        'leaf' => true
                    );
            }

            foreach ($nodeModule->field_name_map as $field_name => $field_defs) {
                // 2011-03-23 also exculde the excluded modules from the config in the Module Tree
                //if ($field_defs['type'] == 'link' && (!isset($field_defs['module']) || (isset($field_defs['module']) && array_search($field_defs['module'], $excludedModules) == false))) {
                if ($field_defs['type'] == 'link' && (!isset($field_defs['module']) || (isset($field_defs['module']) && array_search($field_defs['module'], $excludedModules) == false))) {


                    //BUGFIX 2010/07/13 to display alternative module name if vname is not maintained
                    if (isset($field_defs['vname']))
                        $returnArray[] = array(
                            'path' => /* ($requester != '' ? $requester. '#': '') . */
                                'link:' . $module . ':' . $field_name,
                            'module' => ((translate($field_defs['vname'], $module)) == "" ? ('[' . $field_defs['name'] . ']') : (translate($field_defs
                            ['vname'], $module))),
                            'bean' => $nodeModule->$field_name->focus->object_name,
                            'leaf' => false
                        );
                    elseif (isset($field_defs['module']))
                        $returnArray[] = array(
                            'path' => /*  ($requester != '' ? $requester. '#': '') . */
                                'link:' . $module . ':' . $field_name,
                            'module' => translate($field_defs['module'], $module),
                            'bean' => $nodeModule->$field_name->focus->object_name,
                            'leaf' => false
                        );
                    else {
                        $field_defs_rel = $field_defs['relationship'];
                        $returnArray[] = array(
                            'path' => /* ($requester != '' ? $requester. '#': '') . */
                                'link:' . $module . ':' . $field_name,
                            'module' => get_class($nodeModule->$field_defs_rel->_bean),  //PHP7 - 5.6 COMPAT $nodeModule->$field_defs['relationship']->_bean
                            'bean' => $nodeModule->$field_name->focus->object_name,
                            'leaf' => false
                        );
                    }
                }

                //2013-01-09 add support for Studio Relate Fields
                // get all relate fields where the link is empty ... those with link we get via the link anyway properly
                if ($field_defs['type'] == 'relate' && empty($field_defs['link']) && (!isset($field_defs['reportable']) || (isset($field_defs ['reportable']) && $field_defs['reportable'])) && (!isset($field_defs['module']) || (
                            isset($field_defs['module']) && array_search($field_defs['module'], $excludedModules) == false))
                ) {
                    if (isset($field_defs['vname']))
                        $returnArray [] = array(
                            'path' => 'relate:' . $module . ':' . $field_name,
                            'module' => ((translate($field_defs['vname'], $module)) == "" ? ('[' . $field_defs['name'] . ']') : (translate($field_defs
                            ['vname'], $module))),
                            'bean' => $field_defs['module'],
                            'leaf' => false
                        );
                    elseif (isset($field_defs['module']))
                        $returnArray[] = array(
                            'path' => 'relate:' . $module . ':' . $field_name,
                            'module' => translate($field_defs['module'], $module),
                            'bean' => $field_defs['module'],
                            'leaf' => false
                        );
                    else
                        $returnArray[] = array(
                            'path' => 'relate:' . $module . ':' . $field_name,
                            'module' => $field_defs['name'],
                            'bean' => $field_defs['module'],
                            'leaf' => false
                        );
                }
            }
        }
        // 2013-08-21 BUG #492 added sorting for the module tree
        usort($returnArray, function ($a, $b) {
            if (strtolower($a['module']) > strtolower($b['module']))
                return 1;
            elseif (strtolower($a['module']) == strtolower($b['module']))
                return 0;
            else
                return -1;
        });

        // 2013-08-21 BUG #492 merge with the basic functional elelements
        return array_merge($functionsArray, $returnArray);
    }

    private function buildFieldArray($module)
    {
        $this->checkAdmin();

        global $beanFiles, $beanList;
        require_once('include/utils.php');
        $returnArray = array();
        if ($module != '' && $module != 'undefined' && file_exists($beanFiles[$beanList [$module]])) {
            require_once($beanFiles[$beanList[$module]]);
            $nodeModule = new $beanList[$module];

            foreach ($nodeModule->field_name_map as $field_name => $field_defs) {
                if ($field_defs['type'] != 'link' && (!array_key_exists('source', $field_defs) || (array_key_exists('source', $field_defs)))) {
                    $returnArray[] = array(
                        'id' => 'field:' . $field_defs['name'],
                        'name' => $field_defs['name'],
                        // in case of a kreporter field return the report_data_type so operators ar processed properly
                        // 2011-05-31 changed to kreporttype returned if fieldttype is kreporter
                        // 2011-10-15 if the kreporttype is set return it
                        //'type' => ($field_defs['type'] == 'kreporter') ? $field_defs['kreporttype'] :  $field_defs['type'],
                        'type' => (isset($field_defs['kreporttype'])) ? $field_defs['kreporttype'] : $field_defs['type'],
                        'text' => (translate($field_defs['vname'], $module) != '') ? translate($field_defs['vname'], $module) : $field_defs['name'],
                        'leaf' => true,
                        'options' => $field_defs['options']
                    );
                }
            }
        }

        // 2013-08-21 Bug#493 sorting name for the fields
        usort($returnArray, function ($a, $b) {
            if (strtolower($a['name']) > strtolower($b['name']))
                return 1;
            elseif (strtolower($a['name']) == strtolower($b['name']))
                return 0;
            else
                return -1;
        });

        return $returnArray;
    }

}
