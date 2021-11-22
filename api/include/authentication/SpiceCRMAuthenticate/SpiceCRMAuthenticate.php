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

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\SessionExpiredException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\modules\Users\User;

class SpiceCRMAuthenticate
{
    /**
     * @param $token
     * @return User
     * @throws UnauthorizedException
     */
    public function authenticate($token)
    {
        //todo should ip adress of client match ip-adress of session in order to avoid stealing the session via token...
        $userObj = null;
        session_id($token);
        session_start();
        if (isset($_SESSION['authenticated_user_id'])) {
            /** @var User $userObj */
            $userObj = BeanFactory::getBean("Users", $_SESSION['user_id'], ['relationships' => false]);
        } else {
            throw new SessionExpiredException("Session Expired",0);
        }

        return $userObj;
    }


    /**
     * @param User $userObj
     * @return string session_id
     */
    public static function createSession(User $userObj)
    {
        session_start();

        $_SESSION['is_valid_session'] = true;
        $_SESSION['ip_address'] = SpiceUtils::getClientIP();
        $_SESSION['user_id'] = $userObj->id;
        $_SESSION['type'] = 'user';
        $_SESSION['KREST'] = true;

        SpiceACL::getInstance()->filterModuleList($_SESSION['avail_modules'], false);

        $_SESSION['authenticated_user_id'] = $userObj->id;
        $_SESSION['unique_key'] = SpiceConfig::getInstance()->config['unique_key'];

        $token = session_id();

        $accessLog = BeanFactory::getBean('UserAccessLogs');
        $accessLog->addRecord('loginsuccess', $userObj->user_name);

        return $token;
    }

}