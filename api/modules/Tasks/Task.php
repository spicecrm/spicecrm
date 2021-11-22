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
namespace SpiceCRM\modules\Tasks;

use DateInterval;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use DateTime;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;

// Task is used to store customer information.
class Task extends SugarBean
{

    public $table_name = "tasks";
    public $object_name = "Task";
    public $module_dir = 'Tasks';

    // This is used to retrieve related fields from form posts.
    public $additional_column_fields = [
        'assigned_user_name',
        'assigned_user_id',
        'contact_name',
        'contact_phone',
        'contact_email',
        'parent_name',
    ];


    /**
     * Available status values
     */
    const NOT_STARTED = 'Not Started';
    const IN_PROGRESS = 'In Progress';
    const COMPLETED = 'Completed';
    const PENDING_INPUT = 'Pending Input';
    const DEFERRED = 'Deferred';

    /**
     * Task constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * save
     *
     * Saves the Task Bean and if necessary also saves the Google Task
     *
     * @param bool $check_notify
     * @param bool $fts_index_bean
     * @return string
     */
    public function save($check_notify = false, $fts_index_bean = true)
    {
        if (empty($this->status)) {
            $this->status = $this->getDefaultStatus();
        }

        // set the date_start from the default config if it was not set
        if (empty($this->date_start)) {

            $config = SpiceConfig::getInstance()->config;
            $timeDate = TimeDate::getInstance();
            $dueDate = $timeDate->fromDb($this->date_due);

            $interval = new DateInterval(($config['task']['default_start_date_interval'] ?: 'PT30M'));
            $dueDate->sub($interval);

            $this->date_start = $timeDate->asDb($dueDate);
        }

        return parent::save($check_notify, $fts_index_bean);
    }

    public function getDefaultStatus()
    {
        $def = $this->field_defs['status'];
        if (isset($def['default'])) {
            return $def['default'];
        } else {
            $app = return_app_list_strings_language($GLOBALS['current_language']);
            if (isset($def['options']) && isset($app[$def['options']])) {
                $keys = array_keys($app[$def['options']]);
                return $keys[0];
            }
        }
        return '';
    }


    function get_user_tasks($user, $timespan = 'today')
    {

        $timedate = TimeDate::getInstance();

        $template = $this;

        // get the own meetings
        $myquery = "SELECT id FROM tasks WHERE deleted = 0 AND assigned_user_id = '$user->id' AND status in ('Not Started', 'In Progress', 'Pending Input')";

        // add the timespan
        switch ($timespan) {
            case 'all':
                $end = new DateTime();
                $end->setTime(23, 59, 59);
                $myquery .= " AND tasks.date_due <= '" . $timedate->asDb($end) . "'";
                break;
            case 'today':
                $start = new DateTime();
                $start->setTime(0, 0, 0);
                $end = new DateTime();
                $end->setTime(23, 59, 59);
                $myquery .= " AND tasks.date_due >= '" . $timedate->asDb($start) . "' AND tasks.date_due <= '" . $timedate->asDb($end) . "'";
                break;
            case 'overdue':
                $end = new DateTime();
                $end->setTime(0, 0, 0);
                $myquery .= " AND tasks.date_due < '" . $timedate->asDb($end) . "'";
                break;
            case 'future':
                $start = new DateTime();
                $start->setTime(0, 0, 0);
                $myquery .= " AND tasks.date_due > '" . $timedate->asDb($start) . "''";
                break;
        }

        $result = $this->db->query($myquery, true);

        $list = [];

        while ($row = $this->db->fetchByAssoc($result)) {
            $record = BeanFactory::getBean('Tasks', $row['id']);

            if ($record != null) {
                // this copies the object into the array
                $list[] = $record;
            }
        }
        return $list;

    }

    /*
     * function to retrieve a query string for the activity stream
     */
    function get_activities_query($parentModule, $parentId, $own = false)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $query = "SELECT id, date_due sortdate, 'Tasks' module FROM tasks where ((parent_type = '$parentModule' and parent_id = '$parentId') or contact_id = '$parentId') and deleted = 0 and status in ('In Progress', 'Not Started', 'Pending Input')";

        switch ($own) {
            case 'assigned':
                $query .= " AND tasks.assigned_user_id='$current_user->id'";
                break;
            case 'created':
                $query .= " AND tasks.created_by='$current_user->id'";
                break;
        }

        return $query;
    }

    function get_history_query($parentModule, $parentId, $own = false)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $query = "SELECT DISTINCT(id), date_due sortdate, 'Tasks' module FROM tasks where ((parent_type = '$parentModule' and parent_id = '$parentId') or contact_id = '$parentId') and deleted = 0 and status not in ('In Progress', 'Not Started', 'Pending Input')";

        switch ($own) {
            case 'assigned':
                $query .= " AND tasks.assigned_user_id='$current_user->id'";
                break;
            case 'created':
                $query .= " AND tasks.created_by='$current_user->id'";
                break;
        }

        return $query;
    }


    /**
     * sets the proper date either date_entered, date_start or date_
     */
    public function add_fts_fields()
    {

        if($this->date_due){
            $retvalue = $this->date_due;
        } else if($this->date_start){
            $retvalue = $this->date_start;
        } else {
            $retvalue = $this->date_entered;
        }

        return ['date_activity' => $retvalue];
    }
}
