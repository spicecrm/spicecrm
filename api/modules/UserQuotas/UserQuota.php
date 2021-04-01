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
namespace SpiceCRM\modules\UserQuotas;

use SpiceCRM\data\SugarBean;
use DateTime;

class UserQuota extends SugarBean
{
    public $db;

    public $object_name = 'UserQuota';
    public $table_name = 'userquotas';
    public $disable_row_level_security = true;
    public $module_dir = 'UserQuotas';

    public function __construct()
    {
        parent::__construct();
        $this->tracker_visibility = false;
    }

    public function save($check_notify = false, $fts_index_bean = true)
    {
        $periodDate = DateTime::createFromFormat('Y-m-d', $this->year . '-' .
                        ($this->period < 10 ? '0' . $this->period : $this->period) . '-01');
        $this->period_date = $periodDate->format("Y-m-t");
        $this->name = $this->year . '-' . ($this->period < 10 ? '0' . $this->period : $this->period);
        parent::save($check_notify, $fts_index_bean);

    }

    public function get_quotausers()
    {
        $users = [];
        $usersObj = $this->db->query("SELECT * FROM users WHERE quota_carrying = '1' ORDER BY last_name");
        while ($user = $this->db->fetchByAssoc($usersObj))
            $users[] = $user;

        return $users;
    }

    public function get_quotas($year)
    {
        $userquotas = [];
        $userquotasObj = $this->db->query("SELECT * FROM userquotas WHERE deleted = 0 AND year = '$year'");
        while ($userquota = $this->db->fetchByAssoc($userquotasObj))
            $userquotas[] = $userquota;

        return $userquotas;
    }

    public function set_quota($user, $year, $period, $sales_quota)
    {
        $periodArray = explode(',', $period);
        foreach ($periodArray as $thisPeriod) {
            if (!$this->retrieve_by_string_fields(['assigned_user_id' => $user, 'year' => $year, 'period' => $thisPeriod])) {
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
            if ($this->retrieve_by_string_fields(['assigned_user_id' => $user, 'year' => $year, 'period' => $period])) {
                $this->deleted = true;
                $this->save();
            }
        }
    }
}
