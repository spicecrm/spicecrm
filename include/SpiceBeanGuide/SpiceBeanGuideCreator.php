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
 * Class SpiceUICreator
 * load SQLs containing SYSUI configuration
 * delete current one listed in $sysuitables
 */

class SpiceBeanGuideCreator {
    public $spicebeanguidemodules = array('Opportunities' => 'Opportunities');

    public function displayDefaultConfForm($displayForm, $displayResults = ""){
        $sm = new Sugar_Smarty();
        $sm->assign("displayForm", $displayForm);
        $sm->assign("displayResults", $displayResults);
        $sm->assign("spicebeanguidemodules", $this->spicebeanguidemodules);
        return $sm->display("modules/Administration/templates/SpiceBeanGuideDefault.tpl");
    }


    /**
     * @param $modules Array
     * @return bool
     */
    public function createDefaultConf($modules){
        $successGuideLoaded = array();
        if(empty($modules))
            return false;

        foreach($modules as $module) {
            // load file containing default queries
            $queries = $this->loadGuideDefaultConfig($module);

            if (empty($queries))
                return false;

            // delete content in spicebeanguide tables for $module
            $this->clearSpiceBeanGuide($module);

            // insert
            foreach($queries as $q){
                if(!$GLOBALS['db']->query($q)) {
                    echo 'Query error ' . $q . '. Please check sugarcrm.log for details<br>';
                    return false;
                }
            }
            $successGuideLoaded[] = $module;
        }
        return $successGuideLoaded;
    }


    public function loadGuideDefaultConfig($module){
        $file = get_custom_file_if_exists('install/spicebeanguides/'.strtolower($module).'.txt');
        if(is_file($file)){
            $sqlBuilds = array();
            $sql = "";
            $sqls = explode("\n", file_get_contents($file));
            foreach($sqls as $sqlPart){
                if(substr($sqlPart, 0, 2) == '--') continue;
                if(substr($sqlPart, 0, 2) == '/*') continue;
                if(substr($sqlPart, 0, 2) == 'RE') {
                    if(strlen($sql) > 1) {
                        $sqlBuilds[] = $sql;
                    }
                    $sql = "";
                }
                $sql.= $sqlPart;
            }
        }
        else{
            die('No default File foudn for module '.$module.'. Action was aborted.');
        }

        return $sqlBuilds;
    }


    public function clearSpiceBeanGuide($module){
        $queries = array();
        //get spicebeanguide id
        $spicebeanguide = $GLOBALS['db']->fetchByAssoc($GLOBALS['db']->query("SELECT id FROM spicebeanguides WHERE module='".$module."'"));
        $queries[] = "SELECT id, 'spicebeanguides' as tb FROM spicebeanguides WHERE module='".$module."'";
        $queries[] = " UNION ";
        $queries[] = "SELECT id, 'spicebeanguidestages' as tb FROM spicebeanguidestages WHERE spicebeanguide_id='".$spicebeanguide['id']."'";
        $queries[] = " UNION ";
        $queries[] = "SELECT id, 'spicebeanguidestages_checks' as tb FROM spicebeanguidestages_checks WHERE spicebeanguide_id='".$spicebeanguide['id']."'";
        $queries[] = " UNION ";
        $queries[] = "SELECT id, 'spicebeanguidestages_check_texts' as tb FROM spicebeanguidestages_check_texts WHERE stage_check_id IN( select id from spicebeanguidestages_checks WHERE  spicebeanguide_id='".$spicebeanguide['id']."')";
        $queries[] = " UNION ";
        $queries[] = "SELECT id, 'spicebeanguidestages_texts' as tb FROM spicebeanguidestages_texts WHERE stage_id IN( select id from spicebeanguidestages WHERE  spicebeanguide_id='".$spicebeanguide['id']."')";

        if(!$res = $GLOBALS['db']->query(implode("\n", $queries)))
            die('UNION Query error in clearSpiceBeanGuide()');

        while($id = $GLOBALS['db']->fetchByAssoc($res)){
            if(!$GLOBALS['db']->query("DELETE FROM ".$id['tb']." where id='".$id['id']."'"))
                return false;
        }

        return true;
    }

}