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
use SpiceCRM\data\SpiceBean;
use DateTime;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class Task extends SpiceBean
{
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
