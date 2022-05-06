<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\UserQuotas;

use SpiceCRM\data\SpiceBean;
use DateTime;

class UserQuota extends SpiceBean
{

    public $disable_row_level_security = true;

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
