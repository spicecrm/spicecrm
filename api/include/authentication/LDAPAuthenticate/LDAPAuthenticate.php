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

namespace SpiceCRM\includes\authentication\LDAPAuthenticate;


use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAuthenticate;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\SpiceACLProfiles\SpiceACLProfile;
use SpiceCRM\modules\Users\User;

/**
 * This file is used to control the authentication process.
 * It will call on the user authenticate and controll redirection
 * based on the users validation
 *
 */
class LDAPAuthenticate implements AuthenticatorI
{

    private $server = null;
    private $port = 389;
    private $adminUser = null;
    private $adminPassword = null;
    public $baseDn = null;
    private $loginAttr = null;
    private $bindAttr = null;
    public $ldapConn = null;
    private $loginFilter = null;
    private $autoCreateUser = false;
    private $ldapAcl = false;
    private $requiredLdapGroups = null;
    private $ldapGroupMemberships = null;
    private $ldapUsernameAttribute = null;
    private $userDn = null;
    private $ldapInfos = [];
    private $config = [
        'users' =>
            [
                'fields' =>
                    [
                        "givenname" => 'first_name',
                        "sn" => 'last_name',
                        "mail" => 'email1',
                        "telephonenumber" => 'phone_work',
                        "facsimiletelephonenumber" => 'phone_fax',
                        "mobile" => 'phone_mobile',
                        "street" => 'address_street',
                        "l" => 'address_city',
                        "st" => 'address_state',
                        "postalCode" => 'address_postalcode',
                        "c" => 'address_country'


                    ]
            ],
        'system' =>
            ['overwriteSugarUserInfo' => true,],
    ];

    /**
     * @return bool
     */
    public static function isLdapEnabled()
    {
        $config = self::getLdapConfig();
        return count($config) > 0 ? true : false;
    }

    /**
     * authenticate the user by LDAP server
     * @param object $authData
     * @param string $authType
     * @return AuthResponse
     * @throws Exception
     * @throws UnauthorizedException
     */
    public function authenticate(object $authData, string $authType): AuthResponse
    {
        //merge to config... maybe find a better solution?
        $this->config = array_merge($this->config, ['servers' => $this->getLdapConfig()]);

        //if servers are configured and extension is not loaded throw an error
        if (count($this->config['servers']) && !extension_loaded("ldap")) {
            throw new Exception("Ldap Module not loaded");
        }

        if (count($this->config['servers'])) {
            foreach ($this->config['servers'] as $authSys) {
                //set current system
                $this->server = $authSys['hostname'];
                if ($authSys['port']) {
                    $this->port = $authSys['port'];
                }
                $this->adminUser = $authSys['admin_user'];
                $this->ldapAcl = $authSys['ldap_acl'];
                $this->adminPassword = $authSys['admin_password'];
                $this->baseDn = $authSys['base_dn'];
                $this->loginAttr = $authSys['login_attr'];
                $this->bindAttr = $authSys['bind_attr'];
                $this->loginFilter = $authSys['login_filter'];
                $this->ldapAuthentication = $authSys['ldap_authentication'];
                $this->groups = $authSys['ldap_groups'];
                $this->autoCreateUser = $authSys['auto_create_users'];
                $this->ldapUsernameAttribute = $authSys['ldap_username_attribute'];

                $this->setAdditionalUserFields($authSys['ldap_fields']);


                if ($authSys['ldap_groups']) {
                    if (strpos($authSys['ldap_groups'], ",")) {
                        $this->requiredLdapGroups = explode(",", $authSys['ldap_groups']);
                    } else {
                        $this->requiredLdapGroups = [$authSys['ldap_groups']];
                    }
                }

                if ($userObj = $this->ldapAuthenticate($authData->username, $authData->password)) {
                    return new AuthResponse($userObj->user_name, $this->getUserLdapValues($userObj));
                } else {
                    // if no connection made it, try Spice Authentication
                    if(!next($this->config['servers'])){
                        $spiceAuth = new SpiceCRMAuthenticate();
                        if ($authResponse = $spiceAuth->authenticate($authData, 'credentials')) {
                            return $authResponse;
                        }
                    }
                }
            }
            throw new UnauthorizedException();
        } else {
            throw new UnauthorizedException();
        }
    }

    /**
     * push additional fields set in ldap_settings and enrich / overwrite $this->>config['users']['fields']
     * @param string|null $ldapFields A list of key=> value pairs for ldapFIeld=>CRM field mapping
     * @return void
     */
    private function setAdditionalUserFields($ldapFields){

        if($customFields = json_decode($ldapFields, true)){
            foreach($customFields as $key => $val) {
                $this->config['users']['fields'][$key] = $val;
            }
        }
    }


    /**
     * pack alle values retrieved from user ldap field to pass to AuthResponse
     * Might become handy when ldap values need to be used in an after_ldaplogin_hook
     * @param $userObj
     * @return array
     */
    private function getUserLdapValues($userObj){
        $ldapPropertyFields = [];
        foreach($this->config['users']['fields'] as $ldapField => $targetField){
            $ldapPropertyFields['ldap_fields'][$targetField] = $userObj->$targetField;
        }
        return $ldapPropertyFields;
    }

    /**
     * @return boolean
     */

    private function ldapConn()
    {
        if ($this->getLdapDebug()) {
            if (!defined("LDAP_OPT_DIAGNOSTIC_MESSAGE")) {
                define("LDAP_OPT_DIAGNOSTIC_MESSAGE", 0x0032); // needed for more detailed logging
            }

            ldap_set_option(NULL, LDAP_OPT_DEBUG_LEVEL, 7);
        }
        LoggerManager::getLogger()->debug("ldapauth: Connecting to LDAP server: $this->server");
        $ldapConn = ldap_connect($this->server, $this->port);
        if ($this->ldapConn === false) {
            $message = 'Unable to ldap_connect. check syntax of server and port (' . $this->server . ':' . $this->port . '). ldap server has not been contacted in this stage.';
            LoggerManager::getLogger()->fatal('ldap', $message);
            return false;
        }
        ldap_set_option($this->ldapConn, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($this->ldapConn, LDAP_OPT_REFERRALS, 0); // required for AD

        $this->ldapConn = $ldapConn;
        return true;
    }

    /**
     * this method performs the ldap bind with the specified username and password
     * @param $name
     * @param $password
     * @return bool
     * @throws UnauthorizedException
     */
    private function ldapLogin($name, $password)
    {
        if ($this->adminUser && $this->adminPassword) {
            $bind = ldap_bind($this->ldapConn, $this->adminUser, $this->adminPassword);

        } else {
            //try to bind with username and password
            $bind = ldap_bind($this->ldapConn, $name, $password);
        }

        //last option, try to bind anonymous
        if ($bind !== true) {
            $bind = ldap_bind($this->ldapConn);
        }
        if ($bind !== true) {
            LoggerManager::getLogger()->error("unable to ldap bind in ldapLogin");
            $this->logLdapError();
            // throw new Exception("Unable to bind to ldap");
            return false;
        }

        // launch the search in Active Directory
        $loginFilter = new LDAPLoginFilter();
        $filter = $loginFilter->buildLdapSearchFilter($this->loginAttr, $name, $this->loginFilter);
//            $result = ldap_search($this->ldapConn, $this->baseDn, "(" . $this->loginAttr . "={$name})", array_merge(['dn'], [$this->bindAttr]));
        $result = ldap_search($this->ldapConn, $this->baseDn, $filter, array_merge(['dn'], [$this->bindAttr]));
        if($result === false){
            $error = $this->logLdapError();
            LoggerManager::getLogger()->error($error);
            return false;
        }

        $entries = ldap_get_entries($this->ldapConn, $result);

        if (is_array($entries) && $entries['count'] === 0) {
            //todo log username not found?
            LoggerManager::getLogger()->warn("Username ".$name." not found in ldap. Fallback on default CRM authentication.");
            // throw new UnauthorizedException("Invalid username/password combination ", 10);
            return false;
        }
        if ($this->bindAttr && isset($entries[0]) && $entries[0][$this->bindAttr]) {
            $this->userDn = $entries[0][$this->bindAttr][0];
        } else {
            $this->userDn = $entries[0]['dn'];
        }

        if(empty($this->userDn)){
            LoggerManager::getLogger()->warn("User DN ".$name." not found in ldap");
            // throw new UnauthorizedException("Invalid username/password combination ", 10);
            return false;
        }

        // bind with username & password in order to check password
        $bind = ldap_bind($this->ldapConn, $this->userDn, $password);
        if ($bind === false) {
            $msg = "Unable to bind for userDn:" . $this->userDn . " in ldap.";
            // last hope: bind with credentials as entered in CRM login form
            $bind = ldap_bind($this->ldapConn, $name, $password);
            if ($bind === false) {
                $msg.= " Unable to bind for username " . $name. " in ldap (as entered in CRM login form)";
                LoggerManager::getLogger()->warn($msg);
                // throw new UnauthorizedException("Invalid username/password combination ", 10);
                return false;
            }
        }

        //bind back with admin credentials if available
        if ($this->adminUser && $this->adminPassword) {
            $adminbind = ldap_bind($this->ldapConn, $this->adminUser, $this->adminPassword);
            if ($adminbind === false) {
                $message = "unable to bind back with admin credentials";
                LoggerManager::getLogger()->error($message);
                $this->logLdapError();
                // throw new Exception($message);
                return false;
            }
        }
        return true;
    }

    /**
     * @return string
     */
    private function logLdapError()
    {
        if (ldap_get_option($this->ldapConn, LDAP_OPT_DIAGNOSTIC_MESSAGE, $extended_error)) {
            LoggerManager::getLogger()->error($extended_error);
        }
        LoggerManager::getLogger()->error(ldap_error($this->ldapConn));
        return $extended_error;
    }

    /**
     * this method performs the whole authentication process, it:
     * - checks the password against ldap
     * - checks the required groups
     * - maintains the aclprofile-ldapgroup association table
     * @param $name
     * @param $password
     * @return false|User
     * @throws UnauthorizedException
     */
    private function ldapAuthenticate($name, $password)
    {
        if ($this->ldapConn === null) {
            if (!$this->ldapConn()) {
                return false;
            }
        }

        // If constant is defined, set the timeout (PHP >= 5.3)
        if (defined('LDAP_OPT_NETWORK_TIMEOUT')) {
            // Network timeout, lower than PHP and DB timeouts
            ldap_set_option($this->ldapConn, LDAP_OPT_NETWORK_TIMEOUT, 50); //todo clarify...should we add this to the authSystem?
        }

        $alternateName = false;
        if ($this->ldapUsernameAttribute) {
            /** @var User $userObj */
            $userClass = BeanFactory::getBean("Users");
            $userObj = $userClass->findByUserName($name);
            if ($userObj) {
                $alternateName = $userObj->{$this->ldapUsernameAttribute};
            }
        }

        if( $this->ldapLogin($alternateName ?: $name, $password)) {

            $this->checkRequiredLdapGroupMemberships($name);


            $userId = false;
            /** @var User $userClass */
            $userClass = BeanFactory::getBean("Users");
            if ($this->ldapUsernameAttribute && $alternateName === false) {
                $userObj = $userClass->retrieve_by_string_fields([$this->ldapUsernameAttribute => $name]);
            } else {
                $userObj = $userClass->findByUserName($name);
            }

            if (!$userObj instanceof User) {
                if ($this->autoCreateUser) {
                    try {
                        $userObj = $this->createUser($name);
                    } catch (Exception $e) {
                        throw new Exception("Unable to create User for " . $name);
                    }
                } else {
                    throw new UnauthorizedException("no local user", 8);
                }
            }

            // todo maintain local spice table
            $this->synchronizeLdapFields($userObj);

            if ($this->ldapAcl) {
                $this->maintainAclProfiles($userObj);
                $this->maintainSysuiRoles($userObj);
            }
            ldap_close($this->ldapConn);
            return $userObj;
        }
        return false;
    }

    /**
     * allocate spiceaclprofile dynamically according to ldap profile
     * @param $userObj
     * @throws \Exception
     */
    private function maintainAclProfiles($userObj)
    {
        // current allocated profiles to user
        $userAclProfiles = SpiceACLProfile::getProfilesForUserRows($userObj->id);
        $userAclProfileIds = [];
        foreach ($userAclProfiles as $userAclProfile) {
            $userAclProfileIds[] = $userAclProfile['id'];
        }

        // user LDAP memberships to $this->ldapGroupMemberships
        if ($this->ldapGroupMemberships === null) {
            $this->loadGroupMemberShips();
        }

        // collect profiles mapped to LDAP memeberships
        $db = DBManagerFactory::getInstance();
        $requiredSpiceAclProfileIds = [];
        $query = $db->query("SELECT * FROM spiceaclprofiles_ldap_groups where deleted=0 AND ldap_group_name IN('".implode("', '", $this->ldapGroupMemberships)."')");
        while ($row = $db->fetchByAssoc($query)) {
            $requiredSpiceAclProfileIds[] = $row['spiceaclprofile_id'];
        }

        // INSERT missing profiles
        foreach ($requiredSpiceAclProfileIds as $requiredProfileId) {
            if(!in_array($requiredProfileId, $userAclProfileIds)){
                LoggerManager::getLogger()->debug('ldap', "ldap maintainAclProfiles: adding acl profile " . $row['spiceaclprofile_id'] . " for user " . $userObj->id);
                $q = "insert into spiceaclprofiles_users(id,user_id, spiceaclprofile_id) values('" . SpiceUtils::createGuid() . "','" . $userObj->id . "', '" . $requiredProfileId . "')";
                $db->query($q);
            }
        }

        // REMOVE unnecessary profiles
        foreach ($userAclProfileIds as $userAclProfileId) {
            if (!in_array($userAclProfileId, $requiredSpiceAclProfileIds)) {
                LoggerManager::getLogger()->info("ldap maintainAclProfiles: removing acl profile " . $userAclProfileId . " from user " . $userObj->id);
                $d = "DELETE FROM spiceaclprofiles_users WHERE spiceaclprofile_id = '" . $userAclProfileId . "' and user_id = '" . $userObj->id . "'";
                $db->query($d);
            }
        }

    }

    /**
     * allocate roles dynamically according to ldap profile
     * @param $userObj
     * @return false|void
     * @throws \Exception
     */
    private function maintainSysuiRoles($userObj)
    {
        $db = DBManagerFactory::getInstance();

        //step 1 ... delete all sysuiuserroles for the currentUser
        $db->query("delete from sysuiuserroles where user_id='" . $userObj->id . "'");

        //step 2 ... if user is in group, add sysuiuserrole(s)
        $query = $db->query("SELECT * FROM sysuiroles_ldap_groups where deleted=0");
        while ($row = $db->fetchByAssoc($query)) {
            if ($this->isInGroup($row['ldap_group_name'])) {
                $q = "insert into sysuiuserroles(id,user_id, sysuirole_id, defaultrole) values('" . SpiceUtils::createGuid() . "','" . $userObj->id . "', '" . $row['sysuirole_id'] . "', " . $row['defaultrole'] . ")";
                $db->query($q);
            }
        }
    }

    /**
     * check if group name is found in LDAP membership results
     * @param $groupName
     * @return bool
     * @throws Exception
     */
    public function isInGroup($groupName)
    {
        if ($this->ldapGroupMemberships === null) {
            $this->loadGroupMemberShips();
        }
        return in_array($groupName, $this->ldapGroupMemberships);
    }


    /**
     * check required group membership
     * @param $username
     * @throws Exception
     * @throws UnauthorizedException
     */
    private function checkRequiredLdapGroupMemberships($username)
    {
        if ($this->requiredLdapGroups !== null) {
            if ($this->ldapGroupMemberships === null) {
                $this->loadGroupMemberShips();
            }

            foreach ($this->requiredLdapGroups as $requiredLdapGroup) {
                if (!in_array($requiredLdapGroup, $this->ldapGroupMemberships)) {
                    LoggerManager::getLogger()->warn($username." not in required ldap group".$requiredLdapGroup.". Available Groups: ".json_encode($this->ldapGroupMemberships));
                    throw new UnauthorizedException("Group Membership " . $requiredLdapGroup . " missing", 9);
                }
            }
        }
    }


    /**
     * map ldap information to User properties
     * @param User $userObj
     * @param bool $save
     * @return bool
     * @throws Exception
     * @throws \SpiceCRM\includes\ErrorHandlers\BadRequestException
     */
    private function synchronizeLdapFields(User $userObj, $save = true)
    {

        // Authentication succeeded, get info from LDAP directory
        $attrs = array_keys($this->config['users']['fields']);


        $ldapSearchResult = ldap_read($this->ldapConn, $this->getDn($this->baseDn), '(objectclass=*)', $attrs);
        //$ldapSearchResult = ldap_search($this->ldapConn, $this->baseDn, $this->getUserNameFilter($userObj->user_name), $attrs);
        if ($ldapSearchResult === false) {
            throw new Exception("User not found in AD for synchronizeLdapFields");
        }
        $ldapGetEntriesResult = ldap_get_entries($this->ldapConn, $ldapSearchResult);

        if (isset($ldapGetEntriesResult[0]) && is_array($ldapGetEntriesResult[0])) {
            $dirty = false;
            foreach ($ldapGetEntriesResult[0] as $ldapField => $entry) {
                $this->ldapInfos[$ldapField]=$entry[0];
                if (is_array($entry) && array_key_exists($ldapField, $this->config['users']['fields'])) {
                    $targetField = $this->config['users']['fields'][$ldapField];
                    $ldapValue = $entry[0];
                    if ($userObj->$targetField !== $ldapValue) {
                        $userObj->$targetField = $ldapValue;
                        $dirty = true;
                    }


                }
            }
            if ($dirty && $save === true) {
                $userObj->save();
            }
        }
        return true;
    }

    /**
     * @throws Exception
     */
    private function loadGroupMemberShips()
    {
        $result = ldap_read($this->ldapConn, $this->getDn($this->baseDn), '(objectclass=*)', ['memberof']);
        if ($result === FALSE) {
            throw new Exception("Unable to ldap_read for loadGroupMemberShips");
        };
        $entries = ldap_get_entries($this->ldapConn, $result);
        $this->ldapGroupMemberships = [];

        if ($entries['count'] > 0 && $entries[0] && $entries[0]['memberof']) {
            foreach ($entries[0]['memberof'] as $key => $groupEntry) {
                if ($key === "count") continue;

                $this->ldapGroupMemberships[] = ldap_explode_dn($groupEntry, true)[0];
            }
        }
    }

    /**
     * This function searchs in LDAP tree
     * entry specified by samaccountname and returns its DN or empty
     * string on failure.
     */
    function getDn($basedn)
    {
        $attributes = ['dn'];
        $result = ldap_search($this->ldapConn, $basedn,
            "(" . $this->bindAttr . "={$this->userDn})", $attributes);
        if ($result === FALSE) {
            return '';
        }
        $entries = ldap_get_entries($this->ldapConn, $result);
        if ($entries['count'] > 0) {
            return $entries[0]['dn'];
        } else {
            return '';
        }
    }

    /**
     * load ldap settings
     * @return array
     */
    private static function getLdapConfig(): array
    {
        $rows = [];
        $db = DBManagerFactory::getInstance();
        try {
            if($db->tableExists('ldap_settings')){
                $query = $db->query("SELECT * from ldap_settings where is_active = 1 AND deleted = 0 order by priority");
                while ($row = $db->fetchByAssoc($query)) {
                    $rows[] = $row;
                }
            }
            return $rows;
        } catch (\Exception $e) {
            LoggerManager::getLogger()->fatal('ldap', "unable to query ldap_settings, table not existing?");
            return [];
        }

    }

    /**
     * @return boolean
     */
    private function getLdapDebug()
    {
        if(!isset($this->config['ldap_debug'])) return false;
        return boolval($this->config['ldap_debug']);
    }

    /**
     * Creates a user with the given User Name and populates fields from ldap
     *
     * @param STRING $name
     * @return User
     * @throws Exception
     */
    private function createUser($name)
    {

        $userObj = BeanFactory::getBean('Users');
        $userObj->user_name = $name;
        $this->synchronizeLdapFields($userObj);
        $userObj->employee_status = 'Active';
        $userObj->status = 'Active';
        $userObj->is_admin = 0;
        $userObj->external_auth_only = 1; //todo where should we get this value from?
        if (!$userObj->save()) {
            throw new Exception("Unable to save User");
        }
        return $userObj;

    }


}
