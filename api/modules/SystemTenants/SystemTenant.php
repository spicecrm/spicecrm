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

namespace SpiceCRM\modules\SystemTenants;


use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceInstaller\SpiceInstaller;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Administration\api\controllers\AdminController;
use SpiceCRM\includes\authentication\AuthenticationController;

class SystemTenant extends SugarBean
{

    public $table_name = "systemtenants";
    public $object_name = "SystemTenant";
    public $module_dir = 'SystemTenants';

    /**
     * loads the tenant data from teh config for the loader to return to the frontend
     */
    public function getTenantData(){

        return SpiceConfig::getInstance()->config['tenant'] ?: [];
    }

    /**
     * switches the tenant
     * called fromt he authentication
     */
    public function switchToTenant(){
        DBManagerFactory::switchInstance($this->id, SpiceConfig::getInstance()->config);

        // reloads the config
        SpiceConfig::getInstance()->reloadConfig();

        // unset the fts settings
        unset($_SESSION['SpiceFTS']);
    }

    /**
     * initializes a new tenant, sets up the database and builds all required tables
     */
    public function initializeTenant(){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $config = SpiceConfig::getInstance()->config;
        if(!$current_user->is_admin) return false;

        $db = DBManagerFactory::getInstance();
        $db->createDatabase($this->id);

        // memorize the current db name so we can switch back after the new tenant has been initialized
        $preserved_db_name = $config['dbconfig']['db_name'];

        // switch to ne database
        $db = DBManagerFactory::switchInstance($this->id, $config);

        // run installer on new database
        $installer = new  SpiceInstaller($db);
        $installer->createTables($db);
        $installer->insertDefaults($db);
        // create local and in tenant

        // $installer->createCurrentUser($db, );

        $installer->retrieveCoreandLanguages($db, ['language' => ['language_code' => 'en_us']]);

        $admin = new AdminController();
        $admin->repairAndRebuildforInstaller();

        // set the fts setting


        $this->copyConfig($db, $config, 'fts');
        $this->copyConfig($db, $config, 'default_preferences');
        $this->copyConfig($db, $config, 'system');
        $this->copyConfig($db, $config, 'core');

        // switch back to current dabatase
        DBManagerFactory::switchInstance($preserved_db_name, $config);

        return true;
    }

    /**
     * copy config values fromt eh current sugar config to the new config table
     *
     * @param $db
     * @param $config
     * @param $category
     */
    private function copyConfig($db, $config, $category){
        foreach($config[$category] as $name => $value){
            $db->query("INSERT INTO config (category, name, value) VALUES ('$category', '$name', '$value')");
        }
    }

    /**
     * handle tha after save event on teh user if the user has a tenant id
     *
     * @param $bean
     * @param $event
     * @param $arguments
     */
    public function handleUserAfterSaveHook(&$bean, $event, $arguments)
    {
        // if we have a user ina tenant and are not in the tenant
        // central user maintenance int eh master
        if(!empty($bean->systemtenant_id) && empty(AuthenticationController::getInstance()->systemtenantid)){
            $tenant = $this->retrieve($bean->systemtenant_id);
            if($tenant) {
                DBManagerFactory::switchInstance($tenant->id, SpiceConfig::getInstance()->config);

                // get a new user in the tenant and see if it exists
                $tenantuser = BeanFactory::getBean('Users');
                if(!$tenantuser->retrieve($bean->id)){
                    $tenantuser->new_with_id = true;
                };
                // map all fields
                foreach ($bean->field_defs as $fieldname => $fieldDefs){
                    if ($fieldname == 'systemtenant_id' || $fieldDefs['type'] == 'link' || $fieldDefs['source'] == 'non-db') continue;
                    $tenantuser->{$fieldname} = $bean->{$fieldname};
                }
                // save user
                $tenantuser->save();

                // switch back
                DBManagerFactory::switchInstance(SpiceConfig::getInstance()->config['dbconfig']['db_name'], SpiceConfig::getInstance()->config);
            }
        }

        // if we are in a tenant update the central user record as well
        if(empty($bean->systemtenant_id) && !empty(AuthenticationController::getInstance()->systemtenantid)){
            // switchto the master database
            DBManagerFactory::switchInstance(SpiceConfig::getInstance()->config['dbconfig']['db_name'], SpiceConfig::getInstance()->config);
            $masterUser = BeanFactory::getBean('Users', $bean->id);
            // map all fields
            foreach ($bean->field_defs as $fieldname => $fieldDefs){
                if ($fieldname == 'systemtenant_id' || $fieldDefs['type'] == 'link' || $fieldDefs['source'] == 'non-db') continue;
                $masterUser->{$fieldname} = $bean->{$fieldname};
            }
            // save user
            $masterUser->save();
            DBManagerFactory::switchInstance(AuthenticationController::getInstance()->systemtenantid, SpiceConfig::getInstance()->config);
        }
    }
}
