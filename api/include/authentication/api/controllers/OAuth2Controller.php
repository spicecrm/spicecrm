<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\api\controllers;

use Exception;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\authentication\OAuth2Authenticate\OAuth2Authenticate;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class OAuth2Controller
{
    /**
     * get access token
     * @throws Exception
     */
    public function getAccessToken(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();

        $authHandler = new OAuth2Authenticate($params['issuer']);
        $accessToken = $authHandler->fetchAccessToken($params['code']);

        if (empty($accessToken)) {
            throw new BadRequestException('Invalid authorization code', 'invalid_auth_code');
        }

        $userProfile = $authHandler->fetchUserProfile($accessToken);

        return $res->withJson(['accessToken' => $accessToken, 'profile' => $userProfile]);
    }

    /**
     * get user profile
     * @throws Exception
     */
    public function getUserProfile(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();

        $authHandler = new OAuth2Authenticate($params['issuer']);
        $userProfile = $authHandler->fetchUserProfile($params['accessToken']);

        return $res->withJson($userProfile);
    }
}