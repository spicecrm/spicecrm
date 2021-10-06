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

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\LogicHook\LogicHook;
use SpiceCRM\includes\UploadStream;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

// load the config files
SpiceConfig::getInstance()->loadConfigFromDB();

// load the core dictionary files
SpiceDictionaryHandler::loadMetaDataFiles();

require_once('include/utils.php');

require_once('sugar_version.php'); // provides $sugar_version, $sugar_db_version


// get the logger
LoggerManager::getLogger();



// load the metadata from the database
SpiceDictionaryHandler::loadMetaDataDefinitions();

// load the modules
SpiceModules::getInstance()->loadModules();

// require_once('modules/ACL/ACLController.php');
//$controllerfile = isset( SpiceConfig::getInstance()->config['acl']['controller'][0] ) ? SpiceConfig::getInstance()->config['acl']['controller'] : 'modules/SpiceACL/SpiceACLController.php';
//require_once ($controllerfile);

UploadStream::register();

if (empty($GLOBALS['installing'])) {

    if (!empty(SpiceConfig::getInstance()->config['session_dir'])) {
        session_save_path(SpiceConfig::getInstance()->config['session_dir']);
    }

    // load the config from the db and populate to \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config
    SpiceConfig::getInstance()->loadConfigFromDB();

    $GLOBALS['timedate'] = TimeDate::getInstance();

    $current_user = BeanFactory::getBean('Users');//todo-uebelmar clarify... no global $current_user .. this variable has no usage and no scope
    $system_config = BeanFactory::getBean('Administration');
    $system_config->retrieveSettings();

    LogicHook::getInstance()->call_custom_logic('', 'after_entry_point');
}

