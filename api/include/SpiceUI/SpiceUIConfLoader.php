<?php
/*********************************************************************************
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 *
 * You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
 * SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
 ********************************************************************************/

/**
 * Class SpiceUIConfLoader
 * load UI reference config
 */

namespace SpiceCRM\includes\SpiceUI;

use Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\authentication\AuthenticationController;

class SpiceUIConfLoader
{
    public $sysuitables = [];

    public $loader;
    public $routebase = 'config'; // the common part in endpoint after domain url itself

    private $conftables = [
        'syshooks',
        'sysmodules',
        'sysmodulefilters',
        'systemdeploymentrpdbentrys',
        'sysuiactionsetitems',
        'sysuiactionsets',
        'sysuiadmincomponents',
        'sysuiadmingroups',
        'sysuicomponentdefaultconf',
        'sysuicomponentmoduleconf',
        'sysuicomponentsets',
        'sysuicomponentsetscomponents',
        'sysuicopyrules',
        'sysuidashboarddashlets',
        'sysuifieldsets',
        'sysuifieldsetsitems',
        'sysuifieldtypemapping',
        'sysuilibs',
        'sysuiloadtaskitems',
        'sysuiloadtasks',
        'sysuifieldtypemapping',
        'sysuimodulerepository',
        'sysuiobjectrepository',
        'sysuirolemodules',
        'sysuiroles',
        'sysuiroutes',
    ];

    /**
     * SpiceUIConfLoader constructor.
     * @param null $endpoint introduced with CR1000133
     */
    public function __construct($endpoint = null)
    {
        global $dictionary;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $this->loader = new SpiceUILoader($endpoint);

        // module dictionaries are unknown at that time
        // load them to make sure DBManager will have proper content in global $dictionary
        SpiceModules::getInstance()->loadModules();
        foreach(SpiceModules::getInstance()->getModuleList() as $idx => $module){
            VardefManager::loadVardef($module, SpiceModules::getInstance()->getBeanName($module));
        }

    }

    public static function getDefaultRoutes(){
        return ;
    }

    /**
     * retrieve table column names
     * @param $tb
     * @return array
     */
    public function getTableColumns($tb)
    {
        $columns = DBManagerFactory::getInstance()->get_columns($tb);
        $cols = [];
        foreach ($columns as $c => $col) {
            $cols[] = $col['name'];
        }
        return $cols;
    }

    /**
     * called bei SpiceInstaller
     * @param $package
     * @param string $version
     * @return mixed|string[]
     * @throws Exception
     */
    public function loadPackageForInstall($package, $version = '*')
    {
        $endpoint = implode("/", [$this->routebase, $package, $version]);
        return $this->loadInstallConf($endpoint);
    }

    /**
     * called by loadPackageForInstall
     * @param $routeparams
     * @return mixed|string[]
     * @throws Exception
     */
    public function loadInstallConf($routeparams)
    {
        //get data
        if (!$response = $this->loader->callMethod("GET", $routeparams)) {
            $errormsg = "REST Call error somewhere... Action aborted";
            throw new Exception($errormsg);
        }
        return $response;
    }

    /**
     * load table entries for a given package
     * @param $package
     * @param string $version
     * @return array
     * @throws Exception
     */
    public function loadPackage($package, $version = '*')
    {
        $endpoint = implode("/", [$this->routebase, $package, $version]);
        return $this->loadDefaultConf($endpoint, ['route' => $this->routebase, 'packages' => [$package], 'version' => $version], false);
    }

    /**
     * delete table entries for a given package
     * @param $package
     */
    public function deletePackage($package, $version = '*')
    {
        $db = DBManagerFactory::getInstance();
        // get the package and grab table names in use for thi spackage
        $route = implode("/", [$this->routebase, $package, $version]);

        if (!$response = $this->loadPackageData($route)) {
            $errormsg = "ERROR deleting... Action aborted";
            throw new Exception($errormsg);
        }

        $tables = array_keys($response);

        foreach ($tables as $conftable){
            $delWhere = ['package' => $package];
            if(!$db->deleteQuery($conftable, $delWhere)){
                LoggerManager::getLogger()->fatal('error deleting package {$package}  '.$db->lastError());
            }
        }
    }

    /**
     * get the data
     * @param $routeparams
     * @return mixed|string[]
     */
    public function loadPackageData($routeparams){
        return $this->loader->callMethod("GET", $routeparams);
    }

    /**
     * load sysui config from reference database
     * get column name for each table
     * make a select passing the column names
     * create insert queries.
     * @param $route
     * @param $params
     */
    public function loadDefaultConf($routeparams, $params, $checkopen = true)
    {
        global $dictionary;
        $db = DBManagerFactory::getInstance();
        $tables = [];
        $inserts = [];
        $errors = [];

        if ($checkopen && $this->loader->hasOpenChangeRequest()) {
            $errormsg = "Open Change Requests found! They would be erased...";
            throw new Exception($errormsg);
        }
        //get data
        if (!$response = $this->loadPackageData($routeparams)) {
            $errormsg = "REST Call error somewhere... Action aborted";
            throw new Exception($errormsg);
        }

        $this->sysuitables = array_keys($response);

        // workaround for packages in which a config entries refer to table that hasn't been created yet
        // e.g. uomunits in productmanagement package
        // check if you already have the tables in the database
        // create them if not and send a repair notification
        foreach($this->sysuitables as $tb){
            if(!$db->tableExists($tb)){
                // add the sysmodule entry that should be contained in this package
                if(isset($response['sysmodules']) && !empty($response['sysmodules'])) {
                    foreach($response['sysmodules'] as $moduleId => $encoded){
                        if ($decodeData = json_decode(base64_decode($encoded), true)){
                            //prepare values for DB query
                            foreach ($decodeData as $key => $value) {
                                $decodeData[$key] = (is_null($value) || $value === "" ? NULL :  $value);
                            }
                            // echo print_r($decodeData, true);
                            //delete before insert
                            $delWhere = ['id' => $decodeData['id']];
                            if(!$db->deleteQuery('sysmodules', $delWhere)){
                                LoggerManager::getLogger()->fatal("error deleting entry {$decodeData['id']} ".$db->lastError());
                            }
                            if(!$db->insertQuery('sysmodules', $decodeData, true)){
                                $errors[] = ('Error inserting record into sysmodules '.$db->lastDbError());
                            }
                        }
                    }
                    //die('Please log out, relogin, run repair/ rebuild, then reload this package');
                }
            }
        }

        if (!empty($response['nodata'])) {
            $errors[] = ($response['nodata']);
        }

        foreach ($response as $tb => $content) {
            //truncate command
            $tables[$tb] = 0;
            $thisCols = $this->getTableColumns($tb);
            switch ($tb) {
                case 'syslangs':
                    $db->truncateTableSQL($tb);
                    break;
                case 'sysfts': //don't do anything.
                    // Since we have no custom fts table, delete the whole thing might delete custom entries.
                    // therefore no action here
                    // each reference entry will be deleted before insert. See below 'delete before insert'.
                    break;
                default:
                    if(array_search('package', $thisCols) !== false) {
                        $deleteWhere = "package IN('" . implode("','", $params['packages']) . "') ";
                        //if (in_array($params['packages'][0], $params['packages']))
                        $deleteWhere .= "OR package IS NULL OR package=''";
                        if(!$db->deleteQuery($tb, $deleteWhere, true)){
                            LoggerManager::getLogger()->fatal('error deleting packages '.$db->lastError());
                        }
                    }
            }

            $tbColCheck = false;
            foreach ($content as $id => $encoded) {
                if (!$decodeData = json_decode(base64_decode($encoded), true))
                    $errors[] = ("Error decoding data: " . json_last_error_msg() .
                        " Reference table = $tb" .
                        " Action aborted");

                //compare table column names
                if (!$tbColCheck && is_array($decodeData)) {
                    $referenceCols = array_keys($decodeData);
                    if (!empty(array_diff($referenceCols, $thisCols))) {
                        $errors[] = ("Table structure for $tb is not up-to-date or there is new module. In case of a new module, logout, login, repair, then load core package again." .
                            " Reference table = " . implode(", ", $referenceCols) .
                            " Client table = " . implode(", ", $thisCols) .
                            " Action aborted");
                    }
                    $tbColCheck = true;
                }

                //prepare values for DB query
                if(is_array($decodeData)){
                    foreach ($decodeData as $key => $value) {
                        $decodeData[$key] = (is_null($value) || $value === "" ? NULL :  $value);
                    }
                    //delete before insert
                    $delWhere = ['id' => $decodeData['id']];
                    if(!$db->deleteQuery($tb, $delWhere)){
                        LoggerManager::getLogger()->fatal("error deleting entry {$decodeData['id']} ".$db->lastError());
                    }
                    //run insert
//                if($tb == 'email_templates'){
//                    file_put_contents('spicecrm.log', 'dict email_templates '.print_r($dictionary['EmailTemplate'], true)."\n", FILE_APPEND);
//                }
                    if($dbRes = $db->insertQuery($tb, $decodeData, true)){
                        $tables[$tb]++;
                        $inserts[] = $dbRes;
                    } else{
                        $errors[] = $db->lastError();
                    }
                }
            }
        }

        //if no inserts where created => abort
//        if (count($inserts) < 1) {
//            throw new Exception("No inserts or no inserts run successfully. Action aborted.");
//        }

        $success = true;
        if(count($errors) > 0){
            $success = false;
        }

        return ["success" => $success, "queries" => count($inserts), "errors" => $errors, "tables" => $tables];
    }


    /**
     * Remove sysmodules entries for modules that are not present in backend files
     * @return bool
     */
    public function cleanDefaultConf()
    {
        // load moduleList
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $sysmodules = [];
        if ($current_user->is_admin) {
            $sysmodulesres = $db->query("SELECT * FROM sysmodules");
            while ($sysmodule = $db->fetchByAssoc($sysmodulesres)) {
                $sysmodules[] = $sysmodule['module'];
            }
        };

        // process
        foreach ($sysmodules as $sysmodule) {
            if (!in_array($sysmodule, SpiceModules::getInstance()->getModuleList())) {
                $delPks = ['module' => $sysmodule];
                if(!$db->deleteQuery('sysmodules', $delPks)){
                    LoggerManager::getLogger()->fatal('error deleting packages '.$db->lastError());
                }
            }
        }
        return true;
    }

    /**
     * Get main information about current config loaded in client
     * package, version....
     */
    public function getCurrentConf()
    {
        $db = DBManagerFactory::getInstance();
        $qArray = [];
        $excludePackageCheck = ['systemdeploymentrpdbentrys'];
        foreach($this->conftables as $conftable) {
            if(!in_array($conftable, $excludePackageCheck)){
                $qArray[] = "(SELECT package, version FROM $conftable WHERE version is not null AND version <> '')";
            }
        }
        $q = implode(" UNION ", $qArray) . " ORDER BY package, version";
        $res = $db->query($q);
        $packages = [];
        $versions = [];

        while ($row = $db->fetchByAssoc($res)) {
            if (!empty($row['package']) && !in_array($row['package'], $packages)) {
                $packages[] = $row['package'];
            } elseif (!in_array('core', $packages) && !in_array($row['package'], $packages)) {
                $packages[] = 'core';
            }
            if (!empty($row['version']) && !in_array($row['version'], $versions))
                $versions[] = $row['version'];
        }
        return ['packages' => $packages, 'versions' => $versions];
    }
}
