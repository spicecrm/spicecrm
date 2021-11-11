<?php
/*********************************************************************************
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 *
 * You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
 * SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
 ********************************************************************************/

namespace SpiceCRM\modules\UserAccessLogs;

use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class UserAccessLog extends SugarBean
{
    public $object_name = 'UserAccessLog';
    public $table_name = 'useraccesslogs';
    public $disable_row_level_security = true;
    public $module_dir = 'UserAccessLogs';

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
        $this->assigned_user_id = $currentUser ? $currentUser->id : null;
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
            $dtObj = new \DateTime();
            $dtObj->setTimestamp(time());
            $now = Timedate::getInstance()->asDb($dtObj);
            return (int)$db->getOne('SELECT COUNT(0) FROM useraccesslogs WHERE date_entered > DATE_SUB( "'.$now.'", INTERVAL '.$interval.' MINUTE ) AND action="loginfail" AND ipaddress = "'.$db->quote($ipAddress).'"');
        } else return 0;
    }

}
