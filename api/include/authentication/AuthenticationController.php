<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication;

use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\GoogleAuthenticate\GoogleAuthenticate;
use SpiceCRM\includes\authentication\interfaces\AccessUtilsI;
use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\authentication\LDAPAuthenticate\LDAPAuthenticate;
use SpiceCRM\includes\authentication\OAuth2Authenticate\OAuth2Authenticate;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAccessUtils;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAuthenticate;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMPasswordUtils;
use SpiceCRM\includes\authentication\TenantAuthenticate\TenantAccessUtils;
use SpiceCRM\includes\authentication\TenantAuthenticate\TenantAuthenticate;
use SpiceCRM\includes\authentication\TenantAuthenticate\TenantPasswordUtils;
use SpiceCRM\includes\authentication\TOTPAuthentication\TOTPAuthentication;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\LogicHook\LogicHook;
use SpiceCRM\includes\RESTManager;
use SpiceCRM\includes\SugarObjects\LanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\modules\SystemTenants\SystemTenant;
use SpiceCRM\modules\UserAccessLogs\UserAccessLog;
use SpiceCRM\modules\Users\User;

class AuthenticationController
{
    /**
     * Stores the User object of the user that is currently logged in.
     * @var User|null
     */
    private $currentUser = null;
    /**
     * instance of this class
     */
    protected static $authControllerInstance = null;

    /**
     * the systemtenant id if we are in a tenant
     *
     * @var null
     */
    public $systemtenantid = null;

    /**
     * the name of the tenant
     *
     * @var null
     */
    public $systemtenantname = null;
    /**
     * holds a boolean of the legal notice acceptance
     *
     * @var bool
     */
    public $systemTenantLegalNoticeAccepted = false;
    /**
     * holds a boolean of the wizard completion
     *
     * @var bool
     */
    public $systemTenantWizardCompleted = false;

    public $errorReason;
    public $errorCode;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    protected function __construct(){}

    /**
     * get a single tone instance
     * @return AuthenticationController
     */
    public static function getInstance(): ?AuthenticationController
    {
        if (empty(self::$authControllerInstance)) {
            self::$authControllerInstance = new static();
        }
        return self::$authControllerInstance;
    }

    /**
     * check if the user can change his password
     * @return bool
     */
    public function getCanChangePassword(): bool
    {
        if (LDAPAuthenticate::isLdapEnabled()) {
            return false;
        }
        if ($this->currentUser && in_array($this->currentUser->external_auth_only, [0, "0"])) {
            return true;
        }
        return false;

    }

    /**
     * Singletons should not be restorable from strings.
     */
    public function __wakeup()
    {
        throw new \Exception("Cannot unserialize a singleton.");
    }

    /**
     * set current user
     * @param User $userBean
     */
    public function setCurrentUser(User $userBean)
    {
        $this->currentUser = $userBean;
    }

    /**
     * get current user
     * @return ?User
     */
    public function getCurrentUser(): ?User
    {
        return $this->currentUser;
    }

    /**
     * check if the authentication was successful
     * @return bool
     */
    public function isAuthenticated(): bool
    {
        return $this->currentUser instanceof User;
    }

    /**
     * check if the current user is admin
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->currentUser instanceof User && $this->currentUser->isAdmin();
    }

    /**
     * @throws BadRequestException | Exception | UnauthorizedException
     * @throws \Exception
     */
    public function authenticate()
    {
        $authParams = RESTManager::getInstance()->parseAuthParams();

        if ($authParams->authType == 'none') return;

        try {
            $authenticator = $this->getAuthenticator();

            $authResponse = $authenticator->authenticate($authParams->authData, $authParams->authType);
            $this->handleSuccessfulAuthentication($authParams->authData, $authResponse, $authParams->authType);

            if (method_exists($authenticator, 'afterSuccessfulAuthentication')) {
                $authenticator->afterSuccessfulAuthentication($authParams->authData);
            }

        } catch (UnauthorizedException $e) {
            $this->handleFailedAuthentication($e, $authParams->authData);
        }
    }

    /**
     * get password utils handler
     * @return SpiceCRMPasswordUtils | TenantPasswordUtils
     */
    public function getPasswordUtilsInstance()
    {
        $type = $this->getAuthenticatorType();

        $namespace = "SpiceCRM\includes\authentication\\{$type}Authenticate\\{$type}PasswordUtils";

        if (!class_exists($namespace, true)) {
            $namespace = "SpiceCRM\includes\authentication\\SpiceCRMAuthenticate\\SpiceCRMPasswordUtils";
        }

        return new $namespace();
    }

    /**
     * determine the authenticator type based on the token issuer or the default system authenticator
     * default type is SpiceCRM
     * @return string
     */
    private function getAuthenticatorType(): string
    {
        $type = 'SpiceCRM';

        if (LDAPAuthenticate::isLdapEnabled()) $type = 'LDAP';

        $tokenIssuer = RESTManager::getInstance()->parseAuthParams()->authData->tokenIssuer;

        if (!empty($tokenIssuer)) $type = $tokenIssuer;

        $config = SpiceConfig::getInstance()->config;

        if ($type == 'SpiceCRM' && !empty($config['system']['defaultAuthenticator'])) {
            $type = $config['system']['defaultAuthenticator'];
        }

        return $type;
    }

    /**
     * handle failed authentication
     * @throws BadRequestException | Exception | UnauthorizedException
     * @throws \Exception
     */
    private function handleFailedAuthentication(UnauthorizedException $e, object $authData)
    {
        if ( !$e->isUserBlocked() and !empty( $authData->username )) {
           $this->blockUserByUsername($authData);
        }

        $this->blockUserIp($e);

        $this->errorReason = $e->getMessage();
        $this->errorCode = $e->getErrorCode();

        throw (new UnauthorizedException($e->getMessage(), $e->getErrorCode()))->setDetails($e->getDetails());
    }

    /**
     * block user ip if the max login attempts exceeded
     * @param UnauthorizedException $e
     * @return void
     * @throws BadRequestException | \Exception | Exception
     */
    private function blockUserIp(UnauthorizedException $e) {

        $accessUtils = $this->getAccessUtilsInstance();
        $config = SpiceConfig::getInstance()->config;
        $maxAttemptsExceeded = UserAccessLog::getNumberLoginAttemptsByIp() >= (int)$config['login_attempt_restriction']['ip_number_attempts'];

        if ( $config['login_attempt_restriction']['ip_enabled'] and $maxAttemptsExceeded and !$accessUtils::ipAddressIsWhite() and !$e->isIPblocked()) {
            $accessUtils::addIpAddress('b');
            $e->setIPblocked( true );
        };
    }

    /**
     * block the user if the max login attempts exceeded
     * @param object $authData
     * @return void
     * @throws \Exception
     */
    private function blockUserByUsername(object $authData)
    {
        $config = SpiceConfig::getInstance()->config;
        $accessUtils = $this->getAccessUtilsInstance();

        /** @var UserAccessLog $userAccessLogObj */
        $userAccessLogObj = BeanFactory::getBean('UserAccessLogs');
        $loginName = empty($authData->impersonationUser) ? $authData->username : $authData->impersonationUser . '#as#' . $authData->username;
        $userAccessLogObj->addRecord("loginfail", $loginName);

        unset($userAccessLogObj);

        if (!$config['login_attempt_restriction']['user_enabled']) return;

        $amountFailedLogins = UserAccessLog::getAmountFailedLoginsWithinByUsername($authData->username, $config['login_attempt_restriction']['user_monitored_period']);

        if ($amountFailedLogins >= $config['login_attempt_restriction']['user_number_attempts']) {
            $accessUtils->blockUserByName($authData->username, $config['login_attempt_restriction']['user_blocking_duration']);
        }
    }

    /**
     * get access utils instance
     * @return SpiceCRMAccessUtils | TenantAccessUtils
     * @throws \Exception
     */
    public function getAccessUtilsInstance()
    {
        $type = $this->getAuthenticatorType();

        $namespace = "SpiceCRM\includes\authentication\\{$type}Authenticate\\{$type}AccessUtils";

        if (!class_exists($namespace, true)) {
            $namespace = "SpiceCRM\includes\authentication\\SpiceCRMAuthenticate\\SpiceCRMAccessUtils";
        }

        /** @var SpiceCRMAccessUtils | TenantAccessUtils $accessUtilsInstance */
        $accessUtilsInstance = new $namespace();

        if (!($accessUtilsInstance instanceof AccessUtilsI)) {
            throw new \Exception("Authentication Class {$namespace} must implement AuthenticatorI");
        }

        return $accessUtilsInstance;
    }

    /**
     * handle successful authentication
     * @param object $authData
     * @param AuthResponse $authResponse
     * @param string $authType 'token' | 'credentials'
     * @throws NotFoundException | UnauthorizedException
     */
    private function handleSuccessfulAuthentication(object $authData, AuthResponse $authResponse, string $authType)
    {
        if ($authType == 'credentials') {
            $this->checkUserBlocked($authData);
        }

        if (!empty($authResponse->tenantId)) {
            $this->connectToTenant($authResponse->tenantId);
        }

        $userObj = $this->getUserByUsername($authResponse->username);

        $this->checkUserStatus($userObj);

        $this->checkPasswordExpire($userObj);

        $this->checkTimeBasedOnetimePassword($userObj);

        // retrieve impersonation user
        if (!empty($authData->impersonationUser)) {
            $impersonatingUser = $this->getUserByUsername($authData->impersonationUser);
            $userObj->impersonating_user_id = $impersonatingUser->id;
        }

        $this->setCurrentUser($userObj);

        global $current_language;
        $current_language = $userObj->getPreference('language');

        if (!empty($authResponse->tenantId)) {
            $userObj->reloadPreferences();
        }

        if (LDAPAuthenticate::isLdapEnabled()) {
            $userObj->call_custom_logic('after_ldap_login', $authResponse);
        }

        // if there was no session started create a new one
        if (empty($_SESSION['authenticated_user_id'])) {
            SpiceCRMAuthenticate::createSession($this->currentUser);
        }
    }

    /**
     * check if the user was blocked by login attempts policy or by ip
     * @param object $authData
     * @return void
     * @throws UnauthorizedException | \Exception
     */
    private function checkUserBlocked(object $authData)
    {
        $accessUtils = $this->getAccessUtilsInstance();
        $isBlocked = $accessUtils->isBlocked($authData->impersonationUser ?? $authData->username);

        if ($isBlocked === true) {
            throw (new UnauthorizedException('User is blocked. Contact the admin for access.', 3))->setUserBlocked(true);
        } elseif ($isBlocked !== false) {
            throw (new UnauthorizedException('User is blocked temporary. Access again in ' . $isBlocked . ' Minutes.', 3))->setUserBlocked(true);
        }

        if (!$accessUtils::checkIpAddress() && !User::isAdmin_byName($authData->username)) {
            throw (new UnauthorizedException('No access from this IP address. Contact the admin.', 11))->setIPblocked(true);
        }
    }

    /**
     * throw an exception if the time-based one-time password is required and was not activated
     * @param User $userObj
     * @return void
     * @throws UnauthorizedException
     */
    private function checkTimeBasedOnetimePassword(User $userObj)
    {
        if ( SpiceConfig::getInstance()->config['login_methods']['totp_authentication_required'] and !TOTPAuthentication::checkTOTPActive( $userObj->id )) {
            $necessaryLabels = LanguageManager::getSpecificLabels( SpiceConfig::getInstance()->config['default_language'] ?: 'en_us', [
                'LBL_SAVE', 'LBL_TOTP_AUTHENTICATION', 'MSG_AUTHENTICATOR_INSTRUCTIONS', 'LBL_CODE', 'LBL_CANCEL', 'LBL_CODE'
            ]);
            throw ( new UnauthorizedException('TOTP.', 12 ))->setDetails(['labels' => $necessaryLabels]);
        }
    }

    /**
     * throw an exception if the password expired
     * @param User $userObj
     * @return void
     * @throws UnauthorizedException
     */
    private function checkPasswordExpire(User $userObj)
    {
        if (( $userObj->system_generated_password || $userObj->hasExpiredPassword() ) && !$userObj->is_api_user && !$userObj->external_auth_only) {
            $necessaryLabels = LanguageManager::getSpecificLabels( SpiceConfig::getInstance()->config['default_language'] ?: 'en_us', [
                'LBL_CANCEL','LBL_CHANGE_PASSWORD', 'LBL_NEW_PWD', 'LBL_NEW_PWD_REPEATED', 'LBL_PWD_GUIDELINE', 'LBL_SET_PASSWORD',
                'LBL_ONE_LOWERCASE', 'LBL_ONE_UPPERCASE', 'LBL_ONE_SPECIALCHAR', 'LBL_ONE_DIGIT', 'LBL_MIN_LENGTH', 'MSG_PWD_NOT_LEGAL',
                'MSG_PWDS_DONT_MATCH', 'MSG_PWD_CHANGED_SUCCESSFULLY'
            ]);
            throw ( new UnauthorizedException('Password expired.', 2 ))->setDetails(['labels' => $necessaryLabels]);
        }
    }

    /**
     * get user by username
     * @param string $username
     * @return User
     * @throws UnauthorizedException | NotFoundException
     */
    public function getUserByUsername(string $username): User
    {
        /** @var User $userObj */
        $userObj = BeanFactory::newBean('Users');

        if (!$userObj->findByUserName($username)) {
            throw new UnauthorizedException('User not found', 404);
        }

        return $userObj;
    }

    /**
     * get authenticator class
     * @return SpiceCRMAuthenticate | GoogleAuthenticate | OAuth2Authenticate | TenantAuthenticate
     * @throws \Exception
     */
    public function getAuthenticator()
    {
        $type = $this->getAuthenticatorType();

        return $this->getAuthenticatorObject($type);
    }

    /**
     * get authenticator class instance
     * @param string $type
     * @return SpiceCRMAuthenticate | OAuth2Authenticate | TenantAuthenticate | LDAPAuthenticate | GoogleAuthenticate
     * @throws \Exception
     */
    public static function getAuthenticatorObject(string $type)
    {
        $db = DBManagerFactory::getInstance('master');
        $service = $db->fetchOne("SELECT class_name FROM authentication_services WHERE issuer = '$type'");

        $authenticationClass = "SpiceCRM\includes\authentication\\{$type}Authenticate\\{$type}Authenticate";

        if (!empty($service)) $authenticationClass = $service['class_name'];

        if (class_exists($authenticationClass, true)) {

            /** @var SpiceCRMAuthenticate | OAuth2Authenticate | TenantAuthenticate | LDAPAuthenticate | GoogleAuthenticate $classInstance */
            $classInstance = new $authenticationClass($type);

            if (!($classInstance instanceof AuthenticatorI)) {
                throw new \Exception("Authentication Class {$authenticationClass} must implement AuthenticatorI");
            }

            return $classInstance;
        } else {
            throw new \Exception("Authentication Class {$authenticationClass} not found");
        }
    }

    /**
     * load all the oauth services
     * @return array
     * @throws Exception|\Exception
     */
    public static function loadServices(): array
    {
        $services = [];
        $db = DBManagerFactory::getInstance('master');
        $query = $db->query("SELECT s.*, c.config config FROM authentication_services s INNER JOIN sysauthconfig c ON s.issuer = c.issuer ORDER BY sequence");

        while ($service = $db->fetchByAssoc($query)) {
            if (!empty($service['config'])) {
                $service['config'] = json_decode($service['config']);
                unset($service['config']->client_secret);
                $service['config'] = json_encode($service['config']);
            }
            $services[] = $service;
        }

        return $services;
    }

    /**
     * throw exception if the user is inactive
     * @param User $userObj
     * @throws UnauthorizedException
     */
    private function checkUserStatus(User $userObj)
    {
        switch ($userObj->status) {
            case "Active":
                return;
            case "Inactive":
                throw new UnauthorizedException("User is inactive", 4);
            default:
                throw new UnauthorizedException("User Status is unknown", 5);
        }
    }

    /**
     * connect to the tenant database
     * @param string $tenantId
     * @return void
     * @throws UnauthorizedException
     */
    private function connectToTenant(string $tenantId)
    {
        /** @var SystemTenant $tenant */
        $tenant = BeanFactory::getBean('SystemTenants', $tenantId);

        if ($tenant->valid_until < TimeDate::getInstance()->nowDbDate() && $tenant->valid_until =! null) {
            throw new UnauthorizedException('Tenant expired', 401);
        }

        $tenant->switchToTenant();

        $this->systemtenantid = $tenant->id;
        $this->systemtenantname = $tenant->name;
        $this->systemTenantLegalNoticeAccepted = !empty($tenant->accept_data) && $tenant->accept_data != '{}';
        $this->systemTenantWizardCompleted = boolval($tenant->wizard_completed);
    }

    /**
     * return an array with basic current user data
     * @return array
     * @throws UnauthorizedException
     */
    public function getLoginData(): array
    {
        $authenticationController = AuthenticationController::getInstance();
        if ($authenticationController->getCurrentUser() === null) {
            throw new UnauthorizedException($authenticationController->errorReason, $authenticationController->errorCode);
        }

        // get the current user
        $currentUser = $this->getCurrentUser();

        // get a module handler to map the current user
        $moduleHandler = new SpiceBeanHandler();

        $loginData = [
            'admin' => $currentUser->is_admin == '1' ? true : false,
            'is_api_user' => $currentUser->is_api_user == '1' ? true : false,
            'display_name' => $currentUser->get_summary_text(),
            'email' => $currentUser->email1,
            'first_name' => $currentUser->first_name,
            'address_country' => $currentUser->address_country,
            'id' => session_id(),
            'last_name' => $currentUser->last_name,
            'portal_only' => $currentUser->portal_only == '1' ? true : false,
            'user_name' => $currentUser->user_name,
            'userid' => $currentUser->id,
            'user_image' => $currentUser->user_image,
            'companycode_id' => $currentUser->companycode_id,
            'tenant_id' => $currentUser->systemtenant_id,
            'tenant_name' => $this->systemtenantname,
            'tenant_accepted_legal_notice' => $this->systemTenantLegalNoticeAccepted,
            'tenant_wizard_completed' => $this->systemTenantWizardCompleted,
            'obtainGDPRconsent' => false,
            'canchangepassword' => AuthenticationController::getInstance()->getCanChangePassword(),
            'expiringPasswordValidityDays' => AuthenticationController::getInstance()->expiringPasswordValidityDays,
            'user' => $moduleHandler->mapBean($currentUser)
        ];

        // Is it a portal user? And the GDPR consent for portal users is configured?
        if ($currentUser->portal_only and @SpiceConfig::getInstance()->config['portal_gdpr']['obtain_consent']) {
            $contactOfPortalUser = BeanFactory::getBean('Contacts');
            $contactOfPortalUser->retrieve_by_string_fields(['portal_user_id' => $this->getCurrentUser()->id]);
            // gdpr_marketing_agreement not 'g' and not 'r' indicates that the user has not yet been asked for consent of GDPR in general (data AND marketing)
            if (($contactOfPortalUser->gdpr_marketing_agreement !== 'g' and $contactOfPortalUser->gdpr_marketing_agreement !== 'r')
                and !$contactOfPortalUser->gdpr_data_agreement) {
                $loginData['obtainGDPRconsent'] = true;
            }
        }

        return $loginData;
    }

    /**
     * Called when a user requests to logout. Should invalidate the session and redirect
     * to the login page.
     */
    public function logout()
    {
        $this->getCurrentUser()->call_custom_logic('before_logout');
        session_destroy();
        LogicHook::getInstance()->call_custom_logic('Users', null,'after_logout');
    }
}
