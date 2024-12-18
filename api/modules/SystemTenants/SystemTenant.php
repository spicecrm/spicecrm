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
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryIndexes;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceInstaller\SpiceInstaller;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\utils\SpiceUtils;
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
        SpiceFTSHandler::getInstance()->commitTransaction();

        DBManagerFactory::disconnectAll();
        DBManagerFactory::changeDBName($dbName);
        SpiceCache::reinitialize();
        SpiceConfig::getInstance()->reloadConfig(true);

        SpiceModules::getInstance()->loadModules();
        BeanFactory::clearLoadedBeans();

        DBManagerFactory::getInstance()->transactionStart();
        SpiceFTSHandler::getInstance()->startTransaction();
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

        SpiceConfig::getInstance()->installing = false;

        $this->copyConfig($db, $masterConfig, ['fts', 'default_preferences', 'system', 'core', 'multitenancy']);

        $tenantAdmin = $this->createTenantAdminUser($db, $sendCredentials);

        # switch back to the master system and continue processing
        self::switchToMaster();

        self::addUserTOTenantMappingTable($tenantAdmin->user_name, $this->id, "$this->tenant_domain.{$_SERVER['HTTP_HOST']}");

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
     * copy config values from the master config to the tenant config table
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

        SpiceConfig::getInstance()->reloadConfig(true);
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

        $authParams = RESTManager::getInstance()->getAuthParams();

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
        $tenant->tenant_domain = explode('.', $domain)[0];
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
     * get confirm url used in email templates
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
        if (!EmailAddress::isValidEmailAddress($data->emailAddress)) {
            return (object) [
                'valid' => false, 'status_rejected_reason' => 'Invalid email address'
            ];
        }

        $domain = explode('@', $data->emailAddress)[1];

        if (BeanFactory::newBean('SystemTenants')->retrieve_by_string_fields(['tenant_domain' => explode('.', $domain)[0]])) {
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
        $id = SpiceUtils::createGuid();
        $db->query("INSERT INTO tenant_auth_users (id, username, tenant_id, tenant_domain) VALUES ('$id', '$username', '$tenantID', '$domain')", true);
    }

    /**
     * add user to tenant mapping table
     * @param string $username
     * @param string $tenantID
     * @param string $domain
     * @return void
     * @throws Exception
     */
    public static function removeUserFromTenantMappingTable(string $username, string $tenantID, string $domain): void
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
            'user_name' => "admin",
            'password' => !$sendCredentials ? 'admin' : BeanFactory::newBean('Users')->generatePassword()
        ];

        $user2FAMethod = $sendCredentials ? (empty(SpiceCRM2FAUtils::get2FAConfig()->sms_mailbox_id) ? 'email' : 'sms') : '';

        $user = BeanFactory::newBean('Users');
        $user->user_name = $admin->user_name;
        $user->user_hash = User::getPasswordHash($admin->password);
        $user->last_name = $this->contact_last_name;
        $user->user_email = $this->contact_email_address;
        $user->phone_mobile = $this->contact_phone_mobile;
        $user->title = 'Administrator';
        $user->status = 'Active';
        $user->user_2fa_method = $user2FAMethod;
        $user->system_generated_password = 1;
        $user->is_admin = 1;
        $user->processed = true;
        $user->save();

        # assign the admin role to the user
        $systemRoleId = $db->getOne("SELECT id FROM sysuiroles WHERE systemdefault = 1 OR name = 'admin'");
        $db->query("INSERT INTO sysuiuserroles (id, user_id, sysuirole_id, defaultrole) VALUES (" . $db->getGuidSQL() . ", '1', '$systemRoleId', 1)");

        return $admin;
    }
}
