<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\SystemTenants;


use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceInstaller\SpiceInstaller;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Administration\api\controllers\AdminController;

class SystemTenant extends SpiceBean
{

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

        AuthenticationController::getInstance()->getCurrentUser()->reloadPreferences();
    }

    /**
     * initializes a new tenant, sets up the database and builds all required tables
     * @throws Exception
     */
    public function initializeTenant(): bool
    {
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
        $installer = new  SpiceInstaller();
        $installer->createTables($db);
        $installer->insertDefaults($db);
        // create local and in tenant

        $this->copyDataFromSource($config, $preserved_db_name);

        if (!$config['tenant']['disable_copy_config']) {
            $installer->retrieveCoreandLanguages($db, ['language' => ['language_code' => 'en_us']]);
        }

        $admin = new AdminController();
        $admin->repairAndRebuildforInstaller();

        // set the fts setting


        $this->copyConfig($db, $config, 'fts');
        $this->copyConfig($db, $config, 'default_preferences');
        $this->copyConfig($db, $config, 'system');
        $this->copyConfig($db, $config, 'core');

        $db->transactionCommit();
        // switch back to current dabatase
        DBManagerFactory::switchInstance($preserved_db_name, $config);

        $this->initialized = true;
        $this->save();

        return true;
    }

    /**
     * copy data from the source to the tenant db
     * @param array $config
     * @param string $sourceDBName
     * @return void
     * @throws Exception
     */
    public function copyDataFromSource(array $config, string $sourceDBName)
    {
        $sourceDB = DBManagerFactory::switchInstance($sourceDBName, $config);

        $tables = array_map(function ($tableName) {return (object)['name' => $tableName, 'data' => []];}, $this->getCopyTables());

        if (count($tables) == 0) return;

        foreach ($tables as $table) {
            $insertData = $sourceDB->query("SELECT * FROM {$table->name}");
            while ($row = $sourceDB->fetchByAssoc($insertData)) {
                $table->data[] = $row;
            }
        }

        $tenantDB = DBManagerFactory::switchInstance($this->id, $config);

        foreach ($tables as $table) {
            foreach ($table->data as $row) $tenantDB->insertQuery($table->name, $row);
        }

        unset($tables);
    }

    /**
     * get a list of tables to be copied from the source to the tenant db
     * @return string[]
     */
    public function getCopyTables(): array
    {
        return [
            'spiceaclmoduleactions',
            'spiceaclmodulefields',
            'spiceaclobjectactions',
            'spiceaclobjectfields',
            'spiceaclobjects',
            'spiceaclobjectvalues',
            'spiceaclprofiles',
            'spiceaclprofiles_spiceaclobjects',
            'spiceaclstandardactions',
        ];
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
