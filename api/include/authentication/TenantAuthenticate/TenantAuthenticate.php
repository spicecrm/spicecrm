<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\TenantAuthenticate;

use Exception;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAuthenticate;
use SpiceCRM\includes\authentication\TOTPAuthentication\TOTPAuthentication;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\SessionExpiredException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\modules\Users\User;

class TenantAuthenticate extends SpiceCRMAuthenticate implements AuthenticatorI
{
    /**
     * @param object $authData
     * @param string $authType
     * @return AuthResponse
     * @throws UnauthorizedException| SessionExpiredException | Exception
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

        $authUser = DBManagerFactory::getInstance()->fetchOne("SELECT tenant_id, username from tenant_auth_users WHERE id ='$userId'");

        return new AuthResponse($authUser['username'], ['tenantId' => $authUser['tenant_id']]);
    }

    /**
     * @param string $username
     * @param string $sqlWhere
     * @return array|false
     * @throws Exception
     */
    public function getUser(string $username, string $sqlWhere)
    {
        $db = DBManagerFactory::getInstance();

        return $db->fetchOne(sprintf("SELECT * from tenant_auth_users WHERE username='%s'", $db->quote($username)));
    }

    /** find the user password
     * @param string $name
     * @param string $password
     * @param string $where
     * @return ?array
     * @throws Exception
     */
    public function findUserPassword(string $name, string $password, string $where = ''): ?array
    {
        $db = DBManagerFactory::getInstance();
        $query = "SELECT * from tenant_auth_users WHERE username='" . $db->quote($name) . "'";

        $row = $db->fetchOne($query);

        if (empty($row)) return null;

        // check if we have a Google authenticator password
        $totpAuth = new TOTPAuthentication();

        if (TOTPAuthentication::checkTOTPActive($row['id']) && $totpAuth->checkTOTPCode($row['id'], $password)) {
            return $row;
        } else if (User::checkPasswordMD5(md5($password), $row['user_hash'])) {
            return $row;
        } else {
            return null;
        }
    }
}