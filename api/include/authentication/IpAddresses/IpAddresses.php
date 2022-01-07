<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\IpAddresses;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\TimeDate;

class IpAddresses
{

    static function checkIpAddress( $ipAddress = null )
    {
        if ( $ipAddress === null ) $ipAddress = SpiceUtils::getClientIP();
        $db = DBManagerFactory::getInstance();
        $ipIsBlackListed = (bool)$db->getOne( sprintf("SELECT count(*) FROM ipaddresses WHERE date_deleted IS NULL AND color=\"b\" AND address = \"%s\"", $db->quote( $ipAddress )));
        return !$ipIsBlackListed;
    }

    static function ipAddressIsWhite( $ipAddress = null )
    {
        if ( $ipAddress === null ) $ipAddress = SpiceUtils::getClientIP();
        $db = DBManagerFactory::getInstance();
        return (bool)$db->getOne( sprintf("SELECT count(*) FROM ipaddresses WHERE date_deleted IS NULL AND  color=\"w\" AND address = \"%s\"", $db->quote( $ipAddress )));
    }

    static function addIpAddress( $color, $description = null, $ipAddress = null, $createdBy = null )
    {
        if ( $ipAddress === null ) $ipAddress = SpiceUtils::getClientIP();
        $db = DBManagerFactory::getInstance();
        $now = TimeDate::getInstance()->nowDb();

        if ( $db->getOne('SELECT COUNT(*) FROM ipaddresses WHERE address = "'.$db->quote( $ipAddress ).'" AND date_deleted IS NULL')) {
            throw ( new BadRequestException('IP Address already exists.'));
        }

        if ( $color === 'w' or $color === 'b' ) {
            $result = $db->query( sprintf('INSERT INTO ipaddresses SET id = "%s", color = "%s", address = "%s", date_entered = "%s"', SpiceUtils::createGuid(), $color, $ipAddress, $now ).( isset( $createdBy ) ? ', created_by = "'.$db->quote( $createdBy ).'"':'' ).( isset( $description ) ? ', description = "'.$db->quote( $description ).'"':'' ));
        }

        if ( $db->getAffectedRowCount( $result ) !== 1 ) throw new Exception('Database error.');

        return $db->fetchOne('SELECT i.address, i.date_entered, i.created_by, u.user_name as created_by_name, i.description FROM ipaddresses i LEFT JOIN users u ON i.created_by = u.id WHERE date_deleted IS NULL AND address = "'.$ipAddress.'"');
    }

    static function deleteIpAddress( $ipAddress = null )
    {
        if ( $ipAddress === null ) $ipAddress = SpiceUtils::getClientIP();
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        $description = $db->getOne('SELECT description FROM ipaddresses WHERE address = "'.$db->quote( $ipAddress ).'" AND date_deleted IS NULL');
        if ( $description === false ) {
            throw ( new NotFoundException('IP Address not found.'))->setLookedFor( $ipAddress );
        }

        $now = TimeDate::getInstance()->nowDb();
        $result = $db->query($u=sprintf('UPDATE ipaddresses SET date_deleted = "%s", deleted_by = "%s" WHERE address = "%s" AND date_deleted IS NULL', $now, $currentUser->id, $db->quote($ipAddress)));

        if ( $db->getAffectedRowCount( $result ) === 0 ) throw new Exception('Database error.');

        return $description;
    }

    static function alterIpAddress( $description, $ipAddress = null )
    {
        if ( $ipAddress === null ) $ipAddress = SpiceUtils::getClientIP();
        $db = DBManagerFactory::getInstance();

        if ( $db->getOne('SELECT COUNT(*) FROM ipaddresses WHERE address = "'.$db->quote( $ipAddress ).'" AND date_deleted IS NULL') == 0 ) {
            throw ( new NotFoundException('IP Address not found.'))->setLookedFor( $ipAddress );
        }

        $result = $db->query( sprintf('UPDATE ipaddresses SET description = "%s" WHERE address = "%s" AND date_deleted IS NULL LIMIT 1', $db->quote( $description ), $db->quote( $ipAddress )));
        if ( $db->getAffectedRowCount( $result ) === 0 and $db->lastDbError() !== false ) throw new Exception('Database error.');

        $result = $db->fetchOne('SELECT i.address, i.date_entered, u.user_name as created_by_name, i.created_by, i.description FROM ipaddresses i LEFT JOIN users u ON i.created_by = u.id WHERE date_deleted IS NULL AND address = "'.$ipAddress.'"');
        return $result;
    }

    static function moveIpAddress( $color, $ipAddress = null, $createdBy = null )
    {
        $description = self::deleteIpAddress( $ipAddress );
        return self::addIpAddress( $color, $description, $ipAddress, $createdBy );
    }

}
