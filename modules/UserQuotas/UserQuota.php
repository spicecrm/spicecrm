<?php
if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

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
class UserQuota extends SugarBean
{
    public $db;

    public $object_name = 'UserQuota';
    public $table_name = 'userquotas';
    public $disable_row_level_security = true;
    public $module_dir = 'UserQuotas';

    public function __construct()
    {
        parent::SugarBean();
        $this->tracker_visibility = false;
    }

    public function save()
    {

        $periodDate = DateTime::createFromFormat('Y-m-d', $this->year . '-' . ($this->period < 10 ? '0' . $this->period : $this->period) . '-01');
        $this->period_date = $periodDate->format("Y-m-t");
        $this->name = $this->year . '-' . ($this->period < 10 ? '0' . $this->period : $this->period);
        parent::save();

    }

    public function get_quotausers()
    {
        $users = array();
        $usersObj = $this->db->query("SELECT * FROM users WHERE quota_carrying = '1' ORDER BY last_name");
        while ($user = $this->db->fetchByAssoc($usersObj))
            $users[] = $user;

        return $users;
    }

    public function get_quotas($year)
    {
        $userquotas = array();
        $userquotasObj = $this->db->query("SELECT * FROM userquotas WHERE deleted = 0 AND year = '$year'");
        while ($userquota = $this->db->fetchByAssoc($userquotasObj))
            $userquotas[] = $userquota;

        return $userquotas;
    }

    public function set_quota($user, $year, $period, $sales_quota)
    {
        $periodArray = explode(',', $period);
        foreach ($periodArray as $thisPeriod) {
            if (!$this->retrieve_by_string_fields(array('assigned_user_id' => $user, 'year' => $year, 'period' => $thisPeriod))) {
                $this->assigned_user_id = $user;
                $this->year = $year;
                $this->period = $thisPeriod;
            }

            $this->sales_quota = $sales_quota;
            $this->save();
        }
    }

    public function delete_quota($user, $year, $period)
    {
        $periodArray = explode(',', $period);
        foreach ($periodArray as $thisPeriod) {
            if ($this->retrieve_by_string_fields(array('assigned_user_id' => $user, 'year' => $year, 'period' => $period))) {
                $this->deleted = true;
                $this->save();
            }
        }
    }
}
