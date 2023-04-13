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

namespace SpiceCRM\includes\SugarObjects;

use Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceCache\SpiceCache;
use SpiceCRM\includes\utils\SugarArray;

/**
 * Config manager
 * @api
 */
class SpiceConfig
{
    var $_cached_values = [];

    private static $instance = null;

    /**
     * holds the config
     *
     * @var array
     */
    public $config = [];

    /**
     * set to true in the installation process
     *
     * @var bool
     */
    public $installing = false;


    private function __construct() {}
    private function __clone() {}
    public function __wakeup() {}
    /**
     * @return SpiceConfig
     */
    static function getInstance()
    {
        if (self::$instance === null) {

            //set instance
            self::$instance = new self;
            self::$instance->loadConfigFiles();
            self::$instance->loadConfigFromDB();
            self::$instance->mappingBWC();
        }
        return self::$instance;
    }

    public function get($key, $default = null)
    {
        $value = SugarArray::staticGet($this->config, $key, $default);
        return $value ? $value : $default;
    }

    public function configExists()
    {
        return $this->config !== [];
    }

    /**
     * @return Array
     */
    protected function loadConfigFiles()
    {
        $spice_config = [];
        if (is_file('config.php')) {
            include('config.php'); // provides \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config
        } else {
            return;
        }

        // load up the config_override.php file.  This is used to provide default user settings
        if (is_file('config_override.php')) {
            include('config_override.php');
        }

        // BWC with sugar_config
        if(isset($sugar_config) && is_array($sugar_config)){
            $spice_config = array_merge($spice_config, $sugar_config);
        }

        // set the config
        $this->config = $spice_config;

        // set the session Dir
        if (!empty($this->config['session_dir'])) {
            session_save_path($this->config['session_dir']);
        }

    }

    /**
     * @return bool
     * @throws Exception
     */
    private function loadConfigFromDB($forceReload = false)
    {
        // check that a config exists
        if (!$this->configExists()) return false;

        $dbconfig = SpiceCache::get('dbconfig');
        if($forceReload || !$dbconfig) {
            $dbconfig = [];
            // load the config
            $db = DBManagerFactory::getInstance();
            if ($db) {
                $result = $db->query("SELECT * FROM config");
                while ($configEntry = $db->fetchByAssoc($result)) {
                    $dbconfig[$configEntry['category']][$configEntry['name']] = $this->convertValue($configEntry['value']);
                }
            }

            SpiceCache::set('dbconfig', $dbconfig);
        }

        // merge the configs
        $this->config = array_merge($this->config, $dbconfig);

        return true;
    }

    /**
     * @return array|mixed
     */
    public static function loadConfigFromSpiceJson(){
        $configJsonPath = './api/spiceconfigurations/spiceconfigurations.json';
        if(is_file($configJsonPath)){
            $json = file_get_contents($configJsonPath);
            if($spiceconfigurations = json_decode($json, true)){
                return $spiceconfigurations;
            }
        }
        return [];
    }

    /**
     * returns the spicecrm version nummer stored in package.json located in the root folder of the instance
     * @return mixed|string
     */
    public static function getSystemVersion(){
        if($text = file_get_contents('../package.json')){
            if($package = json_decode($text)){
                return $package->version;
            }
        }
        return '';
    }

    /**
     * handle BWC for version property
     * new is system.version
     * @return void
     */
    public function getVersion(){
        if(empty($this->config['system']['version'] && !empty($this->config['version']))){
            $this->config['system']['version'] = $this->config['version'];
        }
        return $this->config['system']['version'];
    }


    /**
     * db values will all be strings....
     * make sure a "true" will be set as a boolean
     * make sure a "1" will be set as an integer
     * @return void
     */
    public function convertValue($value){
        switch($value){
            case 'true':
                $value = true;
                break;
            case 'false':
                $value = false;
                break;
            case '1':
                $value = 1;
                break;
            case '0':
                $value = 0;
                break;
        }
        return $value;
    }


    /**
     * reloads the complete config
     */
    function reloadConfig($force = false){
        $this->loadConfigFiles();
        $this->loadConfigFromDB($force);
        self::$instance->mappingBWC();
    }

    function mappingBWC() {
        if ( isset( $this->config['default_preferences']['datef'] )) $this->config['default_date_format'] = $this->config['default_preferences']['datef'];
        if ( isset( $this->config['default_preferences']['timef'] )) $this->config['default_time_format'] = $this->config['default_preferences']['timef'];
        if ( isset( $this->config['default_preferences']['export_charset'] )) $this->config['default_export_charset'] = $this->config['default_preferences']['export_charset'];
        if ( isset( $this->config['default_preferences']['locale_name_format'] )) $this->config['default_locale_name_format'] = $this->config['default_preferences']['locale_name_format'];
        if ( isset( $this->config['default_preferences']['dec_sep'] )) $this->config['default_decimal_seperator'] = $this->config['default_preferences']['dec_sep'];
        if ( isset( $this->config['default_preferences']['num_grp_sep'] )) $this->config['default_number_grouping_seperator'] = $this->config['default_preferences']['num_grp_sep'];
        if ( isset( $this->config['default_preferences']['currency_significant_digits'] )) $this->config['default_currency_significant_digits'] = $this->config['default_preferences']['currency_significant_digits'];
        if ( isset( $this->config['default_preferences']['currency'] )) $this->config['default_currency'] = $this->config['default_preferences']['currency'];
    }

}

