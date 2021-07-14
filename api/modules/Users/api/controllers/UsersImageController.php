<?php

namespace SpiceCRM\modules\Users\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use Slim\Psr7\Request as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class UsersImageController
{

    public function SaveImageData(Request $req, Response $res, array $args): Response 
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        if (!$current_user->is_admin && $current_user->id != $args['id'])
            throw (new ForbiddenException("only allowed for admins or assigned user"));

        $userBean = BeanFactory::getBean("Users", $args['id']);

        $body = $req->getParsedBody();
        $userBean->user_image = $body['imagedata'];
        $userBean->save();


        return $res->withJson(['success' => true]);
    }
}