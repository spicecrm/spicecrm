<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\Tasks;

use DateInterval;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use DateTime;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class Task extends SugarBean
{

    public $table_name = "tasks";
    public $object_name = "Task";
    public $module_dir = 'Tasks';

    /**
     * Available status values
     */
    const NOT_STARTED = 'Not Started';
    const IN_PROGRESS = 'In Progress';
    const COMPLETED = 'Completed';
    const PENDING_INPUT = 'Pending Input';
    const DEFERRED = 'Deferred';


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
            $app = SpiceUtils::returnAppListStringsLanguage($GLOBALS['current_language']);
            if (isset($def['options']) && isset($app[$def['options']])) {
                $keys = array_keys($app[$def['options']]);
                return $keys[0];
            }
        }
        return '';
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
