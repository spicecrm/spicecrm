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
namespace SpiceCRM\modules\UserPreferences;

use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\Users\User;

/*********************************************************************************

 * Description: Handles the User Preferences and stores them in a separate table.
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
 * All Rights Reserved.
 * Contributor(s): ______________________________________..
 ********************************************************************************/

class UserPreference extends SugarBean
{


    public $object_name = 'UserPreference';
    public $table_name = 'user_preferences';
    public $disable_row_level_security = true;
    public $module_dir = 'UserPreferences';
    public $new_schema = true;

    protected $_userFocus;

    // Do not actually declare, use the functions statically
    public function __construct(
        User $user = null
    )
    {
        parent::__construct();

        $this->_userFocus = $user;
        $this->tracker_visibility = false;
    }

    /**
     * Get preference by name and category. Lazy loads preferences from the database per category
     *
     * @param string $name name of the preference to retreive
     * @param string $category name of the category to retreive, defaults to global scope
     * @return mixed the value of the preference (string, array, int etc)
     */
    public function getPreference(
        $name,
        $category = 'global'
    )
    {


        $user = $this->_userFocus;

        // if the unique key in session doesn't match the app or prefereces are empty
        if(!isset($_SESSION[$user->user_name.'_PREFERENCES'][$category]) || (!empty($_SESSION['unique_key']) && $_SESSION['unique_key'] != SpiceConfig::getInstance()->config['unique_key'])) {
            $this->loadPreferences($category);
        }
        if(isset($_SESSION[$user->user_name.'_PREFERENCES'][$category][$name])) {
            return $_SESSION[$user->user_name.'_PREFERENCES'][$category][$name];
        }

        return null;
    }

    /**
     * CR1000276 Workaround
     * Call this function when an admin user gets a preference for another user
     *
     * @param $name
     * @param string $category
     * @return mixed|null
     */
    public function getPreferenceForUser(
        $name,
        $category = 'global'
    )
    {


        $user = $this->_userFocus;

        if ( empty($user->user_name) )
            return;

        $focus = new UserPreference($this->_userFocus);
        if($result = $focus->retrieve_by_string_fields([
            'assigned_user_id' => $user->id,
            'category' => $category,
        ])) {
            $cats = unserialize(base64_decode($result->contents));
            return $cats[$name];
        }

        return null;
    }


    /**
     * Get preference by name and category from the system settings.
     *
     * @param string $name name of the preference to retreive
     * @param string $category name of the category to retreive, defaults to global scope
     * @return mixed the value of the preference (string, array, int etc)
     */
    public static function getDefaultPreference(
        $name,
        $category = 'global'
    )
    {


        // Doesn't support any prefs but global ones
        if ( $category != 'global' )
            return null;

        // Next, check to see if it's one of the common problem ones
        if ( isset(SpiceConfig::getInstance()->config['default_'.$name]) )
            return SpiceConfig::getInstance()->config['default_'.$name];
        if ( $name == 'datef' )
            return SpiceConfig::getInstance()->config['default_date_format'];
        if ( $name == 'timef' )
            return SpiceConfig::getInstance()->config['default_time_format'];
        if ( $name == 'email_link_type' )
            return SpiceConfig::getInstance()->config['email_default_client'];

        // Check for name matching \SpiceCRM\includes\SugarObjects\SpiceConfig::getInstance()->config variable
        if ( isset(SpiceConfig::getInstance()->config[$name]) )
            return SpiceConfig::getInstance()->config[$name];

    }

    /**
     * Set preference by name and category. Saving will be done in utils.php -> sugar_cleanup
     *
     * @param string $name name of the preference to retreive
     * @param mixed $value value of the preference to set
     * @param string $category name of the category to retreive, defaults to global scope
     */
    public function setPreference(
        $name,
        $value,
        $category = 'global'
    )
    {
        $user = $this->_userFocus;

        if ( empty($user->user_name) )
            return;

        if(!isset($_SESSION[$user->user_name.'_PREFERENCES'][$category])) {
            if(!$user->loadPreferences($category))
                $_SESSION[$user->user_name.'_PREFERENCES'][$category] = [];
        }

        // preferences changed or a new preference, save it to DB
        if(!isset($_SESSION[$user->user_name.'_PREFERENCES'][$category][$name])
            || (isset($_SESSION[$user->user_name.'_PREFERENCES'][$category][$name]) && $_SESSION[$user->user_name.'_PREFERENCES'][$category][$name] != $value)) {
            $GLOBALS['savePreferencesToDB'] = true;
            if(!isset($GLOBALS['savePreferencesToDBCats'])) $GLOBALS['savePreferencesToDBCats'] = [];
            $GLOBALS['savePreferencesToDBCats'][$category] = true;
        }

        $_SESSION[$user->user_name.'_PREFERENCES'][$category][$name] = $value;
    }

    /**
     * CR1000276 Workaround
     * Call this function when an admin user sets preferences for a user
     * @param $name
     * @param $value
     * @param string $category
     */
    public function setPreferenceForUser(
        $name,
        $value,
        $category = 'global'
    )
    {
        $user = $this->_userFocus;

        if ( empty($user->user_name) )
            return;

        $focus = new UserPreference($this->_userFocus);
        $result = $focus->retrieve_by_string_fields([
            'assigned_user_id' => $user->id,
            'category' => $category,
        ]);
        $cats = unserialize(base64_decode($result->contents));

        $contents = array_merge($cats, [$name => $value]);
        $focus->assigned_user_id = $user->id; // MFH Bug #13862
        $focus->deleted = 0;
        $focus->contents = base64_encode(serialize($contents));
        $focus->category = $category;
        $focus->save();
    }


    /**
     * Delete preference by name and category. Saving will be done in utils.php -> sugar_cleanup
     *
     * @param string $name name of the preference to retreive
     * @param string $category name of the category to retreive, defaults to global scope
     */
    public function deletePreference( $name, $category = 'global' ) {
        $user = $this->_userFocus;

        if ( empty($user->user_name) )
            return;

        if(!isset($_SESSION[$user->user_name.'_PREFERENCES'][$category])) {
            if(!$user->loadPreferences($category))
                $_SESSION[$user->user_name.'_PREFERENCES'][$category] = [];
        }

        // when preference is set, mark to save to DB
        if( isset( $_SESSION[$user->user_name.'_PREFERENCES'][$category][$name] )) {
            $GLOBALS['savePreferencesToDB'] = true;
            if(!isset($GLOBALS['savePreferencesToDBCats'])) $GLOBALS['savePreferencesToDBCats'] = [];
            $GLOBALS['savePreferencesToDBCats'][$category] = true;
        }

        unset( $_SESSION[$user->user_name.'_PREFERENCES'][$category][$name] );

    }

    /**
     * Loads preference by category from database. Saving will be done in utils.php -> sugar_cleanup
     *
     * @param string $category name of the category to retreive, defaults to global scope
     * @return bool successful?
     */
    public function loadPreferences(
        $category = 'global'
    )
    {


        $user = $this->_userFocus;

        if($user->object_name != 'User')
            return;
        if(!empty($user->id) && (!isset($_SESSION[$user->user_name . '_PREFERENCES'][$category]) || (!empty($_SESSION['unique_key']) && $_SESSION['unique_key'] != SpiceConfig::getInstance()->config['unique_key']))) {
            // cn: moving this to only log when valid - throwing errors on install
            return $this->reloadPreferences($category);
        }

        //CR1000454 return the data stored in session if tehre is any
        if(!empty($user->id) && (isset($_SESSION[$user->user_name . '_PREFERENCES'][$category]))) {
            return $_SESSION[$user->user_name . '_PREFERENCES'][$category];
        }

        return false;
    }

    /**
     * CR1000267: additional user prefs like datef... Set default from sugar_config when not set yet
     * Needed for UI
     * @param string $category
     */
    public function loadEnrichedPreferences($category = 'global' ){
        $prefMapToDefault = [
            'datef' => 'datef',
            'timef' => 'timef',
//            'currency' => 'currency', //default is ''
            'default_currency_significant_digits' => 'default_currency_significant_digits',
            'dec_sep' => 'default_decimal_seperator',
            'num_grp_sep' => 'default_number_grouping_seperator'
        ];
        foreach($prefMapToDefault as $userpref => $defaultpref) {
            if (empty($this->getPreference($userpref))) {
                $value = SpiceConfig::getInstance()->config[$defaultpref];
//                if($defaultpref == 'currency' && empty($value))
//                    $value= '-99';
                $this->setPreference($userpref, $value, $category);
            }
        }
    }


    /**
     * Unconditionally reloads user preferences from the DB and updates the session
     * @param string $category name of the category to retreive, defaults to global scope
     * @return bool successful?
     */
    public function reloadPreferences($category = 'global')
    {
        $user = $this->_userFocus;

        if($user->object_name != 'User' || empty($user->id) || empty($user->user_name)) {
            return false;
        }
        LoggerManager::getLogger()->debug('Loading Preferences DB ' . $user->user_name);
        if(!isset($_SESSION[$user->user_name . '_PREFERENCES'])) $_SESSION[$user->user_name . '_PREFERENCES'] = [];
        if(!isset($user->user_preferences) || !is_array($user->user_preferences)) $user->user_preferences = [];
        $result = DBManagerFactory::getInstance()->query("SELECT contents FROM user_preferences WHERE assigned_user_id='$user->id' AND category = '" . $category . "' AND deleted = 0", false, 'Failed to load user preferences');
        $row = DBManagerFactory::getInstance()->fetchByAssoc($result);
        if ($row) {
            $_SESSION[$user->user_name . '_PREFERENCES'][$category] = unserialize(base64_decode($row['contents']));
            $user->user_preferences[$category] = unserialize(base64_decode($row['contents']));
            return true;
        } else {
            $_SESSION[$user->user_name . '_PREFERENCES'][$category] = [];
            $user->user_preferences[$category] = [];
        }
        return false;
    }

    /**
     * Loads users timedate preferences
     *
     * @return array 'date' - date format for user ; 'time' - time format for user
     */
    public function getUserDateTimePreferences()
    {
        global   $timedate;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $user = $this->_userFocus;

        $prefDate = [];

        if(!empty($user) && $this->loadPreferences('global')) {
            // forced to set this to a variable to compare b/c empty() wasn't working
            $timeZone = TimeDate::userTimezone($user);
            $timeFormat = $user->getPreference("timef");
            $dateFormat = $user->getPreference("datef");

            // cn: bug xxxx cron.php fails because of missing preference when admin hasn't logged in yet
            $timeZone = empty($timeZone) ? 'America/Los_Angeles' : $timeZone;

            if(empty($timeFormat)) $timeFormat = SpiceConfig::getInstance()->config['default_time_format'];
            if(empty($dateFormat)) $dateFormat = SpiceConfig::getInstance()->config['default_date_format'];

            $prefDate['date'] = $dateFormat;
            $prefDate['time'] = $timeFormat;
            $prefDate['userGmt'] = TimeDate::tzName($timeZone);
            $prefDate['userGmtOffset'] = $timedate->getUserUTCOffset($user);

            return $prefDate;
        } else {
            $prefDate['date'] = $timedate->get_date_format();
            $prefDate['time'] = $timedate->get_time_format();

            if(!empty($user) && $user->object_name == 'User') {
                $timeZone = TimeDate::userTimezone($user);
                // cn: bug 9171 - if user has no time zone, cron.php fails for InboundEmail
                if(!empty($timeZone)) {
                    $prefDate['userGmt'] = TimeDate::tzName($timeZone);
                    $prefDate['userGmtOffset'] = $timedate->getUserUTCOffset($user);
                }
            } else {
                $timeZone = TimeDate::userTimezone($current_user);
                if(!empty($timeZone)) {
                    $prefDate['userGmt'] = TimeDate::tzName($timeZone);
                    $prefDate['userGmtOffset'] = $timedate->getUserUTCOffset($current_user);
                }
            }

            return $prefDate;
        }
    }

    /**
     * Saves all preferences into the database that are in the session. Expensive, this is called by default in
     * sugar_cleanup if a setPreference has been called during one round trip.
     *
     * @global user will use current_user if no user specificed in $user param
     * @param user $user User object to retrieve, otherwise user current_user
     * @param bool $all save all of the preferences? (Dangerous)
     *
     */
    public function savePreferencesToDB(
        $all = false
    )
    {

        $GLOBALS['savePreferencesToDB'] = false;

        $user = $this->_userFocus;

        // these are not the preferences you are looking for [ hand waving ]
        if(empty($GLOBALS['installing']) && !empty($_SESSION['unique_key']) && $_SESSION['unique_key'] != SpiceConfig::getInstance()->config['unique_key']) return;

        LoggerManager::getLogger()->debug('Saving Preferences to DB ' . $user->user_name);
        if(isset($_SESSION[$user->user_name. '_PREFERENCES']) && is_array($_SESSION[$user->user_name. '_PREFERENCES'])) {
            LoggerManager::getLogger()->debug("Saving Preferences to DB: {$user->user_name}");
            // only save the categories that have been modified or all?
            if(!$all && isset($GLOBALS['savePreferencesToDBCats']) && is_array($GLOBALS['savePreferencesToDBCats'])) {
                $catsToSave = [];
                foreach($GLOBALS['savePreferencesToDBCats'] as $category => $value) {
                    if ( isset($_SESSION[$user->user_name. '_PREFERENCES'][$category]) )
                        $catsToSave[$category] = $_SESSION[$user->user_name. '_PREFERENCES'][$category];
                }
            }
            else {
                $catsToSave = $_SESSION[$user->user_name. '_PREFERENCES'];
            }

            foreach ($catsToSave as $category => $contents) { #print_r($contents);
                $focus = new UserPreference($this->_userFocus);
                $result = $focus->retrieve_by_string_fields([
                    'assigned_user_id' => $user->id,
                    'category' => $category,
                ]);
                $focus->assigned_user_id = $user->id; // MFH Bug #13862
                $focus->deleted = 0;
                $focus->contents = base64_encode(serialize($contents));
                $focus->category = $category;
                $focus->save();
            }
        }
    }

    /**
     * Resets preferences for a particular user. If $category is null all user preferences will be reset
     *
     * @param string $category category to reset
     */
    public function resetPreferences(
        $category = null
    )
    {
        $user = $this->_userFocus;

        LoggerManager::getLogger()->debug('Reseting Preferences for user ' . $user->user_name);

        $remove_tabs = $this->getPreference('remove_tabs');
        $favorite_reports = $this->getPreference('favorites', 'Reports');
        $home_pages = $this->getPreference('pages', 'home');
        $home_dashlets = $this->getPreference('dashlets', 'home');
        $ut = $this->getPreference('ut');
        $timezone = $this->getPreference('timezone');

        $query = "UPDATE user_preferences SET deleted = 1 WHERE assigned_user_id = '" . $user->id . "'";
        if($category)
            $query .= " AND category = '" . $category . "'";
        $this->db->query($query);


        if($category) {
            unset($_SESSION[$user->user_name."_PREFERENCES"][$category]);
        }
        else {
            unset($_SESSION[$user->user_name."_PREFERENCES"]);
            if($user->id == AuthenticationController::getInstance()->getCurrentUser()->id) {
                session_destroy();
            }
            $this->setPreference('remove_tabs', $remove_tabs);
            $this->setPreference('favorites', $favorite_reports, 'Reports');
            $this->setPreference('pages', $home_pages, 'home');
            $this->setPreference('dashlets', $home_dashlets, 'home');
            $this->setPreference('ut', $ut);
            $this->setPreference('timezone', $timezone);
            $this->savePreferencesToDB();
        }
    }

    /**
     * Updates every user pref with a new key value supports 2 levels deep, use append to
     * array if you want to append the value to an array
     */
    public static function updateAllUserPrefs(
        $key,
        $new_value,
        $sub_key = '',
        $is_value_array = false,
        $unset_value = false )
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        // Admin-only function; die if calling as a non-admin
        if(!is_admin($current_user)){
            sugar_die('only admins may call this function');
        }

        // we can skip this if we've already upgraded to the user_preferences format.
        if ( !array_key_exists('user_preferences',$db->getHelper()->get_columns('users')) )
            return;

        $result = $db->query("SELECT id, user_preferences, user_name FROM users");
        while ($row = $db->fetchByAssoc($result)) {
            $prefs = [];
            $newprefs = [];

            $prefs = unserialize(base64_decode($row['user_preferences']));

            if(!empty($sub_key)){
                if($is_value_array ){
                    if(!isset($prefs[$key][$sub_key])){
                        continue;
                    }

                    if(empty($prefs[$key][$sub_key])){
                        $prefs[$key][$sub_key] = [];
                    }
                    $already_exists = false;
                    foreach($prefs[$key][$sub_key] as $k=>$value){
                        if($value == $new_value){

                            $already_exists = true;
                            if($unset_value){
                                unset($prefs[$key][$sub_key][$k]);
                            }
                        }
                    }
                    if(!$already_exists && !$unset_value){
                        $prefs[$key][$sub_key][] = $new_value;
                    }
                }
                else{
                    if(!$unset_value)$prefs[$key][$sub_key] = $new_value;
                }
            }
            else{
                if($is_value_array ){
                    if(!isset($prefs[$key])){
                        continue;
                    }

                    if(empty($prefs[$key])){
                        $prefs[$key] = [];
                    }
                    $already_exists = false;
                    foreach($prefs[$key] as $k=>$value){
                        if($value == $new_value){
                            $already_exists = true;

                            if($unset_value){
                                unset($prefs[$key][$k]);
                            }
                        }
                    }
                    if(!$already_exists && !$unset_value){

                        $prefs[$key][] = $new_value;
                    }
                }else{
                    if(!$unset_value)$prefs[$key] = $new_value;
                }
            }

            $newstr = DBManagerFactory::getInstance()->quote(base64_encode(serialize($prefs)));
            $db->query("UPDATE users SET user_preferences = '{$newstr}' WHERE id = '{$row['id']}'");
        }

        unset($prefs);
        unset($newprefs);
        unset($newstr);
    }

}
