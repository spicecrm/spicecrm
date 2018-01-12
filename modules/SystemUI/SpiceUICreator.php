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

class SpiceUICreator {

    public $uimodules = array();
    public $sysuitables = array(
        'sysmodules',
        'sysuiactionsetitems',
        'sysuiactionsets',
        'sysuiadmincomponents',
        'sysuicomponentdefaultconf',
        'sysuicomponentmoduleconf',
        'sysuicomponentsets',
        'sysuicomponentsetscomponents',
        'sysuicopyrules',
        'sysuifieldsets',
        'sysuifieldsetsitems',
        'sysuifieldtypemapping',
        'sysuimodulerepository',
        'sysuiobjectrepository',
        'sysuirolemodules',
        'sysuiroles',
        'sysuiroutes',
        'sysuiuserroles'
    );

    public function displayDefaultConfForm(){
        $sm = new Sugar_Smarty();
        $sm->assign("sysuitableslist", implode("<br>", $this->sysuitables));
        return $sm->display("modules/Administration/templates/UIDefault.tpl");
    }


    public function createDefaultConf(){
        // load file containing default queries
        $sysuidefaultsqls = $this->loadUIDefaultConfig();

        if(empty($sysuidefaultsqls))
            return false;

        // delete content in sysui tables
        foreach($this->sysuitables as $sysuitable) {
            $GLOBALS['db']->query("DELETE FROM $sysuitable");
        }

        // process
        foreach($sysuidefaultsqls as $sysuidefaultsql){
            $GLOBALS['db']->query($sysuidefaultsql);
        }

        // clean
        $this->cleanDefaultConf();

        //display
        if(!$GLOBALS['installing']) {
            echo('UI Default Config was restored.');
        }
        return true;
    }

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
        if(isset($GLOBALS['moduleList']) && !empty($GLOBALS['moduleList'])) {
            foreach ($sysmodules as $sysmodule) {
                if (!in_array($sysmodule, $GLOBALS['moduleList'])) {
                    $db->query("DELETE FROM sysmodules WHERE module='" . $sysmodule . "'");
                }
            }
        }
        return true;
    }

    public function loadUIDefaultConfig(){
        $uiconfigfile = get_custom_file_if_exists('install/ui/uidefaultconf.txt');
        if(is_file($uiconfigfile)){
            $sqlBuilds = array();
            $sql = "";
            $sqls = explode("\n", file_get_contents($uiconfigfile));
            foreach($sqls as $sqlPart){
                if(substr($sqlPart, 0, 2) == '--') continue;
                if(substr($sqlPart, 0, 2) == '/*') continue;
                if(substr($sqlPart, 0, 2) == 'IN') {
                    if(strlen($sql) > 1) {
                        $sqlBuilds[] = $sql;
                    }
                    $sql = "";
                }
                $sql.= $sqlPart;
            }
        }
        return $sqlBuilds;
    }


}