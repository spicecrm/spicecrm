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
namespace SpiceCRM\modules\Calls;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use DateTime;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\Contacts\Contact;
use SpiceCRM\modules\Leads\Lead;
use SpiceCRM\modules\SpiceACL\SpiceACL;


/*********************************************************************************
 * Description:  TODO: To be written.
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
 * All Rights Reserved.
 * Contributor(s): ______________________________________..
 ********************************************************************************/

// todo move functions from GoogleCalendarEventInterface
class Call extends SugarBean
{

    var $table_name = "calls";
    var $rel_users_table = "calls_users";
    var $rel_contacts_table = "calls_contacts";
    var $rel_leads_table = "calls_leads";
    var $module_dir = 'Calls';
    var $object_name = "Call";



    function __construct()
    {
        parent::__construct();
    }

    /**
     * Disable edit if call is recurring and source is not Sugar. It should be edited only from Outlook.
     * @param $view string
     * @param $is_owner bool
     */
    function ACLAccess($view, $is_owner = 'not_set')
    {
        // don't check if call is being synced from Outlook
        if ($this->syncing == false) {
            $view = strtolower($view);
            switch ($view) {
                case 'edit':
                case 'save':
                case 'editview':
                case 'delete':
                    if (!empty($this->recurring_source) && $this->recurring_source != "Sugar") {
                        return false;
                    }
            }
        }
        return parent::ACLAccess($view, $is_owner);
    }

    // save date_end by calculating user input
    // this is for calendar
    function save($check_notify = FALSE, $fts_index_bean = TRUE)
    {
        $timedate = TimeDate::getInstance();

        if (isset($this->date_start) && !isset($this->date_end) && isset($this->duration_hours) && isset($this->duration_minutes)) {
            $td = $timedate->fromDb($this->date_start);
            if ($td) {
                $this->duration_hours = (int) $this->duration_hours;
                $this->duration_minutes = (int) $this->duration_minutes;
                $this->date_end = $td->modify("+{$this->duration_hours} hours {$this->duration_minutes} mins")->format(TimeDate::DB_DATETIME_FORMAT);
            }
        }

        if (empty($this->status)) {
            $this->status = $this->getDefaultStatus();
        }

        $return_id = parent::save($check_notify, $fts_index_bean);

        // check if contact_id is set
        if (!empty($this->contact_id)) {
            $this->load_relationship('contacts');
            $this->contacts->add($this->contact_id);
        }

        return $return_id;
    }

    /**
     *
     * @return bool|void
     */
    function fill_in_additional_detail_fields()
    {

        parent::fill_in_additional_detail_fields();

        if (!isset($this->duration_minutes)) {
            $this->duration_minutes = $this->minutes_value_default;
        }

        $timedate = TimeDate::getInstance();
        //setting default date and time
        if (is_null($this->date_start)) {
            $this->date_start = $timedate->now();
        }

        if (is_null($this->duration_hours))
            $this->duration_hours = "0";
        if (is_null($this->duration_minutes))
            $this->duration_minutes = "1";

        // CR1000436: set duration_hours and duration_minutes according to date_start/date_end
        if(!is_null($this->date_start) && !is_null($this->date_end)){
            $startDateObj = new DateTime($this->date_start);
            $endDateObj = new DateTime($this->date_end);
            $interval = $startDateObj->diff($endDateObj);
            $this->duration_hours = $interval->format('%h');
            $this->duration_minutes = $interval->format('%i');
        }


        if (empty($this->reminder_time)) {
            $this->reminder_time = -1;
        }

        if (empty($this->id)) {
            $reminder_t = AuthenticationController::getInstance()->getCurrentUser()->getPreference('reminder_time');
            if (isset($reminder_t))
                $this->reminder_time = $reminder_t;
        }
        $this->reminder_checked = $this->reminder_time == -1 ? false : true;

        if (empty($this->email_reminder_time)) {
            $this->email_reminder_time = -1;
        }
        if (empty($this->id)) {
            $reminder_t = AuthenticationController::getInstance()->getCurrentUser()->getPreference('email_reminder_time');
            if (isset($reminder_t))
                $this->email_reminder_time = $reminder_t;
        }
        $this->email_reminder_checked = $this->email_reminder_time == -1 ? false : true;

    }

    /*
     * function to retrieve a query string for the activity stream
     */
    function get_activities_query($parentModule, $parentId, $own = false)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $queryArray = [
            'select' => "SELECT DISTINCT(calls.id), date_start sortdate, 'Calls' module",
            'from' => "FROM calls LEFT JOIN calls_contacts on calls.id = calls_contacts.call_id",
            'where' => "WHERE ((parent_type = '$parentModule' and parent_id = '$parentId') OR calls_contacts.contact_id = '$parentId' ) and calls.deleted = 0 and status in ('Planned')",
            'order_by' => ""
        ];

        switch ($own) {
            case 'assigned':
                $queryArray['where'] .= " AND calls.assigned_user_id='$current_user->id'";
                break;
            case 'created':
                $queryArray['where'] .= " AND calls.created_by='$current_user->id'";
                break;
        }

        if (SpiceACL::getInstance() && method_exists(SpiceACL::getInstance(), 'addACLAccessToListArray')) {
            SpiceACL::getInstance()->addACLAccessToListArray($queryArray, $this);
        }

        return $queryArray['select'] . ' ' . $queryArray['from'] . ' '. $queryArray['where'] . ' ' . $queryArray['order_by'];
    }

    function get_history_query($parentModule, $parentId, $own = false)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $queryArray = [
            'select' => "SELECT DISTINCT(calls.id), date_start sortdate, 'Calls' module",
            'from' => "FROM calls LEFT JOIN calls_contacts ON calls.id = calls_contacts.call_id",
            'where' => "WHERE ((parent_type = '$parentModule' AND parent_id = '$parentId') OR calls_contacts.contact_id = '$parentId' ) AND calls.deleted = 0 AND status NOT IN ('Planned')",
            'order_by' => ""
        ];

        switch ($own) {
            case 'assigned':
                $queryArray['where'] .= " AND calls.assigned_user_id='$current_user->id'";
                break;
            case 'created':
                $queryArray['where'] .= " AND calls.created_by='$current_user->id'";
                break;
        }

        if (SpiceACL::getInstance() && method_exists(SpiceACL::getInstance(), 'addACLAccessToListArray')) {
            SpiceACL::getInstance()->addACLAccessToListArray($queryArray, $this);
        }

        return $queryArray['select'] . ' ' . $queryArray['from'] . ' '. $queryArray['where'] . ' ' . $queryArray['order_by'];
    }

    function get_user_calls($user, $timespan = 'today')
    {

        $timedate = TimeDate::getInstance();

        $template = $this;

        // First, get the list of IDs.
        $myquery = "SELECT id FROM calls WHERE calls.assigned_user_id = '$user->id' AND calls.deleted = 0 and calls.status = 'planned'";
        $invitedquery = "SELECT calls_users.call_id id from calls_users, calls where calls.id = calls_users.call_id AND calls_users.user_id='$user->id' AND ( calls_users.accept_status IS NULL OR  calls_users.accept_status='none') AND calls_users.deleted=0 AND calls.deleted = 0 and calls.status = 'planned'";

        switch ($timespan) {
            case 'all':
                $end = new DateTime();
                $end->setTime(23, 59, 59);
                $myquery .= " AND date_start <= '" . $timedate->asDb($end) . "'";
                $invitedquery .= " AND date_start <= '" . $timedate->asDb($end) . "'";
                break;
            case 'today':
                $start = new DateTime();
                $start->setTime(0, 0, 0);
                $end = new DateTime();
                $end->setTime(23, 59, 59);
                $myquery .= " AND calls.date_start >= '" . $timedate->asDb($start) . "' AND date_start <= '" . $timedate->asDb($end) . "'";
                $invitedquery .= " AND calls.date_start >= '" . $timedate->asDb($start) . "' AND date_start <= '" . $timedate->asDb($end) . "'";
                break;
            case 'overdue':
                $end = new DateTime();
                $end->setTime(0, 0, 0);
                $myquery .= " AND calls.date_start < '" . $timedate->asDb($end) . "'";
                $invitedquery .= " AND calls.date_start < '" . $timedate->asDb($end) . "'";
                break;
            case 'future':
                $start = new DateTime();
                $start->setTime(0, 0, 0);
                $myquery .= " AND calls.date_start > '" . $timedate->asDb($start) . "''";
                $invitedquery .= " AND calls.date_start > '" . $timedate->asDb($start) . "''";
                break;
        }

        $result = $this->db->query($myquery . ' UNION ' . $invitedquery, true);

        $list = [];

        while ($row = $this->db->fetchByAssoc($result)) {
            $record = BeanFactory::getBean('Calls', $row['id']);

            if ($record != null) {
                // this copies the object into the array
                $list[] = $record;
            }
        }
        return $list;

    }

    function get_call_users()
    {
        $template = BeanFactory::getBean('Users');
        // First, get the list of IDs.
        $query = "SELECT calls_users.required, calls_users.accept_status, calls_users.user_id from calls_users where calls_users.call_id='$this->id' AND calls_users.deleted=0";
        LoggerManager::getLogger()->debug("Finding linked records $this->object_name: " . $query);
        $result = $this->db->query($query, true);
        $list = [];

        while ($row = $this->db->fetchByAssoc($result)) {
            $template = BeanFactory::getBean('Users'); // PHP 5 will retrieve by reference, always over-writing the "old" one
            $record = $template->retrieve($row['user_id']);
            $template->required = $row['required'];
            $template->accept_status = $row['accept_status'];

            if ($record != null) {
                // this copies the object into the array
                $list[] = $template;
            }
        }
        return $list;
    }


    function set_accept_status(&$user, $status)
    {
        if ($user->object_name == 'User') {
            $relate_values = ['user_id' => $user->id, 'call_id' => $this->id];
            $data_values = ['accept_status' => $status];
            $this->set_relationship($this->rel_users_table, $relate_values, true, true, $data_values);
            $current_user = AuthenticationController::getInstance()->getCurrentUser();


        } else if ($user->object_name == 'Contact') {
            $relate_values = ['contact_id' => $user->id, 'call_id' => $this->id];
            $data_values = ['accept_status' => $status];
            $this->set_relationship($this->rel_contacts_table, $relate_values, true, true, $data_values);
        } else if ($user->object_name == 'Lead') {
            $relate_values = ['lead_id' => $user->id, 'call_id' => $this->id];
            $data_values = ['accept_status' => $status];
            $this->set_relationship($this->rel_leads_table, $relate_values, true, true, $data_values);
        }
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

}
