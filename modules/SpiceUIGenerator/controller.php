<?php
/**
 * Created by PhpStorm.
 * User: maretval
 * Date: 18.08.2017
 * Time: 13:06
 */
require_once 'modules/SpiceUIGenerator/SpiceUIGenerator.php';

class SpiceUIGeneratorController extends SugarController
{

    /**
     * Create MySQL Queries to overwrite current SA config
     */
    public function action_loadCustomSalesRole()
    {
        echo '<pre>' . __FUNCTION__;
        $modules = array('Accounts', 'Contacts', 'SUPConsultingOrders', 'SUPConsultingTasks', 'SUPConsultingServices', 'Calendar', 'KReports');
        $g = new SpiceUIRolesGenerator();
        $results = $g->loadCustomSalesRole($modules);
        die('<pre>' . print_r($results, true));

    }



    /**
     * Create command line commands to extract Dump for UI config for spcified modules
     * Copy command, paste to console and run
     * sql file is generated in this module folder
     */
    public function action_exportModuleConfiguration()
    {
        echo '<pre>' . __FUNCTION__;
        $exports = array('SUPConsultingOrders', 'SUPConsultingTasks', 'SUPConsultingServices');
        foreach ($exports as $module) {
            $g = new SpiceUIGenerator($module, 'SUP');
            $results = $g->exportModuleConfiguration($module);
            $g->clean_export_file = false;

        }
        die('<pre>' . print_r($results, true));
    }


    public function action_loadFTSConfig()
    {
        $g = new SpiceUIGenerator('KBigdeals');
        $g->generateFtsConfig('KBigdeals');
    }

    public function action_classicModulesToUI(){
        $g = new SpiceUIGenerator('KBigdeals', 'KAB');
        $g->classicModulesToUI();
    }

    public function action_loadClassicView()
    {
        //$modulesToCheck = array_keys($GLOBALS['beanList']);
        //check modules located in custom having a metadata folder. The others will get default config
        foreach (new DirectoryIterator('custom/modules/') as $fileInfo) {
            if ($fileInfo->isDot() || $fileInfo->isFile()) continue;
            foreach (new DirectoryIterator('custom/modules/' . $fileInfo->getFilename()) as $subfolder) {
                if ($subfolder->isDot() || $subfolder->isFile()) continue;
                if ($subfolder == 'metadata')
                    $modulesToCheck[] = $fileInfo->getFilename();
            }
        }
        $modulesToCheck = array('KOnlineAccounts');
//die('<pre>'.print_r($modulesToCheck, true));
        foreach ($modulesToCheck as $module_name) {
            $g = new SpiceUIGenerator($module_name, 'KAB');
            $view = "editviewdefs";
            $file_name = $module_name . "_" . $view . ".csv";
            $g->classicViewDefsToCSV($file_name, $g->readClassicViewDefs($module_name, $view));
//            $view = "detailviewdefs";
//            $file_name = $module_name . "_" . $view . ".csv";
//            $g->classicViewDefsToCSV($file_name, $g->readClassicViewDefs($module_name, $view));
            $view = "layoutdefs";
            $file_name = $module_name . "_" . $view . ".csv";
            $g->classicLayoutDefsToCSV($file_name, $g->readClassicLayoutDefs($module_name));
            $view = "listviewdefs";
            $file_name = $module_name . "_" . $view . ".csv";
            $g->classicListViewDefsToCSV($file_name, $g->readClassicListView($module_name));

        }
    }

    public function action_classicViewCSVtoUI(){
        $module_name = 'KOnlineAccounts';
        $g = new SpiceUIGenerator($module_name, 'KAB');

//        $view = "editviewdefs";
//        $file_name = "modules/SpiceUIGenerator/csv/".strtolower($module_name ). "_" . $view . ".csv";
//        $g->classicViewCSVtoUI($file_name, $module_name);

        $view = "layoutdefs";
        $file_name = "modules/SpiceUIGenerator/csv/".strtolower($module_name ). "_" . $view . ".csv";
        $g->classicLayoutDefsCSVtoUI($file_name, $module_name);

//        $view = "listviewdefs";
//        $file_name = "modules/SpiceUIGenerator/csv/".strtolower($module_name ). "_" . $view . ".csv";
//        $g->classicListViewCSVtoUI($file_name, $module_name);
    }

    public function action_configcustomer(){


    }

}