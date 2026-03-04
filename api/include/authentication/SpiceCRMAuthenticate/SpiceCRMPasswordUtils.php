<?php

namespace SpiceCRM\includes\authentication\SpiceCRMAuthenticate;

/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

use DateTime;
use SpiceCRM\extensions\modules\TextMessageTemplates\TextMessageTemplate;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceBeans\BeanFactory;
use SpiceCRM\includes\SpiceDictionary\database\DBManagerFactory;
use SpiceCRM\includes\SpiceGateway\SpiceGatewayClientHandler;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguageManager;
use SpiceCRM\includes\SpiceTemplateCompiler\System;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\DBUtils;
use SpiceCRM\includes\utils\SpiceUtils;
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
     * @param false $sendBySystem
     * @return bool
     * @throws Exception | ForbiddenException | NotFoundException
     */
    public function changePassword(string $username, string $newPwd, bool $sendBySystem = false): bool
    {
        if (AuthenticationController::getInstance()->getCanChangePassword() === false) {
            throw new ForbiddenException("Password Change not allowed");
        }

        $userObj = AuthenticationController::getInstance()->getUserByUsername($username);

        $passwordUtils = AuthenticationController::getInstance()->getPasswordUtilsInstance();

        return $passwordUtils->setNewPassword($userObj, $newPwd, $sendBySystem, false);
    }

    /**
     * set new password
     * @param User $userObj
     * @param string $newPassword
     * @param bool $sendByEmail
     * @param bool $systemGeneratedPassword
     * @return bool
     * @throws \Exception
     */
    public function setNewPassword(User $userObj, string $newPassword, bool $sendByEmail, bool $systemGeneratedPassword): bool
    {
        $userObj->setNewPassword($newPassword, $systemGeneratedPassword ? '1' : '0');

        if ($sendByEmail) {
            $configs = self::getSendCredentialConfigs('password');
            $template = null;
            # gateway mailbox does not require email template. The template must be defined on the gateway server
            if ($configs->mailboxId != 'gateway') {
                $template = $this->getChannelTemplateByType($userObj, 'sendPassword', $configs->channel);
            }
            $userObj->sendCredentialToUser($template, 'password', ['password' => $newPassword, 'source_frontend_url' => (new System())->frontend_url()]);
        }

        return true;
    }

    /**
     * check and get the send-credential configs
     * @param string $property the credential property name (password, username)
     * @return object
     * @throws \Exception
     */
    public static function getSendCredentialConfigs(string $property): object
    {
        $sendChannel = SpiceConfig::getInstance()->get("passwordsetting.send_{$property}_channel");
        $mailbox = SpiceConfig::getInstance()->get("passwordsetting.send_{$property}_channel_mailbox_id");

        if (!$mailbox || !$sendChannel) {
            throw new \Exception("send_{$property}_channel is not set in the login management settings");
        }

        return (object)[
            "channel" => $sendChannel,
            "mailboxId" => $mailbox,
        ];
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

        if (isset(SpiceConfig::getInstance()->config['passwordsetting']['linkexpirationtime'])) {
            $expirationTime = SpiceConfig::getInstance()->config['passwordsetting']['linkexpirationtime']*1;
        } else $expirationTime = 5;

        # After that, $expirationTime might be 0. This means "off".
        if ( $expirationTime ) {
            $now = new DateTime();
            $now->setTimestamp(time() - ($expirationTime * 60));
            $sqlExpirationTime = "AND date_generated >= '" . $now->format( $timedate->get_db_date_time_format() )."'";
        } else $sqlExpirationTime = '';

        $userId = $db->fetchOne(sprintf("SELECT user_id FROM users_password_tokens WHERE id = '%s' " . $sqlExpirationTime, $db->quote($token)));
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
            throw new BadRequestException("Invalid Token");
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
     * @param $templateType string
     * @param string $channel
     * @return EmailTemplate|TextMessageTemplate
     * @throws \Exception
     */
    public static function getChannelTemplateByType($userIdOrBean, string $templateType, string $channel): EmailTemplate | TextMessageTemplate
    {
        $templateModule = $channel == 'sms' ? 'TextMessageTemplates' : 'EmailTemplates';
        $parentField = $channel == 'sms' ? 'parent_type' : 'for_bean';

        if (!is_object($userIdOrBean)) {
            /** @var User $user */
            $user = BeanFactory::getBean('Users', $userIdOrBean);

            if (empty($user->id)) {
                throw (new Exception("Could not compose $channel. Contact the administrator."))
                    ->setLogMessage("'Could not retrieve user with ID '$userIdOrBean'");
            }
        } else {
            $user = $userIdOrBean;
        }

        $destLang = $user->getPreference('language');
        if (!isset($destLang[0])) $destLang = SpiceLanguageManager::getInstance()->getSystemDefaultLanguage();
        if (!isset($destLang[0])) $destLang = 'en_us';

        /** @var EmailTemplate | TextMessageTemplate $template */
        $template = BeanFactory::getBean($templateModule);

        if ($template === false) {
            throw new Exception("Unable to instantiate $templateModule. Check if $channel Package loaded");
        }

        $template->retrieve_by_string_fields(['type' => $templateType, 'language' => $destLang]);

        # if no template with the passed language was found, try to find the template in en_us language
        if (empty($template->id)) {

            $template->retrieve_by_string_fields([$parentField => 'Users', 'type' => $templateType, 'language' => 'en_us']);

            if (empty($template->id)) {
                throw (new Exception("Could not compose $channel. Contact the administrator."))
                    ->setLogMessage("'Could not retrieve email template $templateType (for language '$destLang')");
            }
        }

        return $template;
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

        $sendChannel = SpiceConfig::getInstance()->get('passwordsetting.send_password_channel');
        $mailboxId = SpiceConfig::getInstance()->get('passwordsetting.send_password_channel_mailbox_id');

        if ($mailboxId == 'gateway') {

            if ($sendChannel == 'sms') {
                SpiceGatewayClientHandler::sendTemplateTypeSMS(
                    $userObj->phone_mobile,'sendTokenForNewPassword', ['token' => $token], $userObj->getPreference('language')
                );
            } else {
                SpiceGatewayClientHandler::sendTemplateTypeEmail(
                    [['type' => 'to', 'email' => $userObj->email1]],'sendTokenForNewPassword', ['token' => $token], $userObj->getPreference('language')
                );
            }

        } else {

            $emailTempl = $this->getChannelTemplateByType($user_id, 'sendTokenForNewPassword', $sendChannel);

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
            $result = $emailObj->sendEmail();

            if (!$result['result']) {
                throw new Exception("Unable to send email");
            }
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

    /**
     * @param $lang
     * @return string
     */
    public static function getPwdGuideline( $lang )
    {
        global $app_strings;
        $app_strings = SpiceUtils::returnApplicationLanguage($lang);

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

}
