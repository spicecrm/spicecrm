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

namespace SpiceCRM\includes;

use DateTime;
use DateTimeZone;
use Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarCache\SugarCache;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Users\User;
use SpiceCRM\includes\authentication\AuthenticationController;

/**
  * New Time & Date handling class
  * @api
  * Migration notes:
  * - to_db_time() requires either full datetime or time, won't work with just date
  * 	The reason is that it's not possible to know if short string has only date or only time,
  *     and it makes more sense to assume time for the time conversion function.
  */
class TimeDate
{
	const DB_DATE_FORMAT = 'Y-m-d';
	const DB_TIME_FORMAT = 'H:i:s';
    // little optimization
	const DB_DATETIME_FORMAT = 'Y-m-d H:i:s';
	const RFC2616_FORMAT = 'D, d M Y H:i:s \G\M\T';

    const SECONDS_IN_A_DAY = 86400;

    // Standard DB date/time formats
    // they are constant, vars are for compatibility
	public $dbDayFormat = self::DB_DATE_FORMAT;
    public $dbTimeFormat = self::DB_TIME_FORMAT;

    /**
     * Regexp for matching format elements
     * @var array
     */
    protected static $format_to_regexp = [
    	'a' => '[ ]*[ap]m',
    	'A' => '[ ]*[AP]M',
    	'd' => '[0-9]{1,2}',
    	'j' => '[0-9]{1,2}',
    	'h' => '[0-9]{1,2}',
    	'H' => '[0-9]{1,2}',
    	'g' => '[0-9]{1,2}',
    	'G' => '[0-9]{1,2}',
   		'i' => '[0-9]{1,2}',
    	'm' => '[0-9]{1,2}',
    	'n' => '[0-9]{1,2}',
    	'Y' => '[0-9]{4}',
        's' => '[0-9]{1,2}',
    	'F' => '\w+',
    	"M" => '[\w]{1,3}',
    ];

    /**
     * Relation between date() and strftime() formats
     * @var array
     */
    public static $format_to_str = [
		// date
    	'Y' => '%Y',

    	'm' => '%m',
    	'M' => '%b',
    	'F' => '%B',
	    'n' => '%m',

       	'd' => '%d',
    	//'j' => '%e',
    	// time
       	'a' => '%P',
       	'A' => '%p',

    	'h' => '%I',
       	'H' => '%H',
    	//'g' => '%l',
       	//'G' => '%H',

       	'i' => '%M',
       	's' => '%S',
    ];

    /**
     * GMT timezone object
     *
     * @var DateTimeZone
     */
    protected static $gmtTimezone;

    /**
     * Current time
     * @var SugarDateTime
     */
    protected $now;

    /**
     * Current user's ID
     *
     * @var string
     */
    protected $current_user_id;
    /**
     * Current user's TZ
     * @var DateTimeZone
     */
    protected $current_user_tz;

    /**
     * Separator for current user time format
     *
     * @var string
     */
    protected $time_separator;

    /**
     * Always consider user TZ to be GMT and date format DB format - for SOAP etc.
     *
     * @var bool
     */
    protected $always_db = true;

    /**
     * Global instance of TimeDate
     * @var TimeDate
     */
    protected static $timedate;

    /**
     * Allow returning cached now() value
     * If false, new system time is checked each time now() is required
     * If true, same value is returned for whole request.
     * Also, current user's timezone is cached.
     * @var bool
     */
    public $allow_cache = true;

    /**
     * Create TimeDate handler
     * @param User $user User to work with, default if current user
     */
    public function __construct(User $user = null)
    {
        if (self::$gmtTimezone == null) {
            self::$gmtTimezone = new DateTimeZone("UTC");
        }
        $this->now = new DateTime();
        $this->tzGMT($this->now);
        $this->user = $user;
    }

    /**
     * Get TimeDate instance
     * @return TimeDate
     */
    public static function getInstance()
    {
        if(empty(self::$timedate)) {
            if(ini_get('date.timezone') == '') {
                // Remove warning about default timezone
                date_default_timezone_set(@date('e'));
                try {
                    $tz = self::guessTimezone();
                } catch(Exception $e) {
                    $tz = "UTC"; // guess failed, switch to UTC
                }
                //BEGIN workaround SpiceLogger
                if(LoggerManager::getLogger()) {
                    LoggerManager::getLogger()->fatal("Configuration variable date.timezone is not set, guessed timezone $tz. Please set date.timezone=\"$tz\" in php.ini!");
                }
                //file_put_contents("sugarcrm.log", "Configuration variable date.timezone is not set, guessed timezone $tz. Please set date.timezone=\"$tz\" in php.ini!\n", FILE_APPEND);
                //END
                date_default_timezone_set($tz);
            }
            self::$timedate = new self;
        }
        return self::$timedate;
    }

    /**
     * Figure out what the required user is
     *
     * The order is: supplied parameter, TimeDate's user, global current user
     *
     * @param User $user User object, default is current user
     * @internal
     * @return User
     */
    protected function _getUser(User $user = null)
    {
        return AuthenticationController::getInstance()->getCurrentUser();
    }

    /**
     * Get timezone for the specified user
     *
     * @param User $user User object, default is current user
     * @return DateTimeZone
     */
    protected function _getUserTZ(User $user = null)
    {
        $user = $this->_getUser($user);
        if (empty($user) || $this->always_db) {
            return self::$gmtTimezone;
        }

        if ($this->allow_cache && $user->id == $this->current_user_id && ! empty($this->current_user_tz)) {
            // current user is cached
            return $this->current_user_tz;
        }

        $usertimezone = $user->getPreference('timezone');
        if(empty($usertimezone)) {
            return self::$gmtTimezone;
        }
        try {
            $tz = new DateTimeZone($usertimezone);
        } catch (Exception $e) {
            LoggerManager::getLogger()->fatal('Unknown timezone: ' . $usertimezone);
            return self::$gmtTimezone;
        }

        if (empty($this->current_user_id)) {
            $this->current_user_id = $user->id;
            $this->current_user_tz = $tz;
        }

        return $tz;
    }


    /**
     * Get user date format.
     * @todo add caching
     *
     * @param User $user user object, current user if not specified
     * @return string
     */
    public function get_date_format(User $user = null)
    {
        $user = $this->_getUser($user);

        if (empty($user) || $this->always_db) {
            return self::DB_DATE_FORMAT;
        }

        $datef = $user->getPreference('datef');
        if(empty($datef) && AuthenticationController::getInstance()->getCurrentUser() && AuthenticationController::getInstance()->getCurrentUser() !== $user) {
            // if we got another user and it has no date format, try current user
            $datef = AuthenticationController::getInstance()->getCurrentUser()->getPreference('datef');
        }
        if (empty($datef)) {
            $datef = SpiceConfig::getInstance()->config['default_date_format'];
        }
        if (empty($datef)) {
            $datef = '';
        }

        return $datef;
    }

    /**
     * Get user time format.
     * @todo add caching
     *
     * @param User $user user object, current user if not specified
     * @return string
     */
    public function get_time_format(/*User*/ $user = null)
    {
        if(is_bool($user) || func_num_args() > 1) {
            // BC dance - old signature was boolean, User
            LoggerManager::getLogger()->fatal('\SpiceCRM\includes\TimeDate::get_time_format(): Deprecated API used, please update you code - get_time_format() now has one argument of type User');
            if(func_num_args() > 1) {
                $user = func_get_arg(1);
            } else {
                $user = null;
            }
        }
        $user = $this->_getUser($user);

        if (empty($user) || $this->always_db) {
            return self::DB_TIME_FORMAT;
        }

        $timef = $user->getPreference('timef');
        if(empty($timef) && AuthenticationController::getInstance()->getCurrentUser() && AuthenticationController::getInstance()->getCurrentUser() !== $user) {
            // if we got another user and it has no time format, try current user
            $timef = AuthenticationController::getInstance()->getCurrentUser()->getPreference('$timef');
        }
        if (empty($timef)) {
            $timef = SpiceConfig::getInstance()->config['default_time_format'];
        }
        if (empty($timef)) {
            $timef = '';
        }
        return $timef;
    }

    /**
     * Get user datetime format.
     *
     * @param User $user user object, current user if not specified
     * @return string
     */
    public function get_date_time_format($user = null)
    {
        // BC fix - had (bool, user) signature before
        if(!($user instanceof User)) {
            if(func_num_args() > 1) {
                $user = func_get_arg(1);
                if(!($user instanceof User)) {
                    $user = null;
                }
            } else {
                $user = null;
            }
        }

        $cacheKey= $this->get_date_time_format_cache_key($user);
        $cachedValue = SugarCache::sugar_cache_retrieve($cacheKey);

        if(!empty($cachedValue) )
        {
            return $cachedValue;
        }
        else
        {
            $value = $this->merge_date_time($this->get_date_format($user), $this->get_time_format($user));
            SugarCache::sugar_cache_put($cacheKey,$value,0);
            return $value;
        }
    }

    /**
     * Retrieve the cache key used for user date/time formats
     *
     * @param $user
     * @return string
     */
    public function get_date_time_format_cache_key($user)
    {
        $cacheKey = get_class($this) ."dateTimeFormat";
        $user = $this->_getUser($user);

        if($user instanceof User)
        {
           $cacheKey .= "_{$user->id}";
        }

        if( $this->always_db )
            $cacheKey .= '_asdb';

        return $cacheKey;
    }

    /**
     * Make one datetime string from date string and time string
     *
     * @param string $date
     * @param string $time
     * @return string New datetime string
     */
    function merge_date_time($date, $time)
    {
        return $date . ' ' . $time;
    }

    /**
     * Split datetime string into date & time
     *
     * @param string $datetime
     * @return array
     */
    function split_date_time($datetime)
    {
        return explode(' ', $datetime, 2);
    }


    /**
     * Format DateTime object as DB datetime
     *
     * @param DateTime $date
     * @return string
     */
    public function asDb(DateTime $date)
    {
        $date->setTimezone(self::$gmtTimezone);
        return $date->format($this->get_db_date_time_format());
    }

    /**
     * Format DateTime object as user datetime
     *
     * @param DateTime $date
     * @param User $user
     * @return string
     */
    public function asUser(DateTime $date, User $user = null)
    {
        $this->tzUser($date, $user);
        return $date->format($this->get_date_time_format($user));
    }

    /**
     * Format DateTime object as DB date
     * Note: by default does not convert TZ!
     * @param DateTime $date
     * @param boolean $tz Perform TZ conversion?
     * @return string
     */
    public function asDbDate(DateTime $date, $tz = false)
    {
        if($tz) $date->setTimezone(self::$gmtTimezone);
        return $date->format($this->get_db_date_format());
    }

    /**
     * Format DateTime object as user date
     * Note: by default does not convert TZ!
     * @param DateTime $date
     * @param boolean $tz Perform TZ conversion?
     * @param User $user
     * @return string
     */
    public function asUserDate(DateTime $date, $tz = false, User $user = null)
    {
        if($tz) $this->tzUser($date, $user);
        return $date->format($this->get_date_format($user));
    }

    /**
     * Format DateTime object as DB time
     *
     * @param DateTime $date
     * @return string
     */
    public function asDbTime(DateTime $date)
    {
        $date->setTimezone(self::$gmtTimezone);
        return $date->format($this->get_db_time_format());
    }

    /**
     * Format DateTime object as user time
     *
     * @param DateTime $date
     * @param User $user
     * @return string
     */
    public function asUserTime(DateTime $date, User $user = null)
    {
        $this->tzUser($date, $user);
        return $date->format($this->get_time_format($user));
    }

    /**
     * Get DateTime from DB datetime string
     *
     * @param string $date
     * @return DateTime
     */
    public function fromDb($date)
    {
        try {
            return DateTime::createFromFormat(self::DB_DATETIME_FORMAT, $date, self::$gmtTimezone);
        } catch (Exception $e) {
            LoggerManager::getLogger()->error("fromDb: Conversion of $date from DB format failed: {$e->getMessage()}");
            return null;
        }
    }


    /**
     * Get DateTime from DB date string
     *
     * @param string $date
     * @return SugarDateTime
     */
    public function fromDbDate($date)
    {
        try {
            return DateTime::createFromFormat(self::DB_DATE_FORMAT, $date, self::$gmtTimezone);
        } catch (Exception $e) {
            LoggerManager::getLogger()->error("fromDbDate: Conversion of $date from DB format failed: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Get DateTime from DB datetime string using non-standard format
     *
     * Non-standard format usually would be only date, only time, etc.
     *
     * @param string $date
     * @param string $format format to accept
     * @return SugarDateTime
     */
    public function fromDbFormat($date, $format)
    {
        try {
            return DateTime::createFromFormat($format, $date, self::$gmtTimezone);
        } catch (Exception $e) {
            LoggerManager::getLogger()->error("fromDbFormat: Conversion of $date from DB format $format failed: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Get DateTime from user datetime string
     *
     * @param string $date
     * @param User $user
     * @return SugarDateTime
     */
    public function fromUser($date, User $user = null)
    {
        $res = null;
        try {
            $res = DateTime::createFromFormat($this->get_date_time_format($user), $date, $this->_getUserTZ($user));
        } catch (Exception $e) {
            LoggerManager::getLogger()->error("fromUser: Conversion of $date exception: {$e->getMessage()}");
        }
        if(!($res instanceof DateTime)) {
            $uf = $this->get_date_time_format($user);
            LoggerManager::getLogger()->error("fromUser: Conversion of $date from user format $uf failed");
            return null;
        }
        return $res;
    }



    /**
     * Create a date object from any string
     *
     * Same formats accepted as for DateTime ctor
     *
     * @param string $date
     * @param User $user
     * @return SugarDateTime
     */
    public function fromString($date, User $user = null)
    {
        try {
            return new DateTime($date, $this->_getUserTZ($user));
        } catch (Exception $e) {
            LoggerManager::getLogger()->error("fromString: Conversion of $date from string failed: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Create DateTime from timestamp
     *
     * @param interger|string $ts
     * @return SugarDateTime
     */
    public function fromTimestamp($ts)
    {
        return new DateTime("@$ts");
    }

    /**
     * Convert DateTime to GMT timezone
     * @param DateTime $date
     * @return DateTime
     */
    public function tzGMT(DateTime $date)
    {
        return $date->setTimezone(self::$gmtTimezone);
    }

    /**
     * Convert DateTime to user timezone
     * @param DateTime $date
     * @param User $user
     * @return DateTime
     */
    public function tzUser(DateTime $date, $user = null)
    {
        return $date->setTimezone($this->_getUserTZ($user));
    }

    /**
     * Get string defining midnight in current user's format
     * @param string $format Time format to use
     * @return string
     */
    protected function _get_midnight($format = null)
    {
        $zero = new DateTime("@0", self::$gmtTimezone);
        return $zero->format($format?$format:$this->get_time_format());
    }

    /**
     *
     * Basic conversion function
     *
     * Converts between two string dates in different formats and timezones
     *
     * @param string $date
     * @param string $fromFormat
     * @param DateTimeZone $fromTZ
     * @param string $toFormat
     * @param DateTimeZone|null $toTZ
     * @param bool $expand If string lacks time, expand it to include time
     * @return string
     */
    protected function _convert($date, $fromFormat, $fromTZ, $toFormat, $toTZ, $expand = false)
    {
        $date = trim($date);
        if (empty($date)) {
            return $date;
        }
        try {
            if ($expand && strlen($date) <= 10) {
                $date = $this->expandDate($date, $fromFormat);
            }
            $phpdate = DateTime::createFromFormat($fromFormat, $date, $fromTZ);
            if ($phpdate == false) {
                LoggerManager::getLogger()->error("convert: Conversion of $date from $fromFormat to $toFormat failed");
                return '';
            }
            if ($fromTZ !== $toTZ && $toTZ != null) {
                $phpdate->setTimezone($toTZ);
            }
            return $phpdate->format($toFormat);
        } catch (Exception $e) {
            LoggerManager::getLogger()->error("Conversion of $date from $fromFormat to $toFormat failed: {$e->getMessage()}");
            return '';
        }
    }


    /**
     * Get DB datetime format
     * @return string
     */
    public function get_db_date_time_format()
    {
        return self::DB_DATETIME_FORMAT;
    }

    /**
     * Get DB date format
     * @return string
     */
    public function get_db_date_format()
    {
        return self::DB_DATE_FORMAT;
    }

    /**
     * Get DB time format
     * @return string
     */
    public function get_db_time_format()
    {
        return self::DB_TIME_FORMAT;
    }


    /**
     * Return current time in DB format
     * @return string
     */
    public function nowDb()
    {
        if(!$this->allow_cache) {
            $nowGMT = $this->getNow();
        } else {
            $nowGMT = $this->now;
        }
        return $this->asDb($nowGMT);
    }

    /**
     * Return current date in DB format
     * @return string
     */
    public function nowDbDate()
    {
        if(!$this->allow_cache) {
            $nowGMT = $this->getNow();
        } else {
            $nowGMT = $this->now;
        }
        return $this->asDbDate($nowGMT, true);
    }

    /**
     * returns timestamp from DateTime object
     *
     * @param $datetime DateTime
     * @return timestamp
     */
    function getTimestamp($datetime)
    {
        return $datetime->getTimestamp();
    }

    /**
     * Get 'now' DateTime object
     * @param bool $userTz return in user timezone?
     * @return SugarDateTime
     */
    public function getNow($userTz = false)
    {
        if(!$this->allow_cache) {
            return new DateTime("now", $userTz?$this->_getUserTZ():self::$gmtTimezone);
        }
        // TODO: should we return clone?
        $now = clone $this->now;
        if($userTz) {
            return $this->tzUser($now);
        }
        return $now;
    }

    /**
     * Return current datetime in local format
     * @return string
     */
    public function now()
    {
        return  $this->asUser($this->getNow());
    }

    /**
     * Return current date in User format
     * @return string
     */
    public function nowDate()
    {
        return  $this->asUserDate($this->getNow());
    }



    /**
     * Expand date format by adding midnight to it
     * Note: date is assumed to be in target format already
     * @param string $date
     * @param string $format Target format
     * @return string
     */
    public function expandDate($date, $format)
    {
        $formats = $this->split_date_time($format);
        if(isset($formats[1])) {
            return $this->merge_date_time($date, $this->_get_midnight($formats[1]));
        }
        return $date;
    }



	/**
	 * Get the name of the timezone for the user
	 * @param User $user User, default - current user
	 * @return string
	 */
	public static function userTimezone(User $user = null)
	{
	    $user = self::getInstance()->_getUser($user);
	    if(empty($user)) {
	        return '';
	    }
	    $tz = self::getInstance()->_getUserTZ($user);
	    if($tz) {
	        return $tz->getName();
	    }
	    return '';
	}

    /**
     * Guess the timezone for the current user
     * @param int $userOffset Offset from GMT in minutes
     * @return string
     */
	public static function guessTimezone($userOffset = 0)
	{
	    if(!is_numeric($userOffset)) {
		    return '';
	    }
	    $defaultZones= [
	        'America/Anchorage', 'America/Los_Angeles', 'America/Phoenix', 'America/Chicago',
	    	'America/New_York', 'America/Argentina/Buenos_Aires', 'America/Montevideo',
	        'Europe/London', 'Europe/Amsterdam', 'Europe/Athens', 'Europe/Moscow',
	        'Asia/Tbilisi', 'Asia/Omsk', 'Asia/Jakarta', 'Asia/Hong_Kong',
	        'Asia/Tokyo', 'Pacific/Guam', 'Australia/Sydney', 'Australia/Perth',
        ];

	    $now = new DateTime();
	    $tzlist = timezone_identifiers_list();
	    if($userOffset == 0) {
    	     $gmtOffset = date('Z');
	         $nowtz = date('e');
	         if(in_array($nowtz, $tzlist)) {
    	         array_unshift($defaultZones, $nowtz);
	         } else {
	             $nowtz = timezone_name_from_abbr(date('T'), $gmtOffset, date('I'));
	             if(in_array($nowtz, $tzlist)) {
	                 array_unshift($defaultZones, $nowtz);
	             }
	         }
    	} else {
    	    $gmtOffset = $userOffset * 60;
    	}
    	foreach($defaultZones as $zoneName) {
	        $tz = new DateTimeZone($zoneName);
	        if($tz->getOffset($now) == $gmtOffset) {
                return $tz->getName();
	        }
	    }
    	// try all zones
	    foreach($tzlist as $zoneName) {
	        $tz = new DateTimeZone($zoneName);
	        if($tz->getOffset($now) == $gmtOffset) {
                return $tz->getName();
	        }
	    }
	    return null;
	}

	/**
	 * Get display name for a certain timezone
	 * Note: it uses current date for GMT offset, so it may be not suitable for displaying generic dates
	 * @param string|DateTimeZone $name TZ name
	 * @return string
	 */
	public static function tzName($name)
	{
	    if(empty($name)) {
	        return '';
	    }
	    if($name instanceof DateTimeZone) {
	        $tz = $name;
	    } else {
            $tz = timezone_open($name);
	    }
        if(!$tz) {
            return "???";
        }
        $now = new DateTime("now", $tz);
        $off = $now->getOffset();
        $translated = translate('timezone_dom','',$name);
        if(is_string($translated) && !empty($translated) && $translated != 'timezone_dom') {
            $name = $translated;
        }
        return sprintf("%s (GMT%+2d:%02d)%s", str_replace('_',' ', $name), $off/3600, (abs($off)/60)%60, "");//$now->format('I')==1?"(+DST)":"");
	}


    /**
     * Timezone sorting helper
     * Sorts by name
     * @param array $a
     * @param array $b
     * @internal
     * @return int
     */
	public static function _sortTz($a, $b)
	{
	    if($a[0] == $b[0]) {
            return strcmp($a[1], $b[1]);
	    } else {
	        return $a[0]<$b[0]?-1:1;
	    }
	}

	/**
	 * Get list of all timezones in the system
	 * @return array
	 */
	public static function getTimezoneList()
	{
        $now = new DateTime();
        $res_zones = $zones = [];
	    foreach(timezone_identifiers_list() as $zoneName) {
            $tz = new DateTimeZone($zoneName);
	        $zones[$zoneName] = [$tz->getOffset($now), self::tzName($zoneName)];
	    }
	    uasort($zones, ['TimeDate', '_sortTz']);
	    foreach($zones as $name => $zonedef) {
	        $res_zones[$name] = $zonedef[1];
	    }
	    return $res_zones;
	}

    /**
     * Print timestamp in RFC2616 format:
     * @param int|null $ts Null means current ts
     * @return string
     */
	public static function httpTime($ts = null)
	{
	    if($ts === null) {
	        $ts = time();
	    }
	    return gmdate(self::RFC2616_FORMAT, $ts);
	}


    /**
     * Create regexp from datetime format
     * @param string $format
     * @return string Regular expression string
     */
    public static function get_regular_expression($format)
    {
        $newFormat = '';
        $regPositions = [];
        $ignoreNextChar = false;
        $count = 1;
        foreach (str_split($format) as $char) {
            if (! $ignoreNextChar && isset(self::$format_to_regexp[$char])) {
                $newFormat .= '(' . self::$format_to_regexp[$char] . ')';
                $regPositions[$char] = $count;
                $count ++;
            } else {
                $ignoreNextChar = false;
                $newFormat .= $char;

            }
            if ($char == "\\") {
                $ignoreNextChar = true;
            }
        }

        return ['format' => $newFormat, 'positions' => $regPositions];
    }

    // format - date expression ('' means now) for start and end of the range
    protected $date_expressions = [
        'yesterday' =>    ["-1 day", "-1 day"],
        'today' =>        ["", ""],
        'tomorrow' =>     ["+1 day", "+1 day"],
        'last_7_days' =>  ["-6 days", ""],
        'next_7_days' =>  ["", "+6 days"],
        'last_30_days' => ["-29 days", ""],
        'next_30_days' => ["", "+29 days"],
    ];

    /**
     * Returns the offset from user's timezone to GMT
     * @param User $user
     * @param DateTime $time When the offset is taken, default is now
     * @return int Offset in minutes
     */
    public function getUserUTCOffset(User $user = null, DateTime $time = null)
    {
        if(empty($time)) {
            $time = $this->now;
        }
        return $this->_getUserTZ($user)->getOffset($time) / 60;
    }

}
