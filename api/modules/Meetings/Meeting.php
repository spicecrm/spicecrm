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
namespace SpiceCRM\modules\Meetings;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use DateTime;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Contacts\Contact;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\includes\TimeDate;

class Meeting extends SugarBean
{

    var $table_name = "meetings";
    var $module_dir = "Meetings";
    var $object_name = "Meeting";

    var $date_changed = false;

    // save date_end by calculating user input
    // this is for calendar
    function save($check_notify = FALSE, $fts_index_bean = TRUE)
    {
        $timedate = TimeDate::getInstance();

        if (isset($this->date_start)) {
            $td = $timedate->fromDb($this->date_start);
            if (!$td) {
                $this->date_start = $timedate->to_db($this->date_start);
                $td = $timedate->fromDb($this->date_start);
            }
            if ($td) {
                if (isset($this->duration_hours) && $this->duration_hours != '') {
                    $this->duration_hours = (int)$this->duration_hours;
                    $td->modify("+{$this->duration_hours} hours");
                }
                if (isset($this->duration_minutes) && $this->duration_minutes != '') {
                    $this->duration_minutes = (int)$this->duration_minutes;
                    $td->modify("+{$this->duration_minutes} mins");
                }
                if (isset($this->date_end)) {
                    $dateEnd = $timedate->fromDb($this->date_end);
                    if ($dateEnd) {
                        $td = $dateEnd;
                    }
                }
                $this->date_end = $td->format($timedate::DB_DATETIME_FORMAT);
            }
        }


        $return_id = parent::save($check_notify, $fts_index_bean);

        // check if contact_id is set
        if (!empty($this->contact_id)) {
            $this->load_relationship('contacts');
            $this->contacts->add($this->contact_id);
        }


        return $return_id;
    }


    function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $ret = parent::retrieve($id, $encode, $deleted, $relationships);

        if($ret && !is_null($this->date_start) && !is_null($this->date_end)){
            $startDateObj = new DateTime($this->date_start);
            $endDateObj = new DateTime($this->date_end);
            $interval = $startDateObj->diff($endDateObj);
            $this->duration_hours = $interval->format('%h');
            $this->duration_minutes = $interval->format('%i');
        }

        return $ret;
    }


    function get_user_meetings($user, $timespan = 'today')
    {

        $timedate = TimeDate::getInstance();

        $template = $this;

        // get the own meetings
        $myquery = "SELECT id FROM meetings WHERE deleted = 0 AND assigned_user_id = '$user->id' AND status = 'planned'";

        // First, get the list of IDs.
        $invitedquery = "SELECT meetings.id FROM meetings, meetings_users WHERE meetings.id = meetings_users.meeting_id AND meetings_users.user_id='$user->id' AND meetings_users.deleted=0 AND meetings.deleted = 0 AND meetings.status = 'planned'";

        // add the timespan
        switch ($timespan) {
            case 'all':
                $end = new DateTime();
                $end->setTime(23, 59, 59);
                $invitedquery .= " AND meetings.date_start <= '" . $timedate->asDb($end) . "'";
                $myquery .= " AND meetings.date_start <= '" . $timedate->asDb($end) . "'";
                break;
            case 'today':
                $start = new DateTime();
                $start->setTime(0, 0, 0);
                $end = new DateTime();
                $end->setTime(23, 59, 59);
                $invitedquery .= " AND meetings.date_start >= '" . $timedate->asDb($start) . "' AND meetings.date_start <= '" . $timedate->asDb($end) . "'";
                $myquery .= " AND meetings.date_start >= '" . $timedate->asDb($start) . "' AND meetings.date_start <= '" . $timedate->asDb($end) . "'";
                break;
            case 'overdue':
                $end = new DateTime();
                $end->setTime(0, 0, 0);
                $invitedquery .= " AND meetings.date_start < '" . $timedate->asDb($end) . "'";
                $myquery .= " AND meetings.date_start < '" . $timedate->asDb($end) . "'";
                break;
            case 'future':
                $start = new DateTime();
                $start->setTime(0, 0, 0);
                $invitedquery .= " AND meetings.date_start > '" . $timedate->asDb($start) . "''";
                $myquery .= " AND meetings.date_start > '" . $timedate->asDb($start) . "''";
                break;
        }

        $result = $this->db->query($invitedquery . ' UNION ' . $myquery, true);

        $list = [];

        while ($row = $this->db->fetchByAssoc($result)) {
            $record = BeanFactory::getBean('Meetings', $row['id']);

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
        $query = "SELECT DISTINCT(meetings.id), date_start sortdate, 'Meetings' module FROM meetings LEFT JOIN meetings_contacts on meetings.id = meetings_contacts.meeting_id where ((parent_type = '$parentModule' and parent_id = '$parentId') OR meetings_contacts.contact_id='$parentId') and meetings.deleted = 0 and status in ('Planned')";

        switch ($own) {
            case 'assigned':
                $query .= " AND meetings.assigned_user_id='$current_user->id'";
                break;
            case 'created':
                $query .= " AND meetings.created_by='$current_user->id'";
                break;
        }

        return $query;
    }

    function get_history_query($parentModule, $parentId, $own = false)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $queryArray = [
            'select' => "SELECT meetings.id, date_start sortdate, 'Meetings' module",
            'from' => "FROM meetings LEFT JOIN meetings_contacts on meetings.id = meetings_contacts.meeting_id",
            'where' => "WHERE ((parent_type = '$parentModule' AND parent_id = '$parentId') OR meetings_contacts.contact_id='$parentId') AND meetings.deleted = 0 AND status NOT IN ('Planned')",
            'order_by' => ""
        ];

        switch ($own) {
            case 'assigned':
                $queryArray['where'] .= " AND meetings.assigned_user_id='$current_user->id'";
                break;
            case 'created':
                $queryArray['where'] .= " AND meetings.created_by='$current_user->id'";
                break;
        }

        if (SpiceACL::getInstance() && method_exists(SpiceACL::getInstance(), 'addACLAccessToListArray')) {
            SpiceACL::getInstance()->addACLAccessToListArray($queryArray, $this);
        }

        return $queryArray['select'] . ' ' . $queryArray['from'] . ' ' . $queryArray['where'] . ' ' . $queryArray['order_by'];
    }

}

