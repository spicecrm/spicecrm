<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\SpiceInstaller;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\Relationships\SugarRelationshipFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceFileUtils;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Relationships\Relationship;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\Users\User;
use SpiceCRM\modules\SystemDeploymentPackages\SystemDeploymentPackageSource;
use SpiceCRM\modules\Administration\api\controllers\AdminController;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguageLoader;
use SpiceCRM\includes\SpiceUI\SpiceUIConfLoader;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryVardefs;

require_once('modules/TableDictionary.php');


/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
class SpiceInstaller
{

    public function __construct()
    {
        // init curl object
        $this->curl = curl_init();
        // init database object
        $this->dbManagerFactory = new DBManagerFactory();

        // set installing global to avoid crashing sugarbean hook logic on install, see include/utils/LogicHook.php
        SpiceConfig::getInstance()->installing = true;
    }


    /**
     * performs a curl call and returns a decoded response
     * @param $curl
     * @param $url
     * @param bool $ssl
     * @return mixed
     */
    private function curlCall($curl, $url, $ssl = false, $username = null, $password = null)
    {
        curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        // turn off ssl check
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, $ssl);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, $ssl);
        curl_setopt($curl, CURLOPT_ENCODING, "UTF-8");


        if($username && $password) {
            curl_setopt($curl, CURLOPT_USERPWD, "{$username}:{$password}");
        }

        $response = curl_exec($curl);
        if (empty($response)) {
            $response = curl_error($curl);
        }
        return json_decode($response);
    }

    /**
     * check system requirements, writes config.php file and delivers array with boolean value for each requirement
     * @return array
     */

    public function checkSystem()
    {
        $requirements = [];
        // check php version
        if (version_compare(phpversion(), '7.4', '<')) {
            $requirements['php'] = false;
        } else {
            $requirements['php'] = true;
        }

        // check PCRE version
        if (version_compare(PCRE_VERSION, '7.0') < 0) {
            $requirements['pcre'] = false;
        } else {
            $requirements['pcre'] = true;
        }

        // check gd
        if (!extension_loaded('gd') && !extension_loaded('gd2')) {
            $requirements['gd'] = false;
        } else {
            $requirements['gd'] = true;
        }

        // check curl
        if (!function_exists('curl_version')) {
            $requirements['curl'] = false;
        } else {
            $requirements['curl'] = true;
        }
        // check xml parser
        if (!function_exists('xml_parser_create')) {
            $requirements['xml_parser'] = false;
        } else {
            $requirements['xml_parser'] = true;
        }
        //check mbstrings enabled in php.ini
        if (!function_exists('mb_strlen')) {
            $requirements['mbstrings'] = false;
        } else {
            $requirements['mbstrings'] = true;
        }
        //check zip
        if (!class_exists('ZipArchive')) {
            $requirements['zip'] = false;
        } else {
            $requirements['zip'] = true;
        }

        //check mailparse
        if (!function_exists('mailparse_msg_parse_file')) {
            $requirements['mailparse'] = false;
        } else {
            $requirements['mailparse'] = true;
        }

        // db check
        $drivers = $this->dbManagerFactory::getDbDrivers();

        if (empty($drivers)) {
            $requirements['db'] = false;
        } else {
            $requirements['db'] = true;
            foreach ($drivers as $ext => $obj) {
                $extensions [] = ['extension' => $ext, 'name' => $obj->variant];
            }
            $requirements['dbdrivers'] = $extensions;
        }

        // check if module directory exists and is writable
        if (!is_dir('./modules') && !is_writable('./modules')) {
            $requirements['modules_dir'] = false;
        } else {
            $requirements['modules_dir'] = true;
        }

        // create the cache directory if it does not exist
        if (!file_exists('./cache')) {
            mkdir('./cache', 0775, true);
        }
        // check if cache directory exists and is writable
        if (!is_dir('./cache') && !is_writable('./cache')) {
            $requirements['cache_dir'] = false;
        } else {
            $requirements['cache_dir'] = true;
        }

        // create the custom directory if it does not exist
        if (!file_exists('./custom')) {
            mkdir('./custom', 0775, true);
        }
        // check if custom directory exists and is writable
        if (!is_dir('./custom') && !is_writable('./custom')) {
            $requirements['custom_dir'] = false;
        } else {
            $requirements['custom_dir'] = true;
        }

        // create the media directory if it does not exist
        if (!file_exists('./media')) {
            mkdir('./media', 0777, true);
        }
        // check if media directory exists and is writable
        if (!is_dir('./media') && !is_writable('./media')) {
            $requirements['media_files_dir'] = false;
        } else {
            $requirements['media_files_dir'] = true;
        }

        // create the upload directory if it does not exist
        if (!file_exists('./upload')) {
            mkdir('./upload', 0777, true);
        }
        // check if upload directory exists and is writable
        if (!is_dir('./upload') && !is_writable('./upload')) {
            $requirements['upload_dir'] = false;
        } else {
            $requirements['upload_dir'] = true;
        }

        // check that we have true for all the requirements
        if (in_array(false, $requirements)) {
            $outcome = false;
        } else {
            $outcome = true;
        }

        return [
            'success' => $outcome,
            "requirements" => $requirements];
    }

    /**
     * gets database credentials and info  from request body, verifies database name and makes a test connection
     * @param $body
     * @return array
     */

    public function checkDatabase($body)
    {

        $errors = [];
        $postData = $body->getParsedBody();

        $db = $this->dbManagerFactory::getTypeInstance($postData['db_type'], ['dbconfig' => ['db_manager' => $postData['db_manager']]]);
        // credentials to connect to the database
        $dbconfig = ['db_host_name' => $postData['db_host_name'],
            'db_host_instance' => $postData['db_host_instance'],
            'db_port' => $postData['db_port'],
            'db_user_name' => $postData['db_user_name'],
            'db_password' => $postData['db_password'],
            'db_manager' => $postData['db_manager'],
            'db_type' => $postData['db_type'],];

        if (!$db->isDatabaseNameValid($postData['db_name'])) {
            $errors[] = 'invalid database name';
        }

        if ($dbconfig['db_type'] == 'oci8') {
            $dbconfig['db_schema'] = $postData['db_schema'];
            $dbconfig['db_name'] = $postData['db_name'];
        }

        if (!$db->connect($dbconfig, false)) {
            $errors[] = $db->lastDbError();
        } else {
            $db->disconnect();

            // check privileges
            $db->connect($dbconfig, false);
            $dbconfig['db_name'] = $postData['db_name'];
            $dbname = $dbconfig['db_name'];
            if (!$db->dbExists($dbname)) {
                switch ($db->dbType) {
                    case 'pgsql':
                        $db->createDatabase($dbname, $postData['lc_collate'], $postData['lc_ctype']);
                        break;
                    default:
                        $db->createDatabase($dbname);
                }
            }
            //check if this database is empty
            switch ($db->dbType) {
                case 'pgsql':
                    $dbquery = "SELECT * FROM " . $dbname . ".information_schema.tables WHERE table_schema = 'public'";
                    break;
                case 'oci8':
                    $dbquery = 'SELECT Count(*) FROM DBA_TABLES';
                    break;
                default:
                    $dbquery = "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = '$dbname'";
            }

            $res = $db->query($dbquery);
            while ($row = $db->fetchByAssoc($res)) {
                if ($row['count'] > 0) {
                    $errors[] = "database is not empty";
                } else {
                    $db->dropDatabase($dbconfig['db_name']);
                }

            }
        }
        if (!empty($errors)) {
            $outcome = false;
        } else {
            $outcome = true;

        }

        return ["success" => $outcome,
            "config" => $dbconfig,
            "errors" => $errors];
    }

    /**
     * gets fts credentials from the request body, connects to the server and checks the elastic search version
     * @param $body
     * @return array
     */

    public function checkFTS($body)
    {
        $errors = [];
        $postData = $body->getParsedBody();

        $protocol = $postData['https'] ? 'https' : 'http';

        $url = $protocol . "://" . $postData['server'] . ":" . $postData['port'] . "/";

        $response = $this->curlCall($this->curl, $url, $postData['sslverify'], $postData['username'], $postData['password']);

        if (!empty($response)) {
            if (version_compare($response->version->number, '7.5', '<') ) {
                $errors = ['version not supported'];
            } else {
                $ftsconfig = ['https' => $postData['https'], 'username' => $postData['username'], 'password' => $postData['password'], 'protocol' => $protocol, 'server' => $postData['server'], 'port' => $postData['port'], 'prefix' => $postData['prefix']];
            }
        } else {
            $errors = ['invalid url', $response];
        }

        if (!empty($errors)) {
            $outcome = false;
        } else {
            $outcome = true;
        }

        return ["success" => $outcome,
            "config" => $ftsconfig,
            "errors" => $errors];
    }

    /**
     * checks if a connection with the reference server is possible
     * @return array
     */
    public function checkReference()
    {
        $errors = [];
        $url = SystemDeploymentPackageSource::getPublicSource() . 'config';

        $response = $this->curlCall($this->curl, $url);

        if (!empty($response)) {
            $outcome = true;
        } else {
            $outcome = false;
            $errors = ['cannot connect to reference database'];
        }

        return ["success" => $outcome,
            "errors" => $errors];
    }

    /**
     * curl call to get the available languages
     * @return mixed
     */
    public function getLanguages()
    {
        $url = SystemDeploymentPackageSource::getPublicSource() . 'config';
        $response = $this->curlCall($this->curl, $url);
        return $response;
    }

    /**
     * @deprecated
     * @param $postData
     * @return void
     */
    private function generateSugarConfig($postData){
        return $this->generateSpiceConfig($postData);
    }

    /**
     * @param $postData
     * @return array
     */
    private function generateSpiceConfig($postData)
    {
        return [
            'dbconfig' => $postData['database'],
            'dbconfigoption' => $postData['dboptions'],
            'fts' => $postData['fts'],
            'site_url' => $postData['backendconfig']['backendUrl'],
            'developerMode' => false,
            'cache_dir' => 'cache/',
            'session_dir' => '',
            'tmp_dir' => 'cache/xml/',
            'media_files_dir' => 'media/',
            'upload_dir' => 'upload/',
            'upload_maxsize' => 30000000,
            'import_max_records_per_file' => 500,
            'unique_key' => md5(SpiceUtils::createGuid()),
            'verify_client_ip' => false,
            'krest' => [
                'error_reporting' => 22517,
                'display_errors' => 0,
            ],
            'logger' => [
                'level' => 'fatal,error',
                'file' => [
                    'ext' => 'log',
                    'name' => 'spicecrm',
                    'dateFormat' => '%c',
                    'maxSize' => '10MB',
                    'maxLogs' => 10,
                    'suffix' => '',
                ]
            ],
            'frontend_url' => $postData['backendconfig']['frontendUrl']
        ];
    }


    /**
     * writes the contents of config.php, creates the config override and returns the sugarconfig array
     * @param $postData
     * @return boolean
     */
    private function writeConfig($spice_config)
    {
        SpiceFileUtils::spiceFilePutContents('config.php', '<?php' . PHP_EOL . ' // created: ' . date("Y-m-d h:i:s") . PHP_EOL . '$spice_config=');
        SpiceFileUtils::spiceWriteArrayToFile("spice_config", $spice_config, 'config.php');
        return true;
    }

    /**
     * creates the database with the contents of post request body, creates and additional user if provided, and returns the database instance
     * @param $postData
     * @return object
     */
    private function createDatabase($postData)
    {
        $dbconfig = ['db_host_name' => $postData['database']['db_host_name'],
            'db_host_instance' => $postData['database']['db_host_instance'],
            'db_port' => $postData['database']['db_port'],
            'db_user_name' => $postData['database']['db_user_name'],
            'db_password' => $postData['database']['db_password'],
            'db_manager' => $postData['database']['db_manager'],
            'db_type' => $postData['database']['db_type'],];

        $db = $this->dbManagerFactory::getTypeInstance($postData['database']['db_type'], ['dbconfig' => ['db_manager' => $postData['database']['db_manager']]]);
        $db->setOptions($postData['dboptions']);
        if ($dbconfig['db_type'] == 'oci8') {
            $dbconfig['db_schema'] = $postData['database']['db_schema'];
            $dbconfig['db_name'] = $postData['database']['db_name'];
        }
        $db->connect($dbconfig, true);


        $dbconfig['db_name'] = $postData['database']['db_name'];

        if (!$db->dbExists($dbconfig['db_name'])) {
            if ($postData['dboptions']['collation'] == 'utf8mb4_general_ci') {
                $db->query("CREATE DATABASE " . $dbconfig['db_name'] . " CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci", true);
            } else {
                $db->createDatabase($dbconfig['db_name']);
            }

        }

        $this->dbManagerFactory::setDBConfigInstaller(['dbconfig' => $dbconfig, 'dbconfigoption'  => $postData['dboptions']]);

        $db = $this->dbManagerFactory->getInstance();

        if (!empty($db) && isset($postData['databaseuser']) && in_array('db_user_name', $postData['databaseuser'])) {
            $db->createDBuser($dbconfig['db_name'], $dbconfig['db_host_name'], $postData['databaseuser']['db_user_name'], $postData['databaseuser']['db_password']);
        }
        return $db;
    }

    /**
     * creates the tables from the dictionary, as well as the audit tables and relationship tables, writes the relationship cache
     * @param $db
     */
    public function createTables($db)
    {
        $globalBeanList = [];
        // workaround load metadata definitions (tables like sysmodules ... will be needed for retrieveSysModules)
        // load them now!
        SpiceDictionaryHandler::loadMetaDataFiles();
        $rel_dictionary = SpiceDictionaryHandler::getInstance()->dictionary;

// will break installation under php8.1 and is unnecessary
//        $vardef = new VardefManager();
//        $vardef->clearVardef();

        // workaround create table from metadata definitions now
        foreach ($rel_dictionary as $rel_name => $rel_data) {
            $table = $rel_data['table'];

            if (!$db->tableExists($table)) {
                $query = $db->createTableSQLParams($table, $rel_data['fields'], $rel_data['indices']);
                $db->query($query);
            }
        }

        // retrieve available modules from reference
        $sysModules = $this->retrieveSysModules();

        if (!empty($sysModules)) {
            foreach ($sysModules['sysmodules'] as $sysModuleId => $moduleConf) {
                $base64conf = base64_decode($moduleConf);
                if ($decodedConf = json_decode($base64conf, true)) {
                    if (!empty($decodedConf['bean'])) {
                        $globalBeanList[$decodedConf['module']] = $decodedConf['bean'];
                        //todo temporary bugfix, find correct solution?
                        SpiceModules::getInstance()->setBeanClass(
                            $decodedConf['module'],
                            '\\SpiceCRM\\modules\\' . $decodedConf['module'] . '\\' . $decodedConf['bean']
                        );
                    }
                }
            }
        }

        // relationship workaround: relationship has to be the first table to be  created before module tables
        require_once('modules/Relationships/vardefs.php');
        $table   = SpiceDictionaryHandler::getInstance()->dictionary['Relationship']['table'];
        $fields  = SpiceDictionaryHandler::getInstance()->dictionary['Relationship']['fields'];
        $indices = SpiceDictionaryHandler::getInstance()->dictionary['Relationship']['indices'];

        if (!empty($table)) {
            if (!$db->tableExists($table)) {
                $query = $db->createTableSQLParams($table, $fields, $indices);
                $db->query($query);
            }
        }
        ksort($globalBeanList);

        foreach ($globalBeanList as $dir => $bean) {
            // in core edition some modules might be missing
            // ignore them when it encountered
            if (file_exists('modules/' . $dir . '/vardefs.php')) {
                require_once('modules/' . $dir . '/vardefs.php');
            } else {
                continue;
            }

            if (SpiceDictionaryHandler::getInstance()->dictionary[$bean]['table'] == 'does_not_exist') {
                continue;
            }
            $table   = SpiceDictionaryHandler::getInstance()->dictionary[$bean]['table'];
            $fields  = SpiceDictionaryHandler::getInstance()->dictionary[$bean]['fields'];
            $indices = SpiceDictionaryHandler::getInstance()->dictionary[$bean]['indices'];

            if (!empty($table)) {
                if (!$db->tableExists($table)) {
                    $query = $db->createTableSQLParams($table, $fields, $indices);
                    $db->query($query);
                }
            }

            // creates audit table if object is audited
            if (SpiceDictionaryHandler::getInstance()->dictionary[$bean]['audited']) {
                require('metadata/audit_templateMetaData.php');
                $audit   = SpiceDictionaryHandler::getInstance()->dictionary[$bean]['table'] . '_audit';
                $fields  = SpiceDictionaryHandler::getInstance()->dictionary['audit']['fields'];
                $indices = SpiceDictionaryHandler::getInstance()->dictionary['audit']['indices'];

                foreach ($indices as $nr => $properties) {
                    $indices[$nr]['name'] = 'idx_' . strtolower($audit) . '_' . $properties['name'];
                }

                if (!$db->tableExists($audit)) {
                    $query = $db->createTableSQLParams($audit, $fields, $indices);
                    $db->query($query);
                }

            }
            SpiceBean::createRelationshipMeta(
                $bean,
                $db,
                SpiceDictionaryHandler::getInstance()->dictionary[$bean]['table'],
                '',
                $dir
            );
        }
        SpiceModules::getInstance()->setBeanList($globalBeanList);

        ksort($rel_dictionary);
        foreach ($rel_dictionary as $rel_name => $rel_data) {
            $table = $rel_data['table'];

            if (!$db->tableExists($table)) {
                $query = $db->createTableSQLParams($table, $rel_data['fields'], $rel_data['indices']);
                $db->query($query);
            }

            SpiceBean::createRelationshipMeta($rel_name, $db, $table, $rel_dictionary, '');
        }


        // repair relationships
        Relationship::build_relationship_cache();

    }

    /**
     * inserts defaults into the config table
     * @param $db
     */
    public function insertDefaults($db, $postData = null )
    {
        $db->query("INSERT INTO config (category, name, value) VALUES ('notify', 'fromaddress', 'do_not_reply@example.com')");
        $db->query("INSERT INTO config (category, name, value) VALUES ('notify', 'fromname', 'SpiceCRM')");
        $db->query("INSERT INTO config (category, name, value) VALUES ('notify', 'send_by_default', '1')");
        $db->query("INSERT INTO config (category, name, value) VALUES ('notify', 'send_from_assigning_user', '0')");
        $db->query("INSERT INTO config (category, name, value) VALUES ('tracker', 'Tracker', '1')");

        $db->query("INSERT INTO config (category, name, value) VALUES ( 'system', 'name', '".$db->quote( $postData['systemname'] ?: 'SpiceCRM' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'system', 'version', '".SpiceConfig::getSystemVersion()."')");

        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'timezone', '".$db->quote( $postData['preferences']['timezone'] ?: '' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'datef', '".$db->quote( $postData['preferences']['datef'] ?: '' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'timef', '".$db->quote( $postData['preferences']['timef'] ?: '' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'distance_unit_system', '".$db->quote( $postData['preferences']['distance_unit_system'] ?: '' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'num_grp_sep', '".$db->quote( $postData['preferences']['num_grp_sep'] ?: '' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'dec_sep', '".$db->quote( $postData['preferences']['dec_sep'] ?: '' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'currency_significant_digits', '".$db->quote( $postData['preferences']['currency_significant_digits'] ?: '' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'export_charset', '".$db->quote( $postData['preferences']['export_charset'] ?: '' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'export_delimiter', '".$db->quote( $postData['preferences']['export_delimiter'] ?: '' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'week_day_start', '".$db->quote( $postData['preferences']['week_day_start'] ?: '' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'week_days_count', '".$db->quote( $postData['preferences']['week_days_count'] ?: '' )."')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'locale_name_format', '".$db->quote( $postData['preferences']['locale_name_format'] ?: '' )."')");

        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'currency', '-99')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'reminder_time', '-1')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'calendar_day_end_hour', '18')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'calendar_day_start_hour', '8')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'help_icon', 'visible')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'default_preferences', 'home_assistant', 'visible')");

        $db->query("INSERT INTO config (category, name, value) VALUES ( 'currencies', 'default_currency_iso4217', 'EUR')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'currencies', 'default_currency_name', 'Euro')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'currencies', 'default_currency_significant_digits', 2)");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'currencies', 'default_currency_symbol', '€')");

        $db->query("INSERT INTO config (category, name, value) VALUES ( 'passwordsetting', 'minpwdlength', '6')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'passwordsetting', 'oneupper', '1')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'passwordsetting', 'onelower', '1')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'passwordsetting', 'onenumber', '1')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'passwordsetting', 'onespecial', '0')");
        $db->query("INSERT INTO config (category, name, value) VALUES ( 'passwordsetting', 'pwdvaliditydays', '0')");

    }

    /**
     * creates the current user and assigns the admin role
     * @param $db
     * @param $postData
     */
    public function createCurrentUser($db, $postData)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $user_instance = BeanFactory::getBean('Users');
        $username = $postData['credentials']['username'];
        $surname = $postData['credentials']['surname'];
        $password = $postData['credentials']['password'];
        $user_instance->user_hash = User::getPasswordHash($password);
        $date = date("Y-m-d h:i:s");
        $user = "INSERT INTO users (id, user_name, user_hash, last_name, is_admin, date_entered, date_modified, modified_user_id, created_by, title, status, deleted) 
            VALUES ('1', '$username', '$user_instance->user_hash', '$surname', 1, '$date','$date', '1', '1', 'Administrator', 'Active', 0)";

        $userrole = "INSERT INTO sysuiuserroles (id, user_id, sysuirole_id, defaultrole) VALUES (" . $db->getGuidSQL() . ", '1', '3687463f-8ed3-49df-af07-1fa2638505db', 1)";
        if (!$db->query($user)) {
            $errors[] = $db->lastDbError();
        }
        $db->query($userrole);

        $current_user = $user_instance->retrieve(1);
        $current_user->email1 = $postData['credentials']['email'];
        $current_user->save();
    }

    /**
     * retrieves the core ui config and the languages, sets the default language
     * @param $db
     * @param $postData
     */

    public function retrieveCoreAndLanguages( $db, $language )
    {
        $confLoader = new SpiceUIConfLoader();
        // load some packages to enable a good start
        $loadPackages = ['core', 'aclessentials', 'ftsreference', 'schedulerjobs'];
        foreach ($loadPackages as $loadPackage) {
            $confLoader->loadPackage($loadPackage);
        }

        $languageLoader = new SpiceLanguageLoader();
        $languageLoader->loadLanguage( $language );
        if ( $language != 'en_us') {
            $languageLoader->loadLanguage('en_us');
        }
        $db->query("UPDATE syslangs SET is_default = 1 WHERE language_code = '".$db->quote( $language )."'");
    }

    private function retrieveSysModules()
    {
        $confLoader = new SpiceUIConfLoader();
        return $confLoader->loadPackageForInstall('core');
    }

    /**
     * install the backend with the posted settings
     * @param $body
     * @return array
     */
    public function install($body)
    {
        set_time_limit(30000);

        $errors = [];
        $postData = $body->getParsedBody();

        //generate a new spice_config
        $spice_config = $this->generateSpiceConfig($postData);

        //assign to global instance
        SpiceConfig::getInstance()->config = $spice_config;

        // set to installing
        SpiceConfig::getInstance()->installing = true;

        $db = $this->createDatabase($postData);

        $repair = new AdminController();

        if (!empty($db)) {
            $this->createTables($db);
            $this->insertDefaults( $db, $postData );
            $this->createCurrentUser($db, $postData);
            $this->retrieveCoreandLanguages( $db, $postData['language'] );
            $repair->repairAndRebuildforInstaller();
        } else {
            $errors[] = "empty database instance";
        }

        if (!empty($errors)) {
            $outcome = false;
        } else {
            $outcome = true;
        }

        // now we switch to database cache
        $spice_config['systemvardefs'] = ['dictionary' => true, 'domains' => true];

        //write the config.php ... all should be good here
        $this->writeConfig($spice_config);
        SpiceConfig::getInstance();

        // now move cache to database
        SpiceDictionaryVardefs::getInstance()->repairDictionaries();

        // remove legacy cache/modules folder
        if(file_exists('api/cache/modules')){
            rmdir('api/cache/modules');
        }

        return [
            "success" => $outcome,
            "errors" => $errors];
    }
}




