<?php
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\interfaces;

use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use Exception;

interface AccessUtilsI
{
    /**
     * Blocks a user (prevent from login) permanent or for a specific time
     * @param string $username The name of the user.
     * @param string|null $blockingDuration The time in minutes that the user should be blocked from logging in. From now on
     * @throws BadRequestException
     * @throws NotFoundException
     */
    public function blockUserByName(string $username, string $blockingDuration = null);

    /**
     * Checks if a user is blocked permanent or for a specific time
     * @param string $username The name of the user.
     * @return True if permanent or the amount of minutes in case the blocking is for a specific time
     * @throws Exception
     */
    public function isBlocked(string $username): bool;

    /**
     * check if the ip address is blacklisted
     * @param $ipAddress
     * @return bool
     * @throws Exception
     */
    static function checkIpAddress( $ipAddress = null ): bool;

    /**
     * check if ip address is whitelisted
     * @param $ipAddress
     * @return bool
     * @throws Exception
     */
    static function ipAddressIsWhite( $ipAddress = null ): bool;

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
    static function addIpAddress( $color, $description = null, $ipAddress = null, $createdBy = null );

    /**
     * delete an ip address
     * @param $ipAddress
     * @return array
     * @throws NotFoundException
     */
    static function deleteIpAddress( $ipAddress = null ): array;

    /**
     * alter an ip address entry
     * @param $description
     * @param $ipAddress
     * @return array|false
     * @throws NotFoundException
     */
    static function alterIpAddress( $description, $ipAddress = null );

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
    static function moveIpAddress( $color, $ipAddress = null, $createdBy = null );
}