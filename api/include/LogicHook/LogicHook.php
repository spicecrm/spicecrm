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
use SpiceCRM\extensions\includes\SpiceCRMExchange\Exceptions\MissingEwsCredentialsException;
use SpiceCRM\extensions\includes\SpiceCRMExchange\Exceptions\EwsConnectionException;

class LogicHook
{
    /**
     * the instance for the singleton pattern
     *
     * @var null
     */
    private static $_instance = null;

    protected static $hooks = [];

    private function __construct() {
    }

    private function __clone() {
    }
    /**
     * Returns an instance of the LogicHook singleton.
     *
     * @return LogicHook|null
     */
    public static function getInstance(): ?LogicHook {
        if (!is_object(self::$_instance)) {
            self::$_instance = new LogicHook();
        }
        return self::$_instance;
    }

	/**
	 * This is left for backwards compatibility.
     *  TODO Remove it once all calls to it are replaced in code.
	 *
	 * @return LogicHook
     */
	public static function initialize(): LogicHook {
		return self::getInstance();
	}

    public static function refreshHooks() {
        self::$hooks = [];
    }

    private function loadHooks($moduleDir): array {
        $hookArray = [];
        $spiceHooks = [];

        if (DBManagerFactory::getInstance()) {
            $db = DBManagerFactory::getInstance();
        }

        if (isset($db) && empty($GLOBALS['installing'])) {

            if (empty($moduleDir) && isset($_SESSION['SpiceCRM']['hooks']['*'])) {
                $spiceHooks = $_SESSION['SpiceCRM']['hooks']['*'];
            } elseif (!empty($moduleDir) && isset($_SESSION['SpiceCRM']['hooks'][$moduleDir])) {
                $spiceHooks = $_SESSION['SpiceCRM']['hooks'][$moduleDir];
            } else {
                $hooksCore = $this->getSpiceHooks('syshooks', $moduleDir);
                $hooksCustom = $this->getSpiceHooks('syscustomhooks', $moduleDir);
                $hooks = array_merge($hooksCore, $hooksCustom);

                if (is_array($hooks)) {
                    foreach ($hooks as $hookHash => $hook) {
                        if ($hook['hook_active'] > 0) {
                            $spiceHooks[$hook['event']][] = [$hook['hook_index'], '', $hook['hook_class'], $hook['hook_method']];
                        }
                    }
                }

                // write to the session to speed up performance
                if (empty($moduleDir)) {
                    $_SESSION['SpiceCRM']['hooks']['*'] = $spiceHooks;
                } else {
                    $_SESSION['SpiceCRM']['hooks'][$moduleDir] = $spiceHooks;
                }
            }

            //merge $spiceHooks into $hookArray
            foreach ($spiceHooks as $event => $hook) {
                foreach($hook as $idx => $hk)
                    $hookArray[$event][] = $hk;
            }
        }
        return $hookArray;
    }

    private function getSpiceHooks($table, $module = null): array {
	    $db = DBManagerFactory::getInstance();
        // $q = "SELECT event, hook_index, hook_class, hook_method, hook_active, event||hook_class||hook_method hook_hash FROM {$table} WHERE ";
        // we can't use oracle || operator in mysql
        // generate hash after data retrieve
        $q = "SELECT event, hook_index, hook_class, hook_method, hook_active FROM {$table} WHERE ";
        if (empty($module)) {
            $q .= " ( module = '' OR module IS NULL ) ";
        } else {
            $q .= " ( module = '{$module}') ";
        }
        $rows = [];
        if ($res = $db->query($q)) {
            while ($row = $db->fetchByAssoc($res)) {
                if (!class_exists($row['hook_class'])) {
                    LoggerManager::getLogger()->fatal("Hook class {$row['hook_class']} does not exist.");
                } elseif (!method_exists($row['hook_class'], $row['hook_method'])) {
                    LoggerManager::getLogger()->fatal("Hook method {$row['hook_method']} does not exist for class {$row['hook_class']}.");
                } else {
                    $hookHash = $row['event'].$row['hook_class'].$row['hook_method'];

                    $rows[$hookHash] = $row;
                }
            }
        }

        return $rows;
    }

    /**
     * Returns an array with hooks for a particular module.
     *
     * @param string $moduleDir
     * @param bool $refresh
     * @return array|mixed
     */
	private function getHooks(string $moduleDir, bool $refresh = false) {
	    if ($refresh || !isset(self::$hooks[$moduleDir])) {
	        self::$hooks[$moduleDir] = $this->loadHooks($moduleDir);
	    }
	    return self::$hooks[$moduleDir];
	}

    /**
     * Provide a means for developers to create upgrade safe business logic hooks.
     * If the bean is null, then we assume this call was not made from a SugarBean Object and
     * therefore we do not pass it to the method call.
     *
     * @param string $moduleDir
     * @param string $event
     * @param null $arguments
     * @throws Exception
     */
	public function call_custom_logic(string $moduleDir, $bean, string $event, $arguments = null): void {
        if (LoggerManager::getLogger()) {
            LoggerManager::getLogger()->debug("Hook called: $moduleDir::$event");
        }

        $allHooks = [];

		if (!empty($moduleDir)) {
			// This will load an array of the hooks to process
            $allHooks = $this->getHooks($moduleDir);
		}

		$defaultHooks = $this->getHooks('');

        foreach ($defaultHooks as $hookName => $items) {
            if (empty($allHooks[$hookName])) $allHooks[$hookName] = [];
            $allHooks[$hookName] = array_merge($allHooks[$hookName], $items);
        }

		if (!empty($allHooks)) {
		    $this->processHooks($allHooks, $bean, $event, $arguments);
		}
	}

    /**
     * This is called from call_custom_logic and actually performs the action as defined in the
     * logic hook. If the bean is null, then we assume this call was not made from a SugarBean Object and
     * therefore we do not pass it to the method call.
     *
     * @param array $hookArray
     * @param string $event
     * @param array $arguments
     * @throws Exception
     */
	private function processHooks(array $hookArray, $bean, string $event, $arguments): void {
		// Now iterate through the array for the appropriate hook
		if (!empty($hookArray[$event])) {

			// Apply sorting to the hooks using the sort index.
			// Hooks with matching sort indexes will be processed in no particular order.
			$sortedIndexes = [];
			foreach ($hookArray[$event] as $idx => $hookDetails) {
				$sortedIndexes[$idx] = $hookDetails[0];
			}
			asort($sortedIndexes);

			$processOrder = array_keys($sortedIndexes);

			foreach ($processOrder as $hookIndex) {
				$hookDetails  = $hookArray[$event][$hookIndex];
				$hookClass    = $hookDetails[2];
				$hookFunction = $hookDetails[3];

                if (LoggerManager::getLogger()) {
                    LoggerManager::getLogger()->debug("Creating new instance of hook class {$hookClass} without parameters");
                }

                try {
                    $class = new $hookClass();
                    if (!is_null($bean)) {
                        $class->$hookFunction($bean, $event, $arguments);
                    } else {
                        $class->$hookFunction($event, $arguments);
                    }
                // TODO are those catch blocks really necessary here??
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
