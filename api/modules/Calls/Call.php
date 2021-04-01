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
        global $timedate;

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

        /*
        if ($this->update_vcal) {
            vCal::cache_sugar_vcal($current_user);
        }
        */

        return $return_id;
    }

    /** Returns a list of the associated contacts
     * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc..
     * All Rights Reserved..
     * Contributor(s): ______________________________________..
     */
    function get_contacts()
    {
        // First, get the list of IDs.
        $query = "SELECT contact_id as id from calls_contacts where call_id='$this->id' AND deleted=0";
        if(!empty($params)){
            if(isset($params['order_by']) && !empty($params['order_by'])){
                $query.= " ORDER BY ".$params['order_by']." ";
            }
        }
        return $this->build_related_list($query, new Contact());
    }


    function get_summary_text()
    {
        return "$this->name";
    }

    /**
     *
     * @return bool|void
     */
    function fill_in_additional_detail_fields()
    {
        global $locale;
        parent::fill_in_additional_detail_fields();

        // @deprecated
        // if (!empty($this->contact_id)) {
        // $query = "SELECT first_name, last_name FROM contacts ";
        // $query .= "WHERE id='$this->contact_id' AND deleted=0";
        // $result = $this->db->limitQuery($query, 0, 1, true, " Error filling in additional detail fields: ");

        // // Get the contact name.
        // $row = $this->db->fetchByAssoc($result);
        // \SpiceCRM\includes\Logger\LoggerManager::getLogger()->info("additional call fields $query");
        // if ($row != null) {
        // $this->contact_name = $locale->getLocaleFormattedName($row['first_name'], $row['last_name'], '', '');
        // \SpiceCRM\includes\Logger\LoggerManager::getLogger()->debug("Call($this->id): contact_name = $this->contact_name");
        // \SpiceCRM\includes\Logger\LoggerManager::getLogger()->debug("Call($this->id): contact_id = $this->contact_id");
        // }
        // }
        if (!isset($this->duration_minutes)) {
            $this->duration_minutes = $this->minutes_value_default;
        }

        global $timedate;
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

        $this->fill_in_additional_parent_fields();

        global $app_list_strings;
        $parent_types = $app_list_strings['record_type_display'];
        $disabled_parent_types = SpiceACL::getInstance()->disabledModuleList($parent_types, false, 'list');
        foreach ($disabled_parent_types as $disabled_parent_type) {
            if ($disabled_parent_type != $this->parent_type) {
                unset($parent_types[$disabled_parent_type]);
            }
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

        // @deprecated
        // if (isset ($_REQUEST['parent_type']) && (!isset($_REQUEST['action']) || $_REQUEST['action'] != 'SubpanelEdits')) {
        // $this->parent_type = $_REQUEST['parent_type'];
        // } elseif (is_null($this->parent_type)) {
        // $this->parent_type = $app_list_strings['record_type_default_key'];
        // }
    }

    function set_notification_body($xtpl, $call)
    {
        
        global $app_list_strings;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        global $app_list_strings;
        global $timedate;

        // rrs: bug 42684 - passing a contact breaks this call
        $notifyUser = ($call->current_notify_user->object_name == 'User') ? $call->current_notify_user : $current_user;


        // Assumes $call dates are in user format
        $calldate = $timedate->fromDb($call->date_start);
        $xOffset = $timedate->asUser($calldate, $notifyUser) . ' ' . $timedate->userTimezoneSuffix($calldate, $notifyUser);

        if (strtolower(get_class($call->current_notify_user)) == 'contact') {
            $xtpl->assign("ACCEPT_URL", SpiceConfig::getInstance()->config['site_url'] .
                '/index.php?entryPoint=acceptDecline&module=Calls&contact_id=' . $call->current_notify_user->id . '&record=' . $call->id);
        } elseif (strtolower(get_class($call->current_notify_user)) == 'lead') {
            $xtpl->assign("ACCEPT_URL", SpiceConfig::getInstance()->config['site_url'] .
                '/index.php?entryPoint=acceptDecline&module=Calls&lead_id=' . $call->current_notify_user->id . '&record=' . $call->id);
        } else {
            $xtpl->assign("ACCEPT_URL", SpiceConfig::getInstance()->config['site_url'] .
                '/index.php?entryPoint=acceptDecline&module=Calls&user_id=' . $call->current_notify_user->id . '&record=' . $call->id);
        }

        $xtpl->assign("CALL_TO", $call->current_notify_user->new_assigned_user_name);
        $xtpl->assign("CALL_SUBJECT", $call->name);
        $xtpl->assign("CALL_STARTDATE", $xOffset);
        $xtpl->assign("CALL_HOURS", $call->duration_hours);
        $xtpl->assign("CALL_MINUTES", $call->duration_minutes);
        $xtpl->assign("CALL_STATUS", ((isset($call->status)) ? $app_list_strings['call_status_dom'][$call->status] : ""));
        $xtpl->assign("CALL_DESCRIPTION", $call->description);

        return $xtpl;
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

        global $timedate;

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


    function get_invite_calls(&$user)
    {
        $template = $this;
        // First, get the list of IDs.
        $query = "SELECT calls_users.required, calls_users.accept_status, calls_users.call_id from calls_users where calls_users.user_id='$user->id' AND ( calls_users.accept_status IS NULL OR  calls_users.accept_status='none') AND calls_users.deleted=0";
        LoggerManager::getLogger()->debug("Finding linked records $this->object_name: " . $query);


        $result = $this->db->query($query, true);


        $list = [];


        while ($row = $this->db->fetchByAssoc($result)) {
            $record = $template->retrieve($row['call_id']);
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


    function get_notification_recipients()
    {

//		\SpiceCRM\includes\Logger\LoggerManager::getLogger()->debug('Call.php->get_notification_recipients():'.print_r($this,true));
        $list = [];
        if (!is_array($this->contacts_arr)) {
            $this->contacts_arr = [];
        }

        if (!is_array($this->users_arr)) {
            $this->users_arr = [];
        }

        if (!is_array($this->leads_arr)) {
            $this->leads_arr = [];
        }

        foreach ($this->users_arr as $user_id) {
            $notify_user = BeanFactory::getBean('Users');
            $notify_user->retrieve($user_id);
            $notify_user->new_assigned_user_name = $notify_user->full_name;
            LoggerManager::getLogger()->info("Notifications: recipient is $notify_user->new_assigned_user_name");
            $list[$notify_user->id] = $notify_user;
        }

        foreach ($this->contacts_arr as $contact_id) {
            $notify_user = new Contact();
            $notify_user->retrieve($contact_id);
            $notify_user->new_assigned_user_name = $notify_user->full_name;
            LoggerManager::getLogger()->info("Notifications: recipient is $notify_user->new_assigned_user_name");
            $list[$notify_user->id] = $notify_user;
        }

        foreach ($this->leads_arr as $lead_id) {
            $notify_user = new Lead();
            $notify_user->retrieve($lead_id);
            $notify_user->new_assigned_user_name = $notify_user->full_name;
            LoggerManager::getLogger()->info("Notifications: recipient is $notify_user->new_assigned_user_name");
            $list[$notify_user->id] = $notify_user;
        }
        
        if (isset(SpiceConfig::getInstance()->config['disable_notify_current_user']) && SpiceConfig::getInstance()->config['disable_notify_current_user']) {
            $current_user = AuthenticationController::getInstance()->getCurrentUser();
            if (isset($list[$current_user->id]))
                unset($list[$current_user->id]);
        }
//		\SpiceCRM\includes\Logger\LoggerManager::getLogger()->debug('Call.php->get_notification_recipients():'.print_r($list,true));
        return $list;
    }

    function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    function save_relationship_changes($is_update, $exclude = [])
    {
        if (empty($this->in_workflow)) {
            if (empty($this->in_import)) {
                //if the global soap_server_object variable is not empty (as in from a soap/OPI call), then process the assigned_user_id relationship, otherwise
                //add assigned_user_id to exclude list and let the logic from MeetingFormBase determine whether assigned user id gets added to the relationship
                if (!empty($GLOBALS['soap_server_object'])) {
                    $exclude = ['lead_id', 'contact_id', 'user_id'];
                } else {
                    $exclude = ['lead_id', 'contact_id', 'user_id', 'assigned_user_id'];
                }
            } else {
                $exclude = ['user_id'];
            }

        }
        parent::save_relationship_changes($is_update, $exclude);
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

    public function removeGcalId() {
        $db = DBManagerFactory::getInstance();

        $query = "UPDATE calls SET external_id = NULL WHERE id = '" . $this->id . "'";
        $result = $db->query($query);

        return $result;
    }
}
