<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\includes\authentication\api\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class LoginController
{
    public function getCurrentUserData(Request $req, Response $res, array $args): Response {
        $authController = AuthenticationController::getInstance();
        $payload        = $authController->getLoginData();
        return $res->withJson($payload);
    }

    public function loginDelete(Request $req, Response $res, array $args): Response {
        session_destroy();
        return $res->withJson(true);
    }
}