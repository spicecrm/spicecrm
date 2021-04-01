<?php
namespace SpiceCRM\includes\authentication\KREST\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;

class UserLoginController
{
    public function getCurrentUserData($req, $res, $args) {
        $authController = AuthenticationController::getInstance();
        $payload        = $authController->getLoginData();
        return $res->withJson($payload);
    }



    public function loginDelete($req, $res, $args) {
        session_destroy();
        return $res->withJson(true);
    }
}