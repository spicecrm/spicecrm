<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
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
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/
namespace SpiceCRM\includes\SpiceFTSManager;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
class SpiceFTSRESTManager
{

    /**
     * instance of an FTS Handler
     * @var SpiceFTSHandler|null
     */


    public function checkAdmin()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if(!$current_user->is_admin)
            throw ( new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
            # header("Access-Control-Allow-Origin: *");
    }

    /**
     * initializes all modules
     *
     * @return string[]
     * @throws ForbiddenException
     */
    function initialize()
    {
        $db = DBManagerFactory::getInstance();

        $this->checkAdmin();

        $modules = $db->query("SELECT module FROM sysfts");
        while($module = $db->fetchByAssoc($modules)){
            // check if we can create a bean for the module
            $seed = BeanFactory::getBean($module['module']);
            if(!$seed) continue;

            SpiceFTSHandler::getInstance()->elasticHandler->deleteIndex($module['module']);
            $beanHandler = new SpiceFTSBeanHandler($module['module']);
            SpiceFTSHandler::getInstance()->elasticHandler->putMapping($module['module'], $beanHandler->mapModule());
            SpiceFTSHandler::getInstance()->resetIndexModule($module['module']);

        }

        return ['status' => 'success'];

    }

    function setCronJob()
    {
        $this->checkAdmin();

        $job = BeanFactory::getBean('SchedulerJobs');
        $job->retrieve_by_string_fields(['job' => 'function::fullTextIndex', 'deleted' => 0]);
        if($job && isset($job->id)) {
            $job->status = "Active";
            $job->date_time_end = "";
        }
        else{
            // CR100349 remove methods from install_utils.php that are required from classes in use
            if(!function_exists('create_date')) require_once 'include/utils.php';
            $job = BeanFactory::newBean('SchedulerJobs');
            $job->name = (!empty($mod_strings['LBL_OOTB_FTS_INDEX']) ? $mod_strings['LBL_OOTB_FTS_INDEX'] : "SpiceCRM Full Text Indexing");
            $job->date_time_start = create_date(date('Y'),date('n'),date('d')) . ' ' . create_time(0,0,1);
            $job->job = "function::fullTextIndex";
            $job->job_interval = '*/1::*::*::*::*';
            $job->status = "Active";
            $job->created_by = '1';
            $job->modified_user_id = '1';
        }
        if(!$job->save())
            die('could not save job');

        return ['status' => 'success'];

    }

    function getIndex()
    {
        $this->checkAdmin();

        $checkIndex = json_decode(SpiceFTSHandler::getInstance()->elasticHandler->getIndex(), true);
        if ($checkIndex['error']) {
            SpiceFTSHandler::getInstance()->elasticHandler->createIndex();
            $checkIndex = json_decode(SpiceFTSHandler::getInstance()->elasticHandler->getIndex(), true);
        }
        return $checkIndex;
    }

    /**
     * returns the modules that have an active fts configutaion
     *
     * @return mixed
     */
    function getModules()
    {
        $db = DBManagerFactory::getInstance();

        $this->checkAdmin();

        $retArray = [];
        $modules = $db->query("SELECT module FROM sysfts");
        while($module = $db->fetchByAssoc($modules)){
            $retArray[] = $module['module'];
        }
        return $retArray;
    }

    /**
     * deletes the index settings from the Database and attpmts to drop the index from Elastic (if it exists)
     *
     * @param $module
     * @return mixed
     */
    function deleteIndexSettings($module)
    {
        $db = DBManagerFactory::getInstance();

        $this->checkAdmin();

        $db->query("DELETE FROM sysfts WHERE module = '$module'");
        $deleteIndex = json_decode(SpiceFTSHandler::getInstance()->elasticHandler->deleteIndex($module), true);
        return $deleteIndex;
    }


    /**
     * deletes the inex from elastic
     *
     * @param $module
     * @return mixed
     */
    function deleteIndex($module)
    {
        $this->checkAdmin();

        $deleteIndex = json_decode(SpiceFTSHandler::getInstance()->elasticHandler->deleteIndex($module), true);
        return $deleteIndex;
    }

    /**
     * @param $module
     * @return array|mixed
     * @throws ForbiddenException
     */
    function getFTSFields($module)
    {
        $db = DBManagerFactory::getInstance();

        $this->checkAdmin();

        $seed = BeanFactory::getBean($module);

        // check if we have a mapping
        // $mapping = json_decode($this->elasticHandler->getMapping($module));

        $ftsFields = [];
        $record = $db->fetchByAssoc($db->query("SELECT * FROM sysfts WHERE module = '$module'"));
        if ($record && $ftsFields = json_decode(html_entity_decode($record['ftsfields']), true)) {
            foreach ($ftsFields as &$ftsField) {
                $ftsField['indexfieldname'] = SpiceFTSUtils::getFieldIndexName($seed, $ftsField['path']);
            }
        }

        return $ftsFields;
    }

    /**
     * returns the analyzers defined in the system
     *
     * @return array
     */
    function getAnalyzers()
    {
        $analyzers = [];

        $this->checkAdmin();

        foreach (SpiceFTSHandler::getInstance()->elasticHandler->standardSettings['analysis']['analyzer'] as $analyzer => $analyzerData)
            $analyzers[] = ['value' => $analyzer, 'text' => $analyzer];

        return $analyzers;
    }

    function getFTSSettings($module)
    {
        $db = DBManagerFactory::getInstance();

        $this->checkAdmin();

        // check if we have a mapping
        // $mapping = json_decode($this->elasticHandler->getMapping($module));

        $ftsFields = [];
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
        $beanHandler = new SpiceFTSBeanHandler($module);
        return json_decode(SpiceFTSHandler::getInstance()->elasticHandler->putMapping($module, $beanHandler->mapModule()));
    }

    function setFTSFields($module, $items)
    {
        $db = DBManagerFactory::getInstance();

        $this->checkAdmin();

        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);


        $record = $db->fetchByAssoc($db->query("SELECT * FROM sysfts WHERE module = '$module'"));

        if ($record) {

            $setFields = [];
            if ($items["fields"] != '') {
                $setFields[] = "ftsfields = '" . addslashes(json_encode($items["fields"])) . "'"; // CR1000343 added addslahes
            }
            if ($items["settings"] != '') {
                $setFields[] = "index_priority=" . intval($items["settings"]["index_priority"]);
                $setFields[] = "settings = '" . json_encode($items["settings"]) . "'";
            }
            if (count($setFields) > 0) {
                $db->query("UPDATE sysfts SET " . implode(', ', $setFields) . " WHERE id = '{$record['id']}'");

                // add to the CR
                if($cr) $cr->addDBEntry("sysfts", $record['id'], 'U', $module);
            }
        } else {
            $newid = create_guid();

            $db->query("INSERT INTO sysfts (id, module, ftsfields, settings) VALUES('$newid', '$module', '" . json_encode($items['fields']) . "', '" . json_encode($items['settings']) . "')");

            // add to the CR
            if($cr) $cr->addDBEntry("sysfts", $newid, 'I', $module);


        }
        return true;
    }

    function getFields($nodeid)
    {
        $this->checkAdmin();

        $pathArray = explode('::', $nodeid);
        $nodeArray = explode(':', end($pathArray));

        $returnArray = [];

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
            $nodeModule = BeanFactory::getBean($nodeArray['1']);

            $returnArray = $this->buildFieldArray($nodeModule->field_defs[$nodeArray[2]]['module']);
        }

        if ($nodeArray[0] == 'relationship') {
            $nodeModule = BeanFactory::getBean($nodeArray['1']);
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

        $pathArray = explode('::', $nodeid);
        //print_r($pathArray);
        $pathEnd = end($pathArray);
        //print_r($pathEnd);
        $nodeArray = explode(':', end($pathArray));

        $returnArray = [];

        if ($nodeArray[0] == 'root' || preg_match('/union/', $nodeArray[0]) > 0) {
            return $this->buildNodeArray($nodeArray['1']);
        }

        if ($nodeArray[0] == 'link') {
            $nodeModule = BeanFactory::getBean($nodeArray['1']);
            $nodeModule->load_relationship($nodeArray['2']);
            //PHP7 - 5.6 COMPAT
            //ORIGINAL $returnArray = return $this->buildNodeArray($nodeModule->$nodeArray['2']->getRelatedModuleName(), $nodeModule->{$nodeArray['2']});
            $nodeArrayEl = $nodeArray['2'];
            return $this->buildNodeArray($nodeModule->$nodeArrayEl->getRelatedModuleName(), $nodeModule->$nodeArrayEl);
            //END
        }

        //2013-01-09 add support for Studio Relate Fields
        if ($nodeArray[0] == 'relate') {
            $nodeModule =  BeanFactory::getBean($nodeArray['1']);
            return $this->buildNodeArray($nodeModule->field_defs[$nodeArray[2]]['module']);
        }
    }

    /*
     * Helper function to get the Fields for a module
     */

    private function buildNodeArray($module, $thisLink = '')
    {

        $returnArray = [];

        // 2013-08-21 BUG #492 create a functional eleent holding the leafs for audit and relationships to make sure they stay on top after sorting
        $functionsArray = [];

        $nodeModule = BeanFactory::getBean($module);
        if ($nodeModule) {
            $nodeModule->load_relationships();
            // print_r($GLOBALS['dictionary']);//
            // 2011-07-21 add audit table
            if (isset($GLOBALS['dictionary'][$nodeModule->object_name]['audited']) && $GLOBALS['dictionary'] [$nodeModule->object_name]['audited'])
                $functionsArray[] = [
                    'path' => /* ($requester != '' ? $requester. '#': '') . */
                        'audit:' . $module . ':audit',
                    'module' => 'auditRecords',
                    'leaf' => true];

            //2011-08-15 add relationship fields in many-to.many relationships
            //2012-03-20 change for 6.4
            if (
                $thisLink != '' && get_class($thisLink) == 'Link2'
            ) {
                if ($thisLink != '' && $thisLink->_relationship->relationship_type == 'many-to-many')
                    $functionsArray[] = [
                        'path' => /*  ($requester != '' ? $requester. '#': '') . */
                            'relationship:' . $thisLink->focus->module_dir /* $module */ . ':' . $thisLink->name,
                        'module' => 'relationship Fields',
                        'leaf' => true
                    ];
            } else {
                if ($thisLink != '' && $thisLink->_relationship->relationship_type == 'many-to-many')
                    $functionsArray[] = [
                        'path' => /*  ($requester != '' ? $requester. '#': '') . */
                            'relationship:' . $thisLink->_bean->module_dir /* $module */ . ':' . $thisLink->name, 'name' => 'relationship Fields',
                        'leaf' => true
                    ];
            }

            foreach ($nodeModule->field_name_map as $field_name => $field_defs) {
                // 2011-03-23 also exculde the excluded modules from the config in the Module Tree
                //if ($field_defs['type'] == 'link' && (!isset($field_defs['module']) || (isset($field_defs['module']) && array_search($field_defs['module'], $excludedModules) == false))) {
                if ($field_defs['type'] == 'link' && !isset($field_defs['module'])) {

                    //BUGFIX 2010/07/13 to display alternative module name if vname is not maintained
                    if (isset($field_defs['vname']))
                        $returnArray[] = [
                            'path' => /* ($requester != '' ? $requester. '#': '') . */
                                'link:' . $module . ':' . $field_name,
                            'module' => ((translate($field_defs['vname'], $module)) == "" ? ('[' . $field_defs['name'] . ']') : (translate($field_defs
                            ['vname'], $module))),
                            'bean' => $nodeModule->$field_name->focus->object_name,
                            'leaf' => false
                        ];
                    elseif (isset($field_defs['module']))
                        $returnArray[] = [
                            'path' => /*  ($requester != '' ? $requester. '#': '') . */
                                'link:' . $module . ':' . $field_name,
                            'module' => translate($field_defs['module'], $module),
                            'bean' => $nodeModule->$field_name->focus->object_name,
                            'leaf' => false
                        ];
                    else {
                        $field_defs_rel = $field_defs['relationship'];
                        $returnArray[] = [
                            'path' => /* ($requester != '' ? $requester. '#': '') . */
                                'link:' . $module . ':' . $field_name,
                            'module' => get_class($nodeModule->$field_defs_rel->_bean),  //PHP7 - 5.6 COMPAT $nodeModule->$field_defs['relationship']->_bean
                            'bean' => $nodeModule->$field_name->focus->object_name,
                            'leaf' => false
                        ];
                    }
                }

                //2013-01-09 add support for Studio Relate Fields
                // get all relate fields where the link is empty ... those with link we get via the link anyway properly
                if ($field_defs['type'] == 'relate' && empty($field_defs['link']) && (!isset($field_defs['reportable']) || (isset($field_defs ['reportable']) && $field_defs['reportable']))) {
                    if (isset($field_defs['vname']))
                        $returnArray [] = [
                            'path' => 'relate:' . $module . ':' . $field_name,
                            'module' => ((translate($field_defs['vname'], $module)) == "" ? ('[' . $field_defs['name'] . ']') : (translate($field_defs
                            ['vname'], $module))),
                            'bean' => $field_defs['module'],
                            'leaf' => false
                        ];
                    elseif (isset($field_defs['module']))
                        $returnArray[] = [
                            'path' => 'relate:' . $module . ':' . $field_name,
                            'module' => translate($field_defs['module'], $module),
                            'bean' => $field_defs['module'],
                            'leaf' => false
                        ];
                    else
                        $returnArray[] = [
                            'path' => 'relate:' . $module . ':' . $field_name,
                            'module' => $field_defs['name'],
                            'bean' => $field_defs['module'],
                            'leaf' => false
                        ];
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

        $returnArray = [];
        if ($module != '' && $module != 'undefined') {
            $nodeModule =  BeanFactory::getBean($module);

            foreach ($nodeModule->field_name_map as $field_name => $field_defs) {
                if ($field_defs['type'] != 'link' && (!array_key_exists('source', $field_defs) || (array_key_exists('source', $field_defs)))) {
                    $returnArray[] = [
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
                    ];
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
