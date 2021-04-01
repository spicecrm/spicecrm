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


/**
 * Predefined logic hooks
 * after_ui_frame
 * after_ui_footer
 * after_save
 * before_save
 * before_retrieve
 * after_retrieve
 * process_record
 * before_delete
 * after_delete
 * before_restore
 * after_restore
 * server_roundtrip
 * before_logout
 * after_logout
 * before_login
 * after_login
 * login_failed
 * after_session_start
 * after_entry_point
 *
 * @api
 */

namespace SpiceCRM\includes\LogicHook;

use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceCRMExchange\Exceptions\MissingEwsCredentialsException;
use SpiceCRM\includes\SpiceCRMExchange\Exceptions\EwsConnectionException;

class LogicHook
{

	var $bean = null;

	/**
	 * Static Function which returns and instance of LogicHook
	 *
	 * @return unknown
	 */
	static function initialize(){
		if(empty($GLOBALS['logic_hook']))
			$GLOBALS['logic_hook'] = new LogicHook();
		return $GLOBALS['logic_hook'];
	}

	function setBean($bean){
		$this->bean = $bean;
		return $this;
	}

	protected $hook_map = [];
	protected $hookscan = [];

	public function getHooksMap()
	{
	    return $this->hook_map;
	}

	public function getHooksList()
	{
	    return $this->hookscan;
	}

    public function scanHooksDir($extpath)
    {
		if(is_dir($extpath)){
		    $dir = dir($extpath);
			while($entry = $dir->read()){
				if($entry != '.' && $entry != '..' && strtolower(substr($entry, -4)) == ".php" && is_file($extpath.'/'.$entry)) {
				    unset($hook_array);
                    include($extpath.'/'.$entry);
                    if(!empty($hook_array)) {
                        foreach($hook_array as $type => $hookg) {
                            foreach($hookg as $index => $hook) {
                                $this->hookscan[$type][] = $hook;
                                $idx = count($this->hookscan[$type])-1;
                                $this->hook_map[$type][$idx] = ["file" => $extpath.'/'.$entry, "index" => $index];
                            }
                        }
                    }
				}
			}
		}
    }

	protected static $hooks = [];

        static public function refreshHooks() {
            self::$hooks = [];
        }

    public function loadHooks($module_dir)
    {
        

//        // config|_override.php
//        if (is_file('config.php')) {
//            require_once('config.php'); // provides \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config
//        }
//
//        // load up the config_override.php file.  This is used to provide default user settings
//        if (is_file('config_override.php')) {
//            require_once('config_override.php');
//        }


        if (  DBManagerFactory::getInstance() ) {
            $dbhooks = DBManagerFactory::getInstance();
        }

        $hook_array = [];
        if(!empty($module_dir)) {
            $custom = "custom/modules/$module_dir";
        } else {
            $custom = "custom/modules";
        }
        if(file_exists("$custom/logic_hooks.php")){
            if(LoggerManager::getLogger()){
                LoggerManager::getLogger()->debug('Including module specific hook file for '.$custom);
            }
            include("$custom/logic_hooks.php");
        }
        if(empty($module_dir)) {
            $custom = "custom/application";
        }
        if(file_exists("$custom/Ext/LogicHooks/logichooks.ext.php")) {
            if(LoggerManager::getLogger()){
                LoggerManager::getLogger()->debug('Including Ext hook file for '.$custom);
            }
            include("$custom/Ext/LogicHooks/logichooks.ext.php");
        }

        // load from database
//        if(is_null($dbhooks) && empty( $GLOBALS['installing'] )) {
//            if(!class_exists('DBManagerFactory', false)) {
//                if(is_null(\SpiceCRM\includes\Logger\LoggerManager::getLogger())){
//                    require_once "include/Logger/LoggerManager.php";
//                    \SpiceCRM\includes\Logger\LoggerManager::getLogger() = LoggerManager::getLogger('SpiceCRM');
//                }
//                require_once "include/TimeDate.php";
//                require_once "include/database/DBManagerFactory.php";
//            }
//            $dbhooks = \SpiceCRM\includes\database\DBManagerFactory::getInstance();
//        }
        $SpiceCRMHooks = [];
        if( isset( $dbhooks ) && empty( $GLOBALS['installing'] )) {

            if(empty($module_dir)){

                if(isset($_SESSION['SpiceCRM']['hooks']['*'])){
                    $SpiceCRMHooks = $_SESSION['SpiceCRM']['hooks']['*'];
                } else {
                    $hooks_core = $this->getSpiceHooksQuery($dbhooks, 'syshooks');
                    $hooks_custom = $this->getSpiceHooksQuery($dbhooks, 'syscustomhooks');
                    $hooks = array_merge($hooks_core, $hooks_custom);
                    if(is_array($hooks)){
                        foreach($hooks as $hook_hash => $hook){
                            if($hook['hook_active'] > 0) {
                                $SpiceCRMHooks[$hook['event']][] = [$hook['hook_index'], '', $hook['hook_include'], $hook['hook_class'], $hook['hook_method']];
                            }
                        }
                    }

                    // write to the session to speed up performance
                    $_SESSION['SpiceCRM']['hooks']['*'] = $SpiceCRMHooks;
                }
            } else {
                if(isset($_SESSION['SpiceCRM']['hooks'][$module_dir])){
                    $SpiceCRMHooks = $_SESSION['SpiceCRM']['hooks'][$module_dir];
                } else {
                    $hooks_core = $this->getSpiceHooksQuery($dbhooks, 'syshooks', $module_dir);
                    $hooks_custom = $this->getSpiceHooksQuery($dbhooks, 'syscustomhooks', $module_dir);
                    $hooks = array_merge($hooks_core, $hooks_custom);
                    if(is_array($hooks)){
                        foreach($hooks as $hook_hash => $hook){
                            if($hook['hook_active'] > 0) {
                                $SpiceCRMHooks[$hook['event']][] = [$hook['hook_index'], '', $hook['hook_include'], $hook['hook_class'], $hook['hook_method']];
                            }
                        }
                    }

                    // write to the session to speed up performance
                    $_SESSION['SpiceCRM']['hooks'][$module_dir] = $SpiceCRMHooks;
                }

            }

            //merge $SpiceCRMHooks into $hook_array
            foreach($SpiceCRMHooks as $event => $hook){
                foreach($hook as $idx => $hk)
                    $hook_array[$event][] = $hk;
            }
        }
        return $hook_array;
    }

    public function getSpiceHooksQuery($dbhooks, $table, $module = null){
        // $q = "SELECT event, hook_index, hook_include, hook_class, hook_method, hook_active, event||hook_class||hook_method hook_hash FROM {$table} WHERE ";
        // we can't use oracle || operator in mysql
        // generate hash after data retrieve
        $q = "SELECT event, hook_index, hook_include, hook_class, hook_method, hook_active FROM {$table} WHERE ";
        if(empty($module)){
            $q.= " ( module = '' OR module IS NULL ) ";
        } else {
            $q.= " ( module = '{$module}') ";
        }
        $rows = [];
        if($res = $dbhooks->query($q)){
            while ($row = $dbhooks->fetchByAssoc($res)){
                $hook_hash = $row['event'].$row['hook_class'].$row['hook_method'];

                $rows[$hook_hash] = $row;
            }
        }

        return $rows;
    }

	public function getHooks($module_dir, $refresh = false)
	{
	    if($refresh || !isset(self::$hooks[$module_dir])) {
	        self::$hooks[$module_dir] = $this->loadHooks($module_dir);
	    }
	    return self::$hooks[$module_dir];
	}

	/**
	 * Provide a means for developers to create upgrade safe business logic hooks.
	 * If the bean is null, then we assume this call was not made from a SugarBean Object and
	 * therefore we do not pass it to the method call.
	 *
	 * @param string $module_dir
	 * @param string $event
	 * @param array $arguments
	 * @param SugarBean $bean
	 */
	function call_custom_logic($module_dir, $event, $arguments = null){
		// declare the hook array variable, it will be defined in the included file.
		$hook_array = null;
        if(LoggerManager::getLogger()){
            LoggerManager::getLogger()->debug("Hook called: $module_dir::$event");
        }
		if(!empty($module_dir)){
			// This will load an array of the hooks to process
			$hooks = $this->getHooks($module_dir);
			if(!empty($hooks)) {
			    $this->process_hooks($hooks, $event, $arguments);
			}
		}
		$hooks = $this->getHooks('');
		if(!empty($hooks)) {
		    $this->process_hooks($hooks, $event, $arguments);
		}
	}

    /**
     * This is called from call_custom_logic and actually performs the action as defined in the
     * logic hook. If the bean is null, then we assume this call was not made from a SugarBean Object and
     * therefore we do not pass it to the method call.
     *
     * @param array $hook_array
     * @param string $event
     * @param array $arguments
     * @throws Exception
     */
	public function process_hooks($hook_array, $event, $arguments){
		// Now iterate through the array for the appropriate hook
		if(!empty($hook_array[$event])){

			// Apply sorting to the hooks using the sort index.
			// Hooks with matching sort indexes will be processed in no particular order.
			$sorted_indexes = [];
			foreach($hook_array[$event] as $idx => $hook_details)
			{
				$order_idx = $hook_details[0];
				$sorted_indexes[$idx] = $order_idx;
			}
			asort($sorted_indexes);

			$process_order = array_keys($sorted_indexes);

			foreach($process_order as $hook_index){
				$hook_details = $hook_array[$event][$hook_index];
				if(!empty($hook_details[2])) {
                    if (!file_exists($hook_details[2])) {
                        if (LoggerManager::getLogger()) {
                            LoggerManager::getLogger()->error('Unable to load custom logic file: ' . $hook_details[2]);
                        }
                        continue;
                    }
                    include_once($hook_details[2]);
                }
				$hook_class = $hook_details[3];
				$hook_function = $hook_details[4];

				// Make a static call to the function of the specified class
				//TODO Make a factory for these classes.  Cache instances accross uses
				if($hook_class == $hook_function){
                    if(LoggerManager::getLogger()){
					    LoggerManager::getLogger()->debug('Creating new instance of hook class '.$hook_class.' with parameters');
                    }
					if(!is_null($this->bean))
						$class = new $hook_class($this->bean, $event, $arguments);
					else
						$class = new $hook_class($event, $arguments);
				}else{
                    if(LoggerManager::getLogger()){
					    LoggerManager::getLogger()->debug('Creating new instance of hook class '.$hook_class.' without parameters');
                    }

                    try {
                        $class = new $hook_class();
                        if (!is_null($this->bean)) {
                            $class->$hook_function($this->bean, $event, $arguments);
                        } else {
                            $class->$hook_function($event, $arguments);
                        }
                    } catch (MissingEwsCredentialsException $e) {
                        // todo figure out if EWS should actually be turned on or off
                        $krestException = new Exception($e->getMessage(), $e->getCode());
                        $krestException->setHttpCode($e->getCode());
                        throw $krestException;
                    } catch (EwsConnectionException $e) {
                        $krestException = new Exception($e->getMessage(), $e->getCode());
                        $krestException->setHttpCode($e->getCode());
                        throw $krestException;
                    }
				}
			}
		}
	}
}
