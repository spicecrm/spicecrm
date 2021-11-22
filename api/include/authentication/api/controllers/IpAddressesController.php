<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
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
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

namespace SpiceCRM\includes\authentication\api\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\authentication\TOTPAuthentication\TwoFactorAuthenticate;
use SpiceCRM\includes\authentication\UserAuthenticate\UserAuthenticate;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\authentication\IpAddresses\IpAddresses;

class IpAddressesController
{

    public function getIpAddresses( $req, $res, array $args )
    {
        $db = DBManagerFactory::getInstance();
        $ipAddresses = [];
        $result = $db->query('SELECT i.address, i.date_entered, i.created_by, u.user_name as created_by_name, i.description FROM ipaddresses i LEFT JOIN users u ON i.created_by = u.id WHERE date_deleted IS NULL AND color = "'.$args['color'][0].'"');
        while( $address = $db->fetchByAssoc( $result )) $ipAddresses[] = $address;
        return $res->withJson( $ipAddresses );
    }

    public function deleteIpAddress( $req, $res, array $args ): Response
    {
        IpAddresses::deleteIpAddress( $args['ipAddress'] );
        return $res->withJson([
            'success' => true
        ]);
    }

    public function addIpAddress( $req, $res, array $args )
    {
        $parsedBody = $req->getParsedBody();
        $ipAddress = IpAddresses::addIpAddress( $parsedBody['color'], $parsedBody['description'], $args['ipAddress'], AuthenticationController::getInstance()->getCurrentUser()->id );
        return $res->withJson([
            'success' => true,
            'data' => $ipAddress
        ]);
    }

    public function alterIpAddress( $req, $res, array $args )
    {
        $ipAddress = IpAddresses::alterIpAddress( $req->getParsedBody()['description'], $args['ipAddress'] );
        return $res->withJson([
            'success' => true,
            'data' => $ipAddress
        ]);
    }

    public function moveIpAddress( $req, $res, array $args )
    {
        return $res->withJson([
            'success' => true,
            'data' => IpAddresses::moveIpAddress( $args['color'][0], $args['ipAddress'], AuthenticationController::getInstance()->getCurrentUser()->id )
        ]);
    }

}
