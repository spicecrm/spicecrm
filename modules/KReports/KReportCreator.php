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

class KReportCreator {



    public function displayDefaultConfForm(){
        $sm = new Sugar_Smarty();
        return $sm->display("modules/Administration/templates/KReportsDefault.tpl");
    }


    public function createDefaultConf(){
        // load file containing default queries
        $kreportsdefaultsqls = $this->loadKReportDefaultConfig();
        if(empty($kreportsdefaultsqls))
            return false;

        // process
        foreach($kreportsdefaultsqls as $kreportsdefaultsql){
            $GLOBALS['db']->query($kreportsdefaultsql);
        }

        //display
        if(!$GLOBALS['installing']) {
            echo('KReports Default Config was restored.');
        }
        return true;
    }

    public function loadKReportDefaultConfig(){
        $uiconfigfile = get_custom_file_if_exists('install/kreports/kreportsdefaultconf.txt');
        if(is_file($uiconfigfile)){
            $sqlBuilds = array();
            $sql = "";
            $sqls = explode("\n", file_get_contents($uiconfigfile));

            foreach($sqls as $sqlPart){
                if(substr($sqlPart, 0, 2) == '--') continue;
                if(substr($sqlPart, 0, 2) == '/*') continue;
                if(substr($sqlPart, 0, 2) == 'IN' || substr($sqlPart, 0, 2) == 'RE') {
                    if(strlen($sqlPart) > 1) {
                        $sqlBuilds[] = $sqlPart;
                    }
                }
            }
        }
        return $sqlBuilds;
    }

}