<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\Calls;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use DateTime;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Contacts\Contact;
use SpiceCRM\modules\Leads\Lead;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class Call extends SugarBean
{

    var $table_name = "calls";
    var $rel_users_table = "calls_users";
    var $rel_contacts_table = "calls_contacts";
    var $rel_leads_table = "calls_leads";
    var $module_dir = 'Calls';
    var $object_name = "Call";


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

    public function getDefaultStatus()
    {
        $def = $this->field_defs['status'];
        if (isset($def['default'])) {
            return $def['default'];
        } else {
            $app = SpiceUtils::returnAppListStringsLanguage($GLOBALS['current_language']);
            if (isset($def['options']) && isset($app[$def['options']])) {
                $keys = array_keys($app[$def['options']]);
                return $keys[0];
            }
        }
        return '';
    }

}
