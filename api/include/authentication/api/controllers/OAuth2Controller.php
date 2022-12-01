<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\api\controllers;

use Exception;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\authentication\OAuth2Authenticate\OAuth2Authenticate;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use function DI\string;

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
        $tokenResponse = $authHandler->fetchAccessToken($params['code']);

        if (empty($tokenResponse)) {
            throw new BadRequestException('Invalid authorization code', 'invalid_auth_code');
        }

        $userProfile = $authHandler->fetchUserProfile($tokenResponse->access_token);
        $tokenObject = ['access_token' => $tokenResponse->access_token, 'refresh_token' => $tokenResponse->refresh_token, 'valid_until' => (string) $tokenResponse->valid_until];
        return $res->withJson(['tokenObject' => $tokenObject, 'profile' => $userProfile]);
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