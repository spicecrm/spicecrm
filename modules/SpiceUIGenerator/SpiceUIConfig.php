<?php
/**
 * Created by PhpStorm.
 * User: maretval
 * Date: 03.11.2017
 * Time: 13:57
 */
require_once 'modules/SpiceUIGenerator/SpiceUIGenerator.php';

class SpiceUIConfig
{

    public $customModules = array();
    public $customViewModules = array();
    public $excludeFromListViewModules = array();
    public $excludeFromViewModules = array();
    public $excludeFromLayoutdefsModules = array();
    public $forceViewForModules = array();
    public $customerKey;
    public $skipModules = array();
    public $sqlpath = 'modules/SpiceUIGenerator/sql';
    public $language;

    public function __construct($customerKey, $language){
        $this->customerKey = $customerKey;
        $this->language= $language;
        $this->g = new SpiceUIGenerator($this->customerKey, $this->language);
        $this->getCustomModules();
        $this->getCustomViewModules();
    }

    /**
     * all modules in custom/modules
     */
    public function getCustomModules(){
        $this->customModules=[];
        foreach (new DirectoryIterator('custom/modules') as $fileInfo) {
            if($fileInfo->isDot() || $fileInfo->isFile()) continue;
            $this->customModules[] = $fileInfo->getFilename();
        }
    }

    /**
     * for KAB customer: all modules in custom/modules except Administration
     */
    public function getCustomViewModules(){
        $this->customViewModules = [];
        foreach (new DirectoryIterator('custom/modules') as $fileInfo) {
            if($fileInfo->isDot() || $fileInfo->isFile()) continue;
            if(in_array($fileInfo->getFilename(), $this->skipModules) ) continue;
            $this->customViewModules[] = $fileInfo->getFilename();
        }
    }

    public function createUIconfig(){
        //create sysmodules
        $this->g->classicModulesToUI($this->customModules);

        //add custom modules to sales sysuiroles
        $this->g->loadCustomSalesRole($this->customModules);

        //load sugar like views and save to CSV files
        $customViews = $this->getCustomViewModules();
        foreach($this->customViewModules as $module_name){
            if(!in_array($module_name, $this->excludeFromViewModules)) {
                $view = "detailviewdefs"; //default
                //check config and set view
                if(isset($this->forceViewForModules[$module_name]['view']))
                    $view = $this->forceViewForModules[$module_name]['view'];

                $file_name = $this->g->csvpath."/".$module_name . "_" . $view . ".csv";
                //save structure to CSV
                $this->g->classicViewDefsToCSV($file_name, $this->g->readClassicViewDefs($module_name, $view));
                //create sysui entries from CSV
                $this->g->classicViewCSVtoUI($file_name, $module_name);
            }

            //handle custom labels
//            $this->g->generateCustomLabels($module_name);


            if(!in_array($module_name, $this->excludeFromListViewModules)) {
                $view = "listviewdefs";
                $file_name = $this->g->csvpath."/".$module_name . "_" . $view . ".csv";
                $this->g->classicListViewDefsToCSV($file_name, $this->g->readClassicListView($module_name));
                $this->g->classicListViewCSVtoUI($file_name, $module_name);
            }
//
//
            if(!in_array($module_name, $this->excludeFromLayoutdefsModules)) {
                $view = "layoutdefs";
                $file_name = $this->g->csvpath."/".$module_name . "_" . $view . ".csv";
                $this->g->classicLayoutDefsToCSV($file_name, $this->g->readClassicLayoutDefs($module_name));
                $this->g->classicLayoutDefsCSVtoUI($file_name, $module_name);
            }

        }

        //create SQLs for custom Labels
//        $lblsqls = [];
//        foreach($this->g->customLabels as $lbl => $languages){
//            $lbl_id = create_guid();
//            $lblsqls[] = "INSERT INTO syslanguagecustomlabels (id, name) VALUES('".$lbl_id."', '".$lbl."')";
//            foreach($languages as $lang => $translation){
//                $lblsqls[] = "INSERT INTO syslanguagecustomtranslations (id, syslanguagelabel_id, syslanguage, translation_default) VALUES(UUID(), '".$lbl_id."', '".$lang."', '".$GLOBALS['db']->quote($translation)."')";
//            }
//        }
//        if(count($lblsqls) > 0) {
//            $file_name = $this->g->sqlpath . "/custom_labels.sql";
//            file_put_contents($file_name, implode(";\n", $lblsqls));
//        }
    }

    public function loadUIconfig(){
        global $sugar_config;
        $txt = "";
        foreach (new DirectoryIterator($this->sqlpath) as $fileInfo) {
            if ($fileInfo->isDot()) continue;
            $txt.= file_get_contents($this->sqlpath."/".$fileInfo->getFilename())."\n" ;
        }
        file_put_contents($this->sqlpath."/_uiconfig.sql", $txt);
    }

    public function createFTSconfig(){
        if(empty($this->customViewModules))
            $this->getCustomViewModules();

        foreach($this->customViewModules as $module_name) {
            $this->g->generateFtsConfig($module_name);
        }
    }

    /*
     * empty all sysuicustom tables except syscustommodules
     */
    public function resetSysUITables(){
        $tables = array(
            'sysuicustomactionsetitems',
            'sysuicustomactionsets',
            'sysuicustomcomponentdefaultconf',
            'sysuicustomcomponentmoduleconf',
            'sysuicustomcomponentsets',
            'sysuicustomcomponentsetscomponents',
            //'sysuicustomcopyrules',
            //'sysuicustomdashboarddashlets',
            'sysuicustomfieldsets',
            'sysuicustomfieldsetsitems',
            //'sysuicustomfieldtypemapping',
            //'sysuicustomlibs',
            //sysuicustommodulerepository,
            //'sysuicustomobjectrepository'
            //'sysuicustomrolemodules',
            //'sysuicustomroles',
            //'sysuicustomroutes',
        );

        foreach($tables as $tb){
            $GLOBALS['db']->query("DELETE FROM $tb WHERE 1=1");

        }
    }

}