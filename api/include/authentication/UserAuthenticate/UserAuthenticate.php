<?php

namespace SpiceCRM\includes\authentication\UserAuthenticate;

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

use DateTime;
use DateInterval;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\modules\UserPreferences\UserPreference;
use SpiceCRM\modules\Users\User;
use SpiceCRM\includes\authentication\IpAddresses\IpAddresses;

/**
 * This file is used to control the authentication process.
 * It will call on the user authenticate and controll redirection
 * based on the users validation
 *
 */
class UserAuthenticate
{

    /**
     * @param $authUser
     * @param $password
     * @return User
     * @throws UnauthorizedException
     */
    function authenticate($authUser, $password, $impersonatingUserName = null )
    {
        if ( !IpAddresses::checkIpAddress(SpiceUtils::getClientIP()) ) {
            if ( !User::isAdmin_byName( empty( $impersonatingUserName ) ? $authUser : $impersonatingUserName )) {
                throw new UnauthorizedException('No access from this IP address. Contact the admin.', 11);
            }
        }

        $db = DBManagerFactory::getInstance();
        $impersonatingUser = null;
        $sqlWhere = "( is_group IS NULL OR is_group != 1 ) AND deleted = 0 and external_auth_only = 0";
        # In case impersonation is used,
        # then the user name of the admin is given as impersonationuser
        # and the password in $password is the password of the impersonating admin.
        if ( !empty( $impersonatingUserName )) {
            # First check the password of the impersonating admin:
            if ( $impersonatingUser = User::findUserPassword($impersonatingUserName, $password, $sqlWhere)) {
                # Now fetch the user the admin wants to impersonate:
                $row = $db->fetchOne( sprintf("SELECT * from users where user_name='%s' AND " . $sqlWhere, $db->quote($authUser)));
            }
        } else {
            # Usual case, no impersonation:
            $row = User::findUserPassword($authUser, $password, $sqlWhere);
        }

        if ($row) {
            /** @var User $userObj */
            $userObj = BeanFactory::getBean("Users", $row['id']);
            if ( $impersonatingUser ) $userObj->impersonating_user_id = $impersonatingUser['id'];
            return $userObj;
        } else {
            throw new UnauthorizedException("Invalid Username/Password combination", 1);
        }
    }

    /**
     * Encodes a users password. This is a static function and can be called at any time.
     *
     * @param STRING $password
     * @return STRING $encoded_password
     */
    function encodePassword($password)
    { //todo AS SOON AS POSSIBLE SWITCH TO SALTED PASSWORDS; SECURITY ISSUE!!!
        return strtolower(md5($password));
    }




    /**
     * @param User $userObj
     * @param string $newPassword
     * @param bool $sendByEmail
     * @param bool $systemGeneratedPassword
     * @return bool
     * @throws Exception
     */
    public function setNewPassword(User $userObj, string $newPassword, bool $sendByEmail, bool $systemGeneratedPassword)
    {
        //todo $newPassword should be checked for password complexity
        $userObj->setNewPassword($newPassword, $systemGeneratedPassword ? '1' : '0');
        if ($sendByEmail) {
            $emailTempl = $this->getProperEmailTemplate($userObj, 'sendCredentials');
            $res = $userObj->sendPasswordToUser($emailTempl, ['password' => $newPassword]);
        }
        return true;
    }

    /**
     * @param $lang
     * @return string
     */
    public static function getPwdGuideline($lang)
    {
        global $app_strings;
        $app_strings = return_application_language($lang);

        $guideline = '';

        if (SpiceConfig::getInstance()->config['passwordsetting']['oneupper']) {
            $guideline .= $app_strings['MSG_PASSWORD_ONEUPPER'] . ', ';
        }
        if (SpiceConfig::getInstance()->config['passwordsetting']['onelower']) {
            $guideline .= $app_strings['MSG_PASSWORD_ONELOWER'] . ', ';
        }
        if (SpiceConfig::getInstance()->config['passwordsetting']['onenumber']) {
            $guideline .= $app_strings['MSG_PASSWORD_ONENUMBER'] . ', ';
        }
        if (SpiceConfig::getInstance()->config['passwordsetting']['onespecial']) {
            $guideline .= $app_strings['MSG_PASSWORD_ONESPECIAL'] . ', ';
        }
        if (SpiceConfig::getInstance()->config['passwordsetting']['minpwdlength']) {
            $guideline .= SpiceConfig::getInstance()->config['passwordsetting']['minpwdlength'];
            $guideline .= ' ' . $app_strings['LBL_CHARACTERS'] . ', ';
        }
        $guideline = substr($guideline, 0, -2);
        $guideline = ucfirst($guideline);

        $guideline = $app_strings['LBL_AT_LEAST'] . ': ' . $guideline . '.';

        return $guideline;
    }


    /**
     * @param $email
     * @param $token
     * @return bool
     * @throws \Exception
     */
    public function checkToken($token): bool
    {
        $db = DBManagerFactory::getInstance();
        $token_valid = false;
        $res = $db->query(sprintf('SELECT * FROM users_password_tokens WHERE id = "%s" AND date_generated >= CURRENT_TIMESTAMP - INTERVAL ' . (@SpiceConfig::getInstance()->config['passwordsetting']['linkexpirationtime'] * 1) . ' MINUTE', $db->quote($token)));
        while ($row = $db->fetchByAssoc($res)) $token_valid = true;
        return $token_valid;
    }

    /**
     * tood clarify, this method should not be here?
     * @return array
     */
    public function get_modules_acl()
    {
        $globalModuleList = SpiceModules::getInstance()->getModuleList();

        $actions = ['list', 'view', 'edit'];

        $retModules = [];

        foreach (SpiceACL::getInstance()->disabledModuleList($globalModuleList) as $disabledModule) {
            SpiceModules::getInstance()->unsetModule($disabledModule);
        }

        foreach ($globalModuleList as $module) {
            $retModules[$module]['acl']['enabled'] = SpiceACL::getInstance()->moduleSupportsACL($module);
            if ($retModules[$module]['acl']['enabled']) {
                foreach ($actions as $action)
                    $retModules[$module]['acl'][$action] = SpiceACL::getInstance()->checkAccess($module, $action);
            }
        }

        return $retModules;
    }


    /**
     * @param $email
     * @return mixed|string
     * @throws \Exception
     */
    public function getUserIdByEmail($email)
    {
        $db = DBManagerFactory::getInstance();
        $user_id = "";
        $query = sprintf('SELECT u.id FROM users u INNER JOIN email_addr_bean_rel rel ON rel.bean_id = u.id AND rel.bean_module = "Users" AND rel.primary_address = 1 INNER JOIN email_addresses ea ON ea.id = rel.email_address_id AND ea.email_address_caps = "%s" WHERE u.deleted = 0 AND rel.deleted = 0 AND ea.deleted = 0', $db->quote(strtoupper($email)));
        return $db->fetchOne($query);
    }

    /**
     * @param $token
     * @return false|User
     */
    private function getUserByToken($token)
    {
        $timedate = TimeDate::getInstance();

        $userObj = false;
        $db = DBManagerFactory::getInstance();
        $expirationTime = 5;
        if (isset(SpiceConfig::getInstance()->config['passwordsetting']['linkexpirationtime'])) {
            $expirationTime = SpiceConfig::getInstance()->config['passwordsetting']['linkexpirationtime'];
        }

        $now = new DateTime();
        $now->setTimestamp(time() - ($expirationTime * 60));
        $userId = $db->fetchOne(sprintf("SELECT user_id FROM users_password_tokens WHERE id = '%s' AND date_generated >= '".$now->format($timedate->get_db_date_time_format())."'", $db->quote($token)));
        if ($userId) {
            /** @var User $userObj */
            $userObj = BeanFactory::getBean("Users", $userId['user_id']);
        }
        return $userObj;

    }

    /**
     * @param string $email
     * @param string $token
     * @param string $password
     * @return bool
     */
    public function resetPasswordByToken(string $token, string $password)
    {
        $userObj = $this->getUserByToken($token);
        if (!$userObj) {
            throw new ForbiddenException("Invalid Token");
        }

        $userObj->setNewPassword($password);
        $accessLog = BeanFactory::getBean('UserAccessLogs');
        $accessLog->addRecord('pwdreset');
        return true;

    }

    /**
     * @param $user User | string
     * @param $type string
     * @return false|\SpiceCRM\data\SugarBean
     * @throws Exception
     */
    public function getProperEmailTemplate( $userIdOrBean, $type )
    {

        if ( !is_object( $userIdOrBean )) {
            $user = BeanFactory::getBean('Users', $userIdOrBean );
            if ( empty( $user->id )) throw ( new Exception('Could not compose Email. Contact the administrator.'))->setLogMessage('Could not retrieve user with ID "' . $userIdOrBean . '"');
        } else $user = $userIdOrBean;

        $destUserPrefs = new UserPreference($user);
        $destUserPrefs->reloadPreferences();
        $destLang = $destUserPrefs->getPreference('language');
        if (!isset($destLang[0])) $destLang = SpiceConfig::getInstance()->config['default_language'];
        if (!isset($destLang[0])) $destLang = 'en_us';

        $emailTempl = BeanFactory::getBean('EmailTemplates');
        if ($emailTempl === false) {
            throw new \Exception("Unable to instanciate EmailTemplates. Email Package loaded?");
        }
        $emailTempl->retrieve_by_string_fields(['type' => $type, 'language' => $destLang], false);

        if (empty($emailTempl->id)) {
            LoggerManager::getLogger()->warn('Could not retrieve email template "' . $type . '" for language "' . $destLang . '", will try "en_us" instead');
            $destLang = 'en_us';
            $emailTempl->retrieve_by_string_fields(['for_bean' => 'Users', 'type' => $type, 'language' => $destLang], false);
            if (empty($emailTempl->id)) throw (new Exception('Could not compose Email. Contact the administrator.'))->setLogMessage('Could not retrieve email template "' . $type . '" (for language "' . $destLang . '")');
        }

        return $emailTempl;

    }

    /**
     * @param string $usernameOrEmail
     * @return bool
     * @throws Exception
     */
    public function sendTokenToUser(string $usernameOrEmail)
    {
        $db = DBManagerFactory::getInstance();

        /** @var User $userClass */
        $userClass = BeanFactory::getBean("Users");
        $user_id = null;
        $userObj = $userClass->findByUserName($usernameOrEmail);

        if ($userObj) {
            //we need to retrieve in order to have email1 popuplated.
            //findbyusername is doing a retrieve_by_string_fields which doesnt populate email1
            $userObj = BeanFactory::getBean("Users", $userObj->id);

        } else {
            //fallback to search by email address
            $userObj = $userClass->retrieve_by_email_address($usernameOrEmail);
            if (!$userObj) {
                throw new Exception("User not found via username/email");
            }
        }
        $email = $userObj->email1;
        $user_id = $userObj->id;


        if (empty($user_id)) {
            throw new Exception("User with email " . $usernameOrEmail . " not found");
        }

        $user = BeanFactory::newBean('Users');
        $token = $user->generatePassword();

        // store the new token
        $db->query(sprintf("INSERT INTO users_password_tokens ( id, user_id, date_generated ) VALUES ( '%s', '%s', '%s' )", $db->quote($token), ($user_id), TimeDate::getInstance()->nowDb()));

        //delete old token
        $db->query(sprintf("delete from users_password_tokens where id != '%s' and user_id = '%s'", $db->quote($token), $user_id));

        $emailTempl = $this->getProperEmailTemplate($user_id, 'sendTokenForNewPassword');
        $emailTempl->disable_row_level_security = true;

        //replace instance variables in email templates
        $memmy = $emailTempl->parse(null, ['token' => $token]);
        $emailTempl->body_html = $memmy['body_html'];
        $emailTempl->body = $memmy['body'];
        $emailTempl->subject = $memmy['subject'];

        /** @var Email $emailObj */
        $emailObj = BeanFactory::getBean('Emails');

        $emailObj->name = from_html($emailTempl->subject);
        $emailObj->body = from_html($emailTempl->body_html);
        $emailObj->addEmailAddress('to', $email);
        $emailObj->to_be_sent = true;
        $result = $emailObj->save();

        if ($result['result'] == true) {
            $emailObj->to_be_sent = false;
            $emailObj->team_id = 1;
            $emailObj->to_addrs = '';
            $emailObj->type = 'archived';
            $emailObj->deleted = '0';
            $emailObj->parent_type = 'User';
            $emailObj->mailbox_id = SpiceConfig::getInstance()->config['passwordsetting']['mailbox'];
            $emailObj->date_sent = TimeDate::getInstance()->nowDb();
            $emailObj->modified_user_id = '1';
            $emailObj->created_by = '1';
            $emailObj->status = 'sent';
            $emailObj->save();
        } else {
            throw new Exception("Unable to send email");
        }

        return true;
    }

    /**
     * @return string
     */
    public static function getPwdCheckRegex()
    {
        $pwdCheck = '';
        if (@SpiceConfig::getInstance()->config['passwordsetting']['oneupper'])
            $pwdCheck .= '(?=.*[A-Z])';
        if (@SpiceConfig::getInstance()->config['passwordsetting']['onelower'])
            $pwdCheck .= '(?=.*[a-z])';
        if (@SpiceConfig::getInstance()->config['passwordsetting']['onenumber'])
            $pwdCheck .= '(?=.*\d)';
        if (@SpiceConfig::getInstance()->config['passwordsetting']['onespecial'])
            $pwdCheck .= '(?=.*[^a-zA-Z0-9])';
        if (@SpiceConfig::getInstance()->config['passwordsetting']['minpwdlength'])
            $pwdCheck .= '.{' . SpiceConfig::getInstance()->config['passwordsetting']['minpwdlength'] . ',}';
        else
            $pwdCheck .= '.+';
        return $pwdCheck;
    }
}
