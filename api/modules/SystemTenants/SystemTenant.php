<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SystemTenants;


use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRM2FAUtils;
use SpiceCRM\includes\database\DBManager;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryIndexes;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceInstaller\SpiceInstaller;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\modules\EmailAddresses\EmailAddress;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\EmailTemplates\EmailTemplate;
use SpiceCRM\modules\Users\User;

class SystemTenant extends SpiceBean
{
    /**
     * system tenant status: created, requested, pending, rejected, provisioned
     * @var string
     */
    public string $systemtenant_status;

    /**
     * holds the passed tenant id in the incoming api request header
     * @var string|null
     */
    public static ?string $currentTenantID = null;
    /**
     * temporary hold the generated admin password to be used in the template
     * @var string
     */
    public string $adminPassword = 'admin';
    /**
     * temporary hold the generated admin username to be used in the template
     * @var string
     */
    public string $adminUsername = 'admin';

    /**
     * @return bool if multitenancy is enabled for the system
     */
    public static function multitenancyEnabled(): bool
    {
        return SpiceConfig::getInstance()->get('multitenancy.enabled') == 1;
    }

    /**
     * @return bool if the system is using the tenant database
     */
    public static function isInTenantSystem(): bool
    {
        return self::multitenancyEnabled() && !empty(self::$currentTenantID);
    }

    /**
     * append the system tenant id to the fts filter
     * @param array $queryParam
     * @return void
     */
    public static function addFTSFilter(array &$queryParam): void
    {
        if (!self::multitenancyEnabled()) return;

        # if in the master system tenant id must be empty
        if (!SystemTenant::isInTenantSystem()) {
            $queryParam['query']['bool']['filter']['bool']['must']  = [
                [
                    'bool' => [
                        'must' => [
                            [
                                'bool' => [
                                    'must_not' => [
                                        [
                                            'exists' => [
                                                'field' => '_systemtenant_id'
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ];
        } else {
            # in the tenant system add the check for the tenant id match
            $queryParam['query']['bool']['filter']['bool']['must']  = [
                [
                    'bool' => [
                        'must' => [
                            [
                                'term' => [
                                    '_systemtenant_id' => SystemTenant::$currentTenantID
                                ]
                            ]

                        ]
                    ]
                ]
            ];
        }
    }

    /**
     * switches to the tenant
     * @throws Exception
     */
    public static function switchToTenant(string $id): void
    {
        if (empty($id)) return;

        self::$currentTenantID = $id;

        if (empty(SpiceFTSHandler::getInstance()->modules)) {
            SpiceFTSHandler::getInstance()->loadModules();
        }

        self::switchDB($id);
    }

    /**
     * switches to master db
     * @throws Exception
     */
    public static function switchToMaster(): void
    {
        self::$currentTenantID = null;
        $masterDBName = SpiceConfig::getInstance()->config['dbconfig']['db_name'];
        self::switchDB($masterDBName);
        SpiceDictionary::getInstance()->loadDictionary();
    }

    /**
     * switch between master and tenant db
     * @param string $dbName
     * @return void
     * @throws Exception
     */
    public static function switchDB(string $dbName): void
    {
        DBManagerFactory::getInstance()->transactionCommit();

        DBManagerFactory::disconnectAll();
        DBManagerFactory::changeDBName($dbName);
        SpiceCache::reinitialize();
        SpiceConfig::getInstance()->reloadConfig(true);

        SpiceModules::getInstance()->loadModules();
        BeanFactory::clearLoadedBeans();

        DBManagerFactory::getInstance()->transactionStart();
        // unset the fts settings
        unset($_SESSION['SpiceFTS']);
    }

    /**
     * initializes a new tenant, sets up the database and builds all required tables
     * @throws Exception
     */
    public function initializeTenant(bool $sendCredentials = false, bool $confirmed = false): bool
    {
        if ((!$confirmed && !AuthenticationController::getInstance()->isAdmin()) || in_array($this->systemtenant_status, ['provisioned', 'rejected'])) {
            return false;
        }

        if (empty(SpiceCRM2FAUtils::get2FAConfig()->sms_mailbox_id) && empty(SpiceCRM2FAUtils::get2FAConfig()->email_mailbox_id)) {
            throw new BadRequestException("Misconfiguration sms or email mailbox is not defined");
        }

        $masterConfig = SpiceConfig::getInstance()->config;

        DBManagerFactory::getInstance()->createDatabase($this->id);

        // switch to tenant database
        self::switchToTenant($this->id);

        $db = DBManagerFactory::getInstance();

        SpiceDictionaryIndexes::getInstance()->reloadItems();

        (new SpiceInstaller())->initializeSystem($db, 'en_us');

        $this->copyDataToTenant($db, $masterConfig);

        $tenantAdmin = $this->createTenantAdminUser($db, $sendCredentials);

        SpiceConfig::getInstance()->installing = false;

        # switch back to the master system and continue processing
        self::switchToMaster();

        self::addUserTOTenantMappingTable($tenantAdmin->user_name, $this->id, $this->tenant_domain);

        $this->systemtenant_status = 'provisioned';

        if ($sendCredentials) {
            $this->sendCredentialsToAdmin($tenantAdmin);
        }

        $this->save();

        return true;
    }

    /**
     * get admin system username used for template
     * @return string
     */
    public function getAdminSystemUsername(): string
    {
        return $this->adminUsername;
    }

    /**
     * get admin system password used for template
     * @return string
     */
    public function getAdminSystemPassword(): string
    {
        return $this->adminPassword;
    }

    /**
     * copy config metadata and module data to the tenant database
     * @param DBManager $db
     * @param array $config
     * @return void
     * @throws Exception
     */
    private function copyDataToTenant(DBManager $db, array $config): void
    {
        $this->copyConfig($db, $config, ['fts', 'default_preferences', 'system', 'core', 'multitenancy']);

        if (SpiceConfig::getInstance()->get('multitenancy.copy_metadata')) {
            $this->copyMetadataFromMaster();
        }

        if (SpiceConfig::getInstance()->get('multitenancy.copy_module_data')) {
            $this->copyModulesDataFromMaster();
        }
    }

    /**
     * send credentials to the admin user
     * @param object $admin
     * @return void
     * @throws Exception
     */
    public function sendCredentialsToAdmin(object $admin): void
    {
        $templateId = SpiceConfig::getInstance()->get('multitenancy.credentials_template_id');
        $this->adminPassword = $admin->password;
        $this->adminUsername = $admin->user_name;
        $this->sendEmail($templateId);
    }

    /**
     * send email to the
     * @param string $templateId
     * @return bool
     */
    public function sendEmail(string $templateId): bool
    {
        /** @var Email $email */
        $email = BeanFactory::getBean('Emails');

        /** @var EmailTemplate $template */
        $template = BeanFactory::getBean('EmailTemplates', $templateId);
        $content = $template->parse($this);
        $email->name = $content['subject'];
        $email->body = $content['body_html'];

        $email->addEmailAddress('to', $this->contact_email_address);

        try {
            $result = $email->sendEmail();

        } catch (Exception $e) {
            $result = ['result' => false];
        }

        return $result['result'];
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
     * @param DBManager $db
     * @param array $config
     * @param array $categories
     */
    private function copyConfig(DBManager $db, array $config, array $categories): void
    {
        foreach ($categories as $category) {
            foreach ($config[$category] as $name => $value) {
                $db->query("INSERT INTO config (category, name, value) VALUES ('$category', '$name', '$value')");
            }
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
        if (!self::multitenancyEnabled()) {
            return;
        }

        $authParams = RESTManager::getInstance()->parseAuthParams();

        if (!empty($authParams->tenantID)) {
            self::switchToTenant($authParams->tenantID);

        } else if ($authParams->authType == 'credentials') {
            self::processTenantSwitchByUsername($authParams->authData->username);
        }
    }

    /**
     * process tenant switch by the passed username
     * @param string $username
     * @return void
     * @throws Exception
     */
    public static function processTenantSwitchByUsername(string $username): void
    {
        $domain = $_SERVER['HTTP_HOST'];
        $tenantId = self::determineUserTenant($username, $domain);
        self::switchToTenant($tenantId);
    }

    /**
     * create a new tenant from inquiry data
     * @param object $data
     * @return bool
     * @throws BadRequestException | Exception
     */
    public static function createTenantFromInquiry(object $data): bool
    {
        /** @var SystemTenant $tenant */
        $tenant = BeanFactory::newBean('SystemTenants');
        $validStatus = $tenant->validateInquiryData($data);
        $domain = explode('@', $data->emailAddress)[1];
        $tenant->name = $domain;
        $tenant->systemtenant_status = 'requested';
        $tenant->tenant_domain = $domain;
        $tenant->contact_email_address = $data->emailAddress;
        $tenant->contact_phone_mobile = $data->phoneMobile;
        $tenant->contact_first_name = $data->firstName;
        $tenant->contact_last_name = $data->lastName;

        if (!$validStatus->valid) {
            $tenant->systemtenant_status = 'rejected';
            $tenant->status_rejected_reason = $validStatus->status_rejected_reason;
            $tenant->save();
        } else {
            $tenant->save();
            $tenant->sendConfirmationEmail();
        }


        return $validStatus->valid;
    }

    /**
     * send email address confirmation email to the user
     * @return void
     * @throws Exception
     */
    public function sendConfirmationEmail(): void
    {
        $templateId = SpiceConfig::getInstance()->get('multitenancy.confirmation_template_id');

        $result = $this->sendEmail($templateId);

        if ($result) {
            $this->systemtenant_status = 'pending';
            $this->save();
        }
    }

    /**
     * get confirm url
     * @return string
     */
    public function getConfirmUrl(): string
    {
        return SpiceConfig::getInstance()->config['site_url'] . "/module/SystemTenants/confirm/$this->id";
    }

    /**
     * validate the inquiry data
     * @param object $data
     * @return object
     */
    public function validateInquiryData(object $data): object
    {
        $domain = explode('@', $data->emailAddress)[1];

        if (BeanFactory::newBean('SystemTenants')->retrieve_by_string_fields(['tenant_domain' => $domain])) {
            return (object) [
            'valid' => false, 'status_rejected_reason' => 'Tenant for domain already exists'
            ];
        }

        if (empty($data->lastName)) {
            return (object) [
            'valid' => false, 'status_rejected_reason' => 'Missing last name'
            ];
        }

        if (empty($data->phoneMobile)) {
            return (object)[
                'valid' => false, 'status_rejected_reason' => 'Missing mobile phone'
            ];
        }

        if (empty($data->emailAddress)) {
            return (object)[
                'valid' => false, 'status_rejected_reason' => 'Missing email address'
            ];

        } else if (!EmailAddress::isValidEmailAddress($data->emailAddress)) {
            return (object)[
                'valid' => false, 'status_rejected_reason' => 'Invalid email address'
            ];
        } else {
            # validate the domain that it is probably a business domain
            $generalDomains = ['gmail.com', 'yahoo.', 'hotmail.', 'aol.', 'msn.', 'live.'];

            foreach ($generalDomains as $generalDomain) {
                if (!str_contains($domain, $generalDomain)) continue;
                return (object)[
                    'valid' => false, 'status_rejected_reason' => 'Invalid email address. Only business domains allowed.'
                ];
            }
        }

        return (object) ['valid' => true];
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
     * create and insert the admin user for the tenant
     * @param DBManager $db
     * @param bool $sendCredentials
     * @return object
     */
    private function createTenantAdminUser(DBManager $db, bool $sendCredentials): object
    {
        $admin = (object)[
            'user_name' => "admin" . (empty($this->tenant_domain) ? strtolower($this->name) : ''),
            'password' => !$sendCredentials ? 'admin' : BeanFactory::newBean('Users')->generatePassword()
        ];

        $date = date("Y-m-d h:i:s");
        $user2FAMethod = $sendCredentials ? (empty(SpiceCRM2FAUtils::get2FAConfig()->sms_mailbox_id) ? 'email' : 'sms') : '';
        $admin->user_hash = User::getPasswordHash($admin->password);

        $query = "INSERT INTO users (id, user_name, user_hash, last_name, user_email, is_admin, date_entered, date_modified, modified_user_id, created_by, title, status, deleted, user_2fa_method, system_generated_password, phone_mobile) ";
        $query .= "VALUES ('1', '$admin->user_name', '$admin->user_hash', '$this->contact_last_name', '$this->contact_email_address', 1, '$date','$date', '1', '1', 'Administrator', 'Active', 0, '$user2FAMethod', 1, '$this->contact_phone_mobile')";
        $db->query($query);

        # assign the admin role to the user
        $db->query("INSERT INTO sysuiuserroles (id, user_id, sysuirole_id, defaultrole) VALUES (" . $db->getGuidSQL() . ", '1', '3687463f-8ed3-49df-af07-1fa2638505db', 1)");

        return $admin;
    }
}
