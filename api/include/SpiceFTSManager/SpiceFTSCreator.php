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

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use Sugar_Smarty;

class SpiceFTSCreator {

    public $ftsmodules = [];

    public function __construct() {

    }

    public function displayDefaultConfForm(){
        $sm = new Sugar_Smarty();
        return $sm->display("modules/Administration/templates/FTSDefault.tpl");
    }


    public function createDefaultConf(){
        //get modules which are already in sysfts
        $this->ftsmodules = $this->getFtsModules();

        // delete sysfts table
        if(!DBManagerFactory::getInstance()->query("DELETE FROM sysfts")){
            die("Could not remove records from sysfts table. Action aborted");
        }

        // load modules
        $this->ftsmodules = array_merge($this->ftsmodules, $this->loadFtsModules());

        // create default DB records for sysfts
        foreach($this->ftsmodules as $module){
            $this->createFtsConfig($module);
        }


        //display
        if(!$GLOBALS['installing']) {
            echo('FTS Default Config was restored.');
        }
    }

    public function getFtsModules(){
        $ftsmodules = [];
        $modules = DBManagerFactory::getInstance()->query("SELECT module FROM sysfts");
        while($module = DBManagerFactory::getInstance()->fetchByAssoc($modules)){
            $ftsmodules[] = $module['module'];
        }
        return $ftsmodules;
    }
    public function createFtsFieldsForModule($module){
        $ftsfields = [];
        $labels = return_module_language(SpiceConfig::getInstance()->config['default_language'], $module);
        //get listview defs
        global $listViewDefs;
        $useVardefs = false;
        $path = get_custom_file_if_exists("modules/".$module."/metadata/listviewdefs.php");
        if(file_exists($path)) {
            require_once $path;
        }
        else{
            $useVardefs = true;
        }
        if(isset($listViewDefs))
            $listkeys = array_keys($listViewDefs[$module]);


        $bean = BeanFactory::getBean($module);
        if($bean){
            foreach($bean->field_name_map as $fieldname => $field){
                if( (in_array(strtoupper($field['name']), $listkeys) && !isset($field['usage'])) || $useVardefs){
                    $id = create_guid();
                    $fieldid = create_guid();
                    $ftsfields[] = [
                        'id' => $id,
                        'fieldid' => $fieldid,
                        'fieldname' => $field['name'],
                        'name' => (empty($labels[$field['vname']]) ? ucfirst($field['name']) : $labels[$field['vname']]),
                        'indexfieldname' => $field['name'],
                        'displaypath' => $module,
                        'path' => 'root:'.$module.'::field:'.$field['name'],
                        'search' => true,
                        'indextype' => $this->setFtsIndexType($field['type']),
                        'enablesort' => true //important! At least 1 field shall have it else indexing will not work, and first field for listview!
                    ];
                }
            }
        }
        return $ftsfields;
    }

    public function createFtsSettingsForModule($module){

        $settings = [
            'index_priority' => $this->getIndexPriorityForModule($module),
            'globalsearch' => $this->getGlobalSearchForModule($module),
            'operator' => $this->getOperatorForModule($module),
        ];

        return $settings;
    }

    public function loadFtsModules(){
        $keepftsmodules = [];
        $ftsmodules = [
            'AccountBankAccounts', 'AccountCCDetails', 'AccountKPIs', 'Accounts',
            'Bugs', 'Calls', 'Campaigns', 'Contacts', 'CompetitorAssessments', 'Contacts',
            'Documents', 'Emails', 'EmailTemplates', 'EventRegistrations',
            'KReports', 'Leads', 'Mailboxes', 'Meetings', 'Notes', 'Opportunities',
            'Projects', 'Proposals', 'ProspectLists', 'Prospects',
            'Tasks', 'Users',

            //PRO
            'Dashboards',
            'Products', 'ProductGroups', 'ProductAttributes', 'ProductVariants',
            'ProjectWBSs', 'ProjectMilestones', 'ProjectPlannedActivities',
            'Questionnaires', 'QuestionSets', 'QuestionOptionCategories', 'QuestionnaireInterpretations',
            'SalesDocs'
        ];

        //check if modules are available (CE/PRO)
        foreach($ftsmodules as $ftsmodule){
            if(in_array($ftsmodule, SpiceModules::getInstance()->getModuleList())){
                $keepftsmodules[] = $ftsmodule;
            }
        }

        return $keepftsmodules;
    }



    public function getOperatorForModule($module){
        $operator = "or";
        $op = [];

        if(in_array($module, $op)){
            $operator = "and";
        }
        return $operator;
    }

    public function getGlobalSearchForModule($module){
        $globalsearch = false;
        $glob = ['Accounts', 'Contacts', 'Leads', 'Opportunities', 'Proposals'];

        if(in_array($module, $glob)){
            $globalsearch = true;
        }
        return $globalsearch;
    }

    public function getIndexPriorityForModule($module){
        $index = 1;
        $highPrio = ['Accounts', 'Contacts', 'Leads', 'Opportunities', 'Proposals'];

        if(in_array($module, $highPrio)){
            $index = 100;
        }
        return $index;
    }

    /**
     * delete, create and set index cron job
     */
    public function initialize(){
        $spiceFTSManager = new SpiceFTSRESTManager();
        $spiceFTSManager->initialize();
        $spiceFTSManager->setCronJob();
    }

    /**
     * set minimal FTS config based on listviewdefs
     * @param null $module_name
     */
    public function createFtsConfig($module){
        $fts = new SpiceFTSRESTManager();

        //setup output
        $items = ['fields' => [], 'settings' => []];
        //fields
        $items['fields'] = $this->createFtsFieldsForModule($module);
        //settings
        $items['settings'] = $this->createFtsSettingsForModule($module);

        $fts->setFTSFields($module, $items);
    }

    public function setFtsIndexType($type){
        $ftstype = 'text';//string | text | keyword |date | double


        switch($type){
            case 'date':
            case 'datetime':
            case 'datetimecombo':
                $ftstype = 'date';
                break;

            case 'float':
            case 'currency':
            case 'decimal':
                $ftstype = 'double';
                break;

            default:
                $ftstype = 'text';
        }

        return $ftstype;
    }
}
