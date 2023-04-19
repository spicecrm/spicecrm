<?php
/*********************************************************************************
 * This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
 * and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 * You can contact us at info@spicecrm.io
 *
 * SpiceCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by SugarCRM".
 *
 * SpiceCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ********************************************************************************/



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
     * @throws SessionExpiredException | Exception | UnauthorizedException
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

        return $this->generateAuthResponse($userId);
    }

    /**
     * get the username by id
     * @param string $userId
     * @return AuthResponse
     * @throws UnauthorizedException
     */
    public function generateAuthResponse(string $userId): AuthResponse
    {
        $username =  BeanFactory::getBean('Users', $userId, ['relationships' => false])->user_name;
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