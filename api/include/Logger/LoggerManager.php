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

use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;

/**
 * Log management
 * Modifications introduced in spicecrm 20180900 to support SpiceLogger
 * @api
 */
class LoggerManager
{

    //this the the current log level
    private $_level = 'fatal';


    //this is a list of different loggers that have been loaded
    private $_loggers = [];

    //this is the instance of the LoggerManager
    private static $_instance = NULL;

	//these are the mappings for levels to different log types
	private $_logMapping = [
		'default' => SpiceLogger::class,
		'fatal'   => SpiceLogger::class,
    ];

	//these are the log level mappings anything with a lower value than your current log level will be logged
	private static $_levelMapping = [
		'debug'      => 100,
		'info'       => 70,
		'warn'       => 50,
		'deprecated' => 40,
        'login'      => 30,
		'error'      => 25,
		'fatal'      => 10,
		'security'   => 5,
		'off'        => 0,
    ];

    private  $_levelCategories = [];
    private  $_dbconfig = [

    ];

    protected $transactionId;


	//only let the getLogger instantiate this object
	private function __construct()
	{
        $user = AuthenticationController::getInstance()->getCurrentUser();
		if ( empty($this->_loggers) ) {
            $this->_findAvailableLoggers();
        }

		if (empty($this->transactionId)) {
		    $this->transactionId = SpiceUtils::createGuid();
        }
	}


	/**
	 * Overloaded method that handles the logging requests.
	 *
	 * @param string $method
	 * @param string $message - also handles array as parameter, though that is deprecated.
	 */
 	public function __call(
 	    $method,
 	    $message
 	    )
 	{

         // just check if we have the level at all
         if(!isset($this->_levelCategories[$method])) return false;

        // get the current user is
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        // log the call
        if( (array_search('*',$this->_levelCategories[$method]) !== false || ($currentUser->id && array_search($currentUser->id,$this->_levelCategories[$method]) !== false))){

            //now we get the logger type this allows for having a file logger an email logger, a firebug logger or any other logger you wish you can set different levels to log differently
            $logger = (!empty($this->_logMapping[$method])) ? $this->_logMapping[$method] : $this->_logMapping['default'];

            //if we haven't instantiated that logger instantiate
            if (!isset($this->_loggers[$logger])) {
                $this->_loggers[$logger] = new $logger();
            }

            // try to extract a sublevel
            $sublevel = '';
            $logData = '';
            if(is_array($message) && count($message) == 2 && is_string($message[0]) ){
                $sublevel = $message[0];
                $logData = is_string($message[1]) ? $message[1] : json_encode($message[1]);
            } else {
                $logData = is_string($message) ? $message : json_encode($message);
            }

            $this->_loggers[$logger]->log($method, $sublevel, $logData, ['user' => $currentUser->id]);
        }
 	}

    /**
     * Getter for the transaction ID.
     *
     * @return string
     */
 	public function getTransactionId(): string {
 	    return $this->transactionId;
    }

 	/**
 	 * Check if this log level will be producing any logging
 	 * @param string $method
 	 * @return boolean
 	 */
 	public function wouldLog($method)
 	{
 	    if ( !isset(self::$_levelMapping[$method]) )
 	    	$method = $this->_level;
 	    if($method == $this->_level
 	    		//otherwise if we have a level mapping for the method and that level is less than or equal to the current level let's let it log
 	    		|| (!empty(self::$_levelMapping[$method])
 	    				&& self::$_levelMapping[$this->_level] >= self::$_levelMapping[$method]) ) {
 	        return true;
 	    }
 	    return false;
 	}

	/**
     * Used for doing design-by-contract assertions in the code; when the condition fails we'll write
     * the message to the debug log
     *
     * @param string  $message
     * @param boolean $condition
     */
    public function assert(
        $message,
        $condition
        )
    {
        if ( !$condition )
            $this->__call('debug', $message);
	}

	/**
	 * Sets the logger to the level indicated
	 *
	 * @param string $name name of logger level to set it to
	 */
 	public function setLevel(
 	    $name
 	    )
 	{
        if ( isset(self::$_levelMapping[$name]) )
            $this->_level = $name;
 	}

    /**
     * SpiceCRM enhancement
     * allocate dbconfig
     *
     * @param array $config
     */
 	public  function setDbConfig($config){
        $this->_dbconfig = $config;
    }


    /**
     * SpiceCRM enhancement
     * allocate level categories
     *
     */
    public function getLevelCategories(){
        $this->_levelCategories = [];

        $levels = SpiceConfig::getInstance()->get('logger.level');
        foreach(explode(',', $levels) as $level){
            $this->_levelCategories[$level] = ['*'];
        }

        if(DBManagerFactory::getInstance()) {
            $res = DBManagerFactory::getInstance()->queryOnly("SELECT log_level level, user_id FROM syslogusers WHERE logstatus = 1");
            while ($row = DBManagerFactory::getInstance()->fetchByAssoc($res)) {
                $this->_levelCategories[$row['level']][$row['user_id']] = true;
            }
        }
    }

 	/**
 	 * Returns a logger instance
 	 */
 	public static function getLogger()
	{
		if(!LoggerManager::$_instance){
			LoggerManager::$_instance = new LoggerManager();
            LoggerManager::$_instance->setLogger('default',(SpiceConfig::getInstance()->get('logger.default') ?: SpiceLogger::class));
            LoggerManager::$_instance->setDbConfig(SpiceConfig::getInstance()->get('dbconfig'));
            LoggerManager::$_instance->getLevelCategories();
		}
		return LoggerManager::$_instance;
	}

	/**
	 * Sets the logger to use a particular backend logger for the given level. Set level to 'default'
	 * to make it the default logger for the application
	 *
	 * @param string $level name of logger level to set it to
	 * @param string $logger name of logger class to use
	 */
	public function setLogger(
 	    $level,
 	    $logger
 	    )
 	{
 	    $this->_logMapping[$level] = $logger;
 	}

 	/**
 	 * Finds all the available loggers in the application
 	 */
 	protected function _findAvailableLoggers()
 	{
 	    $locations = ['include/Logger','custom/include/Logger'];
 	    foreach ( $locations as $location ) {
            if (is_dir($location) && $dir = opendir($location)) {
                while (($file = readdir($dir)) !== false) {
                    if ($file == ".."
                            || $file == "."
                            || $file == "LoggerTemplate.php"
                            || $file == "LoggerManager.php"
                            || $file == "APIlogViewer.php"
                            || !is_file("$location/$file")
                            )
                        continue;
                    require_once("$location/$file");
                    $loggerClass = basename($file, ".php");
                    if ( class_exists($loggerClass) && class_implements($loggerClass,'LoggerTemplate') )
                        $this->_loggers[$loggerClass] = new $loggerClass();
                }
            }
        }
 	}
     

    public static function formatBackTrace($backTrace)
    {
        $traces = "";
        foreach ($backTrace as $entry) {
            $traces .= "\n  " . $entry['file'] . '(' . $entry['line'] . '): ' .
                @$entry['class'] . '->' . $entry['function'];
        }

        return $traces;
    }

    /**
     * return a human readable string for the given php error type
     * @param $type
     * @return string
     */
    public static function parseErrorType($type): string
    {
        switch ($type) {
            case E_USER_ERROR:
                return "Fatal User Error";
            case E_COMPILE_ERROR:
                return "Fatal Compile Error";
            case E_CORE_ERROR:
                return "Fatal Core Error";
            case E_ERROR:
                return "Fatal Error";
            case E_PARSE:
                return "Parse Error";
            case E_RECOVERABLE_ERROR:
                return "Recoverable Error";
            case E_DEPRECATED:
                return "Deprecated";
            case E_USER_DEPRECATED:
                return "User Deprecated";
            case E_NOTICE :
                return "Notice";
            case E_USER_NOTICE:
                return "User Notice";
            case E_WARNING:
                return "Warning Warning";
            case E_CORE_WARNING:
                return "Core Warning";
            case E_USER_WARNING:
                return "User Warning";
            case E_COMPILE_WARNING:
                return "Compile Warning";
            default:
                return 'Unknown Error';
        }
    }
}
