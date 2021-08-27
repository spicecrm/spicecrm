<?php
namespace SpiceCRM\modules\Users\api\controllers;

use SpiceCRM\includes\RESTManager;

class UserLoginController
{
    public function postLogin($req, $res, $args) {
        $RESTManager = RESTManager::getInstance();
        $payload = RESTManager::getInstance()->getLoginData();

        $RESTManager->tmpSessionId = null;
        return $res->withJson($payload);
    }

    public function getLogin($req, $res, $args) {
        return $res->withJson(RESTManager::getInstance()->getLoginData());
    }

    public function deletedLogin($req, $res, $args) {
        session_destroy();
        return $res->withJson(['result' => true]);
    }
}
