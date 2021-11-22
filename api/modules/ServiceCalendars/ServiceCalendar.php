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
namespace SpiceCRM\modules\ServiceCalendars;

use DateTime;
use DateTimeZone;
use DateInterval;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\TimeDate;

class ServiceCalendar extends SugarBean
{
    public $module_dir = 'ServiceCalendars';
    public $object_name = 'ServiceCalendar';
    public $table_name = 'servicecalendars';

    var $workingdays;
    var $workingtimes;
    var $holidays;

    public function bean_implements($interface) {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    /**
     * overwrites teh retrieve and also loads the holidays as well as working times slots
     *
     * @param int $id
     * @param bool $encode
     * @param bool $deleted
     * @param bool $relationships
     * @return SugarBean|null
     */
    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true) {
        $ret = parent::retrieve($id, $encode, $deleted, $relationships);

        // determine the calendar details
        $this->retrieveCalendarWorkingTimes();

        return $ret;
    }

    /**
     * reteives the array of working days and the holidays for the calendar
     *
     * @return array
     */
    public function retrieveCalendarWorkingTimes() {
        $db = DBManagerFactory::getInstance();

        $this->holidays = [];
        if ($this->systemholidaycalendar_id) {
            $holidayCalendar = BeanFactory::getBean('SystemHolidayCalendars', $this->systemholidaycalendar_id);
            $this->holidays = $holidayCalendar->getHolidays();
        }

        $this->workingtimes = [];
        $this->workingdays = [];
        $workingTimes = $db->query("SELECT id, dayofweek, timestart, timeend FROM servicecalendartimes WHERE servicecalendar_id = '$this->id' ORDER BY dayofweek, timestart");
        while ($workingTime = $db->fetchByAssoc($workingTimes)) {
            $this->workingtimes[] = (object)$workingTime;
            if (array_search($workingTime['dayofweek'], $this->workingdays) === false) $this->workingdays[] = $workingTime['dayofweek'];
        }
    }

    /**
     * takes a startdate and addas a given number of workingdays considering all workingdays per calendar as well as the holidays
     *
     * @param $startdate
     * @param $days
     * @return mixed
     * @throws Exception
     */
    public function addNWorkingDays($startdate, $days) {
        $timedate = TimeDate::getInstance();
        // if we have no working days and no holidays .. just add the days
        if (count($this->workingdays) == 0 && count($this->holidays) == 0) {
            $startdate->add(new DateInterval("P{$days}D"));
        } else {
            $i = 0;
            while ($i < $days) {
                // add a day
                $startdate->add(new DateInterval("P1D"));

                // check if the day is a working day according to the calendar
                // if not add another day
                while (!$this->isWorkingDay($startdate) || $this->isHoliday($startdate)) {
                    $startdate->add(new DateInterval("P1D"));
                }

                $i++;
            }
        }

        return $startdate;
    }

    /**
     * adds a number of working hours to a date according to the calendar definition and considers also holidays if a holiday calendar is attached to the calendar
     *
     * @param $startdate
     * @param $hours
     * @return mixed
     * @throws Exception
     */
    public function addNWorkingHours($startdate, $hours) {
        // convert the timestamp to calendar Time
        $calendarStartTime = new DateTime($startdate->format('c'), new DateTimeZone('UTC'));
        $calendarStartTime->setTimezone(new DateTimeZone($this->timezone));

        // calculkate all the times in Caldnartime
        $endDate = $this->addWorkingHours($calendarStartTime, $hours);

        // format back to UTC
        return $endDate->setTimezone(new DateTimeZone('UTC'));
    }

    /**
     * chek if the given date is a working day. If there are no working days defined in the calendar assume all days are working days and return true
     *
     * @param $date
     * @return bool
     */
    private function isWorkingDay($date) {
        return count($this->workingdays) > 0 && array_search($date->format('N'), $this->workingdays) === false ? false : true;
    }

    /**
     * chek if the given date is a holiday
     * @param $date
     * @return bool
     */
    private function isHoliday($date) {
        $timedate = TimeDate::getInstance();
        return array_search($date->format($timedate->get_db_date_format()), $this->holidays) !== false ? true : false;
    }

    /**
     * checks if the given date is a working hour
     *
     * @param $date
     * @param $workingtimeslots
     * @return bool
     */
    private function isWorkingTime($date) {

        if (!$this->isWorkingDay($date) || $this->isHoliday($date)) return false;

        $mtime = $date->format('Hi');
        foreach ($this->workingtimes as $workingtimeslot) {
            if ($workingtimeslot->dayofweek == $date->format('N') && $workingtimeslot->timestart <= $mtime && $workingtimeslot->timeend >= $mtime) {
                return true;
            }
        }
        return false;
    }

    /**
     * returns the next working timestart date
     *
     * @ToDo: Test ... this function is not yet tested
     *
     * @param $date
     */
    private function getNextWorkingStartTime($date = null) {

        // create a new Startdate time object
        $startDate = new DateTime($date ? $date->format('c') : '');

        // check if we have a owrkingday .. other wise move one day and set to 00:00
        while (!$this->isWorkingDay($startDate) || $this->isHoliday($startDate)) {
            $startDate->add(new DateInterval('P1D'));
            $startDate->setTime(0, 0, 0);
        }

        // if we have no workingtimeslots return the curren date
        if (count($this->workingtimes) == 0) {
            return $startDate;
        }

        // the simples of while loops
        while (!$this->checkCalendartimes($startDate)) ;

        // return the startdate
        return $startDate;
    }

    /**
     * runs through the calendar times
     *
     * @param $startDate
     */
    private function checkCalendartimes(&$startDate) {
        $startTime = $startDate->format('Hi');
        // loop through workingtimes
        foreach ($this->workingtimes as $workingtime) {
            // if we are past the startday then the first slot that hits is the start date
            if ($startDate->format('N') < $workingtime->dayofweek) {
                $diff = $workingtime->dayofweek - $startDate->format('N');
                $startDate->add(new DateInterval("P{$diff}D"));
                if ($this->isWorkingDay($startDate) && !$this->isHoliday($startDate)) {
                    // set the time
                    $startDate->setTime(substr($workingtime->timestart,0, 2), substr($workingtime->timestart,2, 2), 0);
                    return true;
                }
            } else if ($workingtime->dayofweek == $startDate->format('N') && $workingtime->timeend >= $startTime) {
                // check if we hit the current window .. the startime is before the endtime of an interval
                // if the startdate is also after the startdate we are in a working window
                // otherwise set the starttime to the startime of the window
                if ($workingtime->timestart >= $startTime) {
                    $startDate->setTime(substr( $workingtime->timestart,0, 2), substr($workingtime->timestart,2, 2), 0);
                }
                return true;
            }
        }

        // we did not find a slot this week ... add days until we are on Sunday 00:00 and then start over
        $startDate->setTime(0, 0, 0);
        while($startDate->format('N') != 1) $startDate->add(new DateInterval('P1D'));

        return false;
    }

    /**
     * adds working hours to a date accoring to the calendar in teh calendar timezon considring non working and holidays
     *
     * @param $startDate
     * @param $hours
     * @return DateTime
     * @throws Exception
     */
    private function addWorkingHours($startDate, $hours) {
        // internally we work with minutes
        $minutes = $hours * 60;

        // create a new Startdate time object
        $endDate = new DateTime($startDate ? $startDate->format('c') : '', new DateTimeZone($this->timezone));

        // check if we have a owrkingday .. other wise move one day and set to 00:00
        while (!$this->isWorkingDay($endDate) || $this->isHoliday($endDate)) {
            $endDate->add(new DateInterval('P1D'));
            $endDate->setTime(0, 0, 0);
        }

        // if we have no workingtimeslots return the date + the minutes
        if (count($this->workingtimes) == 0) {
            $endDate->add(new DateInterval("PT{$minutes}M"));
            return $endDate;
        }

        // run the loop to add timeslots until we have zero minutes left
        while($minutes > 0){
            $this->addCalendarMinutes($endDate, $minutes);
        }

        // return the startdate
        return $endDate;

    }

    /**
     * runs through the calendar times
     *
     * @param $startDate
     */
    private function addCalendarMinutes(&$date, &$minutes) {
        $startTime = $date->format('Hi');
        // loop through workingtimes
        foreach ($this->workingtimes as $workingtime) {
            // if we are past the startday then the first slot that hits is the start date
            if ($date->format('N') < $workingtime->dayofweek) {
                $diff = $workingtime->dayofweek - $date->format('N');
                $date->add(new DateInterval("P{$diff}D"));
                if ($this->isWorkingDay($date) && !$this->isHoliday($date)) {
                    // set the time to the start time of the segment
                    $date->setTime(substr($workingtime->timestart, 0, 2), substr($workingtime->timestart,2, 2), 0);

                    // get the diff minutes
                    $slotminutes = $this->getMinutesBetweenTimestamps($date->format('Hi'), $workingtime->timeend);
                    if($slotminutes > $minutes){
                        $date->add(new DateInterval("PT{$minutes}M"));
                        $minutes = 0;
                        return true;
                    } else {
                        $date->add(new DateInterval("PT{$slotminutes}M"));
                        $minutes = $minutes - $slotminutes;
                    }
                }
            } else if ($workingtime->dayofweek == $date->format('N') && $workingtime->timeend >= $startTime) {
                // check if we hit the current window .. the startime is before the endtime of an interval
                // if the startdate is also after the startdate we are in a working window
                // otherwise set the starttime to the startime of the window
                if ($workingtime->timestart >= $startTime) {
                    $date->setTime(substr($workingtime->timestart,0, 2), substr($workingtime->timestart,2, 2), 0);
                }

                // get the diff minutes
                $slotminutes = $this->getMinutesBetweenTimestamps($date->format('Hi'), $workingtime->timeend);
                if($slotminutes > $minutes){
                    $date->add(new DateInterval("PT{$minutes}M"));
                    $minutes = 0;
                    return true;
                } else {
                    $date->add(new DateInterval("PT{$slotminutes}M"));
                    $minutes = $minutes - $slotminutes;
                }
            }
        }

        // we did not find a slot this week ... add days until we are on Sunday 00:00 and then start over
        $date->setTime(0, 0, 0);
        while($date->format('N') != 1) $date->add(new DateInterval('P1D'));

        // retrun false
        return false;
    }

    /**
     * calculates the total minutes between two military timestamps
     *
     * @param $startpoint e.g. 0800
     * @param $endpoint e.g. 1530
     */
    private function getMinutesBetweenTimestamps($startpoint, $endpoint) {
        $minutes = (int) substr($endpoint,2, 2) - (int) substr($startpoint,2, 2);;
        $hours = (int) substr($endpoint,0, 2) - (int) substr($startpoint,0, 2);
        return $hours * 60 + $minutes;
    }
}
