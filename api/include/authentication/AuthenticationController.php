<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication;

use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\GoogleAuthenticate\GoogleAuthenticate;
use SpiceCRM\includes\authentication\IpAddresses\IpAddresses;
use SpiceCRM\includes\authentication\LDAPAuthenticate\LDAPAuthenticate;
use SpiceCRM\includes\authentication\OAuth2Authenticate\OAuth2Authenticate;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAuthenticate;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMPasswordUtils;
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
use SpiceCRM\modules\UserAccessLogs\UserAccessLog;
use SpiceCRM\modules\Users\User;

class AuthenticationController
{


    /**
     * Stores the current token.
     * @var string|null
     */
    public $token = null;

    /**
     * Stores the User object of the user that is currently logged in.
     * @var User|null
     */
    private $currentUser = null;
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
    protected function __construct()
    {
    }

    public function getCanChangePassword()
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
     * Getter for the current User object.
     *
     * @return User
     */
    public function getCurrentUser()
    {
        return $this->currentUser;
    }

    public function isAuthenticated()
    {
        return $this->currentUser instanceof User;
    }

    public function isAdmin()
    {
        return $this->currentUser instanceof User && $this->currentUser->isAdmin();
    }

    /**
     * Setter for the current User object.
     *
     * @param User $userBean
     * @return bool
     */
    public function setCurrentUser(User $userBean)
    { //todo shouldnt we set currentuser on usersingleton?
        $this->currentUser = $userBean;
        return true;
    }

    /**
     * get password utils handler
     * @return SpiceCRMPasswordUtils
     */
    public function getPasswordUtilsHandler()
    {
        $tokenIssuer = RESTManager::getInstance()->parseAuthParams()->tokenIssuer;

        $namespace = "SpiceCRM\includes\authentication\\{$tokenIssuer}Authenticate\\{$tokenIssuer}PasswordUtils";

        if (!class_exists($namespace, true)) {
            $namespace = "SpiceCRM\includes\authentication\\SpiceCRMAuthenticate\\SpiceCRMPasswordUtils";
        }

        return new $namespace();
    }

    /**
     * handle failed authentication
     * @throws BadRequestException | Exception | UnauthorizedException
     * @throws \Exception
     */
    private function handleFailedAuthentication(UnauthorizedException $e, object $authData)
    {
        $config = SpiceConfig::getInstance()->config;


        # isUserBlocked() in case the login or password check has not happened, because the user is already blocked (temporary or permanent)
        # ,otherwise the check has happened and failed, so log the failed attempt:
        if ( !$e->isUserBlocked() and !empty( $authData->username )) {

            /** @var UserAccessLog $userAccessLogObj */
            $userAccessLogObj = BeanFactory::getBean('UserAccessLogs');
            $loginName = empty($authData->impersonationUser) ? $authData->username : $authData->impersonationUser . '#as#' . $authData->username;
            $userAccessLogObj->addRecord("loginfail", $loginName);

            unset($userAccessLogObj);

            if ( $config['login_attempt_restriction']['user_enabled'] ) {
                $amountFailedLogins = UserAccessLog::getAmountFailedLoginsWithinByUsername( $authData->username, $config['login_attempt_restriction']['user_monitored_period'] );
                if ( $amountFailedLogins >= $config['login_attempt_restriction']['user_number_attempts'] ) {
                    User::blockUserByName( $authData->username, $config['login_attempt_restriction']['user_blocking_duration'] );
                }
            }
        }

        # In case the max. failed login attempts are reached, black list the IP address.
        # ( But only if IP restriction is enabled and the IP address is not white listed and the IP address has not been black listed just before (isIPblocked). )
        if ( $config['login_attempt_restriction']['ip_enabled']
            and UserAccessLog::getNumberLoginAttemptsByIp() >= (int)$config['login_attempt_restriction']['ip_number_attempts']
            and !IpAddresses::ipAddressIsWhite()
            and !$e->isIPblocked() ) {

            IpAddresses::addIpAddress('b');
            $e->setIPblocked( true );
        };

        $this->errorReason = $e->getMessage();
        $this->errorCode = $e->getErrorCode();

        throw (new UnauthorizedException($e->getMessage(), $e->getErrorCode()))->setDetails($e->getDetails());
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

            $authenticator->authenticate($authParams->authData, $authParams->authType);

            $this->handleSuccessfulAuthentication($authParams->authData, $authParams->authType);

        } catch (UnauthorizedException $e) {
            $this->handleFailedAuthentication($e, $authParams->authData);
        }
    }

    /**
     * handle successful authentication
     * @throws UnauthorizedException
     * @throws NotFoundException
     */
    private function handleSuccessfulAuthentication(object $authData, string $authType)
    {
        $isBlocked = User::isBlocked($authData->impersonationUser ?? $authData->username);

        if ($isBlocked === true) {
            throw (new UnauthorizedException('User is blocked. Contact the admin for access.', 3))->setUserBlocked(true);
        } elseif ($isBlocked !== false) {
            throw (new UnauthorizedException('User is blocked temporary. Access again in ' . $isBlocked . ' Minutes.', 3))->setUserBlocked(true);
        }

        if (!IpAddresses::checkIpAddress() && !User::isAdmin_byName($authData->username)) {
            throw (new UnauthorizedException('No access from this IP address. Contact the admin.', 11))->setIPblocked(true);
        }

        $this->handleTenants();

        $userObj = $this->getUserByUsername($authData->username);

        $this->checkUserStatus($userObj);


        if (( $userObj->system_generated_password or $userObj->hasExpiredPassword() ) and !$userObj->is_api_user ) {
            $necessaryLabels = LanguageManager::getSpecificLabels( SpiceConfig::getInstance()->config['default_language'] ?: 'en_us', [
                'LBL_CANCEL','LBL_CHANGE_PASSWORD', 'LBL_NEW_PWD', 'LBL_NEW_PWD_REPEATED', 'LBL_PWD_GUIDELINE', 'LBL_SET_PASSWORD',
                'LBL_ONE_LOWERCASE', 'LBL_ONE_UPPERCASE', 'LBL_ONE_SPECIALCHAR', 'LBL_ONE_DIGIT', 'LBL_MIN_LENGTH', 'MSG_PWD_NOT_LEGAL',
                'MSG_PWDS_DONT_MATCH', 'MSG_PWD_CHANGED_SUCCESSFULLY'
            ]);
            throw ( new UnauthorizedException('Password expired.', 2 ))->setDetails(['labels' => $necessaryLabels]);
        }

        if ( SpiceConfig::getInstance()->config['login_methods']['totp_authentication_required'] and !TOTPAuthentication::checkTOTPActive( $userObj->id )) {
            $necessaryLabels = LanguageManager::getSpecificLabels( SpiceConfig::getInstance()->config['default_language'] ?: 'en_us', [
                'LBL_SAVE', 'LBL_TOTP_AUTHENTICATION', 'MSG_AUTHENTICATOR_INSTRUCTIONS', 'LBL_CODE', 'LBL_CANCEL', 'LBL_CODE'
            ]);
            throw ( new UnauthorizedException('TOTP.', 12 ))->setDetails(['labels' => $necessaryLabels]);
        }

        // retrieve impersonation user
        $impersonatingUser = $this->getUserByUsername($authData->impersonationUser);

        $userObj->impersonating_user_id = $impersonatingUser->id;

        $this->setCurrentUser($userObj);

        if (LDAPAuthenticate::isLdapEnabled()) {
            $userObj->call_custom_logic('after_ldap_login', $this);
        }

        $userObj->call_custom_logic('after_login');

        // login was via user/pass therefore create session and log login
        if ($authType == 'credentials' || $authData->tokenIssuer !== 'SpiceCRM') {
            $this->token = SpiceCRMAuthenticate::createSession($this->currentUser);
        }
    }

    /**
     * get user by username
     * @throws NotFoundException
     */
    public function getUserByUsername(string $username): User
    {
        /** @var User $userObj */
        $userObj = BeanFactory::newBean('Users');
        return $userObj->findByUserName($username);
    }

    /**
     * get authenticator class
     * @return SpiceCRMAuthenticate | GoogleAuthenticate | OAuth2Authenticate
     * @throws \Exception
     */
    public function getAuthenticator()
    {
        $issuer = RESTManager::getInstance()->parseAuthParams()->tokenIssuer;

        $config = SpiceConfig::getInstance()->config;

        if (LDAPAuthenticate::isLdapEnabled()) {
            $issuer = 'LDAP';
        }

        if (empty($issuer)) {
            $issuer = $config['system']['defaultAuthenticator'] ?? 'SpiceCRM';
        }

        return $this->getAuthenticatorObject($issuer);
    }

    /**
     * get issuer class
     * @throws \Exception
     */
    public static function getAuthenticatorObject($tokenIssuer)
    {
        $db = DBManagerFactory::getInstance('master');
        $service = $db->fetchOne("SELECT class_name FROM authentication_services WHERE issuer = '$tokenIssuer'");

        $authenticationClass = "SpiceCRM\includes\authentication\\{$tokenIssuer}Authenticate\\{$tokenIssuer}Authenticate";

        if (!empty($service)) $authenticationClass = $service['class_name'];

        if (class_exists($authenticationClass, true)) {
            return new $authenticationClass($tokenIssuer);
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

        while ($service = $db->fetchByAssoc($query)) $services[] = $service;

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

    private function handleTenants()
    {
        /* switch to a different tenant if the tenant id is set for the user */
        if (!empty($this->getCurrentUser()->systemtenant_id)) {
            $tenant = BeanFactory::getBean('SystemTenants', $this->getCurrentUser()->systemtenant_id);
            if ($tenant->valid_until < TimeDate::getInstance()->nowDbDate() && $tenant->valid_until =! null) {
                throw new UnauthorizedException('Tenant expired', 401);
            }
            $tenant->switchToTenant();
            $this->systemtenantid = $tenant->id;
            $this->systemtenantname = $tenant->name;
            $this->systemTenantLegalNoticeAccepted = !empty($tenant->accept_data) && $tenant->accept_data != '{}';
            $this->systemTenantWizardCompleted = boolval($tenant->wizard_completed);
        }
    }

    /**
     * Returns an array with basic data about the current user.
     *
     * @return array
     */
    public function getLoginData()
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
     * Returns an instance of the authentication controller
     *
     * @param string $type this is the type of authentication you want to use default is SugarAuthenticate
     * @return AuthenticationController
     */
    public static function getInstance()
    {
        if (empty(self::$authControllerInstance)) {
            self::$authControllerInstance = new static();
        }
        return self::$authControllerInstance;
    }


    /**
     * Deletes the session if it was created without login.
     */
    public function cleanup()
    {
        if (!empty($this->tmpSessionId)) {
            session_destroy();
        }
    }


    /**
     * Called when a user requests to logout. Should invalidate the session and redirect
     * to the login page.
     */
    public function logout()
    {
        $this->getCurrentUser()->call_custom_logic('before_logout');
        $this->authController->logout();
        LogicHook::getInstance()->call_custom_logic('Users', 'after_logout');
    }

}
