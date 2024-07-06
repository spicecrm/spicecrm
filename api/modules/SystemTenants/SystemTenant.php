<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SystemTenants;


use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManager;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceCache\SpiceCacheFile;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSRESTManager;
use SpiceCRM\includes\SpiceInstaller\SpiceInstaller;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Users\User;

class SystemTenant extends SpiceBean
{
    /**
     * holds the passed tenant id in the incoming api request header
     * @var string|null
     */
    public static ?string $currentTenantID = null;

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
    public static function switchDB(string $dbName)
    {
        DBManagerFactory::disconnectAll();
        DBManagerFactory::changeDBName($dbName);

        BeanFactory::clearLoadedBeans();

        SpiceCache::reinitialize();

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

        /** @var User $adminUser */
        $adminUser = BeanFactory::getBean('Users', '1');

        // switch to tenant database
        $this->switchToTenant();

        $db = DBManagerFactory::getInstance();

        $db->transactionStart();

        $installer = new SpiceInstaller();

        $installer->initializeSystem($db, 'en_us');

        $this->copyConfig($db, $config, 'fts');
        $this->copyConfig($db, $config, 'default_preferences');
        $this->copyConfig($db, $config, 'system');
        $this->copyConfig($db, $config, 'core');

        SpiceConfig::getInstance()->set('fts', 'prefix', "{$config['fts']['prefix']}{$this->id}_");

        if (SpiceConfig::getInstance()->get('multitenancy.copy_metadata')) {
            $this->copyMetadataFromMaster();
        }

        if (SpiceConfig::getInstance()->get('multitenancy.copy_module_data')) {
            $this->copyModulesDataFromMaster();
        }

        # initialize fts if we already have some modules metadata
        if (SpiceConfig::getInstance()->get('multitenancy.copy_metadata')) {
            $ftsManager = new SpiceFTSRESTManager();
            SpiceFTSHandler::getInstance()->elasticHandler->indexPrefix = "{$config['fts']['prefix']}{$this->id}_";
            $ftsManager->initialize();
        }

        $this->createTenantAdminUser($db, $adminUser);

        $db->transactionCommit();

        self::switchToMaster();

        self::addUserTOTenantMappingTable("$adminUser->user_name.$this->tenant_domain", $this->id, $this->tenant_domain);

        SpiceConfig::getInstance()->set('cache', 'file_location', 'cache' . DIRECTORY_SEPARATOR . $this->id);

        $tenantCacheDir = SpiceCacheFile::getCacheDirectory() . DIRECTORY_SEPARATOR . $this->id;
        mkdir($tenantCacheDir, 0775, true);

        $this->initialized = true;
        $this->save();

        return true;
    }

    /**
     * copy metadata tables from master to tenant db
     * @throws Exception
     */
    private function copyMetadataFromMaster(): void
    {
        $tables = $this->getMetadataCopyTables();
        $this->copyFromMaster($tables);
    }

    /**
     * copy modules tables from master to tenant db
     * @throws Exception
     */
    private function copyModulesDataFromMaster(): void
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
    public function copyFromMaster(array $tables): void
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

    /**
     * determine user tenant by domain and username
     * @param string $username
     * @param $domain
     * @return string|null
     * @throws Exception
     */
    public static function determineUserTenant(string $username, $domain): ?string
    {
        $db = DBManagerFactory::getInstance();
        return (string) $db->getOne("SELECT tenant_id FROM tenant_auth_users WHERE username = '$username' AND tenant_domain = '$domain'", true);
    }

    /**
     * determine tenant by username and domain and switch to tenant
     * this is called at the very beginning of the script execution before authentication
     * @return void
     * @throws Exception
     */
    public static function processTenantSwitch(): void
    {
        $authParams = RESTManager::getInstance()->parseAuthParams();

        if (!empty($authParams->tenantID)) {
            self::$currentTenantID = $authParams->tenantID;
            self::switchDB($authParams->tenantID);

        } else if ($authParams->authType == 'credentials') {
            $domain = $_SERVER['HTTP_HOST'];
            $tenantId = self::determineUserTenant($authParams->authData->username, $domain);

            self::$currentTenantID = $tenantId;

            if (!empty($tenantId)) {
                self::switchDB($tenantId);
            }
        }
    }

    /**
     * add user to tenant mapping table
     * @param string $username
     * @param string $tenantID
     * @param string $domain
     * @return void
     * @throws Exception
     */
    public static function addUserTOTenantMappingTable(string $username, string $tenantID, string $domain): void
    {
        $db = DBManagerFactory::getInstance();
        $db->query("INSERT INTO tenant_auth_users (id, username, tenant_id, tenant_domain) VALUES (UUID(), '$username', '$tenantID', '$domain')", true);
    }

    /**
     * add user to tenant mapping table
     * @param string $username
     * @param string $tenantID
     * @param string $domain
     * @return void
     * @throws Exception
     */
    public static function removeUserTOTenantMappingTable(string $username, string $tenantID, string $domain): void
    {
        $db = DBManagerFactory::getInstance();
        $db->query("DELETE FROM tenant_auth_users WHERE username = '$username' AND tenant_id = '$tenantID' AND tenant_domain = '$domain'", true);
    }

    /**
     * tenant admin is the same as the admin (1) username followed by period and the tenant_domain
     * e.g. admin.crm.spicecrm.cloud
     * @param DBManager $db
     * @param User $masterAdmin
     * @return void
     */
    private function createTenantAdminUser(DBManager $db, User $masterAdmin): void
    {
        $date = date("Y-m-d h:i:s");
        $username = "$masterAdmin->user_name.$this->tenant_domain";

        $query = "INSERT INTO users (id, user_name, user_hash, last_name, user_email, is_admin, date_entered, date_modified, modified_user_id, created_by, title, status, deleted) ";
        $query .= "VALUES ('1', '$username', '$masterAdmin->user_hash', '$masterAdmin->last_name', '$masterAdmin->user_email', 1, '$date','$date', '1', '1', 'Administrator', 'Active', 0)";
        $db->query($query);
        $db->query("INSERT INTO sysuiuserroles (id, user_id, sysuirole_id, defaultrole) VALUES (" . $db->getGuidSQL() . ", '1', '3687463f-8ed3-49df-af07-1fa2638505db', 1)");

    }
}
