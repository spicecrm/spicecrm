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


namespace SpiceCRM\includes\authentication\DeploymentTrustedTokenAuthenticate;

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\modules\Users\User;

class DeploymentTrustedTokenAuthenticate implements AuthenticatorI
{

    /**
     * saveToken
     * Verifies the token
     * Starts the user session
     * Saves Google OAuth data in session
     * Authenticates the user in Spice
     * @param object $authData
     * @param string $authType
     * @return AuthResponse
     * @throws UnauthorizedException | Exception
     */
    public function authenticate(object $authData, string $authType): AuthResponse
    {
        $db = DBManagerFactory::getInstance();

        $decodedToken = base64_decode($authData->token->access_token);
        [$systemId, $headerToken] = explode('::', $decodedToken);

        $dbToken = $db->fetchOne("SELECT token, expire_date FROM systemdeploymentsystems_tokens WHERE system_id = '$systemId'");

        if (!$dbToken || $dbToken['token'] != $headerToken) {
            throw new UnauthorizedException('Invalid Token', 'InvalidToken');
        }
        $dbTokenExpire = TimeDate::getInstance()->fromString($dbToken['expire_date']);

        if ($dbTokenExpire < TimeDate::getInstance()->now()) {
            throw new UnauthorizedException('Expired Token', 'ExpiredToken');
        }

        //try to find user via email
        /** @var User $userObj */
        $userObj = BeanFactory::getBean("Users", '1');

        return new AuthResponse($userObj->user_name);
    }
}