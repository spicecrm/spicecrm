<?php

namespace SpiceCRM\modules\Users\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class ACLforPortalUserController
{

    public function setACLprofile( Request $req, Response $res, array $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $spiceConfig = SpiceConfig::getInstance()->config;

        $portalUser = BeanFactory::getBean('Users');

        if ( !isset( $spiceConfig['acl']['portal_user_profile'][0] )) {
            return $res->withJson([
                'success' => false,
                'error' => 'No user profile ID set in config.php or config DB table (acl/portal_user_profile). '
            ]);
        }

        if ( !isset( $req->getParsedBody()['doIt'] ) or $req->getParsedBody()['doIt'] !== true ) {
            throw new BadRequestException('Body/POST parameter \'doIt\' (true) not set.');
        }

        $dbResult = $db->query("SELECT id FROM users WHERE deleted <> 1 AND portal_only = 1");
        while ( $record = $db->fetchByAssoc( $dbResult )) {
            $portalUser->retrieve($record['id']);
            $portalUser->load_relationship( 'spiceaclprofiles' );
            $portalUser->spiceaclprofiles->add( $spiceConfig['acl']['portal_user_profile'] );
            $counter++;
        }

        return $res->withJson([
            'success' => true,
            'numberPortalUsersFound' => $counter,
            'setAclProfileID' => $spiceConfig['acl']['portal_user_profile']
        ]);

    }

}
