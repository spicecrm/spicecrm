<?php

namespace SpiceCRM\includes\authentication\TenantAuthenticate;

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



use DateInterval;
use Exception;
use SpiceCRM\includes\authentication\interfaces\AccessUtilsI;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAccessUtils;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\TimeDate;

/**
 * user access management
 */
class TenantAccessUtils extends SpiceCRMAccessUtils implements AccessUtilsI
{
    /**
     * Blocks a user (prevent from login) permanent or for a specific time
     * @param string $username The name of the user.
     * @param string|null $blockingDuration The time in minutes that the user should be blocked from logging in. From now on
     * @throws BadRequestException | Exception | NotFoundException
     */
    public function blockUserByName(string $username, string $blockingDuration = null)
    {
        $db = DBManagerFactory::getInstance();
        $userId = DBManagerFactory::getInstance()->fetchOne(sprintf("SELECT id from tenant_auth_users WHERE username ='%s'", $db->quote($username)));

        // if we do not find the user return. causes empty users to be created
        if (!$userId) {
            return null;
        }

        // set a block end date
        if ($blockingDuration) {
            $fields = [
                'login_blocked_until' => date_create()->add(new DateInterval("PT{$blockingDuration}S"))->format(TimeDate::DB_DATETIME_FORMAT)
            ];
        } else {
            $fields = ['login_blocked' => true];
        }

        $db->updateQuery('tenant_auth_users', ['id' => $userId], $fields);
    }

    /**
     * Checks if a user is blocked permanent or for a specific time
     * @param string $username The name of the user.
     * @return bool ture if permanent or the amount of minutes in case the blocking is for a specific time
     * @throws Exception
     */
    public function isBlocked(string $username): bool
    {
        $db = DBManagerFactory::getInstance();

        $row = $db->fetchOne(sprintf("SELECT login_blocked, login_blocked_until FROM tenant_auth_users WHERE username = '%s'", $db->quote($username)));

        if ($row['login_blocked']) { # The user is blocked permanently.
            return true;
        }

        if ($row['login_blocked_until'] === null) return false; # The user (is not blocked permanently and) is not blocked temporarily.

        # The user is blocked temporarily, so calculate the remaining blocking time:
        $remainingBlockingSeconds =
            (new \DateTime($row['login_blocked_until'], new \DateTimeZone('UTC')))->getTimestamp()
            - (new \DateTime('NOW', new \DateTimeZone('UTC')))->getTimestamp();
        if ($remainingBlockingSeconds > 0) return ceil($remainingBlockingSeconds / 60); # return the remaining blocking time (in minutes)

        return false; # The user is not blocked anymore (login_blocked_until is in the past).
    }
}
