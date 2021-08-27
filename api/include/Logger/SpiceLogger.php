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
namespace SpiceCRM\includes\Logger;


use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;

/**
 * Default SugarCRM Logger
 * @api
 */
class SpiceLogger implements LoggerTemplate
{
    /**
     * properties for the SpiceLogger
     */
    protected $logfile = 'spicecrm';
    protected $ext = '.log';
    protected $dateFormat = '%c';
    protected $logSize = '10MB';
    protected $maxLogs = 10;
    protected $filesuffix = "";
    protected $date_suffix = "";
    protected $log_dir = '.';
    protected $full_log_file;
    protected $dbcon;
    protected $_levelCategories;

    /**
     * used for config screen
     */
    public static $filename_suffix = [
        //bug#50265: Added none option for previous version users
        "" => "None",
        "%m_%Y"    => "Month_Year",
        "%d_%m"    => "Day_Month",
        "%m_%d_%y" => "Month_Day_Year",
    ];

    /**
     * Let's us know if we've initialized the logger file
     */
    protected $initialized = false;

    public $db = null;

    /**
     * Logger file handle
     */
    protected $fp = false;

    public function __get(
        $key
    )
    {
        return $this->$key;
    }

    /**
     * Used by the diagnostic tools to get SpiceLogger log file information
     */
    public function getLogFileNameWithPath()
    {
        return $this->full_log_file;
    }

    /**
     * Used by the diagnostic tools to get SpiceLogger log file information
     */
    public function getLogFileName()
    {
        return ltrim($this->full_log_file, "./");
    }

    /**
     * Constructor
     *
     * Reads the config file for logger settings
     */
    public function __construct()
    {
        $config = SpiceConfig::getInstance();
        $this->ext = $config->get('logger.file.ext', $this->ext);
        $this->logfile = $config->get('logger.file.name', $this->logfile);
        $this->dateFormat = $config->get('logger.file.dateFormat', $this->dateFormat);
        $this->logSize = $config->get('logger.file.maxSize', $this->logSize);
        $this->maxLogs = $config->get('logger.file.maxLogs', $this->maxLogs);
        $this->filesuffix = $config->get('logger.file.suffix', $this->filesuffix);
        $log_dir = $config->get('log_dir' , $this->log_dir);
        $this->log_dir = $log_dir . (empty($log_dir)?'':'/');
        //unset($config);
        $this->_doInitialization();
        LoggerManager::setLogger('default', SpiceLogger::class);


    }

    static function getTimestamp(){
        if(function_exists('hrtime' && 1 == 2)) {
            return  hrtime(true);
        } else {
            $thisMS = round(microtime() * 1000);
            while (strlen($thisMS) < 3)
                $thisMS = '0' . $thisMS;

            return   time() . $thisMS;
        }
    }


    /**
     * Handles the SugarLogger initialization
     */
    protected function _doInitialization()
    {
        if( $this->filesuffix && array_key_exists($this->filesuffix, self::$filename_suffix) )
        { //if the global config contains date-format suffix, it will create suffix by parsing datetime
            $this->date_suffix = "_" . date(str_replace("%", "", $this->filesuffix));
        }
        $this->full_log_file = $this->log_dir . $this->logfile . $this->date_suffix . $this->ext;
        $this->initialized = $this->_fileCanBeCreatedAndWrittenTo();
        $this->rollLog();


    }

    /**
     * Checks to see if the SugarLogger file can be created and written to
     */
    protected function _fileCanBeCreatedAndWrittenTo()
    {
        $this->_attemptToCreateIfNecessary();
        return file_exists($this->full_log_file) && is_writable($this->full_log_file);
    }

    /**
     * Creates the SugarLogger file if it doesn't exist
     */
    protected function _attemptToCreateIfNecessary()
    {
        if (file_exists($this->full_log_file)) {
            return;
        }
        @touch($this->full_log_file);
    }

    /**
     * see LoggerTemplate::log()
     */
    public function log($level, $message, $logparams = []) {
        if (!$this->initialized) {
            return;
        }

        $message = $this->prepareMessage($message);

        $this->logToFile($level, $message);

        try {
            $this->logToSyslogs($level, $message, $logparams);
        } catch (DatabaseException $e) {
            $this->logToFile('fatal', $this->prepareMessage($e->getMessage()));
        }
    }

    /**
     * Converts the message into a string before writing.
     *
     * @param $message
     * @return string
     */
    private function prepareMessage($message): string {
        // change to a string if there is just one entry
        if (is_array($message) && count($message) == 1) {
            $message = array_shift($message);
        }

        // change to a human-readable array output if it's any other array
        if (is_array($message)) {
            $message = print_r($message,true);
        }

        return $message;
    }

    /**
     * Writes the log message into a file
     *
     * @param $level
     * @param $message
     */
    public function logToFile($level, $message) {
        //lets get the current user id or default to -none- if it is not set yet
        $userID = '-none-';
        if (is_object(AuthenticationController::getInstance()->getCurrentUser()) && AuthenticationController::getInstance()->getCurrentUser()->id) {
            $userID = AuthenticationController::getInstance()->getCurrentUser()->id;
        }

        //if we haven't opened a file pointer yet let's do that
        if (!$this->fp) {
            $this->fp = fopen($this->full_log_file , 'a');
        }

        //write out to the file including the time in the dateFormat the process id , the user id , and the log level as well as the message
        fwrite($this->fp,
            strftime($this->dateFormat) . ' [' . getmypid() . '][' . $userID . '][' . strtoupper($level) . '] ' . $message . "\n"
        );
    }

    /**
     * introduced maretval 2018-06-06
     * save log to syslogs
     * @param $level
     * @param $message
     */
    public function logToSyslogs(
        $level,
        $message,
        $logparams = []
    )
    {
        //do not log on install!
        if ( !empty( $GLOBALS['installing'] )) return true;

        $td = new TimeDate();
        $log = ["id" => SpiceUtils::createGuid(),
            "table_name" => "syslogs",
            "log_level" => $level,
            "pid" => getmypid(),
            "created_by" => (!empty($logparams['user']) ?: '-none-'),
            'microtime' => $this->getTimestamp(),
            "date_entered" => $td->nowDb(),
            "description" => $message,
            "transaction_id" => LoggerManager::getLogger()->getTransactionId()];

        DBManagerFactory::getInstance('spicelogger')->insertQuery("syslogs", $log, true);

    }

    /**
     * rolls the logger file to start using a new file
     */
    protected function rollLog(
        $force = false
    )
    {
        if (!$this->initialized || empty($this->logSize)) {
            return;
        }
        // bug#50265: Parse the its unit string and get the size properly
        $units = [
            'b' => 1,                   //Bytes
            'k' => 1024,                //KBytes
            'm' => 1024 * 1024,         //MBytes
            'g' => 1024 * 1024 * 1024,  //GBytes
        ];
        if( preg_match('/^\s*([0-9]+\.[0-9]+|\.?[0-9]+)\s*(k|m|g|b)(b?ytes)?/i', $this->logSize, $match) ) {
            $rollAt = ( int ) $match[1] * $units[strtolower($match[2])];
        }
        //check if our log file is greater than that or if we are forcing the log to roll if and only if roll size assigned the value correctly
        if ( $force || ($rollAt && filesize ( $this->full_log_file ) >= $rollAt) ) {
            $temp = tempnam($this->log_dir, 'rot');
            if ($temp) {
                // warning here is expected in case if log file is opened by another process on Windows
                // or rotation has been already started by another process
                if (@rename($this->full_log_file, $temp)) {

                    // manually remove the obsolete part. Otherwise, rename() may fail on Windows (bug #22548)
                    $obsolete_part = $this->getLogPartPath($this->maxLogs - 1);
                    if (file_exists($obsolete_part)) {
                        unlink($obsolete_part);
                    }

                    // now lets move the logs starting at the oldest and going to the newest
                    for ($old = $this->maxLogs - 2; $old > 0; $old--) {
                        $old_name = $this->getLogPartPath($old);
                        if (file_exists($old_name)) {
                            $new_name = $this->getLogPartPath($old + 1);
                            rename($old_name, $new_name);
                        }
                    }

                    $part1 = $this->getLogPartPath(1);
                    rename($temp, $part1);
                } else {
                    unlink($temp);
                }
            }
        }
    }

    /**
     * Returns path for the given log part
     *
     * @param int $i
     * @return string
     */
    protected function getLogPartPath($i)
    {
        return $this->log_dir . $this->logfile . $this->date_suffix . '_' . $i . $this->ext;
    }

    /**
     * This is needed to prevent unserialize vulnerability
     */
    public function __wakeup()
    {
        // clean all properties
        foreach(get_object_vars($this) as $k => $v) {
            $this->$k = null;
        }
        throw new \Exception("Not a serializable object"); //todo-uebelmar clarify...which expection should be thrown?
    }

    /**
     * Destructor
     *
     * Closes the SugarLogger file handle
     */
    public function __destruct()
    {
        if ($this->fp)
        {
            fclose($this->fp);
            $this->fp = FALSE;
        }
    }
}
