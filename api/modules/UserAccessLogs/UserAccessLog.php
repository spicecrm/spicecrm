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
use SpiceCRM\includes\TimeDate;

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
     * @param int $seconds
     * @return integer
     * @throws \Exception
     */
    public function getAmountFailedLoginsWithinByUsername($username, $seconds = 3600)
    {
        $db = DBManagerFactory::getInstance();

        $dtObj=new \DateTime();
        $dtObj->setTimestamp(time()-$seconds);
        $timeLimit = Timedate::getInstance()->asDb($dtObj);


        $sql="SELECT count(0) FROM useraccesslogs WHERE login_name = '" . $db->quote($username) . "' and date_entered >'".$timeLimit."' and action='loginfail'";
        $count=$db->fetchOne($sql);
        if(is_array($count)) {
            return $count[0];
        }
    }
    private function getRemoteAddress()
    { //todo refactor to a central place for ip address handling
        //maybe query_client_ip()?
        $ipaddress = '';
        if ($_SERVER['HTTP_CLIENT_IP'])
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if ($_SERVER['HTTP_X_FORWARDED_FOR'])
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if ($_SERVER['HTTP_X_FORWARDED'])
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if ($_SERVER['HTTP_FORWARDED_FOR'])
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if ($_SERVER['HTTP_FORWARDED'])
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if ($_SERVER['REMOTE_ADDR'])
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        else
            $ipaddress = 'UNKNOWN';

        return $ipaddress;
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
        $this->ipaddress = $this->getRemoteAddress();
        $this->assigned_user_id = $currentUser ? $currentUser->id : null;
        $this->action = $action;
        $this->login_name = $loginName;
        if(!$this->save()) {
            throw new \Exception("unable to save useraccess log record");
        }
        return true;
    }
}
