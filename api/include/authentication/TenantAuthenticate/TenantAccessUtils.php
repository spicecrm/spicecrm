<?php

namespace SpiceCRM\includes\authentication\TenantAuthenticate;

/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

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
