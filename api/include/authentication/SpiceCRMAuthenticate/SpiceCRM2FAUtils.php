<?php

namespace SpiceCRM\includes\authentication\SpiceCRMAuthenticate;

use DateInterval;
use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\extensions\modules\TextMessages\TextMessage;
use SpiceCRM\includes\authentication\TOTPAuthentication\TOTPAuthentication;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguageManager;
use SpiceCRM\includes\SugarObjects\LanguageManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Emails\Email;
use SpiceCRM\modules\Users\User;

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



/**
 * user two-factor authentication utils
 */
class SpiceCRM2FAUtils
{
    /**
     * @param User $user
     * @param object|null $authData
     * @return void
     * @throws UnauthorizedException | Exception
     */
    public static function handle2FAFlow(User $user, ?object $authData)
    {
        $sys2FAConfig = self::get2FAConfig();
        $requireOn = $sys2FAConfig->require_on;
        $method = $sys2FAConfig->method;

        # if the system-wide 2FA is inactive then check for the user 2FA method
        if (!$requireOn && !empty($user->user_2fa_method)) {
            $requireOn = true;
            $method = $user->user_2fa_method;
        }

        if (!$requireOn) return;

        $userId = $user->id;

        # throw an exception and send the 2FA code if the code was not provided and the device is not trusted or the 2FA check is always on
        if (empty($authData->code2fa) && ($requireOn == 'always' || ($requireOn == 'device_change' && !self::isTrustedDevice($userId, $authData->deviceID)))) {
            self::handleRequire2FAException($userId, $method);
        }

        if (!empty($authData->code2fa)) {
            self::check2FACode($user, $method, $authData->code2fa);
        }

        if ($requireOn == 'device_change') {
            self::saveDeviceID($userId, $authData->deviceID);
        }
    }

    /**
     * throw exception and send code by sms
     * @param string $userId
     * @param string $method
     * @return mixed
     * @throws UnauthorizedException
     */
    private static function handleRequire2FAException(string $userId, string $method)
    {
        $message = '';

        switch ($method) {
            case 'email':
                $message = 'Enter the code sent to your email';
                self::send2FACodeByEmail($userId);
                break;
            case 'sms':
                $message = 'Enter the sms code sent to your mobile device';
                self::send2FACodeBySMS($userId);
                break;
            case 'one_time_password':
                $message = 'Enter the one-time password code displayed on the authenticator app in your mobile device';
                break;
        }

        throw new UnauthorizedException($message, 4);
    }

    /**
     * get two-factor authentication config
     * @return object
     */
    public static function get2FAConfig(): object
    {
        $userLogin2FAConfig = SpiceConfig::getInstance()->config['user_login_2fa'] ?? [];
        return (object)[
            'require_on' => $userLogin2FAConfig['require_on'] ?? null,
            'sms_mailbox_id' => $userLogin2FAConfig['sms_mailbox_id'] ?? null,
            'email_mailbox_id' => $userLogin2FAConfig['email_mailbox_id'] ?? null,
            'method' => $userLogin2FAConfig['method'] ?? 'one_time_password',
            'trust_device_days' => $userLogin2FAConfig['trust_device_days'] ?? 90,
        ];
    }

    /**
     * check if the provided 2fa token matches
     * @param User $user
     * @param string $method
     * @param string|null $code2fa
     * @return true
     * @throws UnauthorizedException | Exception
     * @throws
     */
    public static function check2FACode(User $user, string $method, ?string $code2fa): bool
    {
        if (empty($code2fa)) {
            throw new UnauthorizedException("Invalid token", 3);
        }

        $db = DBManagerFactory::getInstance();

        switch ($method) {
            case 'one_time_password':
                self::checkActiveOneTimePassword($user);
                $tokenMatch = TOTPAuthentication::checkTOTPCode($user->id, $code2fa);
                break;
            case 'sms':
            case 'email':
                $code = $db->getOne("SELECT id FROM user_2fa_codes WHERE id ='$code2fa' AND user_id = '$user->id' AND expires_in > {$db->now()}");
                $tokenMatch = (bool)$code;
                break;
            default:
                $tokenMatch = false;
        }

        if (!$tokenMatch) {
            throw new UnauthorizedException("Invalid token", 3);
        }

        return true;
    }


    /**
     * throw an exception if the time-based one-time password is required and was not activated
     * @param User $userObj
     * @throws UnauthorizedException
     */
    private static function checkActiveOneTimePassword(User $userObj)
    {
        if (TOTPAuthentication::checkTOTPActive($userObj->id)) {
            return;
        }

        $language = $userObj->getPreference('language') ?? SpiceLanguageManager::getInstance()->getSystemDefaultLanguage();
        $necessaryLabels = LanguageManager::getSpecificLabels($language , [
            'LBL_SAVE', 'LBL_TOTP_AUTHENTICATION', 'MSG_AUTHENTICATOR_INSTRUCTIONS', 'LBL_CODE', 'LBL_CANCEL', 'LBL_CODE'
        ]);

        throw (new UnauthorizedException('TOTP.', 12))->setDetails(['labels' => $necessaryLabels]);
    }

    /**
     * generate 2FA code and save it in the db
     * @param string $userId
     * @return string
     * @throws UnauthorizedException | Exception
     */
    private static function generateCode(string $userId): string
    {
        $db = DBManagerFactory::getInstance();
        $expiresInDurationMin = 5;
        $code = random_int(100000, 999999);

        $db->query("DELETE FROM user_2fa_codes WHERE user_id = '$userId'");

        $date = TimeDate::getInstance()->getNow();
        $date->add(new DateInterval("PT{$expiresInDurationMin}M"));
        $date = TimeDate::getInstance()->asDb($date);

        $db->query("INSERT INTO user_2fa_codes (id, user_id, expires_in) VALUES ('$code', '$userId', '$date')");

        return $code;
    }

    /**
     * send code by sms
     * @param string $userId
     * @return void
     * @throws UnauthorizedException | Exception
     */
    public static function send2FACodeBySMS(string $userId)
    {
        $db = DBManagerFactory::getInstance();
        $code = self::generateCode($userId);
        $mailboxId = self::get2FAConfig()->sms_mailbox_id;

        $phoneNumber = $db->getOne("SELECT phone_mobile FROM users WHERE id = '$userId'");

        if (!$phoneNumber) {
            throw new UnauthorizedException("User mobile phone number missing", 5);
        }

        if (!$mailboxId) {
            throw new UnauthorizedException("Missing configuration mailbox id", 5);
        }

        /** @var TextMessage $sms */
        $sms = BeanFactory::newBean('TextMessages');
        $sms->to_be_sent = true;
        $sms->mailbox_id = $mailboxId;
        $sms->description = "Your CRM login code is $code";
        $sms->msisdn = $phoneNumber;
        $sms->save();
    }

    /**
     * send code by email
     * @param string $userId
     * @return void
     * @throws UnauthorizedException | Exception
     */
    public static function send2FACodeByEmail(string $userId)
    {
        $db = DBManagerFactory::getInstance();
        $code = self::generateCode($userId);
        $mailboxId = self::get2FAConfig()->email_mailbox_id;

        $emailAddress = $db->getOne("SELECT email_address FROM email_addresses ea, email_addr_bean_rel ear WHERE ear.bean_id='$userId' AND ear.bean_module= 'Users'  AND ear.primary_address = 1 AND ear.deleted != 1 AND ear.email_address_id = ea.id AND ea.deleted != 1");

        if (!$emailAddress) {
            throw new UnauthorizedException("User email address missing", 5);
        }

        if (!$mailboxId) {
            throw new UnauthorizedException("Missing configuration mailbox id", 5);
        }

        /** @var Email $email */
        $email = BeanFactory::newBean('Emails');
        $email->to_be_sent = true;
        $email->mailbox_id = $mailboxId;
        $email->name = 'Verification Code';
        $email->body = "Your CRM login code is $code";
        $email->addEmailAddress('to', $emailAddress);

        $email->save();
    }

    /**
     * save the device id with the user ip to check for 2FA require
     * @param string $userId
     * @param string $deviceID
     * @throws Exception
     */
    public static function saveDeviceID(string $userId, string $deviceID)
    {
        $db = DBManagerFactory::getInstance();

        $db->query("DELETE FROM user_device_ids WHERE user_id = '$userId' AND expires_in < {$db->now()}");

        $ip = SpiceUtils::getClientIP();
        $date = TimeDate::getInstance()->getNow();
        $expiresInDays = self::get2FAConfig()->trust_device_days;
        $date->add(new DateInterval("P{$expiresInDays}D"));
        $date = TimeDate::getInstance()->asDbDate($date);

        $db->query("REPLACE INTO user_device_ids (id, user_id, user_ip, expires_in) VALUES ('$deviceID', '$userId', '$ip', '$date')");
    }

    /**
     * check if the given device id is registered
     * @param string $userId
     * @param string|null $deviceID
     * @return bool
     * @throws Exception
     */
    public static function isTrustedDevice(string $userId, ?string $deviceID): bool
    {
        $db = DBManagerFactory::getInstance();
        $userIp = SpiceUtils::getClientIP();

        $deviceID = $db->getOne("SELECT id FROM user_device_ids WHERE id = '{$db->quote($deviceID)}' AND user_id = '$userId' AND user_ip = '$userIp' AND expires_in > {$db->now()}");

        return (bool)$deviceID;
    }
}
