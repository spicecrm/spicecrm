<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\TenantAuthenticate;

use Exception;
use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAuthenticate;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\modules\Users\User;

class TenantAuthenticate extends SpiceCRMAuthenticate implements AuthenticatorI
{
    /**
     * generate authentication response
     * @param string $userId
     * @return AuthResponse
     * @throws UnauthorizedException
     */
    public function generateAuthResponse(string $userId): AuthResponse
    {
        $authUser = DBManagerFactory::getInstance()->fetchOne("SELECT tenant_id, username from tenant_auth_users WHERE id ='$userId'");

        return new AuthResponse($authUser['username'], ['tenantId' => $authUser['tenant_id']]);    }

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

        if (User::checkPasswordMD5(md5($password), $row['user_hash'])) {
            return $row;
        } else {
            return null;
        }
    }
}