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
