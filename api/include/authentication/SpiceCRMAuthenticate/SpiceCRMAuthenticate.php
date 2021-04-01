<?php

namespace SpiceCRM\includes\authentication\SpiceCRMAuthenticate;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\SessionExpiredException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
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
            $userObj = BeanFactory::getBean("Users", $_SESSION['user_id']);
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
        $_SESSION['ip_address'] = query_client_ip();
        $_SESSION['user_id'] = $userObj->id;
        $_SESSION['type'] = 'user';
        $_SESSION['KREST'] = true;

        $_SESSION['avail_modules'] = query_module_access_list($userObj);
        SpiceACL::getInstance()->filterModuleList($_SESSION['avail_modules'], false);

        $_SESSION['authenticated_user_id'] = $userObj->id;
        $_SESSION['unique_key'] = SpiceConfig::getInstance()->config['unique_key'];

        $token = session_id();

        $accessLog = BeanFactory::getBean('UserAccessLogs');
        $accessLog->addRecord();

        return $token;
    }

}