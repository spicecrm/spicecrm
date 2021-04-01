<?php

namespace SpiceCRM\includes\authentication\KREST\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\authentication\TwoFactorAuthenticate\TwoFactorAuthenticate;
use SpiceCRM\includes\authentication\UserAuthenticate\UserAuthenticate;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\modules\Users\User;


class AuthenticationKRESTController
{
    public function AuthResetPasswordByToken($req, $res, $args)
    {
        //todo add check if required params are populated
        $parsedBody = $req->getParsedBody();
        $userAuthenticationController = new UserAuthenticate();
        $userAuthenticationController->resetPasswordByToken($args['token'], $parsedBody['newPassword']);
        return $res;
    }

    public function AuthSendTokenToUser($req, $res, $args)
    {
        //todo add check if required params are populated
        $sugarAuthenticationObj = new UserAuthenticate();
        try {
            $sugarAuthenticationObj->sendTokenToUser($args['emailAddress']);
        } catch (\SpiceCRM\includes\ErrorHandlers\Exception $exception) {
            throw new \SpiceCRM\includes\ErrorHandlers\Exception();
            //catch error of sending token in order to hide success of action
            //todo clarify should we log invalid email adresses?
        }
        return $res;
    }

    public function AuthCheckCode($req, $res, $args)
    {
        $twoFactorAuthentication = new TwoFactorAuthenticate();

        return $res->withJson($twoFactorAuthentication->checkCode("12345", "56789"));
    }

    public function AuthChangePassword($req, $res, $args)
    {
        $parsedBody = $req->getParsedBody();
        AuthenticationController::getInstance()->changePassword($parsedBody['username'], $parsedBody['password'], $parsedBody['newPassword'], false);

        return $res;

    }

    public function AuthGetModuleACL($req, $res, $args)
    {
        $sugarAuthenticateObj = new UserAuthenticate();

        return $res->withJson($sugarAuthenticateObj->get_modules_acl());
    }

    public function AuthSetNewPassword($req, $res, $args)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if ($current_user->external_auth_only == "1") {
            throw new UnauthorizedException("Password Reset due to external_auth_only unavailable");
        }

        $sugarAuthenticationObj = new UserAuthenticate();

        // CR1000463 use SpiceACL for user preferences editing
        // keep bwc compatibility
        $editEnabled = false;
        if (SpiceConfig::getInstance()->config['acl']['controller'] && !preg_match('/SpiceACL/', SpiceConfig::getInstance()->config['acl']['controller'])) {
            if ($current_user->is_admin) {
                $editEnabled = true;
            }
        } else {
            if (SpiceACL::getInstance()->checkAccess('Users', 'create')) {
                $editEnabled = true;
            }
        }

        if (!$editEnabled) throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        $parsedBody = $req->getParsedBody();
        /** @var User $userObj */
        $userObj = BeanFactory::getBean("Users", $args['id']);
        if (!$userObj) {
            throw new UnauthorizedException("No User with id " . $args['id']);
        }
        //todo add check if required fields are populated
        $sugarAuthenticationObj->setNewPassword($userObj, $parsedBody['newPassword'], $parsedBody['sendEmail'], $parsedBody['forceReset']);

        return $res->withJson(['success' => true]);

    }

    public function AuthGetFormat($req, $res, $args)
    {
        return $res->withJson([
            'dateFormats' => SpiceConfig::getInstance()->config['date_formats'],
            'nameFormats' => array_values(@SpiceConfig::getInstance()->config['name_formats']),
            'timeFormats' => SpiceConfig::getInstance()->config['time_formats']
        ]);
    }
}
