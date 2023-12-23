<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\api\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAccessUtils;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class IpAddressesController
{

    public function getIpAddresses( $req, $res, array $args )
    {
        $db = DBManagerFactory::getInstance();
        $ipAddresses = [];
        $result = $db->query('SELECT i.address, i.date_entered, i.created_by, u.user_name as created_by_name, i.description FROM ipaddresses i LEFT JOIN users u ON i.created_by = u.id WHERE date_deleted IS NULL AND color = \''.$args['color'][0].'\'');
        while( $address = $db->fetchByAssoc( $result )) $ipAddresses[] = $address;
        return $res->withJson( $ipAddresses );
    }

    public function deleteIpAddress( $req, $res, array $args ): Response
    {
        SpiceCRMAccessUtils::deleteIpAddress( $args['ipAddress'] );
        return $res->withJson([
            'success' => true
        ]);
    }

    public function addIpAddress( $req, $res, array $args )
    {
        $parsedBody = $req->getParsedBody();
        $db = DBManagerFactory::getInstance();

        $ipAddress = SpiceCRMAccessUtils::addIpAddress( $parsedBody['color'], $parsedBody['description'], $args['ipAddress'], AuthenticationController::getInstance()->getCurrentUser()->id );

        if (!empty($ipAddress['created_by'])) {
            $ipAddress['created_by_name'] = $db->getOne("SELECT user_name FROM users WHERE id ='{$ipAddress['created_by']}'");
        }

        return $res->withJson([
            'success' => true,
            'data' => $ipAddress
        ]);
    }

    public function alterIpAddress( $req, $res, array $args )
    {
        $ipAddress = SpiceCRMAccessUtils::alterIpAddress( $req->getParsedBody()['description'], $args['ipAddress'] );
        $db = DBManagerFactory::getInstance();

        if (!empty($ipAddress['created_by'])) {
            $ipAddress['created_by_name'] = $db->getOne("SELECT user_name FROM users WHERE id ='{$ipAddress['created_by']}'");
        }

        return $res->withJson([
            'success' => true,
            'data' => $ipAddress
        ]);
    }

    public function moveIpAddress( $req, $res, array $args )
    {
        return $res->withJson([
            'success' => true,
            'data' => SpiceCRMAccessUtils::moveIpAddress( $args['color'][0], $args['ipAddress'], AuthenticationController::getInstance()->getCurrentUser()->id )
        ]);
    }

}
