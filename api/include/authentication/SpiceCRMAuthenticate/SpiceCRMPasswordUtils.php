<?php

namespace SpiceCRM\includes\authentication\SpiceCRMAuthenticate;

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
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\DBUtils;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\EmailTemplates\EmailTemplate;
use SpiceCRM\modules\UserAccessLogs\UserAccessLog;
use SpiceCRM\modules\Users\User;

/**
 * user password management
 */
class SpiceCRMPasswordUtils
{
    /**
     * @param string $username
     * @param string $newPwd
     * @param false $sendByEmail
     * @return bool
     * @throws Exception | ForbiddenException | NotFoundException
     */
    public function changePassword(string $username, string $newPwd, bool $sendByEmail = false): bool
    {
        if (AuthenticationController::getInstance()->getCanChangePassword() === false) {
            throw new ForbiddenException("Password Change not allowed");
        }

        $userObj = AuthenticationController::getInstance()->getUserByUsername($username);

        $passwordUtils = AuthenticationController::getInstance()->getPasswordUtilsInstance();

        return $passwordUtils->setNewPassword($userObj, $newPwd, $sendByEmail, false);
    }

    /**
     * set new password
     * @param User $userObj
     * @param string $newPassword
     * @param bool $sendByEmail
     * @param bool $systemGeneratedPassword
     * @return bool
     * @throws Exception
     */
    public function setNewPassword(User $userObj, string $newPassword, bool $sendByEmail, bool $systemGeneratedPassword): bool
    {
        $userObj->setNewPassword($newPassword, $systemGeneratedPassword ? '1' : '0');
        if ($sendByEmail) {
            $emailTempl = $this->getProperEmailTemplate($userObj, 'sendCredentials');
            $userObj->sendPasswordToUser($emailTempl, ['password' => $newPassword]);
        }
        return true;
    }

    /**
     * @param string $token
     * @return bool
     * @throws \Exception
     */
    public function checkToken(string $token): bool
    {
        $db = DBManagerFactory::getInstance();
        $token = $db->getOne(sprintf('SELECT id FROM users_password_tokens WHERE id = "%s" AND date_generated >= CURRENT_TIMESTAMP - INTERVAL ' . (@SpiceConfig::getInstance()->config['passwordsetting']['linkexpirationtime'] * 1) . ' MINUTE', $db->quote($token)));
        return (bool)$token;
    }

    /**
     * get user by token
     * @param $token
     * @return false|User
     * @throws \Exception
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
        $userId = $db->fetchOne(sprintf("SELECT user_id FROM users_password_tokens WHERE id = '%s' AND date_generated >= '" . $now->format($timedate->get_db_date_time_format()) . "'", $db->quote($token)));
        if ($userId) {
            /** @var User $userObj */
            $userObj = BeanFactory::getBean("Users", $userId['user_id']);
        }
        return $userObj;

    }

    /**
     * reset password by token
     * @param string $token
     * @param string $password
     * @return bool
     * @throws ForbiddenException | \Exception
     */
    public function resetPasswordByToken(string $token, string $password): bool
    {
        $userObj = $this->getUserByToken($token);
        if (!$userObj) {
            throw new ForbiddenException("Invalid Token");
        }

        $userObj->setNewPassword($password);
        /** @var UserAccessLog $accessLog */
        $accessLog = BeanFactory::getBean('UserAccessLogs');
        $accessLog->addRecord('pwdreset');

        return true;

    }

    /**
     * get proper token email template
     * @param $userIdOrBean
     * @param $type string
     * @return ?EmailTemplate
     * @throws Exception
     */
    public function getProperEmailTemplate($userIdOrBean, $type): ?EmailTemplate
    {

        if (!is_object($userIdOrBean)) {
            $user = BeanFactory::getBean('Users', $userIdOrBean);
            if (empty($user->id)) throw (new Exception('Could not compose Email. Contact the administrator.'))->setLogMessage('Could not retrieve user with ID "' . $userIdOrBean . '"');
        } else $user = $userIdOrBean;

        $destUserPrefs = BeanFactory::getBean('UserPreferences')->setUser($user);
        $destUserPrefs->reloadPreferences();
        $destLang = $destUserPrefs->getPreference('language');
        if (!isset($destLang[0])) $destLang = SpiceLanguageManager::getInstance()->getSystemDefaultLanguage();
        if (!isset($destLang[0])) $destLang = 'en_us';

        /** @var EmailTemplate $emailTempl */
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
     * send token to user
     * @param string $emailOrUsername
     * @return bool
     * @throws Exception | \Exception
     */
    public function sendTokenToUser(string $emailOrUsername): bool
    {
        $db = DBManagerFactory::getInstance();

        /** @var User $userClass */
        $userClass = BeanFactory::getBean("Users");
        $userObj = $userClass->retrieve_by_email_address($emailOrUsername);
        if (!$userObj) {
            // fallback to search by user name
            $userObj = $userClass->findByUserName($emailOrUsername);
            //we need to retrieve in order to have email1 popuplated.
            //findbyusername is doing a retrieve_by_string_fields which doesnt populate email1
            $userObj = BeanFactory::getBean("Users", $userObj->id);
            if (!$userObj) {
                throw new Exception("User not found via username/email");
            }
        }
        $email = $userObj->email1;
        $user_id = $userObj->id;

        if (empty($user_id)) {
            throw new Exception("User with email " . $emailOrUsername . " not found");
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

        $emailObj->name = DBUtils::fromHtml($emailTempl->subject);
        $emailObj->body = DBUtils::fromHtml($emailTempl->body_html);
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
     * get password check regex
     * @return string
     */
    public static function getPwdCheckRegex(): string
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
