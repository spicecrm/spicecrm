<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class LoginController
{
    /**
     * get the current user data
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws UnauthorizedException
     */
    public function getCurrentUserData(Request $req, Response $res, array $args): Response
    {
        $payload = AuthenticationController::getInstance()->getLoginData();
        AuthenticationController::getInstance()->getCurrentUser()->call_custom_logic('after_login');
        return $res->withJson($payload);
    }

    /**
     * logout the user
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function loginDelete(Request $req, Response $res, array $args): Response
    {
        AuthenticationController::getInstance()->logout();
        return $res->withJson(true);
    }
}