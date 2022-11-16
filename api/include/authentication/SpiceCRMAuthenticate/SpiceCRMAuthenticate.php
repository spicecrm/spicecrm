<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\SpiceCRMAuthenticate;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\SessionExpiredException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Users\User;

class SpiceCRMAuthenticate implements AuthenticatorI
{
    /**
     * @param object $authData
     * @param string $authType
     * @return AuthResponse
     * @throws SessionExpiredException
     * @throws UnauthorizedException
     */
    public function authenticate(object $authData, string $authType): AuthResponse
    {
        switch ($authType) {
            case 'token':
                $userId = $this->handleToken($authData->token->access_token);
                break;
            case 'credentials':
                $userId = $this->handleCredentials($authData->username, $authData->password, $authData->impersonationUser);
                break;
            default:
                throw new UnauthorizedException("Invalid authentication method", 6);
        }

        $username = BeanFactory::getBean('Users', $userId)->user_name;

        return new AuthResponse($username);
    }

    /**
     * handle token
     * @throws SessionExpiredException
     */
    public function handleToken(string $token): string
    {
        session_id($token);
        session_start();

        if (!isset($_SESSION['authenticated_user_id'])) {
            throw new SessionExpiredException("Session Expired", 0);
        }

        return $_SESSION['authenticated_user_id'];
    }

    /**
     * Handles the authentication with username/password credentials.
     * @param string $username
     * @param string $password
     * @param string|null $adminUsername
     * @return string
     * @throws UnauthorizedException | Exception
     */
    public function handleCredentials(string $username, string $password, ?string $adminUsername = null): string
    {
        $sqlWhere = "( is_group IS NULL OR is_group != 1 ) AND status = 'Active' AND deleted = 0 and external_auth_only = 0";

        # Usual case, no impersonation:
        if (empty($adminUsername)) {
            $row = $this->findUserPassword($username, $password, $sqlWhere);
        } else {
            # check the password of the admin
            $impersonatingUser = $this->findUserPassword($adminUsername, $password, $sqlWhere);
            # fetch the user impersonated by the admin
            $row = !$impersonatingUser ? null : $this->getUser($username, $sqlWhere);
        }

        if (!$row) {
            throw new UnauthorizedException("Invalid Username/Password combination", 1);
        }

        return $row['id'];
    }

    /**
     * @param User $userObj
     * @return string session_id
     */
    public static function createSession(User $userObj): string
    {
        session_start();

        $_SESSION['is_valid_session'] = true;
        $_SESSION['ip_address'] = SpiceUtils::getClientIP();
        $_SESSION['user_id'] = $userObj->id;
        $_SESSION['type'] = 'user';
        $_SESSION['KREST'] = true;

        $_SESSION['authenticated_user_id'] = $userObj->id;
        $_SESSION['unique_key'] = SpiceConfig::getInstance()->config['unique_key'];

        $token = session_id();

        $accessLog = BeanFactory::getBean('UserAccessLogs');
        $accessLog->addRecord('loginsuccess', $userObj->user_name);

        return $token;
    }

    /**
     * @param string $username
     * @param string $sqlWhere
     * @return array|false
     * @throws Exception
     */
    public function getUser(string $username, string $sqlWhere) {

        $db = DBManagerFactory::getInstance();

        return $db->fetchOne(sprintf("SELECT * from users where user_name='%s' AND $sqlWhere", $db->quote($username)));
    }


    /** find the user password
     * @param string $name
     * @param string $password
     * @param string $where
     * @return array|false
     */
    public function findUserPassword(string $name, string $password, string $where = '') # : array|boolean
    {
        return User::findUserPassword($name, $password, $where);
    }
}