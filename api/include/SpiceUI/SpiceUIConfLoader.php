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

use SpiceCRM\data\Relationships\RelationshipFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\database\DBManager;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinition;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryDefinitions;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryIndexes;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItems;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationships;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\authentication\AuthenticationController;

class SpiceUIConfLoader
{
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
        'sysexchangemappingsegments',
        'sysexchangemappingsegmentitems',
        'sysexchangemappingmodules',
        'sysmsgraphmappingsegments',
        'sysmsgraphmappingsegmentitems',
        'sysmsgraphmappingmodules',
    ];

    /**
     * specific records from tables without package column shall be inserted, NOT updated, NOT deleted
     * @var string[]
     */
    private $insertOnlyTables = [
        'nodata',
        'sysfts',
        'sysnumberranges',
        'sysnumberrangeallocation',
        'syssalesdocnumberranges',
        'syssalesdoctypes',
        'syssalesdoctypesflow',
        'syssalesdoctypesitemtypes',
        'syscategorytrees',
        'syscategorytreelinks',
        'schedulerjobtasks',
        'schedulerjobs',
        'sysuihtmlstylesheets',
        'sysuihtmlformats'
    ];
    /**
     * @var array holds the errors from load package
     */
    private array $loadErrors = [];
    /**
     * @var array holds the loaded tables entries count
     */
    private array $loadedTablesEntries = [];
    /**
     * @var int loaded entries count
     */
    private int $loadedEntriesCount = 0;

    /**
     * SpiceUIConfLoader constructor.
     * @param null $endpoint introduced with CR1000133
     */
    public function __construct($endpoint = null)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $this->loader = new SpiceUILoader($endpoint);

        // module dictionaries are unknown at that time
        // load them to make sure DBManager will have proper content in global $dictionary
        SpiceModules::getInstance()->loadModules();
        foreach(SpiceModules::getInstance()->getModuleList() as $idx => $module){
            VardefManager::loadVardef($module, SpiceModules::getInstance()->getBeanName($module));
        }

    }

    /**
     * @deprecated
     * @return void
     */
    public static function getDefaultRoutes(){
        return ;
    }

    /**
     * retrieve table column names
     * @param string $tableName
     * @return array|null
     * @throws \Exception
     */
    public function getTableColumns(string $tableName): ?array
    {
        $dic = SpiceDictionary::getInstance()->getDefsByTableName($tableName);

        return !$dic ? null : array_column(
            array_filter($dic['fields'], fn($f) => $f['source'] != 'non-db'),
            'name'
        );
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

        // gather tables and all the record IDs
        foreach ($response as $conftable => $conf){
            foreach($conf as $recordId => $recordData){
                $tables[$conftable][] = $recordId;
            }
        }

        foreach ($tables as $conftable => $recordIds){
            if(in_array($conftable, $this->insertOnlyTables)){
                continue;
            }
            try {
                $delWhere = ['package' => $package];
                $db->deleteQuery($conftable, $delWhere);
            } catch (Exception $e){
                // just go on -  the table just has no package column
            }

            foreach($recordIds as $recordId){
                $delWhere = ['id' => $recordId];
                if (!$db->deleteQuery($conftable, $delWhere)) {
                    LoggerManager::getLogger()->fatal('error deleting package {$package}  ' . $db->lastError());
                }
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
     * load system ui config from reference database
     * @param $routeParams
     * @param array $params
     * @param bool $checkOpenChangeRequest
     * @return array
     * @throws Exception
     */
    public function loadDefaultConf($routeParams,array $params, bool $checkOpenChangeRequest = true): array
    {
        if ($checkOpenChangeRequest && $this->loader->hasOpenChangeRequest()) {
            throw new Exception("Open Change Requests found! They would be erased...");
        }

        $response = $this->loadPackageData($routeParams);

        if (!$response || !empty($response['nodata'])) {
            throw (new Exception($response['nodata'] ?: "REST Call error somewhere... Action aborted"))->setDetails([['scope' => 'table' ,'name' => 'x', 'message' => "No Dictionary found for table"]]);
        }

        $this->resetCounters();

        $this->loadPackageModules($response, $params['packages']);
        $this->processNewDictionaries($response, $params['packages']);

        foreach ($response as $tableName => $records) {
            $this->loadTableRecords($tableName, $records, $params['packages']);
        }

        if(count($this->loadErrors) > 0){
            $packages = implode(', ', $params['packages']);
            throw (new Exception("Failed to load packages $packages", 'packageLoadFailed'))->setDetails($this->loadErrors);
        }

        return ["success" => true, "queries" => $this->loadedEntriesCount, "errors" => array_unique($this->loadErrors), "tables" => $this->loadedTablesEntries];
    }

    /**
     * reset the counters properties
     * @return void
     */
    private function resetCounters()
    {
        $this->loadErrors = [];
        $this->loadedTablesEntries = [];
        $this->loadedEntriesCount = 0;
    }

    /**
     * load package table records
     * @param string $tableName
     * @param array|null $records
     * @param array $packages
     * @throws Exception | \Exception
     */
    private function loadTableRecords(string $tableName, ?array $records, array $packages)
    {
        $db = DBManagerFactory::getInstance();

        $tableCols = $this->getTableColumns($tableName);

        if (!$tableCols) {
            $this->loadErrors[] = ['scope' => 'table' ,'name' => $tableName, 'message' => "No Dictionary found for table $tableName"];
            return;
        }

        $hasPackageField = in_array('package', $tableCols);

        if ($hasPackageField) {
            $this->cleanupPackageBeforeLoad($tableName, $packages);
        }

        # if no records do nothing
        if (!$records) return;

        if (!isset($this->loadedTablesEntries[$tableName])) {
            $this->loadedTablesEntries[$tableName] = 0;
        }

        foreach ($records as $record) {

            $record = json_decode(base64_decode($record), true);

            # if the table content data could not be decoded skip the table load
            if (!$record) {
                $this->loadErrors[] = ['scope' => 'global' ,'name' => $tableName, 'message' => ("Error decoding data: " . json_last_error_msg() . " Reference table = $tableName Action aborted")];

                continue;
            }

            # skip loading existing records from the insert only tables
            if (in_array($tableName, $this->insertOnlyTables) && $db->getOne("select id from $tableName where id='{$record['id']}'")) {
                continue;
            }

            $record = $this->prepareRecordData($record, $tableCols);

            $db->upsertQuery($tableName, ['id' => $record['id']], $record);

            if(empty($db->lastError())){
                $this->loadedTablesEntries[$tableName]++;
            } else{
                $this->loadErrors[] = ['scope' => 'records' ,'name' => $tableName, 'message' => $db->lastError()];
            }
        }

        $this->loadedEntriesCount += $this->loadedTablesEntries[$tableName];
    }

    /**
     * filter out the unknown columns and return the record
     * @param array $record
     * @param $colDefs
     * @return array
     */
    private function prepareRecordData(array $record, $colDefs): array
    {
        $res = [];

        foreach ($colDefs as $col) {
            $res[$col] = is_null($record[$col]) || $record[$col] === "" ? NULL : $record[$col];
        }

        return $res;
    }

    /**
     * cleanup package entries before loading the package data
     * @param string $table
     * @param array $cols
     * @param $packages
     * @return void
     * @throws Exception
     */
    private function cleanupPackageBeforeLoad(string $table,array $packages)
    {
        if (in_array($table, ['sysfts', 'syslangs'])) return;

        /** @var DBManager $db */
        $db = DBManagerFactory::getInstance();

        $deleteWhere = "package IN('" . implode("','", $packages) . "') OR package IS NULL OR package=''";
        $deleted = $db->deleteQuery($table, $deleteWhere);

        if (!$deleted) {
            LoggerManager::getLogger()->fatal('error deleting packages ' . $db->lastError());
        }
    }

    /**
     * insert package system modules
     * @param array|null $response
     * @throws Exception | \Exception
     */
    private function loadPackageModules(array &$response, array $packages)
    {
        $this->loadTableRecords('sysmodules', $response['sysmodules'], $packages);

        unset($response['sysmodules']);

        SpiceModules::getInstance()->loadModules(true);
    }

    /**
     * check the package dictionaries if loaded and repair the dictionaries
     * @param array $response
     * @param array $packages
     * @return void
     * @throws Exception
     * @throws DatabaseException | \Exception
     */
    private function processNewDictionaries(array &$response, array $packages): void
    {
        $dictionaryTables = [
            'sysdictionarydefinitions',
            'sysdictionaryindexitems',
            'sysdictionaryindexes' ,
            'sysdictionaryitems',
            'sysdictionaryrelationshipfields',
            'sysdictionaryrelationshippolymorphs',
            'sysdictionaryrelationships',
            'sysdomaindefinitions',
            'sysdomainfields',
            'sysdomainfieldvalidations',
            'sysdomainfieldvalidationvalues',
        ];

        $definitions = SpiceDictionaryDefinitions::getInstance();
        $db = DBManagerFactory::getInstance();

        foreach ($dictionaryTables as $table) {
            $this->loadTableRecords($table, $response[$table], $packages);
        }

        SpiceDictionaryDefinitions::getInstance()->reloadItems();
        SpiceDictionaryItems::getInstance()->reloadItems();
        SpiceDictionaryIndexes::getInstance()->reloadItems();
        SpiceDictionaryRelationships::getInstance()->reloadItems();

        foreach ($response['sysdictionarydefinitions'] as $dictionaryDef) {

            $dictionaryDef = json_decode(base64_decode($dictionaryDef), true);

            # repair only active definitions
            if ($dictionaryDef['status'] != 'a') continue;

            try {
                $definitions->repair($dictionaryDef['id']);
            } catch (\Throwable | Exception $exception) {
                unset($response[$dictionaryDef['tablename']]);

                $this->loadErrors[] = ['scope' => 'dictionary' ,'name' => $dictionaryDef['name'], 'mismatch' => is_callable([$exception, 'getDetails']) ? $exception->getDetails() : null, 'message' => $exception->getMessage()];
            }
        }


        SpiceDictionary::getInstance()->loadDictionary();
        RelationshipFactory::getInstance()->loadRelationships(true);

        foreach ($dictionaryTables as $table) {
            unset($response[$table]);
        }
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
            if(!in_array($conftable, $excludePackageCheck) && $db->tableExists($conftable)){
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

    /**
     * get packages, versions and languages from all repository sources (i.e. reference, release)
     * returns array with packages and versions
     * @return array[]
     * @throws Exception
     */
    public function getRepositoryInfo(): array
    {

        $repositoriesMetadata = ['packages' => [], 'versions' => []];

        $db = DBManagerFactory::getInstance();
        $repositoryObjects = $db->query("SELECT * FROM sysuipackagerepositories");

        while($repository = $db->fetchByAssoc($repositoryObjects)){

            // prepare url
            $repositoryUrl = $repository['url'].'/';

            $curl = curl_init();
            curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($curl, CURLOPT_URL, $repositoryUrl .'config');
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($curl, CURLOPT_ENCODING, "UTF-8");
            $getJSONcontent = curl_exec($curl);

            // decode content as array
            $content = json_decode($getJSONcontent, true);

            // loop through content and push the versions to repositoriesMetadata array
            foreach ($content['versions'] as $version) {

                // check if the version exists in array
                if(!in_array(['name' => $version['version']], $repositoriesMetadata['versions'])) {
                    $repositoriesMetadata['versions'][] = ['name' => $version['version']];
                }
            }

            // loop through content and push the packages to repositoriesMetadata array
            foreach ($content['packages'] as $package) {

                // check if the package exists in array
                if(!in_array(['package' => $package['package']], $repositoriesMetadata['packages'])) {
                    $repositoriesMetadata['packages'][] = ['package' => $package['package']];
                }
            }
        };

        // sort arrays
        rsort($repositoriesMetadata['versions']);
        sort($repositoriesMetadata['packages']);

        return $repositoriesMetadata;
    }
}
