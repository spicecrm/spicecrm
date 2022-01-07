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

namespace SpiceCRM\modules\Users;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\authentication\TOTPAuthentication\TOTPAuthentication;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\SugarObjects\templates\person\Person;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\modules\ACLActions\ACLAction;
use SpiceCRM\modules\UserAccessLogs\UserAccessLog;
use SpiceCRM\modules\UserPreferences\UserPreference;

// workaround for spiceinstaller
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\authentication\AuthenticationController;

// User is used to store customer information.
class User extends Person
{

    var $table_name = "users";
    var $module_dir = 'Users';
    var $object_name = "User";
    var $user_preferences;
    var $impersonating_user_id;

    public function __construct()
    {
        parent::__construct();

        $this->_loadUserPreferencesFocus();

        return $this;
    }

    protected function _loadUserPreferencesFocus()
    {
        $this->_userPreferenceFocus = new UserPreference($this);
    }

    /**
     * returns an admin user
     */
    public function getSystemUser()
    {
        if (null === $this->retrieve('1'))
            // handle cases where someone deleted user with id "1"
            $this->retrieve_by_string_fields([
                'status' => 'Active',
                'is_admin' => '1',
            ]);

        return $this;
    }

    /**
     * Interface for the User object to calling the UserPreference::setPreference() method in modules/UserPreferences/UserPreference.php
     *
     * @param string $name Name of the preference to set
     * @param string $value Value to set preference to
     * @param null $nosession For BC, ignored
     * @param string $category Name of the category to retrieve
     * @see UserPreference::setPreference()
     *
     */
    public function setPreference(
        $name, $value, $nosession = 0, $category = 'global'
    )
    {
        // for BC
        if (func_num_args() > 4) {
            $user = func_get_arg(4);
            LoggerManager::getLogger()->deprecated('User::setPreferences() should not be used statically.');
        } else
            $user = $this;

        $user->_userPreferenceFocus->setPreference($name, $value, $category);
    }

    /**
     * Interface for the User object to calling the UserPreference::resetPreferences() method in modules/UserPreferences/UserPreference.php
     *
     * @param string $category category to reset
     * @see UserPreference::resetPreferences()
     *
     */
    public function resetPreferences(
        $category = null
    )
    {
        // for BC
        if (func_num_args() > 1) {
            $user = func_get_arg(1);
            LoggerManager::getLogger()->deprecated('User::resetPreferences() should not be used statically.');
        } else
            $user = $this;

        $user->_userPreferenceFocus->resetPreferences($category);
    }

    /**
     * Interface for the User object to calling the UserPreference::savePreferencesToDB() method in modules/UserPreferences/UserPreference.php
     *
     * @see UserPreference::savePreferencesToDB()
     */
    public function savePreferencesToDB()
    {
        // for BC
        if (func_num_args() > 0) {
            $user = func_get_arg(0);
            LoggerManager::getLogger()->deprecated('User::savePreferencesToDB() should not be used statically.');
        } else
            $user = $this;

        $user->_userPreferenceFocus->savePreferencesToDB();
    }

    /**
     * Unconditionally reloads user preferences from the DB and updates the session
     * @param string $category name of the category to retreive, defaults to global scope
     * @return bool successful?
     */
    public function reloadPreferences($category = 'global')
    {
        return $this->_userPreferenceFocus->reloadPreferences($category = 'global');
    }

    /**
     * Interface for the User object to calling the UserPreference::getUserDateTimePreferences() method in modules/UserPreferences/UserPreference.php
     *
     * @return array 'date' - date format for user ; 'time' - time format for user
     * @see UserPreference::getUserDateTimePreferences()
     *
     */
    public function getUserDateTimePreferences()
    {
        // for BC
        if (func_num_args() > 0) {
            $user = func_get_arg(0);
            LoggerManager::getLogger()->deprecated('User::getUserDateTimePreferences() should not be used statically.');
        } else
            $user = $this;

        return $user->_userPreferenceFocus->getUserDateTimePreferences();
    }

    /**
     * Interface for the User object to calling the UserPreference::loadPreferences() method in modules/UserPreferences/UserPreference.php
     *
     * @param string $category name of the category to retreive, defaults to global scope
     * @return bool successful?
     * @see UserPreference::loadPreferences()
     *
     */
    public function loadPreferences(
        $category = 'global'
    )
    {
        // for BC
        if (func_num_args() > 1) {
            $user = func_get_arg(1);
            LoggerManager::getLogger()->deprecated('User::loadPreferences() should not be used statically.');
        } else
            $user = $this;

        return $user->_userPreferenceFocus->loadPreferences($category);
    }


    /**
     * CR1000267: additional user prefs like datef... Set default from sugar_config when not set yet
     * Needed for UI
     * @param string $category
     * @return mixed
     */
    public function loadEnrichedPreferences(
        $category = 'global'
    )
    {
        // for BC
        if (func_num_args() > 1) {
            $user = func_get_arg(1);
            LoggerManager::getLogger()->deprecated('User::loadEnrichedPreferences() should not be used statically.');
        } else
            $user = $this;

        return $user->_userPreferenceFocus->loadEnrichedPreferences($category);
    }

    /**
     * Interface for the User object to calling the UserPreference::setPreference() method in modules/UserPreferences/UserPreference.php
     *
     * @param string $name name of the preference to retreive
     * @param string $category name of the category to retreive, defaults to global scope
     * @return mixed the value of the preference (string, array, int etc)
     * @see UserPreference::getPreference()
     *
     */
    public function getPreference(
        $name, $category = 'global'
    )
    {
        // for BC
        if (func_num_args() > 2) {
            $user = func_get_arg(2);
            LoggerManager::getLogger()->deprecated('User::getPreference() should not be used statically.');
        } else
            $user = $this;

        return $user->_userPreferenceFocus->getPreference($name, $category);
    }


    function save($check_notify = false, $fts_index_bean = true)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if (!isset($GLOBALS['installing']) && $current_user !== null) {
            if ($current_user->isAdmin()) {
                if (isset($this->UserType[0])) {
                    switch ($this->UserType) {
                        case 'Administrator':
                            $this->is_admin = 1;
                            $this->portal_only = $this->is_api_user = 0;
                            break;
                        case 'PortalUser':
                            $this->is_admin = $this->is_api_user = 0;
                            $this->portal_only = 1;
                            break;
                        case 'RegularUser':
                            $this->is_admin = $this->portal_only = $this->is_api_user = 0;
                            break;
                        case 'APIuser':
                            $this->is_admin = $this->portal_only = 0;
                            $this->is_api_user = 1;
                            break;
                        default:
                            unset($this->UserType);
                    }
                }
            } else unset($this->UserType);
        }


        // is_group & portal should be set to 0 by default
        if (!isset($this->is_group)) {
            $this->is_group = 0;
        }
        if (!isset($this->portal_only)) {
            $this->portal_only = 0;
        }

        // wp: do not save user_preferences in this table, see user_preferences module
        $this->user_preferences = '';

        // if this is an admin user, do not allow is_group or portal_only flag to be set.
        if ($this->is_admin) {
            $this->is_group = 0;
            $this->portal_only = 0;
        }

        // If ...
        // • the user name has been changed, or
        // • the status has been set from 'Inactive' to 'Active' (while the user is not deleted), or
        // • the deleted flag has been set from 1 to 0 (undelete) (while the user status is 'Active')
        // ... check if the user name is already taken by another user. This would not be allowed!
        if (($this->user_name != $this->fetched_row['user_name']
                or ($this->fetched_row['status'] != $this->status and !$this->deleted)
                or ($this->fetched_row['deleted'] != $this->deleted and $this->status == 'Active'))
            and self::usernameAlreadyExists($this->user_name, $this->id)) {

            throw (new BadRequestException('User name \'' . $this->user_name . '\' already exists.'))->setErrorCode('duplicateUsername');

        }

        // set some default preferences when creating a new user
        $setNewUserPreferences = empty($this->id) || !empty($this->new_with_id);

        parent::save($check_notify, $fts_index_bean);

        // populate the name field
        $this->_create_proper_name_field();

        // set some default preferences when creating a new user
        if ($setNewUserPreferences) {
            if (!$this->getPreference('calendar_publish_key')) {
                $this->setPreference('calendar_publish_key', create_guid());
            }
        }

        $this->savePreferencesToDB();
        return $this->id;
    }

    function get_summary_text()
    {
        //$this->_create_proper_name_field();
        return $this->name;
    }

    /**
     * @param string $user_name - Must be non null and at least 2 characters
     * @param string $user_password - Must be non null and at least 1 character.
     * @desc Take an unencrypted username and password and return the encrypted password
     * @return string encrypted password for storage in DB and comparison against DB password.
     * @deprecated
     */
    function encrypt_password($user_password)
    {
        $salt = [];
        // encrypt the password.
        $salt = substr($this->user_name, 0, 2);
        $encrypted_password = crypt($user_password, $salt);

        return $encrypted_password;
    }


    /**
     * retrieves an User bean
     * preformat name & full_name attribute with first/last
     * loads User's preferences
     *
     * @param string id ID of the User
     * @param bool encode encode the result
     * @return object User bean
     * @return null null if no User found
     */
    function retrieve($id = -1, $encode = true, $deleted = true, $relationships = true)
    {
        $ret = parent::retrieve($id, $encode, $deleted, $relationships);

        $this->summary_text = $this->get_summary_text();

        if ($ret) {
            if (isset($_SESSION)) {
                $this->loadPreferences();
                // BEGIN CR1000267: additional user prefs like datef... Set default from sugar_config when not set yet
                // Needed for UI
                // $this->loadEnrichedPreferences();
                // END
            }
        }

        return $ret;
    }

    /**
     * Generate a new hash from plaintext password
     * @param string $password
     */
    public static function getPasswordHash($password)
    {
        return crypt(strtolower(md5($password)), "_.012" . substr(str_shuffle('./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'), -4));
    }

    /**
     * Check that password matches existing hash
     * @param string $password Plaintext password
     * @param string $user_hash DB hash
     */
    public static function checkPassword($password, $user_hash)
    {
        return self::checkPasswordMD5(md5($password), $user_hash);
    }

    /**
     * Check that md5-encoded password matches existing hash
     * @param string $password MD5-encoded password
     * @param string $user_hash DB hash
     * @return bool Match or not?
     */
    public static function checkPasswordMD5($password_md5, $user_hash)
    {
        if (empty($user_hash))
            return false;
        if ($user_hash[0] != '$' && strlen($user_hash) == 32) {
            // Old way - just md5 password
            return strtolower($password_md5) == $user_hash;
        }
        return crypt(strtolower($password_md5), $user_hash) == $user_hash;
    }

    /**
     * Find user with matching password
     * @param string $name Username
     * @param string $password MD5-encoded password
     * @param string $where Limiting query
     * @return array the matching User of false if not found
     */
    public static function findUserPassword($name, $password, $where = '')
    {
        $db = DBManagerFactory::getInstance();
        $query = "SELECT * from users where user_name='" . $db->quote($name) . "'";
        if (!empty($where)) {
            $query .= " AND $where";
        }
        $row = $db->fetchOne($query);
        if (!empty($row)) {

            // check if we have a google authenticator password
            $totpAuth = new TOTPAuthentication();
            if(TOTPAuthentication::checkTOTPActive($row['id'])){
                if($totpAuth->checkTOTPCode($row['id'], $password)){
                    return $row;
                }
            } else if (self::checkPasswordMD5(md5($password), $row['user_hash'])) {
                return $row;
            }
        }
        return false;
    }

    /**
     * Sets new password and resets password expiration timers
     * @param string $new_password
     */
    public function setNewPassword($new_password, $system_generated = '0')
    {
        $user_hash = self::getPasswordHash($new_password); //todo $new_password should be checked for password complexity
        $this->setPreference('loginexpiration', '0');
        $this->setPreference('lockout', '');
        $this->setPreference('loginfailed', '0');
        $this->savePreferencesToDB();
        //set new password
        $now = TimeDate::getInstance()->nowDb();
        $query = "UPDATE $this->table_name SET user_hash='$user_hash', system_generated_password='$system_generated', pwd_last_changed='$now' where id='$this->id'";
        $this->db->query($query, true, "Error setting new password for $this->user_name: ");
        $_SESSION['hasExpiredPassword'] = '0';

        // call the after save hook
        $this->user_hash = $user_hash;
        $this->call_custom_logic('after_save', '');
    }


    function is_authenticated()
    {
        return $this->authenticated;
    }

    function fill_in_additional_list_fields()
    {
        $this->fill_in_additional_detail_fields();
    }

    function fill_in_additional_detail_fields()
    {
        // jmorais@dri Bug #56269
        parent::fill_in_additional_detail_fields();
        // ~jmorais@dri
        global $locale;

        $query = "SELECT u1.first_name, u1.last_name from users  u1, users  u2 where u1.id = u2.reports_to_id AND u2.id = '$this->id' and u1.deleted=0";
        $result = $this->db->query($query, true, "Error filling in additional detail fields");

        $row = $this->db->fetchByAssoc($result);

        if ($row != null) {
            $this->reports_to_name = stripslashes($row['first_name'] . ' ' . $row['last_name']);
        } else {
            $this->reports_to_name = '';
        }

        $this->_create_proper_name_field();

        if ($this->is_admin) $this->UserType = 'Administrator';
        elseif ($this->portal_only) $this->UserType = 'PortalUser';
        elseif ($this->is_api_user) $this->UserType = 'APIuser';
        else $this->UserType = 'RegularUser';

    }

    public function retrieve_user_id(
        $user_name
    )
    {
        $userFocus = BeanFactory::getBean('Users');
        $userFocus->retrieve_by_string_fields(['user_name' => $user_name]);
        if (empty($userFocus->id))
            return false;

        return $userFocus->id;
    }


    /**
     * Helper function that enumerates the list of modules and checks if they are an admin/dev.
     * The code was just too similar to copy and paste.
     *
     * @return array
     */
    protected function _getModulesForACL($type = 'dev')
    {
        $isDev = $type == 'dev';
        $isAdmin = $type == 'admin';

        $myModules = [];

        // These modules don't take kindly to the studio trying to play about with them.
        static $ignoredModuleList = ['iFrames', 'Feeds', 'Home', 'Dashboard', 'Calendar', 'Activities', 'Reports'];

        $actions = ACLAction::getUserActions($this->id);

        foreach (SpiceModules::getInstance()->getBeanList() as $module => $val) {
            // Remap the module name
            $module = $this->_fixupModuleForACL($module);
            if (in_array($module, $myModules)) {
                // Already have the module in the list
                continue;
            }
            if (in_array($module, $ignoredModuleList)) {
                // You can't develop on these modules.
                continue;
            }

            $focus = BeanFactory::getBean($module);
            if ($focus instanceof SugarBean) {
                $key = $focus->acltype;
            } else {
                $key = 'module';
            }

            if (($this->isAdmin() && isset($actions[$module][$key]))
            ) {
                $myModules[] = $module;
            }
        }

        return $myModules;
    }

    /**
     * Is this user a system wide admin
     *
     * @return bool
     */
    public function isAdmin()
    {
        if (isset($this->is_admin) && ($this->is_admin == '1' || $this->is_admin === 'on')) {
            return true;
        }
        return false;
    }

    /**
     * List the modules a user has admin access to
     *
     * @return array
     */
    public function getAdminModules()
    {
        if (!isset($_SESSION[$this->user_name . '_get_admin_modules_for_user'])) {
            $_SESSION[$this->user_name . '_get_admin_modules_for_user'] = $this->_getModulesForACL('admin');
        }

        return $_SESSION[$this->user_name . '_get_admin_modules_for_user'];
    }

    /**
     * Is this user an admin for the specified module
     *
     * @return bool
     */
    public function isAdminForModule($module)
    {
        if (empty($this->id)) {
            // empty user is no admin
            return false;
        }
        if ($this->isAdmin()) {
            return true;
        }

        $adminModules = $this->getAdminModules();

        if (in_array($module, $adminModules)) {
            return true;
        }

        return false;
    }


//   function create_new_list_query($order_by, $where,$filter=[],$params=[], $show_deleted = 0,$join_type='', $return_array = false,$parentbean=null, $singleSelect = false)
//   {	//call parent method, specifying for array to be returned
    function create_new_list_query($order_by, $where, $filter = [], $params = [], $show_deleted = 0, $join_type = '', $return_array = false, $parentbean = null, $singleSelect = false, $ifListForExport = false)
    {

        $ret_array = parent::create_new_list_query($order_by, $where, $filter, $params, $show_deleted, $join_type, true, $parentbean, $singleSelect);

        //if this is being called from webservices, then run additional code
        if (!empty($GLOBALS['soap_server_object'])) {

            //if this is a single select, then secondary queries are being run that may result in duplicate rows being returned through the
            //left joins with meetings/tasks/call.  We need to change the left joins to include a null check (bug 40250)
            if ($singleSelect) {
                //retrieve the 'from' string and make lowercase for easier manipulation
                $left_str = strtolower($ret_array['from']);
                $lefts = explode('left join', $left_str);
                $new_left_str = '';

                //explode on the left joins and process each one
                foreach ($lefts as $ljVal) {
                    //grab the join alias
                    $onPos = strpos($ljVal, ' on');
                    if ($onPos === false) {
                        $new_left_str .= ' ' . $ljVal . ' ';
                        continue;
                    }
                    $spacePos = strrpos(substr($ljVal, 0, $onPos), ' ');
                    $alias = substr($ljVal, $spacePos, $onPos - $spacePos);

                    //add null check to end of the Join statement
                    // Bug #46390 to use id_c field instead of id field for custom tables
// CR1000452
//                    if (substr($alias, -5) != '_cstm') {
                    $ljVal = '  LEFT JOIN ' . $ljVal . ' and ' . $alias . '.id is null ';
//                    }
//                    else {
//                        $ljVal = '  LEFT JOIN ' . $ljVal . ' and ' . $alias . '.id_c is null ';
//                    }

                    //add statement into new string
                    $new_left_str .= $ljVal;
                }
                //replace the old string with the new one
                $ret_array['from'] = $new_left_str;
            }
        }

        //return array or query string
        if ($return_array) {
            return $ret_array;
        }

        return $ret_array['select'] . $ret_array['from'] . $ret_array['where'] . $ret_array['order_by'];
    }


    /**
     * Method for password generation
     *
     * @static
     * @return string password
     */
    public function generatePassword()
    {

        $length =
            (isset(SpiceConfig::getInstance()->config['passwordsetting']['minpwdlength']) and (int)SpiceConfig::getInstance()->config['passwordsetting']['minpwdlength'] > 0)
                ? (int)SpiceConfig::getInstance()->config['passwordsetting']['minpwdlength'] : 6;

        // chars to select from (without specific characters to prevent confusion when reading and retyping the password)
        $LOWERCASE = 'abcdefghijkmnpqrstuvwxyz'; // without "l"!
        $NUMBER = '23456789'; // without "0" and "1"!
        $UPPERCASE = 'ABCDEFGHIJKLMNPQRSTUVWXYZ'; // without "O"!
        $charBKT = $UPPERCASE . $LOWERCASE . $NUMBER;

        $condition = 0;
        $password = '';

        // Create random characters for the ones that doesnt have requirements
        for ($i = 0; $i < $length - $condition; $i++) {  // loop and create password
            $password = $password . substr($charBKT, rand() % strlen($charBKT), 1);
        }

        return $password;

    }

    /**
     * sendPasswordToUser
     *
     * Replacement for the deprecated sendEmailForPassword function, to be used with KREST.
     * Sends a new password to the user.
     *
     * @param object $emailTempl
     * @param array $additionalData
     * @return array
     */
    public function sendPasswordToUser($emailTempl, $additionalData = [])
    {
        $result = ['status' => false];

        $memmy = $emailTempl->parse($this, ['password' => $additionalData['password']]);
        $emailTempl->body_html = $memmy['body_html'];
        $emailTempl->body = $memmy['body'];
        $emailTempl->subject = $memmy['subject'];

        $itemail = $this->email1;

        $emailObj = BeanFactory::getBean('Emails');
        $emailObj->name = from_html($emailTempl->subject);
        $emailObj->body = from_html($emailTempl->body_html);
        $emailObj->addEmailAddress('to', $itemail);
        $emailObj->to_be_sent = true;

        try {
            $response = $emailObj->save();
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            return $result;
        }

        if ($response['result'] == true) {
            $result['status'] = true;
            $emailObj->to_be_sent = false;
            $emailObj->type = 'archived';
            $emailObj->team_id = 1;
            $emailObj->parent_type = 'User';
            $emailObj->modified_user_id = '1';
            $emailObj->created_by = '1';
            $emailObj->date_sent = TimeDate::getInstance()->nowDb();
            $emailObj->save();

            if (!isset($additionalData['link']) || $additionalData['link'] == false) {
                $this->setNewPassword($additionalData['password'], '1');
            }
        } else {
            $result['message'] = 'The Email was not sent. Check Mailbox settings.';
        }

        return $result;
    }

    /**
     * getNewPasswordEmailTemplate
     *
     * Generates and returns the Email Template used to send a new password to a user.
     *
     * @param $templateId
     * @param array $additionalData
     * @return EmailTemplate
     * @throws Exception
     */
    private function getNewPasswordEmailTemplate($templateId, $additionalData = [])
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $mod_strings = return_module_language('', 'Users');

        $emailTemp = new EmailTemplate();
        $emailTemp->disable_row_level_security = true;
        if ($emailTemp->retrieve($templateId) == '') {
            $result['message'] = $mod_strings['LBL_EMAIL_TEMPLATE_MISSING'];
            return $result;
        }

        //replace instance variables in email templates
        $htmlBody = $emailTemp->body_html;
        $body = $emailTemp->body;
        if (isset($additionalData['link']) && $additionalData['link'] == true) {
            $htmlBody = str_replace('$contact_user_link_guid', $additionalData['url'], $htmlBody);
            $body = str_replace('$contact_user_link_guid', $additionalData['url'], $body);
        } else {
            $htmlBody = str_replace('$contact_user_user_hash', $additionalData['password'], $htmlBody);
            $body = str_replace('$contact_user_user_hash', $additionalData['password'], $body);
        }
        // Bug 36833 - Add replacing of special value $instance_url
        //workaround due to UI email templates for backend. Placeholder for $config_site_url was changed
        $htmlBody = str_replace('{config.frontend_url}', '$config_site_url', $htmlBody);
        $body = str_replace('{config.frontend_url}', '$config_site_url', $body);

        $htmlBody = str_replace('$config_site_url', SpiceConfig::getInstance()->config['site_url'], $htmlBody);
        $body = str_replace('$config_site_url', SpiceConfig::getInstance()->config['site_url'], $body);

        $htmlBody = str_replace('$contact_user_user_name', $this->user_name, $htmlBody);
        $htmlBody = str_replace('$contact_user_pwd_last_changed', TimeDate::getInstance()->nowDb(), $htmlBody);
        $body = str_replace('$contact_user_user_name', $this->user_name, $body);
        $body = str_replace('$contact_user_pwd_last_changed', TimeDate::getInstance()->nowDb(), $body);
        $emailTemp->body_html = $htmlBody;
        $emailTemp->body = $body;

        if (from_html($emailTemp->body_html) == '' && $current_user->is_admin) {
            global $app_strings;
            throw new Exception($result['message'] = $app_strings['LBL_EMAIL_TEMPLATE_EDIT_PLAIN_TEXT']);
        }

        return $emailTemp;
    }

    /**
     * introduced 2018-06-06
     * get syslogusers entry
     */
    public function getSysLogConfig()
    {
        $q = "SELECT * FROM syslogusers WHERE user_id = '" . $this->id . "' AND logstatus = 1";
        $res = $this->db->query($q);
        $syslogconfig = [];
        while ($row = $this->db->fetchByAssoc($res)) {
            $syslogconfig['user_id'] = $row['user_id'];
            $syslogconfig['level'][$row['level']] = $row['logstatus'];
        }
        return $syslogconfig;
    }

    /**
     * Checks if another user with a specific/same user name already exists.
     * @username The user name to check for.
     * @userIdToIgnore The id of the user who should own the user name. The check will ignore this user.
     */
    public static function usernameAlreadyExists($username, $userIdToIgnore)
    {
        $db = DBManagerFactory::getInstance();
        $sql = 'SELECT id,user_name FROM users WHERE status = \'Active\' AND deleted = 0';
        if (!empty($userIdToIgnore))
            $sql .= ' AND id <> "' . $db->quote($userIdToIgnore) . '"';
        $sql .= ' AND LOWER(user_name) = "' . $db->quote(mb_strtolower($username)) . '" LIMIT 1';
        $user = $db->fetchOne($sql);
        return $user !== false;
    }

    /**
     * findByName
     *
     * Searches for a User by its name.
     *
     * @param $name
     * @return User
     * @throws NotFoundException
     */
    public static function findByName($name)
    {
        $db = DBManagerFactory::getInstance();

        $sql = "SELECT * FROM users WHERE LOWER(CONCAT(first_name, ' ' , last_name)) LIKE LOWER('" . $name . "')";
        $result = $db->query($sql);

        if ($result->num_rows > 0) {
            $row = $db->fetchByAssoc($result);

            $user = BeanFactory::getBean('Users', $row['id']);

            return $user;
        } else {
            throw (new NotFoundException('User not found'))->setLookedFor($name);
        }
    }

    /**
     * findByUserName
     *
     * Searches for a User by its user name.
     *
     * @param $name
     * @return User
     * @throws NotFoundException
     */
    public function findByUserName($name)
    {
        return $this->retrieve_by_string_fields(['user_name' => $name]);
    }

    /**
     * blockUserByName
     *
     * Blocks a user (prevent from login) permanent or for a specific time.
     *
     * @param $username The name of the user.
     * @param $blockingDuration The time in minutes that the user should be blocked from logging in. From now on.
     * @return The user bean.
     */
    public static function blockUserByName( $username, $blockingDuration = null ) {
        $user = BeanFactory::getBean('Users');
        $user->findByUserName( $username );

        if ( $blockingDuration ) {
            $dtObj=new \DateTime();
            $dtObj->setTimestamp(time()+$blockingDuration*60);
            $user->login_blocked_until = Timedate::getInstance()->asDb($dtObj);
        } else {
            $user->login_blocked = true;
        }

        $user->save();
        return $user;
    }

    /**
     * isBlocked
     *
     * Checks if a user is blocked permanent or for a specific time.
     *
     * @param $username The name of the user.
     * @return True if permanent or the amount of minutes in case the blocking is for a specific time.
     */
    public static function isBlocked( $username ) {
        $db = DBManagerFactory::getInstance();

        $dtObj=new \DateTime();
        $dtObj->setTimestamp(time());
        $now = Timedate::getInstance()->asDb($dtObj);

        $row = $db->fetchOne( sprintf('SELECT login_blocked, TIMESTAMPDIFF( SECOND, "'.$now.'", login_blocked_until ) as blocked_seconds FROM users WHERE user_name = "%s"', $db->quote( $username )));
        if ( $row['login_blocked'] ) return true;
        if ( $row['blocked_seconds'] > 0 ) return ceil( $row['blocked_seconds']/60 );
        return false;
    }

    /**
     * hasExpiredPassword
     *
     * Checks if the password of the user is expired (returns true) or will expire soon (returns the number of days of remaining validity).
     *
     * @return True If the password is expired.
     * @return False If the password is not expired and will not expire soon.
     * @return Integer Number of days of remaining validity, in case the password will expire soon.
     */
    function hasExpiredPassword()
    {
        $config = SpiceConfig::getInstance()->config['passwordsetting'];
        $timedate = TimeDate::getInstance();

        # Password expiration is OFF or not configured.
        if ( empty( $config['pwdvaliditydays'] )) return false;

        # In case password expiration is used, we make sure the date of last password change is set.
        # If not, we set it. Then a further expiration check for this time makes no sense, so return true.
        if ( empty( $this->pwd_last_changed )) {
            $this->pwd_last_changed = $timedate->nowDb();
            $this->save();
            return false;
        }

        # Calculate the age of the password (in days).
        $passwordAge = ( new \DateTime( $this->pwd_last_changed ))->setTime(0,0,0)->diff( $timedate->getNow()->setTime(0,0,0))->format('%r%a')*1;

        # Calculate the remaining days until expiration.
        $remainingDays = $config['pwdvaliditydays'] - $passwordAge;

        return $remainingDays < 1;
    }

    public static function isAdmin_byName( $username ) {
        $db = DBManagerFactory::getInstance();
        return (boolean)$db->getOne("SELECT is_admin FROM users WHERE deleted = 0 AND user_name = '".$db->quote( $username )."'" );
    }

}
