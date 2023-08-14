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