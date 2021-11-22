<?php
/*********************************************************************************
* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
* You can contact us at info@spicecrm.io
* 
* SpiceCRM is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* SugarCRM" logo. If the display of the logo is not reasonably feasible for
* technical reasons, the Appropriate Legal Notices must display the words
* "Powered by SugarCRM".
* 
* SpiceCRM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

namespace SpiceCRM\includes\authentication\api\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\authentication\TOTPAuthentication\TOTPAuthentication;
use SpiceCRM\includes\authentication\TOTPAuthentication\TwoFactorAuthenticate;
use SpiceCRM\includes\authentication\UserAuthenticate\UserAuthenticate;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use SpiceCRM\modules\Users\User;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;


class AuthenticateController
{
    public function authResetPasswordByToken(Request $req, Response $res, array $args): Response
    {
        $parsedBody = $req->getParsedBody();
        $userAuthenticationController = new UserAuthenticate();
        $userAuthenticationController->resetPasswordByToken($args['token'], $parsedBody['newPassword']);
        return $res->withJson($res);

    }

    public function authSendTokenToUser(Request $req, Response $res, array $args): Response
    {
        $sugarAuthenticationObj = new UserAuthenticate();
        try {
            $sugarAuthenticationObj->sendTokenToUser($args['emailAddress']);
        } catch (Exception $exception) {
            throw new Exception();
            //catch error of sending token in order to hide success of action
        }
        return $res->withJson($res);
    }

    /**
     *this function is in beta state and can be used for two factor authentication
     */
    public function authCheckCode(Request $req, Response $res, array $args): Response
    {
        $twoFactorAuthentication = new TwoFactorAuthenticate();

        return $res->withJson($twoFactorAuthentication->checkCode("12345", "56789"));
    }

    public function authChangePassword(Request $req, Response $res, array $args)
    {
        $parsedBody = $req->getParsedBody();
        AuthenticationController::getInstance()->changePassword($parsedBody['username'], $parsedBody['password'], $parsedBody['newPassword'], false);

        return $res->withJson($res);

    }

    public function authGetModuleACL(Request $req, Response $res, array $args): Response
    {
        $sugarAuthenticateObj = new UserAuthenticate();

        return $res->withJson($sugarAuthenticateObj->get_modules_acl());
    }

    public function authSetNewPassword(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
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

        if ($userObj->external_auth_only == "1") {
            throw new UnauthorizedException("Password Reset due to external_auth_only unavailable");
        }

        $sugarAuthenticationObj = new UserAuthenticate();
        $sugarAuthenticationObj->setNewPassword($userObj, $parsedBody['newPassword'], $parsedBody['sendEmail'], $parsedBody['forceReset']);

        return $res->withJson(['success' => true]);

    }

    public function authGetFormat(Request $req, Response $res, array $args): Response
    {
        return $res->withJson([
            'dateFormats' => SpiceConfig::getInstance()->config['date_formats'],
            'nameFormats' => array_values(@SpiceConfig::getInstance()->config['name_formats']),
            'timeFormats' => SpiceConfig::getInstance()->config['time_formats']
        ]);
    }


    /**
     * generates a TOTP Password Secret
     *
     * @param $req
     * @param $res
     * @param array $args
     * @return mixed
     * @throws \Com\Tecnick\Color\Exception
     * @throws \SpiceCRM\includes\ErrorHandlers\BadRequestException
     */
    public function generateTOTPSecret($req, $res, array $args)
    {
        $spice_config = SpiceConfig::getInstance()->config;
        $db = DBManagerFactory::getInstance();
        $timeDate = TimeDate::getInstance();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $auth = new TOTPAuthentication();
        $secret = $auth->generateSecret();

        // delete all old not confirmed records
        $db->query("UPDATE users_totp SET deleted = 1 WHERE user_id='{$current_user->id}'AND auth_status='C' AND deleted = 0");

        // generate a new pending record
        $id = SpiceUtils::createGuid();
        $db->query("INSERT INTO users_totp (id, user_id, user_secret, date_generated,auth_status, deleted) VALUES('{$id}', '{$current_user->id}', '{$secret}', '{$timeDate->nowDb()}', 'C', 0)");

        $hostname = str_replace(' ', '_', $spice_config['system']['name']);

        return $res->withJson(['secret' => $secret, 'name' => "{$current_user->user_name}@{$hostname}"  , 'qrcode' => $auth->getQRCode($current_user->user_name, $hostname, $secret)]);
    }

    /**
     * validates the TOTP Code
     *
     * @param $req
     * @param $res
     * @param array $args
     * @return mixed
     * @throws NotFoundException
     */
    public function validateTOTPCode($req, $res, array $args)
    {
        $db = DBManagerFactory::getInstance();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $record = $db->fetchOne("SELECT * FROM users_totp WHERE user_id = '{$current_user->id}' AND auth_status = 'C' AND deleted = 0");
        if(!$record){
            throw new NotFoundException('no record to validate');
        }

        $auth = new TOTPAuthentication();
        $validated = false;
        if($auth->checkCode($record['user_secret'], $args['code'])){
            $db->query("UPDATE users_totp SET auth_status='A' WHERE id='{$record['id']}'");
            $validated = true;
        }


        return $res->withJson(['validated' => $validated]);
    }

    /**
     * validates the TOTP Code
     *
     * @param $req
     * @param $res
     * @param array $args
     * @return mixed
     * @throws NotFoundException
     */
    public function checkTOTPActive($req, $res, array $args)
    {
        return $res->withJson(['active' => TOTPAuthentication::checkTOTPActive()]);
    }
    /**
     * vdeletes an active TOTP Code
     *
     * @param $req
     * @param $res
     * @param array $args
     * @return mixed
     * @throws NotFoundException
     */
    public function deleteTOTPActive($req, $res, array $args)
    {
        return $res->withJson(['success' => TOTPAuthentication::deleteTOTP()]);
    }
}
