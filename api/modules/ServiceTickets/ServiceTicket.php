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

namespace SpiceCRM\modules\ServiceTickets;

use DateTime;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\SpiceNumberRanges\SpiceNumberRanges;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\extensions\modules\QuestionAnswers\QuestionAnsweringHandler;

class ServiceTicket extends SugarBean
{
    public $module_dir = 'ServiceTickets';
    public $object_name = 'ServiceTicket';
    public $table_name = 'servicetickets';

    private $stageFields = ['assigned_user_id', 'serviceticket_status', 'serviceticket_class', 'servicequeue_id', 'sysservicecategory_id1', 'sysservicecategory_id2', 'sysservicecategory_id3', 'sysservicecategory_id4'];

    public $sysnumberranges = true; //entries in table sysnumberranges required!

    public function get_summary_text()
    {
        return $this->serviceticket_number . '/' . $this->name;
    }

    public function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    private function detetctStageChange()
    {
        foreach ($this->stageFields as $stageField) {
            if ($this->$stageField != $this->fetched_row[$stageField])
                return true;
        }
    }

    /**
     * overwrite the retrieve and also add the email1 to the ticket
     *
     * @param int $id
     * @param bool $encode
     * @param bool $deleted
     * @param bool $relationships
     * @return ServiceTicket|null
     */
    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $bean = parent::retrieve($id, $encode, $deleted, $relationships);

        if (!empty($this->contact_id)) {
            $contact = BeanFactory::getBean('Contacts', $this->contact_id);
            $this->email1 = $contact->email1;
        }

        return $bean;
    }

    public function save($check_notify = false, $fts_index_bean = true)
    {
        $timedate = TimeDate::getInstance();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        //set serviceticket_number
        if (empty($this->serviceticket_number)) {
            $this->serviceticket_number = str_pad(SpiceNumberRanges::getNextNumberForField('ServiceTickets', 'serviceticket_number'), 10, '0', STR_PAD_LEFT);
        }
        //set date_closed
        if ($this->serviceticket_status == 'Closed' && empty($this->date_closed)) {
            $sdt = new TimeDate();
            $this->date_closed = gmdate($sdt->get_db_date_time_format());
        }

        if (empty($this->serviceticket_status)) $this->serviceticket_status = 'New';

        if ($this->serviceticket_status != $this->fetched_row['serviceticket_status']) {
            switch ($this->serviceticket_status) {
                case 'Assigned':
                    $this->assigned_user_id = $current_user->id;
                    $this->assigned_user_name = $current_user->get_summary_text();
                    break;
                case 'In Process':
                case 'Pending Input':
                case 'Closed':
                    $this->assigned_user_id = '';
                    $this->assigned_user_name = '';
                    break;
            }
        }


        if (!$this->in_save && $this->detetctStageChange()) {
            $ticketStage = BeanFactory::getBean('ServiceTicketStages');
            if ($ticketStage) {
                if (empty($this->id)) {
                    $this->id = create_guid();
                    $this->new_with_id = true;
                }

                foreach ($this->stageFields as $stageField) {
                    $ticketStage->$stageField = $this->$stageField;
                }

                $ticketStage->name = $this->serviceticket_number . ' ' . $timedate->nowDb();
                $ticketStage->created_by = $this->id;
                $ticketStage->serviceticket_id = $this->id;
                $ticketStage->save();
            }
        }

        // determine SLAs
        if (empty($this->serviceticketsla_id)) {
            $sla = BeanFactory::getBean('ServiceTicketSLAs');
            if($sla) {
                $sla->determineSLAforTicket($this);
            }

        }
        /**
         * if(!empty($this->serviceticket_type) && !empty($this->serviceticket_class) && empty($this->resolve_until)){
         * $sla = $this->db->fetchByAssoc($this->db->query("SELECT * FROM serviceticketslas WHERE serviceticket_type='$this->serviceticket_type' AND serviceticket_class='$this->serviceticket_class'"));
         * if($sla){
         * if($sla['time_to_response']){
         * $responsedate = $this->getSLAStartDate();
         * $responsedate->add(new DateInterval("PT{$sla['time_to_response']}H"));
         * $this->respond_until = $responsedate->format($timedate->get_db_date_time_format());
         * }
         *
         * if($sla['time_to_resolution']){
         * $resolvedate = $this->getSLAStartDate();
         * $resolvedate->add(new DateInterval("PT{$sla['time_to_resolution']}H"));
         * $this->resolve_until = $resolvedate->format($timedate->get_db_date_time_format());
         * }
         * }
         * }
         */

        // set the closed date
        if ($this->serviceticket_status == 'Closed' || $this->serviceticket_status == 'Rejected' || $this->serviceticket_status == 'Duplicate') {
            $closeDate = new DateTime();
            $this->resolve_date = $closeDate->format($timedate->get_db_date_time_format());
        } else {
            $this->resolve_date = '';
        }

        // determine the notification status
        $this->has_notification = $this->determineNotificationStatus();

        if (!empty(json_decode($this->questionnaire_answers, true))) {
            QuestionAnsweringHandler::saveAnswers_byParent(json_decode($this->questionnaire_answers, true)['answers'], 'ServiceTickets', $this->id, true);
        }

        return parent::save($check_notify);

    }

    /**
     * check if there are unread emails resp also to be extended to serviceticketnotes
     */
    public function determineNotificationStatus()
    {
        $unreadEmailCount = $this->db->fetchByAssoc($this->db->query("SELECT COUNT(id) total FROM emails WHERE parent_id = '{$this->id}' and status = 'unread' AND deleted = 0"));
        $unreadNoteCount = $this->db->fetchByAssoc($this->db->query("SELECT COUNT(id) total FROM servicetickets WHERE serviceticket_id = '{$this->id}' and servicenote_status = 'unread' AND deleted = 0"));
        return $unreadEmailCount['total'] > 0 || $unreadNoteCount['total'] > 0 ? 1 : 0;
    }

    /**
     * determine the SLA Date and Time
     *
     * @return DateTime|false
     */
    private function getSLAStartDate()
    {
        $timedate = TimeDate::getInstance();
        if (empty($this->date_entered)) {
            return new DateTime();
        } else {
            return date_create_from_format($timedate->get_db_date_time_format(), $this->date_entered);
        }
    }


    function getUserQueuesTickets()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        // get the users queues
        $current_user->load_relationship('servicequeues');
        $queues = $current_user->get_linked_beans('servicequeues', 'ServiceQueue');
        $queuesArray = [];
        foreach ($queues as $queue) {
            $queuesArray[] = "'" . $queue->id . "'";
        }

        if (count($queuesArray) == 0)
            return [];

        // load the tickets
        $whereClauseArray = [];
        $whereClauseArray[] = "servicetickets.serviceticket_status = 'New'";
        $whereClauseArray[] = "servicetickets.servicequeue_id in (" . implode(',', $queuesArray) . ")";
        // function get_list($order_by = "", $where = "", $row_offset = 0, $limit = -1, $max = -1, $show_deleted = 0, $singleSelect = false, $select_fields = array())
        return $this->get_list("date_entered", implode(' AND ', $whereClauseArray));

    }


    function getUserOpenTickets()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        // load the tickets
        $whereClauseArray = [];
        $whereClauseArray[] = "servicetickets.serviceticket_status <> 'Closed'";
        $whereClauseArray[] = "servicetickets.assigned_user_id ='$current_user->id'";
        return $this->get_list("date_entered", implode(' AND ', $whereClauseArray));

    }

}
