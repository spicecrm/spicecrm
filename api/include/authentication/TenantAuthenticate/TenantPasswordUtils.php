<?php

namespace SpiceCRM\includes\authentication\TenantAuthenticate;

/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMPasswordUtils;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\modules\Users\User;

/**
 * user password management
 */
class TenantPasswordUtils extends SpiceCRMPasswordUtils
{
    /**
     * set new password
     * @param User $userObj
     * @param string $newPassword
     * @param bool $sendByEmail
     * @param bool $systemGeneratedPassword
     * @return bool
     * @throws Exception | \Exception
     */
    public function setNewPassword(User $userObj, string $newPassword, bool $sendByEmail, bool $systemGeneratedPassword): bool
    {
        $systemGeneratedPassword = $systemGeneratedPassword ? '1' : '0';

        $this->updateTenantUserPassword($userObj, $newPassword, $systemGeneratedPassword);

        if ($sendByEmail) {
            $emailTemplate = $this->getProperEmailTemplate($userObj, 'sendCredentials');
            $userObj->sendPasswordToUser($emailTemplate, ['password' => $newPassword]);
        }
        return true;
    }

    /**
     * Sets new password and resets password expiration timers
     * @param User $user
     * @param $password
     * @param string $systemGeneratedPassword
     * @throws \Exception
     */
    private function updateTenantUserPassword(User $user, $password, string $systemGeneratedPassword)
    {
        $db = DBManagerFactory::getInstance('master');

        $user->setNewPassword($password, $systemGeneratedPassword);

        $db->query("UPDATE tenant_auth_users SET user_hash='{$user->user_hash}', where id='{$user->id}'");

    }
}
