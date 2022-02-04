<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\includes\authentication\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\authentication\OAuthAuthenticate\OAuth2Authenticate;

class OAuthController
{
    public function handleOAuthRedirect(Request $req, Response $res, array $args): Response {
        session_id($args['state']);
        $authHandler = new OAuth2Authenticate();
        $accessToken = $authHandler->fetchAccessToken($args['code']);
        $userProfile = $authHandler->fetchUserProfile($accessToken);

        return $res->withJson();
    }
}