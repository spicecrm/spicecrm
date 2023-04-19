<?php
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
    static function deleteIpAddress( $ipAddress = null ): string;

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