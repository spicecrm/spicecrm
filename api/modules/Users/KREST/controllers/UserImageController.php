<?php

namespace SpiceCRM\modules\Users\KREST\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;

class UserImageController{

    public function GetImageData($req, $res, $args){

        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $current_user->user_image = '';
        $body = $req->getParsedBody();

        if($body['imagedata']) {
            $current_user->user_image = $body['imagedata'];
            $current_user->save();
        }

        return $res->withJson(['success' => true]);
    }
}