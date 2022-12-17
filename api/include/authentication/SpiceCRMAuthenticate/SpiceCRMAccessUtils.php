<?php

namespace SpiceCRM\includes\authentication\SpiceCRMAuthenticate;

/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

use DateInterval;
use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\authentication\interfaces\AccessUtilsI;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\Users\User;

/**
 * user access management
 */
class SpiceCRMAccessUtils implements AccessUtilsI
{
    /**
     * Blocks a user (prevent from login) permanent or for a specific time
     * @param string $username The name of the user.
     * @param string|null $blockingDuration The time in minutes that the user should be blocked from logging in. From now on
     * @throws BadRequestException
     * @throws NotFoundException
     */
    public function blockUserByName(string $username, string $blockingDuration = null)
    {
        /** @var User $user */
        $user = BeanFactory::getBean('Users');
        // if we do not find the user return .. causes empty users to be created
        if (!$user->findByUserName($username)) {
            return null;
        }

        // set a block end date
        if ($blockingDuration) {
            $user->login_blocked_until = date_create()->add(new DateInterval("PT{$blockingDuration}S"))->format(TimeDate::DB_DATETIME_FORMAT);
        } else {
            $user->login_blocked = true;
        }

        $user->save();
    }

    /**
     * Checks if a user is blocked permanent or for a specific time
     * @param string $username The name of the user.
     * @return True if permanent or the amount of minutes in case the blocking is for a specific time
     * @throws Exception
     */
    public function isBlocked(string $username): bool
    {
        $db = DBManagerFactory::getInstance();

        $row = $db->fetchOne(sprintf("SELECT login_blocked, login_blocked_until FROM users WHERE user_name = '%s'", $db->quote($username)));

        if ($row['login_blocked']) return true; # The user is blocked permanently.
        if ($row['login_blocked_until'] === null) return false; # The user (is not blocked permanently and) is not blocked temporarily.

        # The user is blocked temporarily, so calculate the remaining blocking time:
        $remainingBlockingSeconds =
            (new \DateTime($row['login_blocked_until'], new \DateTimeZone('UTC')))->getTimestamp()
            - (new \DateTime('NOW', new \DateTimeZone('UTC')))->getTimestamp();
        if ($remainingBlockingSeconds > 0) return ceil($remainingBlockingSeconds / 60); # return the remaining blocking time (in minutes)

        return false; # The user is not blocked anymore (login_blocked_until is in the past).
    }

    /**
     * check if the ip address is blacklisted
     * @param $ipAddress
     * @return bool
     * @throws Exception
     */
    static function checkIpAddress( $ipAddress = null ): bool
    {
        if ( $ipAddress === null ) $ipAddress = SpiceUtils::getClientIP();
        $db = DBManagerFactory::getInstance();
        $ipIsBlackListed = (bool)$db->getOne( sprintf("SELECT count(*) FROM ipaddresses WHERE date_deleted IS NULL AND color='b' AND address = '%s'", $db->quote( $ipAddress )));
        return !$ipIsBlackListed;
    }

    /**
     * check if ip address is whitelisted
     * @param $ipAddress
     * @return bool
     * @throws Exception
     */
    static function ipAddressIsWhite( $ipAddress = null ): bool
    {
        if ( $ipAddress === null ) $ipAddress = SpiceUtils::getClientIP();
        $db = DBManagerFactory::getInstance();
        return (bool)$db->getOne( sprintf("SELECT count(*) FROM ipaddresses WHERE date_deleted IS NULL AND color='w' AND address = '%s'", $db->quote( $ipAddress )));
    }

    /**
     * add an ip address as white/black-listed
     * @param $color
     * @param $description
     * @param $ipAddress
     * @param $createdBy
     * @return array|false
     * @throws BadRequestException
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    static function addIpAddress( $color, $description = null, $ipAddress = null, $createdBy = null )
    {
        if ( $ipAddress === null ) $ipAddress = SpiceUtils::getClientIP();
        $db = DBManagerFactory::getInstance();
        $now = TimeDate::getInstance()->nowDb();

        if ( $db->getOne("SELECT COUNT(*) FROM ipaddresses WHERE address = '".$db->quote( $ipAddress )."' AND date_deleted IS NULL")) {
            throw ( new BadRequestException('IP Address already exists.'));
        }

        if ( $color === 'w' or $color === 'b' ) {
            $result = $db->query( sprintf("INSERT INTO ipaddresses SET id = '%s', color = '%s', address = '%s', date_entered = '%s'", SpiceUtils::createGuid(), $color, $db->quote( $ipAddress ), $now ).( isset( $createdBy ) ? ", created_by = '".$db->quote( $createdBy )."'":"" ).( isset( $description ) ? ", description = '".$db->quote( $description )."'":'' ));
        }

        if ( $db->getAffectedRowCount( $result ) !== 1 ) throw new \SpiceCRM\includes\ErrorHandlers\Exception('Database error.');

        return $db->fetchOne("SELECT address, date_entered, created_by, description FROM ipaddresses WHERE date_deleted IS NULL AND address = '".$db->quote( $ipAddress )."'");
    }

    /**
     * delete an ip address
     * @param $ipAddress
     * @return array
     * @throws NotFoundException
     */
    static function deleteIpAddress( $ipAddress = null ): array
    {
        if ( $ipAddress === null ) $ipAddress = SpiceUtils::getClientIP();
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $description = $db->getOne("SELECT description FROM ipaddresses WHERE address = '".$db->quote( $ipAddress )."' AND date_deleted IS NULL");
        if ( $description === false ) {
            throw ( new NotFoundException('IP Address not found.'))->setLookedFor( $ipAddress );
        }

        $now = TimeDate::getInstance()->nowDb();
        $result = $db->query( sprintf("UPDATE ipaddresses SET date_deleted = '%s', deleted_by = '%s' WHERE address = '%s' AND date_deleted IS NULL", $now, $currentUser->id, $db->quote($ipAddress)));

        if ( $db->getAffectedRowCount( $result ) === 0 ) throw new Exception('Database error.');

        return $description;
    }

    /**
     * alter an ip address entry
     * @param $description
     * @param $ipAddress
     * @return array|false
     * @throws NotFoundException
     */
    static function alterIpAddress( $description, $ipAddress = null )
    {
        if ( $ipAddress === null ) $ipAddress = SpiceUtils::getClientIP();
        $db = DBManagerFactory::getInstance();

        if (!$db->getOne("SELECT COUNT(*) FROM ipaddresses WHERE address = '".$db->quote( $ipAddress )."' AND date_deleted IS NULL")) {
            throw ( new NotFoundException('IP Address not found.'))->setLookedFor( $ipAddress );
        }

        $result = $db->limitQuery( sprintf("UPDATE ipaddresses SET description = '%s' WHERE address = '%s' AND date_deleted IS NULL", $db->quote( $description ), $db->quote( $ipAddress )), 0, 1);
        if ( $db->getAffectedRowCount( $result ) === 0 and $db->lastDbError() !== false ) throw new Exception('Database error.');

        $result = $db->fetchOne("SELECT address, date_entered, created_by, description FROM ipaddresses WHERE date_deleted IS NULL AND address = '".$db->quote( $ipAddress )."'");
        return $result;
    }

    /**
     * move an ip address between black and white lists
     * @param $color
     * @param $ipAddress
     * @param $createdBy
     * @return array|false
     * @throws BadRequestException
     * @throws NotFoundException
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    static function moveIpAddress( $color, $ipAddress = null, $createdBy = null )
    {
        $description = self::deleteIpAddress( $ipAddress );
        return self::addIpAddress( $color, $description, $ipAddress, $createdBy );
    }
}
