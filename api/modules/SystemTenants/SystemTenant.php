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


namespace SpiceCRM\modules\SystemTenants;


use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSRESTManager;
use SpiceCRM\includes\SpiceInstaller\SpiceInstaller;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;

class SystemTenant extends SpiceBean
{

    /**
     * loads the tenant data from teh config for the loader to return to the frontend
     */
    public function getTenantData()
    {

        return SpiceConfig::getInstance()->config['tenant'] ?: [];
    }

    /**
     * switches to the tenant
     * @throws Exception
     */
    public function switchToTenant()
    {
        self::switchDB($this->id);
    }

    /**
     * switches to master db
     * @throws Exception
     */
    public static function switchToMaster()
    {
        $masterDBName = SpiceConfig::getInstance()->config['dbconfig']['db_name'];
        self::switchDB($masterDBName);
    }

    /**
     * switch between master and tenant db
     * @param string $dbName
     * @return void
     */
    private static function switchDB(string $dbName)
    {
        DBManagerFactory::disconnectAll();
        DBManagerFactory::changeDBName($dbName);

        BeanFactory::clearLoadedBeans();

        // reloads the config
        SpiceConfig::getInstance()->reloadConfig();

        // unset the fts settings
        unset($_SESSION['SpiceFTS']);
    }

    /**
     * initializes a new tenant, sets up the database and builds all required tables
     * @throws Exception
     */
    public function initializeTenant(): bool
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $config = SpiceConfig::getInstance()->config;

        if (!$current_user->is_admin) return false;

        $db = DBManagerFactory::getInstance();
        $db->createDatabase($this->id);

        // switch to tenant database
        $this->switchToTenant();

        $db = DBManagerFactory::getInstance();

        // create the db tables
        $this->createMissingTables();

        // insert default configs
        $installer = new SpiceInstaller();
        $installer->insertDefaults($db);

        // create local and in tenant
        if (!$config['tenant']['disable_copy_config']) {
            $installer->retrieveCoreandLanguages($db, 'en_us');
        }

        $this->copyMetadataFromMaster();

        // create the missing db tables after copying the metadata from the master
        $this->createMissingTables();

        $this->copyModulesDataFromMaster();

        // set the fts setting

        $this->copyConfig($db, $config, 'fts');
        $this->copyConfig($db, $config, 'default_preferences');
        $this->copyConfig($db, $config, 'system');
        $this->copyConfig($db, $config, 'core');

        // initialize elastic search
        $ftsManager = new SpiceFTSRESTManager();
        SpiceFTSHandler::getInstance()->elasticHandler->indexPrefix = "{$config['fts']['prefix']}{$this->id}_";
        $ftsManager->initialize();

        $db->transactionCommit();

        self::switchToMaster();

        $this->initialized = true;
        $this->save();

        return true;
    }

    /**
     * repair the database tables from vardefs
     * @return void
     * @throws Exception
     * @see AdminController::buildSQLforRepair
     */
    private function createMissingTables()
    {
        $db = DBManagerFactory::getInstance();

        $repairedTables = [];

        foreach (SpiceModules::getInstance()->getModuleList() as $moduleName) {

            $bean = BeanFactory::getBean($moduleName);

            if (($bean instanceof SpiceBean) && !$repairedTables[$bean->_tablename]) {
                $db->repairTable($bean);
                $repairedTables[$bean->_tablename] = true;
            }

            // check on audit tables
            if (($bean instanceof SpiceBean) && $bean->is_AuditEnabled() && !isset($repairedTables[$bean->_tablename . '_audit'])) {
                $sql .= $bean->update_audit_table();
                $repairedTables[$bean->_tablename . '_audit'] = true;
            }
        }

        foreach (SpiceDictionaryHandler::getInstance()->dictionary as $meta) {

            if (!isset($meta['table']) || $repairedTables[$meta['table']]) continue;

            $db->repairTableParams($meta['table'], $meta['fields'], $meta['indices'], true, $meta['engine']);

            $repairedTables[$meta['table']] = true;
        }
    }

    /**
     * copy metadata tables from master to tenant db
     * @throws Exception
     */
    private function copyMetadataFromMaster()
    {
        $tables = $this->getMetadataCopyTables();
        $this->copyFromMaster($tables);
    }

    /**
     * copy modules tables from master to tenant db
     * @throws Exception
     */
    private function copyModulesDataFromMaster()
    {
        $tables = $this->getModulesCopyTables();
        $this->copyFromMaster($tables);
    }

    /**
     * copy data from the master to the tenant db
     * @param array $tables
     * @return void
     * @throws Exception
     */
    public function copyFromMaster(array $tables)
    {
        $db = DBManagerFactory::getInstance();

        if (count($tables) == 0) return;

        $masterDBName = SpiceConfig::getInstance()->config['dbconfig']['db_name'];

        // set array key to table name
        $tables = array_fill_keys($tables, true);

        foreach (SpiceDictionaryHandler::getInstance()->dictionary as $meta) {

            if (!$tables[$meta['table']]) continue;

            $table = $meta['table'];
            $fields = [];

            // get the table fields list
            foreach ($meta['fields'] as $field) {
                if (isset($field['source']) && $field['source'] != 'db')  continue;
                $fields[] = $field['name'];
            }

            $fields = implode(', ', $fields);

            // execute copy data from master db
            $db->query("INSERT INTO $table ($fields) SELECT $fields FROM $masterDBName.$table");
        }
    }

    /**
     * get a list of metadata tables to be copied from the master to the tenant db
     * @return string[]
     */
    public function getMetadataCopyTables(): array
    {
        return [
            'spiceaclmoduleactions',
            'spiceaclmodulefields',
            'spiceaclobjectactions',
            'spiceaclobjectfields',
            'spiceaclobjects',
            'spiceaclobjectvalues',
            'spiceaclprofiles',
            'spiceaclprofiles_spiceaclobjects',
            'spiceaclstandardactions',
            'spicebeancustomguides',
            'spicebeanguides',
            'spicebeanguidestages',
            'spicebeanguidestages_check_texts',
            'spicebeanguidestages_checks',
            'spicebeanguidestages_texts',
        ];
    }

    /**
     * get a list of module tables to be copied from the master to the tenant db
     * @return string[]
     */
    public function getModulesCopyTables(): array
    {
        return [];
    }

    /**
     * copy config values fromt eh current sugar config to the new config table
     *
     * @param $db
     * @param $config
     * @param $category
     */
    private function copyConfig($db, $config, $category)
    {
        foreach ($config[$category] as $name => $value) {
            $db->query("INSERT INTO config (category, name, value) VALUES ('$category', '$name', '$value')");
        }
    }
}
