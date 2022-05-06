<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\UserAccessLogs;

use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class UserAccessLog extends SpiceBean
{
    public $disable_row_level_security = true;

    public function __construct()
    {
        parent::__construct();
        $this->tracker_visibility = false;
    }


    /**
     * @param $username
     * @param int $mins
     * @return integer
     * @throws \Exception
     */
    public static function getAmountFailedLoginsWithinByUsername($username, $mins = 60 )
    {
        $db = DBManagerFactory::getInstance();

        $dtObj=new \DateTime();
        $dtObj->setTimestamp(time()-($mins*60));
        $timeLimit = Timedate::getInstance()->asDb($dtObj);

        return (int)$db->getOne("SELECT count(0) FROM useraccesslogs WHERE deleted = 0 AND login_name = '" . $db->quote($username) . "' and date_entered >'".$timeLimit."' and action='loginfail'");
    }

    /**
     * @param string $action loginsuccess | loginfail
     * @param null $loginName
     */
    public function addRecord($action = 'loginsuccess', $loginName = null)
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        if ($loginName === null && $currentUser !== null) {
            $loginName = $currentUser->name;
        }
        $this->ipaddress = SpiceUtils::getClientIP();
//        $this->assigned_user_id = $currentUser ? $currentUser->id : null;
        $this->action = $action;
        $this->login_name = $loginName;
        $this->impersonating_user_id = isset( $currentUser->impersonating_user_id[0] ) ? $currentUser->impersonating_user_id : null;
        if(!$this->save()) {
            throw new \Exception("unable to save useraccess log record");
        }
        return true;
    }

    static function getNumberLoginAttemptsByIp( $ipAddress = null ) {
        if ( $ipAddress === null ) $ipAddress = SpiceUtils::getClientIP();
        $db = DBManagerFactory::getInstance();
        $interval = SpiceConfig::getInstance()->config['login_attempt_restriction']['ip_monitored_period']*1;
        if ( $interval ) {
//            $dtObj = new \DateTime();
//            $dtObj->setTimestamp(time());
//            $now = Timedate::getInstance()->asDb($dtObj);

            $dtObj = TimeDate::getInstance()->getNow();
            $dtObj->sub(new \DateInterval('PT'.$interval.'M'));
            $calculatedDate = TimeDate::getInstance()->asDb($dtObj);

//            return (int)$db->getOne('SELECT COUNT(0) FROM useraccesslogs WHERE date_entered > DATE_SUB( "'.$now.'", INTERVAL '.$interval.' MINUTE ) AND action="loginfail" AND ipaddress = "'.$db->quote($ipAddress).'"');
            return (int)$db->getOne('SELECT COUNT(0) FROM useraccesslogs WHERE date_entered > "'.$calculatedDate.'" AND action="loginfail" AND ipaddress = "'.$db->quote($ipAddress).'"');
        } else return 0;
    }

}
