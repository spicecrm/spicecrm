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

namespace SpiceCRM\data;

use SpiceCRM\includes\database\DBManager;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\LogicHook\LogicHook;
use SpiceCRM\includes\SpiceNotifications\SpiceNotifications;
use SpiceCRM\includes\SpiceNotifications\SpiceNotificationsLoader;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\SysTrashCan\SysTrashCan;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\modules\ACLActions\ACLAction;
use SpiceCRM\modules\Relationships\Relationship;
use SpiceCRM\includes\SugarCleaner;
use SpiceCRM\data\Relationships\SugarRelationship;
use SpiceCRM\data\Relationships\SugarRelationshipFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SugarObjects\VardefManager;
use SpiceCRM\includes\SugarCache\SugarCache;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\includes\utils\SpiceUtils;


/* * *******************************************************************************
 * Description:  Defines the base class for all data entities used throughout the
 * application.  The base class including its methods and variables is designed to
 * be overloaded with module-specific methods and variables particular to the
 * module's base entity class.
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
 * All Rights Reserved.
 * ***************************************************************************** */

// CR1000349 spiceinstaller
//require_once('modules/DynamicFields/DynamicField.php');


/**
 * SugarBean is the base class for all business objects in Sugar.  It implements
 * the primary functionality needed for manipulating business objects: create,
 * retrieve, update, delete.  It allows for searching and retrieving list of records.
 * It allows for retrieving related objects (e.g. contacts related to a specific account).
 *
 * In the current implementation, there can only be one bean per folder.
 * Naming convention has the bean name be the same as the module and folder name.
 * All bean names should be singular (e.g. Contact).  The primary table name for
 * a bean should be plural (e.g. contacts).
 * @api
 */
class SugarBean
{
    /**
     * introduced in spicecrm 201903001
     * CR1000154
     * catch and handle bean action state
     * @var
     */
    private $_bean_action;
    const BEAN_ACTION_CREATE = 1;
    const BEAN_ACTION_UPDATE = 2;
    const BEAN_ACTION_DELETE = 4;
    // const BEAN_ACTION_DUPLICATE = 8;
    const BEAN_ACTIONS = [self::BEAN_ACTION_CREATE, self::BEAN_ACTION_UPDATE, self::BEAN_ACTION_DELETE];
    //

    /**
     * Blowfish encryption key
     * @var string
     */
    static protected $field_key;

    /**
     * Cache of fields which can contain files
     *
     * @var array
     */
    static protected $fileFields = [];

    /**
     * A pointer to the database object
     *
     * @var DBManager
     */
    var $db;

    /**
     * Unique object identifier
     *
     * @var string
     */
    public $id;

    /**
     * the module this has been created for, set by the BeanFactory
     *
     * @var string
     */
    public $_module;

    /**
     * When createing a bean, you can specify a value in the id column as
     * long as that value is unique.  During save, if the system finds an
     * id, it assumes it is an update.  Setting new_with_id to true will
     * make sure the system performs an insert instead of an update.
     *
     * @var BOOL -- default false
     */
    var $new_with_id = false;

    /**
     * Disble vardefs.  This should be set to true only for beans that do not have varders.  Tracker is an example
     *
     * @var BOOL -- default false
     */
    var $disable_vardefs = false;

    /**
     * holds the full name of the user that an item is assigned to.  Only used if notifications
     * are turned on and going to be sent out.
     *
     * @var String
     */
    var $new_assigned_user_name;

    /**
     * An array of booleans.  This array is cleared out when data is loaded.
     * As date/times are converted, a "1" is placed under the key, the field is converted.
     *
     * @var Array of booleans
     */
    var $processed_dates_times = [];

    /**
     * Whether to process date/time fields for storage in the database in GMT
     *
     * @var BOOL
     */
    var $process_save_dates = true;

    /**
     * This signals to the bean that it is being saved in a mass mode.
     * Examples of this kind of save are import and mass update.
     * We turn off notificaitons of this is the case to make things more efficient.
     *
     * @var BOOL
     */
    var $save_from_post = true;

    /**
     * When running a query on related items using the method: retrieve_by_string_fields
     * this value will be set to true if more than one item matches the search criteria.
     *
     * @var BOOL
     */
    var $duplicates_found = false;

    /**
     * true if this bean has been deleted, false otherwise.
     *
     * @var BOOL
     */
    var $deleted = 0;

    /**
     * Should the date modified column of the bean be updated during save?
     * This is used for admin level functionality that should not be updating
     * the date modified.  This is only used by sync to allow for updates to be
     * replicated in a way that will not cause them to be replicated back.
     *
     * @var BOOL
     */
    var $update_date_modified = true;

    /**
     * Should the modified by column of the bean be updated during save?
     * This is used for admin level functionality that should not be updating
     * the modified by column.  This is only used by sync to allow for updates to be
     * replicated in a way that will not cause them to be replicated back.
     *
     * @var BOOL
     */
    var $update_modified_by = true;

    /**
     * This allows for seed data to be created without using the current user to set the id.
     * This should be replaced by altering the current user before the call to save.
     *
     * @var unknown_type
     */
    //TODO This should be replaced by altering the current user before the call to save.
    /**
     * Setting this to true allows for updates to overwrite the date_entered
     *
     * @var BOOL
     */
    var $update_date_entered = false;
    var $set_created_by = true;

    /**
     * The database table where records of this Bean are stored.
     *
     * @var String
     */
    var $table_name = '';

    /**
     * This is the singular name of the bean.  (i.e. Contact).
     *
     * @var String
     */
    var $object_name = '';


    /**
     * The name of the module folder for this type of bean.
     *
     * @var String
     */
    var $module_dir = '';
    var $module_name = '';
    var $field_name_map;
    var $field_defs;
    var $column_fields = [];
    var $list_fields = [];
    var $additional_column_fields = [];
    var $relationship_fields = [];
    var $fetched_row = false;
    var $fetched_rel_row = [];
    var $force_load_details = false;
    var $optimistic_lock = false;
    /*
     * The default ACL type
     */
    var $acltype = 'module';

    /**
     * Set to true in the child beans if the module supports importing
     */
    var $importable = false;

    /**
     * Set to true if the bean is being dealt with in a workflow
     */
    var $in_workflow = false;

    /**
     *
     * By default it will be true but if any module is to be kept non visible
     * to tracker, then its value needs to be overriden in that particular module to false.
     *
     */
    var $tracker_visibility = true;

    /**
     * How deep logic hooks can go
     * @var int
     */
    protected $max_logic_depth = 10;

    /**
     * A way to keep track of the loaded relationships so when we clone the object we can unset them.
     *
     * @var array
     */
    protected $loaded_relationships = [];

    /**
     * set to true if dependent fields updated
     */
    protected $is_updated_dependent_fields = false;


    /**
     * maretval 2019-03-13. additional property
     * save data changes to be able to look up audited fields in after_save logic
     */
    public $auditDataChanges = [];

    /**
     * In case this bean is a clone: This informs about the GUID of the template bean.
     */
    var $newFromTemplate = '';

    /**
     * Constructor for the bean, it performs following tasks:
     *
     * 1. Initalized a database connections
     * 2. Load the vardefs for the module implemeting the class. cache the entries
     *    if needed
     * 3. Setup row-level security preference
     * All implementing classes  must call this constructor using the parent::SugarBean() class.
     *
     */
    function __construct()
    {
        $this->initialize_bean();

        return $this;
    }

    /**
     * initializes the bean
     */
    public function initialize_bean()
    {
        global $dictionary;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        static $loaded_defs = [];
        $this->db = DBManagerFactory::getInstance();
        if (empty($this->module_name))
            $this->module_name = $this->module_dir;
        if ((false == $this->disable_vardefs && empty($loaded_defs[$this->object_name])) || !empty($GLOBALS['reload_vardefs'])) {
            VardefManager::loadVardef($this->module_dir, $this->object_name);

            // logic hook to create vardefs .. if any additonal fields are required
            $this->call_custom_logic('create_vardefs');

            // build $this->column_fields from the field_defs if they exist
            if (!empty($dictionary[$this->object_name]['fields'])) {
                foreach ($dictionary[$this->object_name]['fields'] as $key => $value_array) {
                    $column_fields[] = $key;
                    if (!empty($value_array['required']) && !empty($value_array['name'])) {
                        $this->required_fields[$value_array['name']] = 1;
                    }
                }
                $this->column_fields = $column_fields;
            }

            //load up field_arrays from CacheHandler;
            if (empty($this->list_fields))
                $this->list_fields = $this->_loadCachedArray($this->module_dir, $this->object_name, 'list_fields');
            if (empty($this->column_fields))
                $this->column_fields = $this->_loadCachedArray($this->module_dir, $this->object_name, 'column_fields');
            if (empty($this->required_fields))
                $this->required_fields = $this->_loadCachedArray($this->module_dir, $this->object_name, 'required_fields');

            if (isset($GLOBALS['dictionary'][$this->object_name]) && !$this->disable_vardefs) {
                $this->field_name_map = $dictionary[$this->object_name]['fields'];
                $this->field_defs = $dictionary[$this->object_name]['fields'];

                if (!empty($dictionary[$this->object_name]['optimistic_locking'])) {
                    $this->optimistic_lock = true;
                }
            }

        } else {
            $this->field_name_map = &$loaded_defs[$this->object_name]['field_name_map'];
            $this->field_defs = &$loaded_defs[$this->object_name]['field_defs'];

            if (!empty($dictionary[$this->object_name]['optimistic_locking'])) {
                $this->optimistic_lock = true;
            }
        }

        if ($this->bean_implements('ACL') && !empty(AuthenticationController::getInstance()->getCurrentUser())) {
            $this->acl_fields = (isset($dictionary[$this->object_name]['acl_fields']) && $dictionary[$this->object_name]['acl_fields'] === false) ? false : true;
        }
        $this->populateDefaultValues();
    }

    /**
     * introduced in spicecrm 201903001
     * CR1000154
     * set current action applied on bean
     * only create || update for now
     * @param null $action
     */
    private function set_bean_action($action = null)
    {
        if ($action && !in_array($action, self::BEAN_ACTIONS))
            return;
        $this->_bean_action = $action;
    }

    /**
     * introduced in spicecrm 201903001
     * CR1000154
     * @return mixed
     */
    public function get_bean_action()
    {
        return $this->_bean_action;
    }

    /**
     * introduced in spicecrm 201903001
     * CR1000154
     * @return bool
     */
    public function isNew()
    {
        // added check on new_with_id for BW compatibility
        // return ($this->_bean_action == self::BEAN_ACTION_CREATE);
        return ($this->_bean_action == self::BEAN_ACTION_CREATE || $this->new_with_id);
    }

    /**
     * will be called on var_dump() or print_r()
     * @return mixed
     */
    public function __debugInfo()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        // only if the current user is an admin
        if (!$current_user->isAdmin()) return [];

        $fields = $this->getFieldDefinitions();
        foreach ($fields as $field => $data) {
            $ret[$field] = $this->{$field};
        }
        return $ret;
    }


    /**
     * This function is designed to cache references to field arrays that were previously stored in the
     * bean files and have since been moved to separate files. Was previously in include/CacheHandler.php
     *
     * @param $module_dir string the module directory
     * @param $module string the name of the module
     * @param $key string the type of field array we are referencing, i.e. list_fields, column_fields, required_fields
     * *@deprecated
     */
    private function _loadCachedArray(
        $module_dir, $module, $key
    )
    {
        static $moduleDefs = [];

        $fileName = 'field_arrays.php';

        $cache_key = "load_cached_array.$module_dir.$module.$key";
        $result = SugarCache::sugar_cache_retrieve($cache_key);
        if (!empty($result)) {
            // Use SugarCache::EXTERNAL_CACHE_NULL_VALUE to store null values in the cache.
            if ($result == SugarCache::EXTERNAL_CACHE_NULL_VALUE) {
                return null;
            }

            return $result;
        }

        if (file_exists('modules/' . $module_dir . '/' . $fileName)) {
            // If the data was not loaded, try loading again....
            if (!isset($moduleDefs[$module])) {
                include('modules/' . $module_dir . '/' . $fileName);
                $moduleDefs[$module] = $fields_array;
            }
            // Now that we have tried loading, make sure it was loaded
            if (empty($moduleDefs[$module]) || empty($moduleDefs[$module][$module][$key])) {
                // It was not loaded....  Fail.  Cache null to prevent future repeats of this calculation
                SugarCache::sugar_cache_put($cache_key, SugarCache::EXTERNAL_CACHE_NULL_VALUE);
                return null;
            }

            // It has been loaded, cache the result.
            SugarCache::sugar_cache_put($cache_key, $moduleDefs[$module][$module][$key]);
            return $moduleDefs[$module][$module][$key];
        }

        // It was not loaded....  Fail.  Cache null to prevent future repeats of this calculation
        SugarCache::sugar_cache_put($cache_key, SugarCache::EXTERNAL_CACHE_NULL_VALUE);
        return null;
    }

    function bean_implements($interface)
    {
        // by default return ACL true
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    function populateDefaultValues($force = false)
    {
        if (!is_array($this->field_defs))
            return;
        foreach ($this->field_defs as $field => $value) {
            if ((isset($value['default']) || !empty($value['display_default'])) && ($force || empty($this->$field))) {
                $type = $value['type'];

                switch ($type) {
                    case 'multienum':
                        if (empty($value['default']) && !empty($value['display_default']))
                            $this->$field = $value['display_default'];
                        else
                            $this->$field = $value['default'];
                        break;
                    case 'bool':
                        if (isset($this->$field)) {
                            break;
                        }
                    default:
                        if (isset($value['default']) && $value['default'] !== '') {
                            $this->$field = htmlentities($value['default'], ENT_QUOTES, 'UTF-8');
                        } else {
                            $this->$field = '';
                        }
                } //switch
            }
        } //foreach
    }

    /**
     * Returns a list of fields with their definitions that have the audited property set to true.
     * Before calling this function, check whether audit has been enabled for the table/module or not.
     * You would set the audit flag in the implemting module's vardef file.
     *
     * @return array
     * @see is_AuditEnabled
     *
     * Internal function, do not override.
     */
    function getAuditEnabledFieldDefinitions()
    {
        $aclcheck = $this->bean_implements('ACL');
        $is_owner = $this->isOwner(AuthenticationController::getInstance()->getCurrentUser()->id);
        if (!isset($this->audit_enabled_fields)) {

            $this->audit_enabled_fields = [];
            foreach ($this->field_defs as $field => $properties) {

                if (
                    // todo: figure out why the modified fields are always set to wrong audited value
                    $properties['audited'] !== false && $properties['name'] != 'modified_by_name' && $properties['name'] != 'date_modified'
                ) {

                    $this->audit_enabled_fields[$field] = $properties;
                }
            }
        }
        return $this->audit_enabled_fields;
    }

    /**
     * Introduced 2018-6-19
     * Returns a list of fields with their definitions that have the auditedfirstlog property set to true.
     * Before calling this function, check whether audit has been enabled for the table/module or not.
     * You would set the audit flag in the implemting module's vardef file.
     *
     * @return array
     *
     * Internal function, do not override.     */
    function getAuditedFirstLogEnabledFieldDefinitions()
    {
        $aclcheck = $this->bean_implements('ACL');
        $is_owner = $this->isOwner(AuthenticationController::getInstance()->getCurrentUser()->id);
        if (!isset($this->firstlog_enabled_fields)) {

            $this->firstlog_enabled_fields = [];
            foreach ($this->field_defs as $field => $properties) {
                if (
                (
                !empty($properties['auditedfirstlog']))
                ) {

                    $this->firstlog_enabled_fields[$field] = $properties;
                }
            }
        }
        return $this->firstlog_enabled_fields;
    }

    /**
     * Returns true of false if the user_id passed is the owner
     *
     * @param GUID $user_id
     * @return boolean
     */
    function isOwner($user_id)
    {
        //if we don't have an id we must be the owner as we are creating it
        if (!isset($this->id)) {
            return true;
        }
        //if there is an assigned_user that is the owner
        if (!empty($this->fetched_row['assigned_user_id'])) {
            if ($this->fetched_row['assigned_user_id'] == $user_id) {
                return true;
            }
            return false;
        } elseif (isset($this->assigned_user_id)) {
            if ($this->assigned_user_id == $user_id)
                return true;
            return false;
        } else {
            //other wise if there is a created_by that is the owner
            if (isset($this->created_by) && $this->created_by == $user_id) {
                return true;
            }
        }
        return false;
    }


    /**
     * Returns the implementing class' table name.
     *
     * All implementing classes set a value for the table_name variable. This value is returned as the
     * table name. If not set, table name is extracted from the implementing module's vardef.
     *
     * @return String Table name.
     *
     * Internal function, do not override.
     */
    public function getTableName()
    {
        if (isset($this->table_name)) {
            return $this->table_name;
        }
        global $dictionary;
        return $dictionary[$this->getObjectName()]['table'];
    }

    /**
     * Returns the object name. If object_name is not set, table_name is returned.
     *
     * All implementing classes must set a value for the object_name variable.
     *
     * @param array $arr row of data fetched from the database.
     * @return  nothing
     *
     */
    function getObjectName()
    {
        if ($this->object_name)
            return $this->object_name;

        // This is a quick way out. The generated metadata files have the table name
        // as the key. The correct way to do this is to override this function
        // in bean and return the object name. That requires changing all the beans
        // as well as put the object name in the generator.
        return $this->table_name;
    }

    /**
     * Returns index definitions for the implementing module.
     *
     * The definitions were loaded in the constructor.
     *
     * @return Array Index definitions.
     *
     * Internal function, do not override.
     */
    function getIndices()
    {
        global $dictionary;
        if (isset($dictionary[$this->getObjectName()]['indices'])) {
            return $dictionary[$this->getObjectName()]['indices'];
        }
        return [];
    }

    /**
     * Returnss  definition for the id field name.
     *
     * The definitions were loaded in the constructor.
     *
     * @return Array Field properties.
     *
     * Internal function, do not override.
     */
    function getPrimaryFieldDefinition()
    {
        $def = $this->getFieldDefinition("id");
        if (empty($def)) {
            $def = $this->getFieldDefinition(0);
        }
        if (empty($def)) {
            $defs = $this->field_defs;
            reset($defs);
            $def = current($defs);
        }
        return $def;
    }

    /**
     * Returns field definition for the requested field name.
     *
     * The definitions were loaded in the constructor.
     *
     * @param string field name,
     * @return Array Field properties or boolean false if the field doesn't exist
     *
     * Internal function, do not override.
     */
    function getFieldDefinition($name)
    {
        if (!isset($this->field_defs[$name]))
            return false;

        return $this->field_defs[$name];
    }

    /**
     * Returns the value for the requested field.
     *
     * When a row of data is fetched using the bean, all fields are created as variables in the context
     * of the bean and then fetched values are set in these variables.
     *
     * @param string field name,
     * @return varies Field value.
     *
     * Internal function, do not override.
     */
    function getFieldValue($name)
    {
        if (!isset($this->$name)) {
            return FALSE;
        }
        if ($this->$name === TRUE) {
            return 1;
        }
        if ($this->$name === FALSE) {
            return 0;
        }
        return $this->$name;
    }

    /**
     * Populates the relationship meta for a module.
     *
     * It is called during setup/install. It is used statically to create relationship meta data for many-to-many tables.
     *
     * @param string $key name of the object.
     * @param object $db database handle.
     * @param string $tablename table, meta data is being populated for.
     * @param array dictionary vardef dictionary for the object.     *
     * @param string module_dir name of subdirectory where module is installed.
     * @param boolean $iscustom Optional,set to true if module is installed in a custom directory. Default value is false.
     * @static
     *
     *  Internal function, do not override.
     */
    static function createRelationshipMeta($key, $db, $tablename, $dictionary, $module_dir, $iscustom = false)
    {
        //forget relationships if tablename is empty. Will be the case with MergeRecords.
        //avoid unnecessary log line "createRelationshipMeta: Metadata for table  does not exist"
        if (empty($tablename)) return;

        //load the module dictionary if not supplied.
        if (empty($dictionary) && !empty($module_dir)) {
            if ($iscustom) {
                $filename = 'custom/modules/' . $module_dir . '/Ext/Vardefs/vardefs.ext.php';
            } else {
                if ($key == 'User') {
                    // a very special case for the Employees module
                    // this must be done because the Employees/vardefs.php does an include_once on
                    // Users/vardefs.php
                    $filename = 'modules/Users/vardefs.php';
                } else {
                    if (file_exists( "extensions/modules/{$module_dir}/vardefs.php")) {
                        $filename = "extensions/modules/{$module_dir}/vardefs.php";
                    } elseif (file_exists( "modules/{$module_dir}/vardefs.php")) {
                        $filename = "modules/{$module_dir}/vardefs.php";
                    }
                }
            }

            //add custom/modules/[]modulename]/vardefs.php capability
            //ORIGINAL: if (file_exists($filename)) {
            if (file_exists(($iscustom ? $filename : get_custom_file_if_exists($filename)))) {
                include($filename);
                // cn: bug 7679 - dictionary entries defined as $GLOBALS['name'] not found
                if (empty($dictionary) || !empty($GLOBALS['dictionary'][$key])) {
                    $dictionary = $GLOBALS['dictionary'];
                }
            } else {
                LoggerManager::getLogger()->debug("createRelationshipMeta: no metadata file found" . ($iscustom ? $filename : get_custom_file_if_exists($filename)));
                return;
            }
        }

        if (!is_array($dictionary) or !array_key_exists($key, $dictionary)) {
            LoggerManager::getLogger()->fatal("createRelationshipMeta: Metadata for table " . $tablename . " does not exist");
            display_notice("meta data absent for table " . $tablename . " keyed to $key ");
        } else {
            if (isset($dictionary[$key]['relationships'])) {

                $RelationshipDefs = $dictionary[$key]['relationships'];

                $delimiter = ',';
                $beanList_ucase = array_change_key_case(SpiceModules::getInstance()->getBeanList(), CASE_UPPER);
                foreach ($RelationshipDefs as $rel_name => $rel_def) {
                    if (isset($rel_def['lhs_module']) and !isset($beanList_ucase[strtoupper($rel_def['lhs_module'])])) {
                        LoggerManager::getLogger()->debug('skipping orphaned relationship record ' . $rel_name . ' lhs module is missing ' . $rel_def['lhs_module']);
                        continue;
                    }
                    if (isset($rel_def['rhs_module']) and !isset($beanList_ucase[strtoupper($rel_def['rhs_module'])])) {
                        LoggerManager::getLogger()->debug('skipping orphaned relationship record ' . $rel_name . ' rhs module is missing ' . $rel_def['rhs_module']);
                        continue;
                    }


                    //check whether relationship exists or not first.
                    if (!class_exists('Relationship')) {
                        require_once 'modules/Relationships/Relationship.php';
                    }
                    if (Relationship::exists($rel_name, $db)) {
                        LoggerManager::getLogger()->debug('Skipping, reltionship already exists ' . $rel_name);
                    } else {
                        $seed = new Relationship();
                        $keys = array_keys($seed->field_defs);
                        $toInsert = [];
                        foreach ($keys as $key) {
                            if ($key == "id") {
                                $toInsert[$key] = SpiceUtils::createGuid();
                            } else if ($key == "relationship_name") {
                                $toInsert[$key] = $rel_name;
                            } else if (isset($rel_def[$key])) {
                                $toInsert[$key] = $rel_def[$key];
                            } else if (isset($seed->field_defs[$key]['default'])) {
                                $defaultValue = $seed->field_defs[$key]['default'];
                                if($seed->field_defs[$key]['default'] === false) $defaultValue = 0;
                                if($seed->field_defs[$key]['default'] === true) $defaultValue = 1;
                                $toInsert[$key] = $defaultValue;
                            }
                        }


                        $column_list = implode(",", array_keys($toInsert));
                        // todo: consider variable type for values! integer shall be passed as such and not as a string
                        $value_list = "'" . implode("','", array_values($toInsert)) . "'";

                        //create the record. todo add error check.
                        $insert_string = "INSERT into relationships (" . $column_list . ") values (" . $value_list . ")";
                        $db->query($insert_string, true);
                    }
                }
            } else {
                //todo
                //log informational message stating no relationships meta was set for this bean.
            }
        }
    }

    /**
     * Handle the following when a SugarBean object is cloned
     *
     * Currently all this does it unset any relationships that were created prior to cloning the object
     *
     * @api
     */
    public function __clone()
    {
        if (!empty($this->loaded_relationships)) {
            foreach ($this->loaded_relationships as $rel) {
                unset($this->$rel);
            }
        }
    }

    /**
     * Loads all attributes of type link.
     *
     * DO NOT CALL THIS FUNCTION IF YOU CAN AVOID IT. Please use load_relationship directly instead.
     *
     * Method searches the implmenting module's vardef file for attributes of type link, and for each attribute
     * create a similary named variable and load the relationship definition.
     *
     * @return Nothing
     *
     * Internal function, do not override.
     */
    function load_relationships()
    {
        LoggerManager::getLogger()->debug("SugarBean.load_relationships, Loading all relationships of type link.");
        $linked_fields = $this->get_linked_fields();
        foreach ($linked_fields as $name => $properties) {
            $this->load_relationship($name);
        }
    }

    /**
     * Returns an array of fields that are of type link.
     *
     * @return array List of fields.
     *
     * Internal function, do not override.
     */
    function get_linked_fields()
    {
        $linked_fields = [];
        $fieldDefs = $this->getFieldDefinitions();

        //find all definitions of type link.
        if (!empty($fieldDefs)) {
            foreach ($fieldDefs as $name => $properties) {
                if (array_search('link', $properties) === 'type') {
                    $linked_fields[$name] = $properties;
                }
            }
        }

        return $linked_fields;
    }

    /**
     * Returns field definitions for the implementing module.
     *
     * The definitions were loaded in the constructor.
     *
     * @return Array Field definitions.
     *
     * Internal function, do not override.
     */
    function getFieldDefinitions()
    {
        return $this->field_defs;
    }

    /**
     * Loads the request relationship. This method should be called before performing any operations on the related data.
     *
     * This method searches the vardef array for the requested attribute's definition. If the attribute is of the type
     * link then it creates a similary named variable and loads the relationship definition.
     *
     * @param string $rel_name relationship/attribute name.
     * @return nothing.
     */
    function load_relationship($rel_name)
    {
        LoggerManager::getLogger()->debug("SugarBean[{$this->object_name}].load_relationships, Loading relationship (" . $rel_name . ").");

        if (empty($rel_name)) {
            LoggerManager::getLogger()->error("SugarBean.load_relationships, Null relationship name passed.");
            return false;
        }
        $fieldDefs = $this->getFieldDefinitions();

        //find all definitions of type link.
        if (!empty($fieldDefs[$rel_name])) {
            //initialize a variable of type Link
            $class = '\SpiceCRM\data\Link2';
            if (isset($this->$rel_name) && $this->$rel_name instanceof $class) {
                return true;
            }
            //if rel_name is provided, search the fieldef array keys by name.
            if (isset($fieldDefs[$rel_name]['type']) && $fieldDefs[$rel_name]['type'] == 'link') {
                $this->$rel_name = new $class($rel_name, $this);

                if (empty($this->$rel_name) ||
                    (method_exists($this->$rel_name, "loadedSuccesfully") && !$this->$rel_name->loadedSuccesfully())
                ) {
                    unset($this->$rel_name);
                    return false;
                }
                // keep track of the loaded relationships
                $this->loaded_relationships[] = $rel_name;
                return true;
            }
        }
        LoggerManager::getLogger()->info("SugarBean.load_relationships, Error Loading relationship (passed link name = " . $rel_name . ") in module " . $this->module_dir);

        return false;
    }

    /**
     * Returns an array of beans of related data.
     *
     * For instance, if an account is related to 10 contacts , this function will return an array of contacts beans (10)
     * with each bean representing a contact record.
     * Method will load the relationship if not done so already.
     *
     * @param mixed string|array $field_name relationship(s) to be loaded.
     * @param string $bean name  class name of the related bean. @deprecated parameter. Not necessary
     * @param array $sort_array optional, unused
     * @param int $begin_index Optional, default 0, unused.
     * @param int $end_index Optional, default -1
     * @param int $deleted Optional, Default 0, 0  adds deleted=0 filter, 1  adds deleted=1 filter.
     * @param string $optional_where , Optional, default empty.
     *
     * Internal function, do not override.
     */
    function get_linked_beans($field_name, $bean_name = null, $sort_array = [], $begin_index = 0, $end_index = -1, $deleted = 0, $optional_where = "")
    {
        // CR1000509 get a collection of related beans
        if (is_array($field_name)) {
            return $this->get_multiple_linked_beans($field_name);
        }

        if ($this->load_relationship($field_name)) {

            // Link2 style
            if ($end_index != -1 || !empty($deleted) || !empty($optional_where)) {

                // BEGIN CR1000382: move sort_array content to 'sorthook' when sortfield is non-db
                if (!empty($sort_array) && isset($sort_array['sortfield'])) {
                    if (isset($this->field_defs[$sort_array['sortfield']]['source']) && $this->field_defs[$sort_array['sortfield']]['source'] == 'non-db') {
                        $sorthook['sorthook'] = $sort_array;
                        $sort_array = $sorthook;
                    }
                }
                // END

                return array_values($this->$field_name->getBeans([
                    'where' => $optional_where,
                    'deleted' => $deleted,
                    'offset' => $begin_index,
                    'limit' => ($end_index - $begin_index),
                    'sort' => $sort_array
                ]));
            } else
                return array_values($this->$field_name->getBeans());
        }
        return [];
    }

    /**
     * CR1000509 get a collection of related beans
     * EXPERIMENTAL! DO NOT USE FOR NOW!
     * @param array $field_names linkname => [params]
     * @return array
     */
    private function get_multiple_linked_beans($field_names)
    {
        // check how field_names is formed. Make an array if it's not.
        foreach ($field_names as $field_name){
            if(!is_array($field_name)){
                $field_names[$field_name] = [];
            }
        }

        $returnBeans = [];
        foreach ($field_names as $field_name => $field_name_params) {
            if ($this->load_relationship($field_name)) {
                // handle params
                $sort_array = [];
                $begin_index = 0;
                $end_index = -1;
                $deleted = 0;
                $optional_where = "";
                if (isset($field_name_params['sort_array'])) {
                    $sort_array = $field_name_params['sort_array'];
                }
                if (isset($field_name_params['begin_index'])) {
                    $begin_index = $field_name_params['begin_index'];
                }
                if (isset($field_name_params['end_index'])) {
                    $end_index = $field_name_params['end_index'];
                }
                if (isset($field_name_params['deleted'])) {
                    $deleted = $field_name_params['deleted'];
                }
                if (isset($field_name_params['optional_where'])) {
                    $optional_where = $field_name_params['optional_where'];
                }
                // get related beans
                $returnBeans = array_merge($returnBeans, $this->get_linked_beans($field_name, null, $sort_array, $begin_index, $end_index, $deleted, $optional_where));
            }
        }

        return $returnBeans;
    }

    /**
     * @param string $field_name
     * @param null $bean_name
     * @param int $deleted
     * @param string $optional_where
     * @return int
     */
    function get_linked_beans_count($field_name, $bean_name = null, $deleted = 0, $optional_where = "")
    {
        if (is_array($field_name)) {
            return $this->get_multiple_linked_beans_count($field_name);
        }

        if ($this->load_relationship($field_name)) {
            return $this->$field_name->getBeanCount([
                'where' => $optional_where,
                'deleted' => $deleted
            ]);
        } else
            return 0;
    }

    /**
     * @param array $field_names list of linknames => [params]
     * @return int
     */
    function get_multiple_linked_beans_count($field_names)
    {
        // check how field_names is formed. Make an array if it's not.
        foreach ($field_names as $field_name){
            if(!is_array($field_name)){
                $field_names[$field_name] = [];
            }
        }

        $count = 0;
        foreach ($field_names as $field_name => $field_name_params) {
            if ($this->load_relationship($field_name)) {
                $count += $this->$field_name->getBeanCount([
                    'where' => $field_name_params['optional_where'],
                    'deleted' => $field_name_params['deleted']
                ]);
            }
        }
        return $count;
    }


    /**
     * Creates tables for the module implementing the class.
     * If you override this function make sure that your code can handles table creation.
     *
     */
    function create_tables()
    {
        global $dictionary;

        $key = $this->getObjectName();
        if (!array_key_exists($key, $dictionary)) {
            LoggerManager::getLogger()->fatal("create_tables: Metadata for table " . $this->table_name . " does not exist");
            display_notice("meta data absent for table " . $this->table_name . " keyed to $key ");
        } else {
            if (!$this->db->tableExists($this->table_name)) {
                $this->db->createTable($this);
                if ($this->bean_implements('ACL')) {
                    if (!empty($this->acltype)) {
                        ACLAction::addActions($this->getACLCategory(), $this->acltype);
                    } else {
                        ACLAction::addActions($this->getACLCategory());
                    }
                }
            } else {
                echo "Table already exists : $this->table_name<br>";
            }
            if ($this->is_AuditEnabled()) {
                if (!$this->db->tableExists($this->get_audit_table_name())) {
                    $this->create_audit_table();
                }
            }
        }
    }

    /**
     * Returns the ACL category for this module; defaults to the SugarBean::$acl_category if defined
     * otherwise it is SugarBean::$module_dir
     *
     * @return string
     */
    public function getACLCategory()
    {
        return !empty($this->acl_category) ? $this->acl_category : $this->module_dir;
    }

    /**
     * Return true if auditing is enabled for this object
     * You would set the audit flag in the implemting module's vardef file.
     *
     * @return boolean
     *
     * Internal function, do not override.
     */
    function is_AuditEnabled()
    {
        global $dictionary;
        if (isset($dictionary[$this->getObjectName()]['audited'])) {
            return $dictionary[$this->getObjectName()]['audited'];
        } else {
            return false;
        }
    }

    /**
     * Uses the Audit log and gets all change reocords grouped by field
     * that have been changed on teh bean since the date passed in
     *
     * @param $date .. the date from which to check,
     * @param $fields .. array of Fields to be checked
     * @return array of changed fields
     */
    public function getAuditChangesAfterDate($date, $fields = [])
    {
        $records = [];

        // CR1000308
        if (!$this->db->tableExists($this->get_audit_table_name())) {
            return $records;
        }

        $query = "SELECT {$this->get_audit_table_name()}.*, users.user_name FROM {$this->get_audit_table_name()}, users WHERE users.id = {$this->get_audit_table_name()}.created_by AND parent_id = '$this->id' AND date_created > '$date'";
        if (count($fields) > 0) {
            $query .= " AND field_name in ('" . implode("','", $fields) . "')";
        }
        $query .= " ORDER BY date_created DESC";

        $recordsObject = $this->db->query($query);
        while ($record = $this->db->fetchByAssoc($recordsObject)) {
            if (!isset($records[$record['field_name']])) {
                $records[$record['field_name']] = [
                    'value' => $this->{$record['field_name']},
                    'changes' => []
                ];
            }
            $records[$record['field_name']]['changes'][] = $record;
        }

        return $records;
    }

    /**
     * Returns the name of the audit table.
     * Audit table's name is based on implementing class' table name.
     *
     * @return String Audit table name.
     *
     * Internal function, do not override.
     */
    function get_audit_table_name()
    {
        return $this->getTableName() . '_audit';
    }

    /**
     * If auditing is enabled, create the audit table.
     *
     * Function is used by the install scripts and a repair utility in the admin panel.
     *
     * Internal function, do not override.
     */
    function create_audit_table()
    {
        global $dictionary;
        $table_name = $this->get_audit_table_name();

        require('metadata/audit_templateMetaData.php');

        // Bug: 52583 Need ability to customize template for audit tables
        $custom = 'custom/metadata/audit_templateMetaData_' . $this->getTableName() . '.php';
        if (file_exists($custom)) {
            require($custom);
        }

        $fieldDefs = $dictionary['audit']['fields'];
        $indices = $dictionary['audit']['indices'];

        // Renaming template indexes to fit the particular audit table (removed the brittle hard coding)
        foreach ($indices as $nr => $properties) {
            // BEGIN CR1000085 enable repair/rebuild for audit tables. Make index name unique within database
            //$indices[$nr]['name'] = 'idx_' . strtolower($this->getTableName()) . '_' . $properties['name'];
            $indices[$nr]['name'] = 'idx_' . strtolower($table_name) . '_' . $properties['name'];
            // END
        }

        $engine = null;
        if (isset($dictionary['audit']['engine'])) {
            $engine = $dictionary['audit']['engine'];
        } else if (isset($dictionary[$this->getObjectName()]['engine'])) {
            $engine = $dictionary[$this->getObjectName()]['engine'];
        }

        $this->db->createTableParams($table_name, $fieldDefs, $indices, $engine);
    }

    /**
     * If auditing is enabled, create the audit table.
     * CR1000085 enable repair/rebuild for audit tables. Introduced in spicecrm 2018.11.001
     * Function is used by the install scripts and a repair utility in the admin panel.
     * Internal function, do not override.
     */
    function update_audit_table($execute = true)
    {

        global $dictionary;
        $table_name = $this->get_audit_table_name();

        require('metadata/audit_templateMetaData.php');

        // Bug: 52583 Need ability to customize template for audit tables
        $custom = 'custom/metadata/audit_templateMetaData_' . $this->getTableName() . '.php';
        if (file_exists($custom)) {
            require($custom);
        }

        $fieldDefs = $dictionary['audit']['fields'];
        $indices = $dictionary['audit']['indices'];

        // Renaming template indexes to fit the particular audit table (removed the brittle hard coding)
        foreach ($indices as $nr => $properties) {
            $indices[$nr]['name'] = 'idx_' . strtolower($this->getTableName()) . '_audit_' . $properties['name'];
        }

        return $this->db->repairAuditTable($table_name, $fieldDefs, $indices, $execute);
    }

    /**
     * Delete the primary table for the module implementing the class.
     * If custom fields were added to this table/module, the custom table will be removed too, along with the cache
     * entries that define the custom fields.
     *
     */
    function drop_tables()
    {
        global $dictionary;
        $key = $this->getObjectName();
        if (!array_key_exists($key, $dictionary)) {
            LoggerManager::getLogger()->fatal("drop_tables: Metadata for table " . $this->table_name . " does not exist");
            echo "meta data absent for table " . $this->table_name . "<br>\n";
        } else {
            if (empty($this->table_name))
                return;
            if ($this->db->tableExists($this->table_name))
                $this->db->dropTable($this);

            if ($this->db->tableExists($this->get_audit_table_name())) {
                $this->db->dropTableName($this->get_audit_table_name());
            }
        }
    }

    /**
     * Implements a generic insert and update logic for any SugarBean
     * This method only works for subclasses that implement the same variable names.
     * This method uses the presence of an id field that is not null to signify and update.
     * The id field should not be set otherwise.
     *
     * @param boolean $check_notify Optional, default false, if set to true assignee of the record is notified via email.
     * @param boolean $fts_index_bean Optional, default true, if set to true SpiceFTSHandler will index the bean.
     * @return int returns the id of the saved bean
     * @todo Add support for field type validation and encoding of parameters.
     */
    public function save($check_notify = false, $fts_index_bean = true)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if (isset($this->newFromTemplate[0])) {
            // CRNR: 1000375: Bug Fix
            // used "module_dir" instead of "module_name", because "OutputTemplates" has the field "module_name" in vardefs which
            // overrides sugar bean variable "module_name".
            // this fix should not have any side effects, as long as all extended beans has the variable "module_dir" set.
            $GLOBALS['cloningData'] = ['count' => 1, 'cloned' => [['module' => $this->module_dir, 'id' => $this->newFromTemplate, 'bean' => &$this, 'cloneId' => $this->id]], 'custom' => null];
            $templateBean = BeanFactory::getBean($this->module_dir, $this->newFromTemplate);
            $templateBean->cloneBeansOfAllLinks($this);
        }

        $this->in_save = true;
        // cn: SECURITY - strip XSS potential vectors
        $this->cleanBean();

        $isUpdate = true;
        if (empty($this->id) || $this->new_with_id == true) {
            $isUpdate = false;
        }

        //set current bean_action
        if ($isUpdate) {
            $this->set_bean_action(self::BEAN_ACTION_UPDATE);
        } else {
            $this->set_bean_action(self::BEAN_ACTION_CREATE);
        }

        if (empty($this->date_modified) || $this->update_date_modified) {
            $this->date_modified = TimeDate::getInstance()->nowDb();
        }

        if (!empty($this->modified_by_name))
            $this->old_modified_by_name = $this->modified_by_name;
        if ($this->update_modified_by) {
            $this->modified_user_id = 1;

            if (!empty($current_user)) {
                $this->modified_user_id = $current_user->id;
                $this->modified_by_name = $current_user->user_name;
            }
        }
        if ($this->deleted != 1)
            $this->deleted = 0;
        if (!$isUpdate) {
            if (empty($this->date_entered)) {
                $this->date_entered = $this->date_modified;
            }
            if ($this->set_created_by == true) {
                // created by should always be this user
                $this->created_by = (isset($current_user)) ? $current_user->id : "";
            }
            if ($this->new_with_id == false) {
                $this->id = SpiceUtils::createGuid();
            }
        }

        BeanFactory::registerBean($this->module_name, $this);

        if (empty($GLOBALS['updating_relationships']) && empty($GLOBALS['saving_relationships']) && empty($GLOBALS['resavingRelatedBeans'])) {
            $GLOBALS['saving_relationships'] = true;
            // let subclasses save related field changes
            $this->save_relationship_changes($isUpdate);
            $GLOBALS['saving_relationships'] = false;
        }

        // keep date entered and do not delete it .. otherwise we will remove id from fts indexer
        if ($isUpdate && !$this->update_date_entered && $this->date_entered != $this->fetched_row['date_entered']) {
            //unset($this->date_entered);
            $this->date_entered = $this->fetched_row['date_entered'];
        }
        // call the custom business logic
        $custom_logic_arguments['check_notify'] = $check_notify;

        $this->call_custom_logic("before_save", $custom_logic_arguments);
        unset($custom_logic_arguments);

        //construct the SQL to create the audit record if auditing is enabled.
        $auditDataChanges = [];
        if ($this->is_AuditEnabled()) {
            if ($isUpdate && !isset($this->fetched_row)) {
                LoggerManager::getLogger()->debug('Auditing: Retrieve was not called, audit record will not be created.');
            } else {
                $auditDataChanges = $this->db->getAuditDataChanges($this);
                //BEGIN introduced 2018-06-19 maretval: log first value set to audit table (vardefs property auditedfirstlog)
                if (!$isUpdate)
                    $dataFirstLog = $this->db->getDataAuditedFirstLog($this);
                //END
            }
        }

        //maretval 2019-03-13: remember changes in after_save logic
        $this->auditDataChanges = $auditDataChanges;
        //END

        // create notifications
        $notificationLoader = new SpiceNotificationsLoader();
        $notificationLoader->createChangeNotifications($this, $check_notify);
        $notificationLoader->createAssignNotification($this, $check_notify);

        if ($isUpdate) {
            $this->db->update($this);
        } else {
            $this->db->insert($this);
        }

        if (!empty($auditDataChanges) && is_array($auditDataChanges)) {
            foreach ($auditDataChanges as $change) {
                $this->db->save_audit_records($this, $change);
            }
        }//BEGIN introduced 2018-06-19 maretval 2018-05-09: log first value set to audit table (vardefs property auditedfirstlog)
        elseif (!empty($dataFirstLog) && is_array($dataFirstLog)) {
            foreach ($dataFirstLog as $change) {
                $this->db->save_audit_records($this, $change);
            }
        }
        //END


        if (empty($GLOBALS['resavingRelatedBeans'])) {
            SugarRelationship::resaveRelatedBeans();
        }

        $this->call_custom_logic('after_save', '');
        // call fts manager to index the bean
        if ($fts_index_bean) {

            SpiceFTSHandler::getInstance()->indexBean($this);
        }

        //Now that the record has been saved, we don't want to insert again on further saves
        $this->new_with_id = false;
        $this->in_save = false;
        //unset current bean_action
        $this->set_bean_action(null);
        return $this->id;
    }

    /**
     * Cleans char, varchar, text, etc. fields of XSS type materials
     */
    function cleanBean()
    {
        foreach ($this->field_defs as $key => $def) {

            if (isset($def['type'])) {
                $type = $def['type'];
            }
            if (isset($def['dbType']))
                $type .= $def['dbType'];

            if ($def['type'] == 'html' || $def['type'] == 'longhtml') {
                $this->$key = SugarCleaner::cleanHtml($this->$key, true);
            } elseif ((strpos($type, 'char') !== false ||
                    strpos($type, 'text') !== false ||
                    $type == 'enum') &&
                !empty($this->$key)
            ) {
                $this->$key = SugarCleaner::cleanHtml($this->$key);
            }
        }
    }

    /**
     * Encrpyt and base64 encode an 'encrypt' field type in the bean using Blowfish. The default system key is stored in cache/Blowfish/{keytype}
     * @param STRING value -plain text value of the bean field.
     * @return string
     */
    function encrpyt_before_save($value)
    {
        require_once("include/utils/encryption_utils.php");
        return blowfishEncode($this->getEncryptKey(), $value);
    }

    protected function getEncryptKey()
    {
        if (empty(self::$field_key)) {
            self::$field_key = blowfishGetKey('encrypt_field');
        }
        return self::$field_key;
    }


    /**
     * returns this bean as an array
     *
     * @return array of fields with id, name, access and category
     */
    function toArray($dbOnly = false, $stringOnly = false, $upperKeys = false)
    {
        static $cache = [];
        $arr = [];

        foreach ($this->field_defs as $field => $data) {
            if (!$dbOnly || !isset($data['source']) || $data['source'] == 'db')
                if (!$stringOnly || is_string($this->$field))
                    if ($upperKeys) {
                        if (!isset($cache[$field])) {
                            $cache[$field] = strtoupper($field);
                        }
                        $arr[$cache[$field]] = $this->$field;
                    } else {
                        if (isset($this->$field)) {
                            $arr[$field] = $this->$field;
                        } else {
                            $arr[$field] = '';
                        }
                    }
        }
        return $arr;
    }

    /**
     * This function is a good location to save changes that have been made to a relationship.
     * This should be overridden in subclasses that have something to save.
     *
     * @param boolean $is_update true if this save is an update.
     * @param array $exclude a way to exclude relationships
     */
    public function save_relationship_changes($is_update, $exclude = [])
    {
        /*
        list($new_rel_id, $new_rel_link) = $this->set_relationship_info($exclude);

        $new_rel_id = $this->handle_preset_relationships($new_rel_id, $new_rel_link, $exclude);

        $this->handle_request_relate($new_rel_id, $new_rel_link);
        */

    }


    /**
     * Trigger custom logic for this module that is defined for the provided hook
     * The custom logic file is located under custom/modules/[CURRENT_MODULE]/logic_hooks.php.
     * That file should define the $hook_version that should be used.
     * It should also define the $hook_array.  The $hook_array will be a two dimensional array
     * the first dimension is the name of the event, the second dimension is the information needed
     * to fire the hook.  Each entry in the top level array should be defined on a single line to make it
     * easier to automatically replace this file.  There should be no contents of this file that are not replacable.
     *
     * $hook_array['before_save'][] = Array(1, testtype, 'custom/modules/Leads/test12.php', 'TestClass', 'lead_before_save_1');
     * This sample line creates a before_save hook.  The hooks are procesed in the order in which they
     * are added to the array.  The second dimension is an array of:
     *        processing index (for sorting before exporting the array)
     *        A logic type hook
     *        label/type
     *        php file to include
     *        php class the method is in
     *        php method to call
     *
     * The method signature for version 1 hooks is:
     * function NAME(&$bean, $event, $arguments)
     *        $bean - $this bean passed in by reference.
     *        $event - The string for the current event (i.e. before_save)
     *        $arguments - An array of arguments that are specific to the event.
     */
    function call_custom_logic($event, $arguments = null)
    {
        if (!isset($this->processed) || $this->processed == false) {
            //add some logic to ensure we do not get into an infinite loop
            if (!empty($this->logicHookDepth[$event])) {
                if ($this->logicHookDepth[$event] > $this->max_logic_depth)
                    return;
            } else
                $this->logicHookDepth[$event] = 0;

            //we have to put the increment operator here
            //otherwise we may never increase the depth for that event in the case
            //where one event will trigger another as in the case of before_save and after_save
            //Also keeping the depth per event allow any number of hooks to be called on the bean
            //and we only will return if one event gets caught in a loop. We do not increment globally
            //for each event called.
            $this->logicHookDepth[$event]++;

            //method defined in 'include/utils/LogicHook.php'

            $logicHook = LogicHook::getInstance();
            $logicHook->call_custom_logic($this->module_dir, $this, $event, $arguments);
            $this->logicHookDepth[$event]--;
        }
    }

    /**
     * Checks if Bean has email defs
     *
     * @return boolean
     */
    public function hasEmails()
    {
        if (!empty($this->field_defs['email_addresses']) && $this->field_defs['email_addresses']['type'] == 'link' &&
            !empty($this->field_defs['email_addresses_non_primary']) && $this->field_defs['email_addresses_non_primary']['type'] == 'email'
        ) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * Returns the summary text that should show up in the recent history list for this object.
     *
     * @return string
     */
    public function get_summary_text()
    {
        // by default return name
        return $this->name;

    }


    /**
     * This function returns a paged list of the current object type.  It is intended to allow for
     * hopping back and forth through pages of data.  It only retrieves what is on the current page.
     *
     * @param string $order_by
     * @param string $where Additional where clause
     * @param int $row_offset Optaional,default 0, starting row number
     * @param init $limit Optional, default -1
     * @param int $max Optional, default -1
     * @param boolean $show_deleted Optional, default 0, if set to 1 system will show deleted records.
     * @return array Fetched data.
     *
     * Internal function, do not override.
     *
     * @internal This method must be called on a new instance.  It trashes the values of all the fields in the current one.
     */
    function get_list($order_by = "", $where = "", $row_offset = 0, $limit = -1, $max = -1, $show_deleted = 0, $singleSelect = false, $select_fields = [])
    {
        LoggerManager::getLogger()->debug("get_list:  order_by = '$order_by' and where = '$where' and limit = '$limit'");
        if (isset($_SESSION['show_deleted'])) {
            $show_deleted = 1;
        }

        if ($this->bean_implements('ACL') && SpiceACL::getInstance()->requireOwner($this->module_dir, 'list')) {
            $current_user = AuthenticationController::getInstance()->getCurrentUser();
            $owner_where = $this->getOwnerWhere($current_user->id);

            //rrs - because $this->getOwnerWhere() can return '' we need to be sure to check for it and
            //handle it properly else you could get into a situation where you are create a where stmt like
            //WHERE .. AND ''
            if (!empty($owner_where)) {
                if (empty($where)) {
                    $where = $owner_where;
                } else {
                    $where .= ' AND ' . $owner_where;
                }
            }
        }
        $query = $this->create_new_list_query($order_by, $where, $select_fields, [], $show_deleted, '', false, null, $singleSelect);
        return $this->process_list_query($query, $row_offset, $limit, $max, $where);
    }

    /**
     * Gets there where statement for checking if a user is an owner
     *
     * @param GUID $user_id
     * @return STRING
     */
    function getOwnerWhere($user_id)
    {
        if (isset($this->field_defs['assigned_user_id'])) {
            return " $this->table_name.assigned_user_id ='$user_id' ";
        }
        if (isset($this->field_defs['created_by'])) {
            return " $this->table_name.created_by ='$user_id' ";
        }
        return '';
    }

    /**
     * Return the list query used by the list views and export button. Next generation of create_new_list_query function.
     *
     * Override this function to return a custom query.
     *
     * @param string $order_by custom order by clause
     * @param string $where custom where clause
     * @param array $filter Optioanal
     * @param array $params Optional     *
     * @param int $show_deleted Optional, default 0, show deleted records is set to 1.
     * @param string $join_type
     * @param boolean $return_array Optional, default false, response as array
     * @param object $parentbean creating a subquery for this bean.
     * @param boolean $singleSelect Optional, default false.
     * @return String select query string, optionally an array value will be returned if $return_array= true.
     */
    public function create_new_list_query($order_by, $where, $filter = [], $params = [], $show_deleted = 0,
                                          $join_type = '', $return_array = false, $parentbean = null,
                                          $singleSelect = false, $ifListForExport = false)
    {
        $ret_array = [];

        if ($this->bean_implements('ACL') && SpiceACL::getInstance()->requireOwner($this->module_dir, 'list')) {
            $current_user = AuthenticationController::getInstance()->getCurrentUser();
            $owner_where = $this->getOwnerWhere($current_user->id);
            if (empty($where)) {
                $where = $owner_where;
            } else {
                $where .= ' AND ' . $owner_where;
            }
        }

        $ret_array['select'] = " SELECT $this->table_name.id ";

        $ret_array['from'] = " FROM $this->table_name ";
        $ret_array['where'] = '';
        $ret_array['order_by'] = '';

        if ($show_deleted == 0) {
            $where_auto = "$this->table_name.deleted = 0";
        } else if ($show_deleted == 1) {
            $where_auto = "$this->table_name.deleted = 1";
        }

        if ($where != "")
            $ret_array['where'] = " where ($where) AND $where_auto";
        else
            $ret_array['where'] = " where $where_auto";

        //make call to process the order by clause
        $order_by = $this->process_order_by($order_by);
        if (!empty($order_by)) {
            $ret_array['order_by'] = " ORDER BY " . $order_by;
        }

        if (SpiceACL::getInstance() && method_exists(SpiceACL::getInstance(), 'addACLAccessToListArray')) {
            SpiceACL::getInstance()->addACLAccessToListArray($ret_array, $this);
        }

        if ($return_array) {
            return $ret_array;
        }

        return $ret_array['select'] . $ret_array['from'] . $ret_array['where'] . $ret_array['order_by'];
    }

    /**
     * Prefixes column names with this bean's table name.
     *
     * @param string $order_by Order by clause to be processed
     * @param SugarBean $submodule name of the module this order by clause is for
     * @param boolean $suppress_table_name Whether table name should be suppressed
     * @return string Processed order by clause
     *
     * Internal function, do not override.
     */
    private function process_order_by($order_by, $submodule = null, $suppress_table_name = false)
    {
        if (empty($order_by))
            return $order_by;

        $raw_elements = explode(',', $order_by);
        $valid_elements = [];
        foreach ($raw_elements as $key => $value) {

            $is_valid = false;

            //value might have ascending and descending decorations
            $list_column = preg_split('/\s/', trim($value), 2);
            $list_column = array_map('trim', $list_column);

            $list_column_name = $list_column[0];
            if (isset($this->field_defs[$list_column_name])) {
                $field_defs = $this->field_defs[$list_column_name];
                $source = isset($field_defs['source']) ? $field_defs['source'] : 'db';

                if (empty($field_defs['table']) && !$suppress_table_name) {
                    if ($source == 'db') {
                        $list_column[0] = $this->table_name . '.' . $list_column[0];
                    }
                }

                // Bug 38803 - Use CONVERT() function when doing an order by on ntext, text, and image fields
                if ($source != 'non-db' && $this->db->isTextType($this->db->getFieldType($this->field_defs[$list_column_name]))
                ) {
                    // array(10000) is for db2 only. It tells db2manager to cast 'clob' to varchar(10000) for this 'sort by' column
                    $list_column[0] = $this->db->convert($list_column[0], "text2char", [10000]);
                }

                $is_valid = true;

                if (isset($list_column[1])) {
                    switch (strtolower($list_column[1])) {
                        case 'asc':
                        case 'desc':
                            break;
                        default:
                            LoggerManager::getLogger()->debug("process_order_by: ($list_column[1]) is not a valid order.");
                            unset($list_column[1]);
                            break;
                    }
                }
            } else {
                LoggerManager::getLogger()->debug("process_order_by: ($list_column[0]) does not have a vardef entry.");
            }

            if ($is_valid) {
                $valid_elements[$key] = implode(' ', $list_column);
            }
        }

        return implode(', ', $valid_elements);
    }

    /**
     * Processes the list query and return fetched row.
     *
     * Internal function, do not override.
     * @param string $query select query to be processed.
     * @param int $row_offset starting position
     * @param int $limit Optioanl, default -1
     * @param int $max_per_page Optional, default -1
     * @param string $where Optional, additional filter criteria.
     * @return array Fetched data
     */
    function process_list_query($query, $row_offset, $limit = -1, $max_per_page = -1)
    {
        $db = DBManagerFactory::getInstance('listviews');
        /**
         * if the row_offset is set to 'end' go to the end of the list
         */
        $toEnd = strval($row_offset) == 'end';
        LoggerManager::getLogger()->debug("process_list_query: " . $query);
        if ($max_per_page == -1) {
            $max_per_page = SpiceConfig::getInstance()->config['list_max_entries_per_page'] ?: 25;
        }
        // Check to see if we have a count query available.
        if (empty(SpiceConfig::getInstance()->config['disable_count_query']) || $toEnd) {
            $count_query = $this->create_list_count_query($query);
            if (!empty($count_query) && (empty($limit) || $limit == -1)) {
                // We have a count query.  Run it and get the results.
                $result = $db->query($count_query, true, "Error running count query for $this->object_name List: ");
                $assoc = $db->fetchByAssoc($result);
                if (!empty($assoc['c'])) {
                    $rows_found = $assoc['c'];
                    $limit = SpiceConfig::getInstance()->config['list_max_entries_per_page'];
                }
                if ($toEnd) {
                    $row_offset = (floor(($rows_found - 1) / $limit)) * $limit;
                }
            }
        } else {
            if ((empty($limit) || $limit == -1)) {
                $limit = $max_per_page + 1;
                $max_per_page = $limit;
            }
        }

        if (empty($row_offset)) {
            $row_offset = 0;
        }
        if (!empty($limit) && $limit != -1 && $limit != -99) {
            $result = $db->limitQuery($query, $row_offset, $limit, true, "Error retrieving $this->object_name list: ");
        } else {
            $result = $db->query($query, true, "Error retrieving $this->object_name list: ");
        }

        $list = [];

        $previous_offset = $row_offset - $max_per_page;
        $next_offset = $row_offset + $max_per_page;

        $class = get_class($this);
        //FIXME: Bug? we should remove the magic number -99
        //use -99 to return all
        $index = $row_offset;
        while ($max_per_page == -99 || ($index < $row_offset + $max_per_page)) {
            $row = $db->fetchByAssoc($result);
            if (empty($row))
                break;

            //instantiate a new class each time. This is because php5 passes
            //by reference by default so if we continually update $this, we will
            //at the end have a list of all the same objects
            /** @var SugarBean $temp */
            $temp = BeanFactory::getBean($this->_module, $row['id'], ['relationships' => false]);

            $temp->fill_in_additional_list_fields();

            // needs to be processed as well
            $temp->fill_in_relationship_fields();

            $temp->call_custom_logic("process_record");

            // fix defect #44206. implement the same logic as sugar_currency_format
            // Smarty modifier does.
            // $temp->populateCurrencyFields();
            $list[] = $temp;

            $index++;
        }
        if (!empty(SpiceConfig::getInstance()->config['disable_count_query']) && !empty($limit)) {

            $rows_found = $row_offset + count($list);

            if (!$toEnd) {
                $next_offset--;
                $previous_offset++;
            }
        } else if (!isset($rows_found)) {
            $rows_found = $row_offset + count($list);
        }

        $response = [];
        $response['list'] = $list;
        $response['row_count'] = $rows_found;
        $response['next_offset'] = $next_offset;
        $response['previous_offset'] = $previous_offset;
        $response['current_offset'] = $row_offset;
        return $response;
    }

    /**
     * Changes the select expression of the given query to be 'count(*)' so you
     * can get the number of items the query will return.  This is used to
     * populate the upper limit on ListViews.
     *
     * @param string $query Select query string
     * @return string count query
     *
     * Internal function, do not override.
     */
    function create_list_count_query($query)
    {
        // remove the 'order by' clause which is expected to be at the end of the query
        $pattern = '/\sORDER BY.*/is';  // ignores the case
        $replacement = '';
        $query = preg_replace($pattern, $replacement, $query);
        //handle distinct clause
        $star = '*';
        if (substr_count(strtolower($query), 'distinct')) {
            if (!empty($this->seed) && !empty($this->seed->table_name))
                $star = 'DISTINCT ' . $this->seed->table_name . '.id';
            else
                $star = 'DISTINCT ' . $this->table_name . '.id';
        }

        // change the select expression to 'count(*)'
        $pattern = '/SELECT(.*?)(\s){1}FROM(\s){1}/is';  // ignores the case
        $replacement = 'SELECT count(' . $star . ') c FROM ';

        //if the passed query has union clause then replace all instances of the pattern.
        //this is very rare. I have seen this happening only from projects module.
        //in addition to this added a condition that has  union clause and uses
        //sub-selects.
        if (strstr($query, " UNION ALL ") !== false) {

            //separate out all the queries.
            $union_qs = explode(" UNION ALL ", $query);
            foreach ($union_qs as $key => $union_query) {
                $star = '*';
                preg_match($pattern, $union_query, $matches);
                if (!empty($matches)) {
                    if (stristr($matches[0], "distinct")) {
                        if (!empty($this->seed) && !empty($this->seed->table_name))
                            $star = 'DISTINCT ' . $this->seed->table_name . '.id';
                        else
                            $star = 'DISTINCT ' . $this->table_name . '.id';
                    }
                } // if
                $replacement = 'SELECT count(' . $star . ') c FROM ';
                $union_qs[$key] = preg_replace($pattern, $replacement, $union_query, 1);
            }
            $modified_select_query = implode(" UNION ALL ", $union_qs);
        } else {
            $modified_select_query = preg_replace($pattern, $replacement, $query, 1);
        }

        return $modified_select_query;
    }


    /**
     * This is designed to be overridden and add specific fields to each record.
     * This allows the generic query to fill in the major fields, and then targeted
     * queries to get related fields and add them to the record.  The contact's
     * account for instance.  This method is only used for populating extra fields
     * in lists.
     */
    function fill_in_additional_list_fields()
    {
        // // removed and covered in fill_in_relationship_fields
        // $this->fill_in_additional_parent_fields();
    }


    /**
     * Function fetches a single row of data given the primary key value.
     *
     * The fetched data is then set into the bean. The function also processes the fetched data by formattig
     * date/time and numeric values.
     *
     * @param string $id Optional, default -1, is set to -1 id value from the bean is used, else, passed value is used
     * @param boolean $encode Optional, default true, encodes the values fetched from the database.
     * @param boolean $deleted Optional, default true, if set to false deleted filter will not be added.
     *
     * Internal function, do not override.
     */
    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {

        $custom_logic_arguments['id'] = $id;
        $this->call_custom_logic('before_retrieve', $custom_logic_arguments);

        if ($id == -1) {
            $id = $this->id;
        }

        $query = "SELECT $this->table_name.*" . " FROM $this->table_name ";
        $query .= " WHERE $this->table_name.id = " . $this->db->quoted($id);
        if ($deleted)
            $query .= " AND $this->table_name.deleted=0";
        LoggerManager::getLogger()->debug("Retrieve $this->object_name : " . $query);
        $result = $this->db->limitQuery($query, 0, 1, true, "Retrieving record by id $this->table_name:$id found ");
        if (empty($result)) {
            return null;
        }

        $row = $this->db->fetchByAssoc($result);
        if (empty($row)) {
            return null;
        }

        //make copy of the fetched row for construction of audit record and for business logic/workflow
        $row = $this->convertRow($row, $encode);
        $this->fetched_row = $row;
        $this->populateFromRow($row);

        $this->is_updated_dependent_fields = false;
        $this->fill_in_additional_detail_fields();

        if ($relationships) {
            $this->fill_in_relationship_fields();
            // save related fields values for audit
            foreach ($this->get_related_fields() as $rel_field_name) {
                $rel_field_name_name = $rel_field_name['name']; //PHP7 COMPAT
                if (!empty($this->$rel_field_name_name)) { //PHP7 COMPAT
                    $this->fetched_rel_row[$rel_field_name['name']] = $this->$rel_field_name_name;
                }
            }
            //make a copy of fields in the relationship_fields array. These field values will be used to
            //clear relationship.
            foreach ($this->field_defs as $key => $def) {
                if ($def ['type'] == 'relate' && isset($def ['id_name']) && isset($def ['link']) && isset($def['save'])) {
                    if (isset($this->$key)) {
                        $this->rel_fields_before_value[$key] = $this->$key;
                        $def_id_name = $def ['id_name']; //PHP7 COMPAT
                        if (isset($this->$def_id_name)) { //PHP7 COMPAT
                            $this->rel_fields_before_value[$def ['id_name']] = $this->$def_id_name; //PHP7 COMPAT
                        }
                    } else
                        $this->rel_fields_before_value[$key] = null;
                }
            }
            if (isset($this->relationship_fields) && is_array($this->relationship_fields)) {
                foreach ($this->relationship_fields as $rel_id => $rel_name) {
                    if (isset($this->$rel_id))
                        $this->rel_fields_before_value[$rel_id] = $this->$rel_id;
                    else
                        $this->rel_fields_before_value[$rel_id] = null;
                }
            }
        }

        // call the custom business logic
        $custom_logic_arguments['id'] = $id;
        $custom_logic_arguments['encode'] = $encode;
        $this->call_custom_logic("after_retrieve", $custom_logic_arguments);
        unset($custom_logic_arguments);
        return $this;
    }

    /**
     * callable to retrieve addtional View Details
     */
    public function retrieveViewDetails()
    {

    }

    /**
     * callable to retrieve addtional List Details
     */
    public function retrieveListDetails()
    {

    }

    /*
     * map to the array that is returnes to the REST Output
     * needs to be overwritten on the BEAN for a custom implementation
     */

    /**
     * Proxy method for DynamicField::getJOIN
     * @param array $beanDataArray
     * @return array
     */
    public function mapToRestArray($beanDataArray)
    {
        return $beanDataArray;
    }

    /*
     * map to the array that is received in the REST Post or PUT Call
     * needs to be overwritten on the BEAN for a custom implementation
     */

    /**
     * Proxy method for DynamicField::getJOIN
     * @param array $beanDataArray
     * @return array
     */
    public function mapFromRestArray($beanDataArray)
    {
        return;
    }

    /**
     * @deprecated
     *
     * Converts an array into an acl mapping name value pairs into files
     *
     * @param Array $arr
     */
    function fromArray($arr)
    {
        foreach($arr as $name=>$value)
        {
            $this->$name = $value;
        }
    }
    /**
     * Convert row data from DB format to internal format
     * Mostly useful for dates/times
     * @param array $row
     * @param bool $encode
     * @return array $row
     */
    public function convertRow(array $row, bool $encode = false): array
    {
        foreach ($this->field_defs as $name => $fieldDef) {
            if (!isset($name) || empty($row[$name])) continue;
            $row[$name] = $this->convertField($row[$name], $fieldDef, $encode);

        }
        return $row;
    }

    /**
     * Converts the field value based on the provided fieldDef
     * @param $fieldvalue
     * @param $fieldDef
     * @param bool $encode
     * @return string
     */
    public function convertField($fieldvalue, $fieldDef, bool $encode = false): string
    {
        if (empty($fieldvalue)) return $fieldvalue;

        switch ($fieldDef['type']) {
            case 'json':
                break;
            default:
                if ($encode) $fieldvalue = to_html($fieldvalue);
                if (!(isset($fieldDef['source']) && !in_array($fieldDef['source'], ['db', 'relate']) && !isset($fieldDef['dbType']))) {
                    $fieldvalue = $this->db->fromConvert($fieldvalue, $this->db->getFieldType($fieldDef));
                }
        }

        return $fieldvalue;
    }

    /**
     * Sets value from fetched row into the bean.
     *
     * @param array $row Fetched row
     * @todo loop through vardefs instead
     * @internal runs into an issue when populating from field_defs for users - corrupts user prefs
     *
     * Internal function, do not override.
     */
    function populateFromRow($row)
    {
        $nullvalue = '';
        foreach ($this->field_defs as $field => $field_value) {
            if ($field == 'user_preferences' && $this->module_dir == 'Users')
                continue;
            if (isset($row[$field])) {
                $this->$field = $row[$field];
                $owner = $field . '_owner';
                if (!empty($row[$owner])) {
                    $this->$owner = $row[$owner];
                }
            } else {
                $this->$field = $nullvalue;
            }
        }
    }

    /**
     * Decode and decrypt a base 64 encoded string with field type 'encrypt' in this bean using Blowfish.
     * @param STRING value - an encrypted and base 64 encoded string.
     * @return string
     */
    function decrypt_after_retrieve($value)
    {
        if (empty($value))
            return $value; // no need to decrypt empty
        require_once("include/utils/encryption_utils.php");
        return blowfishDecode($this->getEncryptKey(), $value);
    }

    /**
     * This is designed to be overridden and add specific fields to each record.
     * This allows the generic query to fill in the major fields, and then targeted
     * queries to get related fields and add them to the record.  The contact's
     * account for instance.  This method is only used for populating extra fields
     * in the detail form
     */
    function fill_in_additional_detail_fields()
    {
        // do not do thif for the users as thius runs in a circular reference
        if($this->object_name == 'User') return;

        $usr = BeanFactory::getBean('Users');
        if (!empty($this->field_defs['created_by']) && !empty($this->created_by)) {
            if($_SESSION['usernames'][$this->created_by]){
                $this->created_by_name = $_SESSION['usernames'][$this->created_by];
            } else {
                $usr->retrieve($this->created_by, false, true, false);
                $this->created_by_name = $usr->user_name;
                $_SESSION['usernames'][$this->created_by] = $usr->user_name;
            }
        }

        if (!empty($this->field_defs['modified_user_id']) && !empty($this->modified_user_id)) {
            if($_SESSION['usernames'][$this->modified_user_id]){
                $this->modified_by_name = $_SESSION['usernames'][$this->modified_user_id];
            } else {
                if ($usr->id != $this->modified_user_id) {
                    $usr->retrieve($this->modified_user_id, false, true, false);
                }
                $this->modified_by_name = $usr->user_name;
                $_SESSION['usernames'][$this->modified_user_id] = $usr->user_name;
            }
        }

        if (!empty($this->field_defs['assigned_user_name']) && !empty($this->assigned_user_id)) {
            if($_SESSION['usernames'][$this->assigned_user_id]){
                $this->assigned_user_name = $_SESSION['usernames'][$this->assigned_user_id];
            } else {
                if ($usr->id != $this->assigned_user_id) {
                    $usr->retrieve($this->assigned_user_id,false, true, false);
                }
                $this->assigned_user_name = $usr->user_name;
                $_SESSION['usernames'][$this->assigned_user_id] = $usr->user_name;
            }
        }

    }

    /**
     * Fill in fields where type = relate
     */
    function fill_in_relationship_fields()
    {
        global $fill_in_rel_depth;
        if (empty($fill_in_rel_depth) || $fill_in_rel_depth < 0)
            $fill_in_rel_depth = 0;

        if ($fill_in_rel_depth > 1)
            return;

        $fill_in_rel_depth++;

        foreach ($this->field_defs as $field) {
            if (0 == strcmp($field['type'], 'relate') && !empty($field['module'])) {
                $name = $field['name'];
                if (empty($this->$name)) {

                    if (empty($this->{$field['id_name']})) {
                        $this->fill_in_link_field($field['id_name'], $field);
                    }
                    if (!empty($this->{$field['id_name']}) && ($this->object_name != $field['module'] || ($this->object_name == $field['module'] && $this->{$field['id_name']} != $this->id))) {
                        if (SpiceModules::getInstance()->getBeanName($field['module'])) {

                                // change to use of BeanFactory
                                $mod = BeanFactory::getBean($field['module'], $this->{$field['id_name']}, ['relationships' => false]);
                                /*
                                $this->$name = [];
                                foreach ($mod->field_name_map as $fieldId => $fieldData) {
                                    switch ($fieldData['type']) {
                                        case 'relate':
                                        case 'parent':
                                        case 'link':
                                            break;
                                        default:
                                            $this->$name[$fieldId] = is_string($mod->$fieldId) ? html_entity_decode($mod->$fieldId, ENT_QUOTES) : $mod->$fieldId;
                                            break;
                                    }
                                }
                                */
                                if ($mod and !empty(@$field['rname'])) {
                                    $field_rname = $field['rname']; //PHP7 COMPAT
                                    $this->$name = $mod->$field_rname; //PHP7 COMPAT
                                } else if (isset($mod->name)) {
                                    $this->$name = $mod->name;
                                }
                        }
                    }
                }
            }
            // fill in parents as well
            if (0 == strcmp($field['type'], 'parent') && !empty($this->{$field['id_name']}) && !empty($this->{$field['type_name']})) {
                $mod = BeanFactory::getBean($this->{$field['type_name']}, $this->{$field['id_name']}, ['relationships' => false]);
                $this->{$field['name']} = $mod->name;
            }

        }
        $fill_in_rel_depth--;
    }

    function fill_in_link_field($linkFieldName, $def)
    {
        $idField = $linkFieldName;
        //If the id_name provided really was an ID, don't try to load it as a link. Use the normal link
        // CR1000476: remove check on type shall be id. Not always the case (see companycode_id in Users)
        // if (!empty($this->field_defs[$linkFieldName]['type']) && $this->field_defs[$linkFieldName]['type'] == "id" && !empty($def['link'])) {
        // check field type
        $typeIsId = false;
        if ($this->field_defs[$linkFieldName]['type'] == "id" ||
            $this->field_defs[$linkFieldName]['dbType'] == "id" ||
            $this->field_defs[$linkFieldName]['dbtype'] == "id") {
            $typeIsId = true;
        }
        if (!empty($this->field_defs[$linkFieldName]['type']) && $typeIsId && !empty($def['link'])) {
            $linkFieldName = $def['link'];
        }

        // ToDo Check why the above was added
        if($def['link']) $linkFieldName = $def['link'];

        if ($this->load_relationship($linkFieldName)) {
            $list = $this->$linkFieldName->get();
            $this->$idField = ''; // match up with null value in $this->populateFromRow()
            if (!empty($list))
                $this->$idField = $list[0];
        }
    }

    /**
     * Returns an array of fields that are of type relate.
     *
     * @return array List of fields.
     *
     * Internal function, do not override.
     */
    function get_related_fields()
    {

        $related_fields = [];

//    	require_once('data/Link.php');

        $fieldDefs = $this->getFieldDefinitions();

        //find all definitions of type link.
        if (!empty($fieldDefs)) {
            foreach ($fieldDefs as $name => $properties) {
                if (array_search('relate', $properties) === 'type') {
                    $related_fields[$name] = $properties;
                }
            }
        }

        return $related_fields;
    }

    /**
     * Returns a full (ie non-paged) list of the current object type.
     *
     * @param string $order_by the order by SQL parameter. defaults to ""
     * @param string $where where clause. defaults to ""
     * @param boolean $check_dates . defaults to false
     * @param int $show_deleted show deleted records. defaults to 0
     */
    function get_full_list($order_by = "", $where = "", $check_dates = false, $show_deleted = 0)
    {
        LoggerManager::getLogger()->debug("get_full_list:  order_by = '$order_by' and where = '$where'");
        if (isset($_SESSION['show_deleted'])) {
            $show_deleted = 1;
        }
        $query = $this->create_new_list_query($order_by, $where, [], [], $show_deleted);
        return $this->process_full_list_query($query);
    }

    /**
     * Processes fetched list view data
     *
     * Internal function, do not override.
     * @param string $query query to be processed.
     * @return array Fetched data.
     *
     */
    function process_full_list_query($query)
    {
        LoggerManager::getLogger()->debug("process_full_list_query: query is " . $query);
        $result = $this->db->query($query, false);
        LoggerManager::getLogger()->debug("process_full_list_query: result is " . print_r($result, true));
        $bean = BeanFactory::getBean($this->_module);

        // We have some data.
        while (($row = $this->db->fetchByAssoc($result)) != null) {

            $seed = BeanFactory::getBean($this->_module, $row['id'], ['relationships' => false]);

            $seed->fill_in_additional_list_fields();

            // needs to be processed as well
            $seed->fill_in_relationship_fields();

            $seed->call_custom_logic("process_record");

            $list[] = $seed;
        }
        //}
        if (isset($list))
            return $list;
        else
            return null;
    }

    /**
     * This function should be overridden in each module.  It marks an item as deleted.
     *
     * If it is not overridden, then marking this type of item is not allowed
     */
    function mark_deleted($id)
    {
        // make sure that we retrieve before we continue in case we did not retrieve before calling this function
        if (empty($this->id)) {
            $bean = BeanFactory::getBean($this->module_name, $id, ['relationships' => false ]);
            // check if retrieve succeed to prevent recursion
            if (!empty($bean->id)) {
                $bean->mark_deleted($id);
                return;
            }
        }
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $date_modified = $GLOBALS['timedate']->nowDb();
        if (isset($_SESSION['show_deleted'])) {
            $this->mark_undeleted($id);
        } else {
            // call the custom business logic
            $custom_logic_arguments['id'] = $id;
            $this->call_custom_logic("before_delete", $custom_logic_arguments);
            $this->deleted = 1;

            // add to the trashcan
            SysTrashCan::addRecord('bean', $this->module_name, $this->id, $this->get_summary_text());

            $this->mark_relationships_deleted($id);
            if (isset($this->field_defs['modified_user_id'])) {
                if (!empty($current_user)) {
                    $this->modified_user_id = $current_user->id;
                } else {
                    $this->modified_user_id = 1;
                }
                $query = "UPDATE $this->table_name set deleted=1 , date_modified = '$date_modified', modified_user_id = '$this->modified_user_id' where id='$id'";
            } else {
                $query = "UPDATE $this->table_name set deleted=1 , date_modified = '$date_modified' where id='$id'";
            }
            $this->db->query($query, true, "Error marking record deleted: ");

            SugarRelationship::resaveRelatedBeans();

            // Take the item off the recently viewed lists
            $tracker = BeanFactory::getBean('Trackers');
            $tracker->makeInvisibleForAll($id);

            // delete from the index
            SpiceFTSHandler::getInstance()->deleteBean($this);

            // create a delete notification
            $notificationLoader = new SpiceNotificationsLoader();
            $notificationLoader->createDeleteNotification($this);

            // call the custom business logic
            $this->call_custom_logic("after_delete", $custom_logic_arguments);
        }
    }

    /**
     * Restores data deleted by call to mark_deleted() function.
     *
     * Internal function, do not override.
     */
    function mark_undeleted($id)
    {
        // call the custom business logic
        $custom_logic_arguments['id'] = $id;
        $this->call_custom_logic("before_restore", $custom_logic_arguments);

        $date_modified = $GLOBALS['timedate']->nowDb();
        $query = "UPDATE $this->table_name set deleted=0 , date_modified = '$date_modified' where id='$id'";
        $this->db->query($query, true, "Error marking record undeleted: ");

        // reindex the bean

        SpiceFTSHandler::getInstance()->indexBean($this);

        // call the custom business logic
        $this->call_custom_logic("after_restore", $custom_logic_arguments);
    }

    /**
     * spicecrm merge current bean with others
     * current bean is master in merge (the bean we keep)
     *
     * @param array $params
     * ** array toDeleteBeanIds => IDs of beans that will be marked deleted
     * ** array fields => field names from beans to use and overwrite current bean with
     */
    public function merge($params)
    {
        //simplify  params
        $duplicates = $params['duplicates'];
        $overwriteFieldsWithId = $params['fields'];

        //get beans to delete
        $tmpBeans = [];
        foreach ($duplicates as $beanId) {
            $tmpBeans[$beanId] = BeanFactory::getBean($this->module_name, $beanId);
        }
        // overwrite fields
        foreach ($overwriteFieldsWithId as $fieldname => $beanId) {
            $this->{$fieldname} = $tmpBeans[$beanId]->{$fieldname};
        }
        //save bean master
        $this->save();

        //handle related beans coming from beans to delete
        $linked_fields = $this->get_linked_fields();

        //delete beans used in merge
        foreach ($tmpBeans as $beanId => $tmpBean) {
            //handle related beans
            foreach ($linked_fields as $name => $properties) {
                if ($properties['name'] == 'modified_user_link' || $properties['name'] == 'created_by_link' || $properties['name'] == 'assigned_user_link')
                    continue;

                if (isset($properties['duplicate_merge'])) {
                    if ($properties['duplicate_merge'] == 'disabled' or
                        $properties['duplicate_merge'] == 'false' or
                        $properties['duplicate_merge'] === false

                    ) {
                        continue;
                    }
                }


                if ($tmpBean->load_relationship($name)) {
                    //check to see if loaded relationship is with email address
                    $relName = $tmpBean->$name->getRelatedModuleName();
                    if (!empty($relName) and strtolower($relName) == 'emailaddresses') {
                        //handle email address merge
                        $this->handleEmailMerge($name, $tmpBean->$name->get());
                    } else {
                        $data = $tmpBean->$name->get();
                        if (is_array($data) && !empty($data)) {
                            if ($this->load_relationship($name)) {
                                foreach ($data as $related_id) {
                                    //remove from tmpBean (only many-to-many)
                                    if ($tmpBean->$name->getType == 'many')
                                        $tmpBean->$name->delete($tmpBean->id, $related_id);
                                    //add to primary bean
                                    $this->$name->add($related_id);
                                }
                            }
                        }
                    }
                }
            }

            // merge attachments
            $this->db->query("UPDATE spiceattachments SET bean_id='{$this->id}' WHERE deleted=0 AND bean_id='{$tmpBean->id}'");

            //mark deleted
            $tmpBean->mark_deleted($beanId);
        }
        //free memory
        unset($tmpBeans);

        return true;
    }

    /**
     * This function will compare the email addresses to be merged and only add the email id's
     * of the email addresses that are not duplicates.
     * @param $name name of relationship (email_addresses)
     * @param $data array of email id's that will be merged into existing bean.
     */
    public function handleEmailMerge($name, $data)
    {
        $mrgArray = [];
        //get the email id's to merge
        $existingData = $data;

        //make sure id's to merge exist and are in array format
        //get the existing email id's
        $this->load_relationship($name);
        $exData = $this->$name->get();

        if (!is_array($existingData) || empty($existingData)) {
            return;
        }
        //query email and retrieve existing email address
        $exEmailQuery = 'Select id, email_address from email_addresses where id in (';
        $first = true;
        foreach ($exData as $id) {
            if ($first) {
                $exEmailQuery .= " '$id' ";
                $first = false;
            } else {
                $exEmailQuery .= ", '$id' ";
                $first = false;
            }
        }
        $exEmailQuery .= ')';

        $exResult = $this->db->query($exEmailQuery);
        while (($row = $this->db->fetchByAssoc($exResult)) != null) {
            $existingEmails[$row['id']] = $row['email_address'];
        }


        //query email and retrieve email address to be linked.
        $newEmailQuery = 'Select id, email_address from email_addresses where id in (';
        $first = true;
        foreach ($existingData as $id) {
            if ($first) {
                $newEmailQuery .= " '$id' ";
                $first = false;
            } else {
                $newEmailQuery .= ", '$id' ";
                $first = false;
            }
        }
        $newEmailQuery .= ')';

        $newResult = $this->db->query($newEmailQuery);
        while (($row = $this->db->fetchByAssoc($newResult)) != null) {
            $newEmails[$row['id']] = $row['email_address'];
        }

        //compare the two arrays and remove duplicates
        foreach ($newEmails as $k => $n) {
            if (!in_array($n, $existingEmails)) {
                $mrgArray[$k] = $n;
            }
        }

        //add email id's.
        foreach ($mrgArray as $related_id => $related_val) {
            //add to primary bean
            $this->$name->add($related_id);
        }
    }

    /*
     * 	RELATIONSHIP HANDLING
     */

    /**
     * This function deletes relationships to this object.  It should be overridden
     * to handle the relationships of the specific object.
     * This function is called when the item itself is being deleted.
     *
     * @param int $id id of the relationship to delete
     */
    function mark_relationships_deleted($id)
    {
        $this->delete_linked($id);
    }

    /* 	When creating a custom field of type Dropdown, it creates an enum row in the DB.
      A typical get_list_view_array() result will have the *KEY* value from that drop-down.
      Since custom _dom objects are flat-files included in the $app_list_strings variable,
      We need to generate a key-key pair to get the true value like so:
      ([module]_cstm->fields_meta_data->$app_list_strings->*VALUE*) */

    /**
     * Iterates through all the relationships and deletes all records for reach relationship.
     *
     * @param string $id Primary key value of the parent reocrd
     */
    function delete_linked($id)
    {
        $linked_fields = $this->get_linked_fields();
        foreach ($linked_fields as $name => $value) {
            if ($this->load_relationship($name)) {
                $this->$name->delete($id);
            } else {
                LoggerManager::getLogger()->fatal("error loading relationship $name");
            }
        }
    }


    /**
     * This function is used to execute the query and create an array template objects
     * from the resulting ids from the query.
     * It is currently used for building sub-panel arrays.
     *
     * @param string $query - the query that should be executed to build the list
     * @param object $template - The object that should be used to copy the records.
     * @param int $row_offset Optional, default 0
     * @param int $limit Optional, default -1
     * @return array
     */
    function build_related_list($query, &$template, $row_offset = 0, $limit = -1)
    {
        LoggerManager::getLogger()->debug("Finding linked records $this->object_name: " . $query);
        $db = DBManagerFactory::getInstance('listviews');

        if (!empty($row_offset) && $row_offset != 0 && !empty($limit) && $limit != -1) {
            $result = $db->limitQuery($query, $row_offset, $limit, true, "Error retrieving $template->object_name list: ");
        } else {
            $result = $db->query($query, true);
        }

        $list = [];
        $isFirstTime = true;
        $class = get_class($template);
        while ($row = $this->db->fetchByAssoc($result)) {
            if (!$isFirstTime) {
                $template = new $class();
            }
            $isFirstTime = false;
            $record = $template->retrieve($row['id']);

            if ($record != null) {
                // this copies the object into the array
                $list[] = $template;
            }
        }
        return $list;
    }

    /**
     * Constructs a select query and fetch 1 row using this query, and then process the row
     *
     * Internal function, do not override.
     * @param array @fields_array  array of name value pairs used to construct query.
     * @param boolean $encode Optional, default true, encode fetched data.
     * @param boolean $deleted Optional, default true, if set to false deleted filter will not be added.
     * @return object Instance of this bean with fetched data.
     */
    function retrieve_by_string_fields($fields_array, $encode = true, $deleted = true)
    {
        $where_clause = $this->get_where($fields_array, $deleted);
        $query = "SELECT $this->table_name.id" . " FROM $this->table_name ";
        $query .= " $where_clause";
        LoggerManager::getLogger()->debug("Retrieve $this->object_name: " . $query);
        //requireSingleResult has been deprecated.
        //$result = $this->db->requireSingleResult($query, true, "Retrieving record $where_clause:");
        $result = $this->db->limitQuery($query, 0, 1, true, "Retrieving record $where_clause:");


        if (empty($result)) {
            return null;
        }
        $row = $this->db->fetchByAssoc($result);
        if (empty($row)) {
            return null;
        }
        // Removed getRowCount-if-clause earlier and insert duplicates_found here as it seems that we have found something
        // if we didn't return null in the previous clause.
        return $this->retrieve($row['id'], $encode, $deleted);
    }

    /**
     * Construct where clause from a list of name-value pairs.
     * if value is passed as array the values are put into an IN statement
     *
     * @param array $fields_array Name/value pairs for column checks
     * @param boolean $deleted Optional, default true, if set to false deleted filter will not be added.
     * @return string The WHERE clause
     */
    function get_where($fields_array, $deleted = true)
    {
        $where_clause = "";
        foreach ($fields_array as $name => $value) {
            if (!empty($where_clause)) {
                $where_clause .= " AND ";
            }

            $name = $this->db->getValidDBName($name);

            // if we pass ina  list of values convert to an IN statement
            if(is_array($value)){
                $valArray = [];
                foreach($value as $thisValue){
                    $valArray[] = $this->db->quoted($thisValue, false);
                }
                $where_clause .= "$name IN (" . implode(',', $valArray) . ")";
            } else {
                $where_clause .= "$name = " . $this->db->quoted($value, false);
            }
        }
        if (!empty($where_clause)) {
            if ($deleted) {
                return "WHERE $where_clause AND deleted=0";
            } else {
                return "WHERE $where_clause";
            }
        } else {
            return "";
        }
    }


    /**
     * Override this function to build a where clause based on the search criteria set into bean .
     * @abstract
     */
    function build_generic_where_clause($value)
    {

    }

    /**
     * ToDo: define what this does exaclt
     *
     * @param $table
     * @param $relate_values
     * @param bool $check_duplicates
     * @param false $do_update
     * @param null $data_values
     *
     */
    function set_relationship($table, $relate_values, $check_duplicates = true, $do_update = false, $data_values = null)
    {
        $where = '';

        // make sure there is a date modified
        $date_modified = $this->db->convert("'" . $GLOBALS['timedate']->nowDb() . "'", 'datetime');

        $row = null;
        if ($check_duplicates) {
            $query = "SELECT * FROM $table ";
            $where = "WHERE deleted = '0'  ";
            foreach ($relate_values as $name => $value) {
                $where .= " AND $name = '$value' ";
            }
            $query .= $where;
            $result = $this->db->query($query, false, "Looking For Duplicate Relationship:" . $query);
            $row = $this->db->fetchByAssoc($result);
        }

        if (!$check_duplicates || empty($row)) {
            unset($relate_values['id']);
            if (isset($data_values)) {
                $relate_values = array_merge($relate_values, $data_values);
            }
            $query = "INSERT INTO $table (id, " . implode(',', array_keys($relate_values)) . ", date_modified) VALUES ('" . create_guid() . "', " . "'" . implode("', '", $relate_values) . "', " . $date_modified . ")";

            $this->db->query($query, false, "Creating Relationship:" . $query);
        } else if ($do_update) {
            $conds = [];
            foreach ($data_values as $key => $value) {
                array_push($conds, $key . "='" . $this->db->quote($value) . "'");
            }
            $query = "UPDATE $table SET " . implode(',', $conds) . ",date_modified=" . $date_modified . " " . $where;
            $this->db->query($query, false, "Updating Relationship:" . $query);
        }
    }

    function retrieve_relationships($table, $values, $select_id)
    {
        $query = "SELECT $select_id FROM $table WHERE deleted = 0  ";
        foreach ($values as $name => $value) {
            $query .= " AND $name = '$value' ";
        }
        $query .= " ORDER BY $select_id ";
        $result = $this->db->query($query, false, "Retrieving Relationship:" . $query);
        $ids = [];
        while ($row = $this->db->fetchByAssoc($result)) {
            $ids[] = $row;
        }
        return $ids;
    }


    /**
     * Check whether the user has access to a particular view for the current bean/module
     * @param $view string required, the view to determine access for i.e. DetailView, ListView...
     * @param $is_owner bool optional, this is part of the ACL check if the current user is an owner they will receive different access
     */
    function ACLAccess($view, $is_owner = 'not_set')
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if ($current_user->isAdmin()) {
            return true;
        }
        $not_set = false;
        if ($is_owner == 'not_set') {
            $not_set = true;
            $is_owner = $this->isOwner($current_user->id);
        }

        // If we don't implement ACLs, return true.
        if (!$this->bean_implements('ACL'))
            return true;
        $view = strtolower($view);

        // BEGMOD KORGOBJECTS
        // if(!($GLOBALS['KAuthAccessController']->checkACLAccess($this, $view))) return false;
        // ENDMOD KORGOBJECTS

        switch ($view) {
            case 'list':
            case 'index':
            case 'listview':
                return SpiceACL::getInstance()->checkAccess($this->module_dir, 'list', true);
            case 'edit':
            case 'save':
                if (!$is_owner && $not_set && !empty($this->id)) {
                    if (!empty($this->fetched_row) && !empty($this->fetched_row['id']) && !empty($this->fetched_row['assigned_user_id']) && !empty($this->fetched_row['created_by'])) {
                        //$temp->populateFromRow($this->fetched_row);
                    } else {
                        $temp = BeanFactory::getBean($this->module_name, $this->id, ['relationships' => false]);
                        $is_owner = $temp->isOwner($current_user->id);
                        unset($temp);
                    }
                }
            case 'popupeditview':
            case 'editview':
                return SpiceACL::getInstance()->checkAccess($this, 'edit', $is_owner, $this->acltype);
            case 'view':
            case 'detail':
            case 'detailview':
                return SpiceACL::getInstance()->checkAccess($this, 'view', $is_owner, $this->acltype);
            case 'delete':
                return SpiceACL::getInstance()->checkAccess($this, 'delete', $is_owner, $this->acltype);
            case 'export':
                return SpiceACL::getInstance()->checkAccess($this->module_dir, 'export', $is_owner, $this->acltype);
            case 'import':
                return SpiceACL::getInstance()->checkAccess($this->module_dir, 'import', true, $this->acltype);
        }
        //if it is not one of the above views then it should be implemented on the page level
        return true;
    }

    function getACLActions()
    {

        // If we don't implement ACLs, return true.
        if (!$this->bean_implements('ACL'))
            return [];

        return SpiceACL::getInstance()->getBeanActions($this);
    }

    /**
     * Loads a row of data into instance of a bean. The data is passed as an array to this function
     *
     * @param array $arr row of data fetched from the database.
     * @return  nothing
     *
     * Internal function do not override.
     */
    function loadFromRow($arr)
    {
        $this->populateFromRow($arr);

        $this->fill_in_additional_list_fields();

        $this->call_custom_logic("process_record");
    }

    /**
     * checks if there are duplicates for the bean based on the FTS search
     *
     * @return array
     */
    public function checkForDuplicates()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $module = array_search($this->object_name, SpiceModules::getInstance()->getBeanList());

        $duplicates = SpiceFTSHandler::getInstance()->checkDuplicates($this);

        $dupRet = [];
        foreach ($duplicates['records'] as $duplicate) {
            $seed = BeanFactory::getBean($this->_module, $duplicate);
            if ($seed) {
                $dupRet[] = $seed;
            } else {
                $duplicates['count']--;
            }
        }
        return ['count' => $duplicates['count'], 'records' => $dupRet];
    }

    /**
     * ToDo: add validation logic based on domains
     *
     * @return array|bool
     */
    function validate()
    {
        $return = [];
        if (($dummy = $this->validateContent()) !== true)
            $return['invalidFields'] = $dummy;
        if (($dummy = $this->validateRequired()) !== true)
            $return['missingFields'] = $dummy;
        return $return ? $return : true;
    }

    function validateRequired()
    {
        $missingFields = [];
        foreach ($this->field_defs as $field) {
            if (($field['name'] !== 'id' or $this->new_with_id === true) and $field['name'] !== 'date_entered' and $field['name'] !== 'date_modified'
                and isset($field['required']) and $field['required']
                and (
                    !isset($this->{$field['name']}) or
                    is_null($this->{$field['name']}) or
                    (is_string($this->{$field['name']}) and strlen($this->{$field['name']}) === 0)
                )
            )
                $missingFields[] = $field['name'];
        }
        return $missingFields ? $missingFields : true;
    }

    function validateContent()
    {
        $invalidFields = [];
        foreach ($this->field_defs as $field) {
            if (isset($this->{$field['name']})) {
                switch ($field['type']) {
                    case 'enum':
                        if (!isset($GLOBALS['app_list_strings'][$field['options']][$this->{$field['name']}]))
                            $invalidFields[$field['name']][] = 'Invalid enum value (allowed: \'' . implode('\'|\'', $GLOBALS['app_list_strings'][$field['options']]) . '\').';
                        break;
                    case 'varchar':
                    case 'text':
                        if (isset($field['len']) and strlen($this->{$field['name']}) > $field['len'])
                            $invalidFields[$field['name']][] = 'String to long (max: ' . $field['len'] . ').';
                        break;
                    case 'date':
                        if (!(preg_match('#^(\d{1,4})-(\d{1,2})-(\d{1,2})$#', $this->{$field['name']}, $matches) and checkdate($matches[2], $matches[3], $matches[1])))
                            $invalidFields[$field['name']][] = 'Date invalid.';
                }
            }
        }
        return $invalidFields ? $invalidFields : true;
    }

    protected static function logDeprecated()
    {
        LoggerManager::getLogger()->deprecated(
            get_class() . " Deprecated. " .
            LoggerManager::formatBackTrace(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 4))
        );
    }

    /**
     * returns the frontend url
     * ToDo: move to other general class
     *
     * @return false|string
     */
    public function getFrontendUrl()
    {
        if (empty($this->id)) return false;
        return SpiceConfig::getInstance()->config['frontend_url'] . '#/module/' . $this->module_name . '/' . $this->id;
    }

    public function getFrontendUrlEncoded()
    {
        return urlencode($this->getFrontendUrl());
    }

    /**
     * Iterates over all linked beans of a template bean
     * and clones them (in case the vardef property 'deepClone' is set).
     *
     * @param object $clone
     */
    private function cloneBeansOfAllLinks(&$clone)
    {
        foreach ($this->field_defs as $v) {
            if ($v['type'] === 'link' and @$v['deepClone'] === true) {
                foreach ($this->get_linked_beans($v['name'], $v['module']) as $v2) {
                    if (!$v2->isCloned()) { # To prevent a recursion: Don´t clone in case this bean has already been cloned.
                        $v2->cloneLinkedBean($v['name'], $clone);
                    } else {
                        LoggerManager::getLogger()->error('Bean cloning: A recursion has been prevented ( link: ' . $v['name'] . ' in module ' . $this->module_name . ', bean to clone: ' . $v2->object_name . ' ' . $v2->id . ' ). Check configuration in vardefs for property "deepClone".');
                    }
                }
            }
        }
    }

    /**
     * Clones a linked bean. It also creates the link to the opposite bean.
     *
     * @param string $linkName Name of the link.
     * @param string $oppositeBean The opposite cloned bean where the link is defined.
     */
    public function cloneLinkedBean($linkName, &$oppositeBean)
    {
        $clone = clone $this;
        $clone->id = create_guid();
        $GLOBALS['cloningData']['cloned'][] = ['module' => $clone->module_name, 'id' => $this->id, 'cloneId' => $clone->id, 'clone' => $clone];
        $clone->cloningData['count']++;
        $clone->new_with_id = true;
        $clone->update_date_entered = true;
        $clone->date_entered = $GLOBALS['timedate']->nowDb();
        $clone->onClone();
        $clone->save();

        $oppositeBean->load_relationship($linkName);
        $oppositeBean->{$linkName}->add($clone->id);

        $this->cloneBeansOfAllLinks($clone);
    }

    /**
     * Has the bean already been cloned??
     *
     * @return boolean
     */
    public function isCloned()
    {
        foreach ($GLOBALS['cloningData']['cloned'] as $v) {
            if ($this->module_name === $v['module'] and $this->id === $v['id']) return true;
        }
        return false;
    }

    /**
     * Placeholder
     */
    public function onClone()
    {
    }
}
