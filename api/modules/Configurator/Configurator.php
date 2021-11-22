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

namespace SpiceCRM\modules\Configurator;


use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarCache\SugarCache;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class Configurator {
	var $config = '';
	var $override = '';
	var $allow_undefined = ['stack_trace_errors', 'export_delimiter', 'use_real_names', 'developerMode', 'default_module_favicon', 'authenticationClass', 'SAML_loginurl', 'SAML_X509Cert', 'dashlet_auto_refresh_min', 'show_download_tab', 'enable_action_menu'];
	var $errors = ['main' => ''];
	var $logger = NULL;
	var $previous_sugar_override_config_array = [];
	var $useAuthenticationClass = false;
    protected $error = null;

	function __construct() {
		$this->loadConfig();
	}

	function loadConfig() {
		$this->logger = LoggerManager::getLogger();
		
		$this->config = SpiceConfig::getInstance()->config;
	}

	function handleOverride($fromParseLoggerSettings=false) {
		global  $sugar_version;
		$sc = SpiceConfig::getInstance();
		$overrideArray = $this->readOverride();
		$this->previous_sugar_override_config_array = $overrideArray;
		$diffArray = deepArrayDiff($this->config, SpiceConfig::getInstance()->config);
		$overrideArray = sugarArrayMergeRecursive($overrideArray, $diffArray);

		// To remember checkbox state
          if (!$this->useAuthenticationClass && !$fromParseLoggerSettings) {
             if (isset($overrideArray['authenticationClass']) &&
                $overrideArray['authenticationClass'] == 'SAMLAuthenticate') {
              unset($overrideArray['authenticationClass']);
            }
          }

		$overideString = "<?php\n/***CONFIGURATOR***/\n";

        SugarCache::sugar_cache_put('sugar_config', $this->config);
		SpiceConfig::getInstance()->config = $this->config;

		foreach($overrideArray as $key => $val) {
			if (in_array($key, $this->allow_undefined) || isset (SpiceConfig::getInstance()->config[$key])) {
				if (is_string($val) && strcmp($val, 'true') == 0) {
					$val = true;
					$this->config[$key] = $val;
				}
				if (is_string($val) && strcmp($val, 'false') == 0) {
					$val = false;
					$this->config[$key] = false;
				}
			}
			$overideString .= override_value_to_string_recursive2('sugar_config', $key, $val);
		}
		$overideString .= '/***CONFIGURATOR***/';

		$this->saveOverride($overideString);
		if(isset($this->config['logger']['level']) && $this->logger) $this->logger->setLevel($this->config['logger']['level']);
	}

	function handleOverrideFromArray($diffArray) {
		global  $sugar_version;
		$overrideArray = $this->readOverride();
		$this->previous_sugar_override_config_array = $overrideArray;
		$overrideArray = sugarArrayMergeRecursive($overrideArray, $diffArray);

		$overideString = "<?php\n/***CONFIGURATOR***/\n";

        SugarCache::sugar_cache_put('sugar_config', $this->config);
		SpiceConfig::getInstance()->config = $this->config;

		foreach($overrideArray as $key => $val) {
			if (in_array($key, $this->allow_undefined) || isset (SpiceConfig::getInstance()->config[$key])) {
				if (is_string($val) && strcmp($val, 'true') == 0) {
					$val = true;
					$this->config[$key] = $val;
				}
				if (is_string($val) && strcmp($val, 'false') == 0) {
					$val = false;
					$this->config[$key] = false;
				}
			}
			$overideString .= override_value_to_string_recursive2('sugar_config', $key, $val);
		}
		$overideString .= '/***CONFIGURATOR***/';

		$this->saveOverride($overideString);
		if(isset($this->config['logger']['level']) && $this->logger) $this->logger->setLevel($this->config['logger']['level']);
	}

	//bug #27947 , if previous \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config['stack_trace_errors'] is true and now we disable it , we should clear all the cache.
	function clearCache(){
		global  $sugar_version;
		$currentConfigArray = $this->readOverride();
		foreach($currentConfigArray as $key => $val) {
			if (in_array($key, $this->allow_undefined) || isset (SpiceConfig::getInstance()->config[$key])) {
				if (empty($val) ) {
					if(!empty($this->previous_sugar_override_config_array['stack_trace_errors']) && $key == 'stack_trace_errors'){
						return;
					}
				}
			}
		}
	}

	function saveConfig() {
		$this->handleOverride();
		$this->clearCache();
	}

	function readOverride() {
		SpiceConfig::getInstance()->config = [];
		if (file_exists('config_override.php')) {
		    if ( !is_readable('config_override.php') ) {
		        LoggerManager::getLogger()->fatal("Unable to read the config_override.php file. Check the file permissions");
		    }
	        else {
	            include('config_override.php');
	        }
		}
		return SpiceConfig::getInstance()->config;
	}
	// CR100349 remove methods from install_utils.php that are required from classes in use
	function saveOverride($override) {
	    if ( !file_exists('config_override.php') ) {
	    	touch('config_override.php');
	    }
	    if ( !($this->make_writable('config_override.php')) ||  !(is_writable('config_override.php')) ) {
	        LoggerManager::getLogger()->fatal("Unable to write to the config_override.php file. Check the file permissions");
	        return;
	    }
		$fp = sugar_fopen('config_override.php', 'w');
		fwrite($fp, $override);
		fclose($fp);
	}


	function make_writable($file)
	{

		$ret_val = false;
		if(is_file($file) || is_dir($file))
		{
			if(is_writable($file))
			{
				$ret_val = true;
			}
			else
			{
				$original_fileperms = fileperms($file);

				// add user writable permission
				$new_fileperms = $original_fileperms | 0x0080;
				@sugar_chmod($file, $new_fileperms);
				clearstatcache();
				if(is_writable($file))
				{
					$ret_val = true;
				}
				else
				{
					// add group writable permission
					$new_fileperms = $original_fileperms | 0x0010;
					@chmod($file, $new_fileperms);
					clearstatcache();
					if(is_writable($file))
					{
						$ret_val = true;
					}
					else
					{
						// add world writable permission
						$new_fileperms = $original_fileperms | 0x0002;
						@chmod($file, $new_fileperms);
						clearstatcache();
						if(is_writable($file))
						{
							$ret_val = true;
						}
					}
				}
			}
		}

		return $ret_val;
	}

}
