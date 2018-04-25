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

/**
 * Class SpiceUIConfLoader
 * load UI reference config
 */
require_once 'modules/SystemUI/SpiceUILoader.php';

class SpiceUIConfLoader{
//    public $sysuitables = array(
//        'sysmodules',
//        'sysuiactionsetitems',
//        'sysuiactionsets',
//        'sysuiadmincomponents',
//        'sysuicomponentdefaultconf',
//        'sysuicomponentmoduleconf',
//        'sysuicomponentsets',
//        'sysuicomponentsetscomponents',
//        'sysuicopyrules',
//        'sysuidashboarddashlets',
//        'sysuifieldsets',
//        'sysuifieldsetsitems',
//        'sysuifieldtypemapping',
//        'sysuilibs',
//        'sysuimodulerepository',
//        'sysuiobjectrepository',
//        'sysuirolemodules',
//        'sysuiroles',
//        'sysuiroutes',
////        'dashboards','kreports'
//    );

    public $loader;


    public function __construct(){
        $this->loader = new SpiceUILoader();
    }



    /**
     * Display load language form
     * in SpiceCRM Backend Administration
     * @return string
     */
    public function displayDefaultConfForm($params){
        $sm = new Sugar_Smarty();

        if(!empty($params['packages'])) $sm->assign('currentpackages', $params['packages']);
        if(!empty($params['versions'])) $sm->assign('currentversions', $params['versions']);

        return $sm->display("modules/Administration/templates/UIDefault.tpl");
    }

    /**
     * retrieve table column names
     * @param $tb
     * @return array
     */
    public function getTableColumns($tb){
        $columns = $GLOBALS['db']->get_columns($tb);
        $cols = array();
        foreach($columns as $c => $col){
            $cols[] = $col['name'];
        }
        return $cols;
    }

    /**
     * load sysui config from reference database
     * get column name for each table
     * make a select passing the column names
     * create insert queries.
     * @param $route
     * @param $params
     */
    public function loadDefaultConf($endpoint, $params){
        global $sugar_config;
        $tables = array();
        $truncates = array();
        $inserts = array();

        //get data
        if(!$response = $this->loader->callMethod("GET", $endpoint)){
            die("REST Call error somewhere... Action aborted");
        }
//        echo '<pre>'. print_r($response, true);die();

        foreach($response as $tb => $content) {
            //truncate command
            $tables[] = $tb;
            $truncates[] = "DELETE FROM $tb WHERE 1=1";//$GLOBALS['db']->truncateTableSQL($tb);
            $tbColCheck = false;

            foreach ($content as $id => $encoded) {
                if(!$decodeData = json_decode(base64_decode($encoded), true))
                    die("Error decoding data: ".json_last_error_msg().
                            "<br/>Reference table = $tb".
                            "<br/>Action aborted");
                //compare table column names
                if (!$tbColCheck) {
                    $referenceCols = array_keys($decodeData);
                    $thisCols = $this->getTableColumns($tb);
                    if (!empty(array_diff($referenceCols, $thisCols))) {
                        die("Table structure for $tb is not up-to-date.".
                            "<br/>Reference table = ".implode(", ", $referenceCols).
                            "<br/>Client table = ".implode(", ", $thisCols).
                            "<br/>Action aborted");
                    }
                    $tbColCheck = true;
                }

                //prepare values for DB query
                foreach($decodeData as $key => $value){
                    $decodeData[$key] = (is_null($value) || $value==="" ? "NULL" : "'".$GLOBALS['db']->quote($value)."'");
                }
                //insert command
                $inserts[] = "INSERT INTO $tb (" . implode(",", $referenceCols) . ") ".
                    "VALUES(" . implode(",", array_values($decodeData)) . ")";
            }
        }

        //if no inserts where created => abort
        if(count($inserts) < 1){
            die("No inserts found. Action aborted.");
        }

        $queries = array_merge($truncates, $inserts);
//        echo '<pre>'. print_r(implode(";\n", $queries), true);

        //process queries
        if(count($queries) > 2) {
            $errors = array();
            foreach ($queries as $q) {
                if(!$GLOBALS['db']->query($q))
                    $errors[] = 'Error with query: '.$q." ".$GLOBALS['db']->last_error;
            }
        }

        if(count($errors) > 0){
            echo "Errors:\n";
            echo '<pre>'.implode("\n", $errors);
        }
        else {
            echo "<br>Modified tables: <br>".implode("<br>", $tables);
            echo "<br>Success: Processed " . (count($queries) - count($errors)) . " queries out of " . (count($queries)) . "\n";
        }
    }


    /**
     * Remove sysmodules entries for modules that are not present in backend
     * @return bool
     */
    public function cleanDefaultConf(){
        // load moduleList
        global $current_user, $db;

        $sysmodules = [];
        if ($current_user->is_admin) {
            $sysmodulesres = $db->query("SELECT * FROM sysmodules");
            while ($sysmodule = $db->fetchByAssoc($sysmodulesres)) {
                $sysmodules[] = $sysmodule['module'];
            }
        };

        // process
        if(isset($GLOBALS['beanList']) && !empty($GLOBALS['beanList'])) {
            foreach ($sysmodules as $sysmodule) {
                if (!isset($GLOBALS['beanList'][$sysmodule])) {
                    $db->query("DELETE FROM sysmodules WHERE module='" . $sysmodule . "'");
                }
            }
        }
        return true;
    }

    /**
     * Get main information about current config loaded in client
     * package, version....
     */
    public function getCurrentConf(){
        global $db;
        $q = "(SELECT package, version FROM sysmodules WHERE version is not null AND version <> '') UNION 
        (SELECT package, version FROM sysuicomponentmoduleconf WHERE version is not null AND version <> '') UNION 
        (SELECT package, version FROM sysuifieldsets WHERE version is not null AND version <> '') 
        ORDER BY package, version";
        $res = $db->query($q);
        $packages = array();
        $versions = array();

        while($row = $db->fetchByAssoc($res)){
            if(!empty($row['package'])) $packages[] = $row['package'];
            if(!empty($row['version'])) $versions[] = $row['version'];
        }
        return array('packages' => $packages, 'versions' => $versions);
    }
}
