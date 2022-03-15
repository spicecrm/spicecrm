<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication;

use http\Exception\UnexpectedValueException;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\IpAddresses\IpAddresses;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAuthenticate;
use SpiceCRM\includes\authentication\TOTPAuthentication\TOTPAuthentication;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\LogicHook\LogicHook;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\modules\Administration\Administration;
use SpiceCRM\modules\Contacts\Contact;
use SpiceCRM\modules\SystemTenants\SystemTenant;
use SpiceCRM\modules\UserAccessLogs\UserAccessLog;
use SpiceCRM\modules\Users\User;
use SpiceCRM\includes\authentication\UserAuthenticate\UserAuthenticate;
use SpiceCRM\includes\authentication\LDAPAuthenticate\LDAPAuthenticate;
use SpiceCRM\includes\authentication\TOTPAuthentication\TwoFactorAuthenticate;

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
     * @var UserAuthenticate
     */
    public $authController;

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
     * @param $username
     * @param $currentPwd
     * @param $newPwd
     * @param false $sendByEmail
     * @return bool
     * @throws Exception
     * @throws ForbiddenException
     * @throws UnauthorizedException
     */
    public function changePassword($username, $currentPwd, $newPwd, $sendByEmail = false)
    {
        try {
            $userAuthenticateObj = new UserAuthenticate();
            $userObj = $userAuthenticateObj->authenticate($username, $currentPwd);
            $this->setCurrentUser($userObj);
        } catch (UnauthorizedException $e) {
            //convert error message
            throw new UnauthorizedException("Current Password is not correct");
        }

        if ($this->getCanChangePassword() === false) {
            throw new ForbiddenException("Password Change not allowed");
        }

        return $userAuthenticateObj->setNewPassword($userObj, $newPwd, $sendByEmail, false);

    }

    /**
     * @param string|null $username
     * @param string|null $password
     * @param null $token
     * @param null $tokenIssuer
     * @return array
     * @throws UnauthorizedException
     */
    public function authenticate($username = null, $password = null, $token = null, $tokenIssuer = null, $impersonationUser = null )
    {
        $config = SpiceConfig::getInstance()->config;

        try {
            /** @var User $userObj */

            if ($token) {

                $issuerObject = $this->getIssuerObject($tokenIssuer);
                $userObj = $issuerObject->authenticate($token);

                if ( !IpAddresses::checkIpAddress() ) {
                    if ( !User::isAdmin_byName( $userObj->user_name )) # don´t block the admin
                        throw ( new UnauthorizedException('No access from this IP address. Contact the admin.', 11))->setIPblocked( true );
                }
            } elseif ($username && $password) {
                if ( !IpAddresses::checkIpAddress() ) {
                    if ( !User::isAdmin_byName( $username )) # don´t block the admin
                        throw ( new UnauthorizedException('No access from this IP address. Contact the admin.', 11))->setIPblocked( true );
                }
                $userObj = $this->handleUserPassAuth($username, $password, $impersonationUser );
            } else {
                throw new UnauthorizedException("Invalid authentication method", 6);
            }

            //check status field on user
            $this->checkUserStatus($userObj);

            $this->setCurrentUser($userObj);

            if (($username && $password) || $tokenIssuer !== 'SpiceCRM') { //login was via user/pass therefore create session and log login
                $this->token = SpiceCRMAuthenticate::createSession($this->currentUser);

                //should we log successful login?
                if (array_key_exists("logSuccessLogin", $config )) {
                    $this->logSuccessLogin($userObj);
                }

            }

            $this->handleTenants();

        } catch (UnauthorizedException $e) {
            /** @var UserAccessLog $userAccessLogObj */

            # isUserBlocked() in case the login or password check has not happened, because the user is already blocked (temporary or permanent).
            # Otherwise the check has happened and failed, so log the failed attempt:
            if ( !$e->isUserBlocked() and !empty( $username )) {
                $userAccessLogObj = BeanFactory::getBean('UserAccessLogs');
                $userAccessLogObj->addRecord("loginfail", empty($impersonationUser) ? $username : $impersonationUser . '#as#' . $username);
                unset($userAccessLogObj);
                if ( $config['login_attempt_restriction']['user_enabled'] ) {
                    $amountFailedLogins = UserAccessLog::getAmountFailedLoginsWithinByUsername( $username, $config['login_attempt_restriction']['user_monitored_period'] );
                    if ( $amountFailedLogins >= $config['login_attempt_restriction']['user_number_attempts'] ) {
                        User::blockUserByName( $username, $config['login_attempt_restriction']['user_blocking_duration'] );
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

            throw new UnauthorizedException($e->getMessage(), $e->getErrorCode());
        }

        return [ //todo find a solution to specify return format
            'token' => $this->token,
            'user' => $userObj,
            'pwChangeEnabled' => LDAPAuthenticate::isLdapEnabled() === false && $userObj->external_auth_only === false && TOTPAuthentication::checkTOTPActive($userObj->id) === false
        ];

    }

    /**
     * get issuer class
     * @throws \Exception
     */
    public static function getIssuerObject($tokenIssuer)
    {
        $db = DBManagerFactory::getInstance();
        $service = $db->fetchOne("SELECT class_name FROM authentication_services WHERE issuer = '$tokenIssuer'");

        $authenticationClass = "SpiceCRM\includes\authentication\\{$tokenIssuer}Authenticate\\{$tokenIssuer}Authenticate";

        if (!empty($service)) $authenticationClass = $service['class_name'];

        if (class_exists($authenticationClass, true)) {
            return new $authenticationClass($tokenIssuer);
        } else {
            throw new \Exception("AuthenticationClass {$authenticationClass} not found");
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
        $db = DBManagerFactory::getInstance();
        $query = $db->query("SELECT s.*, c.config config FROM authentication_services s INNER JOIN sysauthconfig c ON s.issuer = c.issuer ORDER BY sequence");

        while ($service = $db->fetchByAssoc($query)) $services[] = $service;

        return $services;
    }

    private function logSuccessfulLogin(User $userObj)
    {
        $userAccessLogObj = BeanFactory::getBean('UserAccessLogs');
        if (!$userAccessLogObj->addRecord("loginsuccess", $userObj->user_name)) {
            unset($userAccessLogObj);
            throw new \Exception("Unable to log successful login");
        }
        unset($userAccessLogObj);
        return true;
    }

    private function checkUserStatus(User $userObj)
    {
        switch ($userObj->status) {
            case "Active":
                break;
            case "Inactive":
                throw new UnauthorizedException("User is inactive", 4);
            default:
                throw new UnauthorizedException("User Status is unknown", 5);
        }
        return true;
    }

    /**
     * Handles the authentication with username/password credentials.
     * @return User | false
     */
    private function handleUserPassAuth($authUser, $authPass, $impersonationUser = null )
    {
        //first check if ldap authentication is enabled
        if (LDAPAuthenticate::isLdapEnabled()) {
            /** @var LDAPAuthenticate $ldapController */
            $ldapController = new LDAPAuthenticate();
            try {
                if ($userObj = $ldapController->authenticate($authUser, $authPass)) {

                    return $userObj;
                }
            } catch (UnauthorizedException | \Exception $e) {
                $ldapError = $e;
            }
        }

        //second use sugar authentication
        try {

            # Check if the user is blocked (after too many login attempts with wrong passwords).
            # This check must happen BEFORE checking the password. No password check (and answer to the user) in case the user is blocked!
            $isBlocked = User::isBlocked(isset($impersonationUser) ? $impersonationUser : $authUser);
            if ($isBlocked === true) {
                throw (new UnauthorizedException('User is blocked. Contact the admin for access.', 3))->setUserBlocked(true);
            } elseif ($isBlocked !== false) {
                throw (new UnauthorizedException('User is blocked temporary. Access again in ' . $isBlocked . ' Minutes.', 3))->setUserBlocked(true);
            }

            $sugarAuthenticationController = new UserAuthenticate();
            $userObj = $sugarAuthenticationController->authenticate( $authUser, $authPass, $impersonationUser );

            // check if password is expired
            if (( $userObj->system_generated_password or $userObj->hasExpiredPassword() ) and !$userObj->is_api_user ) {
                throw new UnauthorizedException('Password expired.', 2 );
            }

        } catch (UnauthorizedException $e) {
            throw ( new UnauthorizedException($ldapError ? $ldapError->getMessage() : $e->getMessage(), $ldapError ? $ldapError->getErrorCode() : $e->getErrorCode()))->setUserBlocked( $e->isUserBlocked() );
        }
        return $userObj;
    }


    private function handleTenants()
    {
        /* switch to a different tenant if the tenant id is set for the user */
        if (!empty($this->getCurrentUser()->systemtenant_id)) {
            $tenant = new SystemTenant();
            $tenant->retrieve($this->getCurrentUser()->systemtenant_id);
            if ($tenant->valid_until < TimeDate::getInstance()->nowDbDate()) {
                throw new UnauthorizedException('Tenant expired', 401);
            }
            $tenant->switchToTenant();
            $this->systemtenantid = $tenant->id;
            $this->systemtenantname = $tenant->name;
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
        $currentUser = $this->getCurrentUser();

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
            'obtainGDPRconsent' => false,
            'canchangepassword' => AuthenticationController::getInstance()->getCanChangePassword(),
            'expiringPasswordValidityDays' => AuthenticationController::getInstance()->expiringPasswordValidityDays
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
