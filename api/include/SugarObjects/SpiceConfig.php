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
use SpiceCRM\includes\utils\SugarArray;
use SpiceCRM\includes\database;

/**
 * Config manager
 * @api
 */
class SpiceConfig
{
    var $_cached_values = [];

    private static $instance = null;

    public $config = [];


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
        $sugar_config = [];
        if (is_file('config.php')) {
            include('config.php'); // provides \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config
        }

        // load up the config_override.php file.  This is used to provide default user settings
        if (is_file('config_override.php')) {
            include('config_override.php');
        }
        $this->config = $sugar_config;
    }

    /**
     * @return bool
     * @throws Exception
     */
    public function loadConfigFromDB()
    {
        $db = DBManagerFactory::getInstance();
        if ($db) {
            $result = $db->query("SELECT * FROM config");
            while ($configEntry = $db->fetchByAssoc($result)) {
                $this->config[$configEntry['category']][$configEntry['name']] = $configEntry['value'];
            }
        }
        return true;
    }



    /**
     * reloads the complete config
     */
    function reloadConfig(){
        $this->loadConfigFiles();
        $this->loadConfigFromDB();
    }
}

