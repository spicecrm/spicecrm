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
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRM2FAUtils;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAuthenticate;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMPasswordUtils;
use SpiceCRM\includes\authentication\TOTPAuthentication\TOTPAuthentication;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\ErrorHandlers\SessionExpiredException;
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
    /**
     * reset password by token
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     */
    public function authResetPasswordByToken(Request $req, Response $res, array $args): Response
    {
        $parsedBody = $req->getParsedBody();
        $userAuthenticationController = new SpiceCRMPasswordUtils();
        $userAuthenticationController->resetPasswordByToken($args['token'], $parsedBody['newPassword']);
        return $res->withJson($res);

    }

    /**
     * send password token to user
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function authSendTokenToUser(Request $req, Response $res, array $args): Response
    {
        $sugarAuthenticationObj = new SpiceCRMPasswordUtils();
        try {
            $sugarAuthenticationObj->sendTokenToUser($args['emailAddress']);
        } catch (Exception $exception) {
            throw new Exception();
            //catch error of sending token in order to hide success of action
        }
        return $res->withJson($res);
    }

    /**
     * change user password
     * @throws Exception
     * @throws UnauthorizedException | \Exception | ForbiddenException
     */
    public function authChangePassword(Request $req, Response $res, array $args): Response
    {
        $parsedBody = $req->getParsedBody();

        $spiceCRMAuth = new SpiceCRMAuthenticate();
        $userId = $spiceCRMAuth->handleCredentials($parsedBody['username'], $parsedBody['password']);

        /** @var User $user */
        $user = BeanFactory::getBean('Users', $userId);

        if (!$user) {
            throw new UnauthorizedException("User not found");
        }

        $config2FA = SpiceCRM2FAUtils::get2FAConfig();

        if (!empty($user->user_2fa_method) || in_array($config2FA->require_on, ['always', 'device_change'])) {

            $method = $user->user_2fa_method ?? $config2FA->method;

            if (!empty($parsedBody['code2fa'])) {
                try {
                    SpiceCRM2FAUtils::check2FACode($user, $method, $parsedBody['code2fa']);
                } catch (UnauthorizedException $e) {
                    throw new Exception('Invalid token', 'invalid2FACode');
                }
            } else {

                $message = '';

                switch ($method) {
                    case 'sms':
                        $message = 'Enter the code sent to your email';
                        SpiceCRM2FAUtils::send2FACodeBySMS($user->id);
                        break;
                    case 'email':
                        $message = 'Enter the sms code sent to your mobile device';
                        SpiceCRM2FAUtils::send2FACodeByEmail($user->id);
                        break;
                    case 'one_time_password':
                        $message = 'Enter the one-time password code displayed on the authenticator app in your mobile device';
                        break;
                }

                throw new Exception($message, 'no2FACode');
            }

        }
        AuthenticationController::getInstance()->setCurrentUser($user);

        $sugarAuthenticationObj = AuthenticationController::getInstance()->getPasswordUtilsInstance();
        $sugarAuthenticationObj->changePassword($parsedBody['username'], $parsedBody['newPassword']);

        return $res->withJson(true);

    }

    /**
     * set new user password
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     * @throws ForbiddenException
     * @throws UnauthorizedException
     */
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

        $sugarAuthenticationObj = AuthenticationController::getInstance()->getPasswordUtilsInstance();
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
     * generates one time Password Secret
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     * @throws SessionExpiredException
     * @throws UnauthorizedException
     * @throws \Com\Tecnick\Color\Exception
     */
    public function generateTOTPSecret( Request $req, Response $res, array $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $forUser = $this->get2FAUserObject($req);

        $secret = TOTPAuthentication::generateSecret();

        // delete all old not confirmed records
        $db->query("UPDATE users_totp SET deleted = 1 WHERE user_id='{$forUser->id}'AND auth_status='C' AND deleted = 0");

        // generate a new pending record
        $id = SpiceUtils::createGuid();
        $db->query("INSERT INTO users_totp (id, user_id, user_secret, date_generated,auth_status, deleted) VALUES('{$id}', '{$forUser->id}', '{$secret}', {$db->now()}, 'C', 0)");

        $hostname = str_replace(' ', '_', SpiceConfig::getInstance()->get('system.name'));

        return $res->withJson(['secret' => $secret, 'name' => "{$forUser->user_name}@{$hostname}"  , 'qrcode' => TOTPAuthentication::getQRCode($forUser->user_name, $hostname, $secret)]);
    }

    /**
     * validate the one time password code
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws NotFoundException
     * @throws SessionExpiredException
     * @throws UnauthorizedException
     */
    public function validateTOTPCode( Request $req, Response $res, array $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $forUser = $this->get2FAUserObject($req);

        $record = $db->fetchOne("SELECT * FROM users_totp WHERE user_id = '{$forUser->id}' AND auth_status = 'C' AND deleted = 0");

        if(!$record){
            throw new NotFoundException('no record to validate');
        }

        $validated = false;
        if(TOTPAuthentication::checkCode($record['user_secret'], $args['code'])){
            $db->query("UPDATE users_totp SET deleted=1 WHERE user_id='{$forUser->id}' AND auth_status='A'");
            $db->query("UPDATE users_totp SET auth_status='A' WHERE id='{$record['id']}'");

            // update the user
            $forUser->user_2fa_method = 'one_time_password';
            $forUser->save();

            $validated = true;
        }

        return $res->withJson(['validated' => $validated]);
    }

    /**
     * check if one time password is active (has a secret entry)
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws SessionExpiredException
     * @throws UnauthorizedException
     */
    public function checkTOTPActive( Request $req, Response $res, array $args): Response
    {
        $forUser = $this->get2FAUserObject($req);

        return $res->withJson(['active' => TOTPAuthentication::checkTOTPActive( $forUser->id )]);
    }

    /**
     * deletes an active one time password Code
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return mixed
     * @throws SessionExpiredException
     * @throws UnauthorizedException
     */
    public function deleteTOTPActive( Request $req, Response $res, array $args): Response
    {
        $forUser = $this->get2FAUserObject($req);

        return $res->withJson(['success' => TOTPAuthentication::deleteTOTP( $forUser->id )]);
    }

    /**
     * validate 2fa code for the given method
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws SessionExpiredException | UnauthorizedException|BadRequestException | \Exception
     */
    public function validate2FACode( Request $req, Response $res, array $args): Response
    {
        $forUser = $this->get2FAUserObject($req);
        $methods = array_column(SpiceCRM2FAUtils::getAvailableMethods($forUser), 'value');

        if (!in_array($args['method'], $methods)) {
            throw new BadRequestException('2FA method does not exist');
        }

        $valid = SpiceCRM2FAUtils::check2FACode($forUser, $args['method'], $args['code']);

        if ($valid) {
            $db = DBManagerFactory::getInstance();
            $db->updateQuery('users', ['id' => $forUser->id], ['user_2fa_method' => $args['method']]);
        }

        return $res->withJson(['success' => $valid]);
    }

    /**
     * send 2fa code to user by the given method
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws SessionExpiredException | UnauthorizedException
     */
    public function send2FACode( Request $req, Response $res, array $args): Response
    {
        $forUser = $this->get2FAUserObject($req);

        switch ($args['method']) {
            case 'sms':
                SpiceCRM2FAUtils::send2FACodeBySMS($forUser->id);
                break;
            case 'email':
                SpiceCRM2FAUtils::send2FACodeByEmail($forUser->id);
                break;
        }

        return $res->withJson(['success' => true]);
    }

    /**
     * get 2FA user object from request
     * @param Request $req
     * @return User
     * @throws UnauthorizedException
     * @throws SessionExpiredException
     */
    private function get2FAUserObject(Request $req): User
    {
        $queryParams = $req->getQueryParams();
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        if ( isset( $queryParams['onBehalfUserId'] ) && $currentUser && $currentUser->isAdmin() ) {
            $forUser = BeanFactory::getBean('Users', $queryParams['onBehalfUserId'] );
        } else {
            $forUser = $currentUser;
        }

        if ( !$forUser ) {
            $body = $req->getParsedBody();
            if ( !empty( $body['username'] ) && !empty( $body['password'] )) {

                $userAuthenticateObj = new SpiceCRMAuthenticate();

                $authData = (object) [
                    'username' => $body['username'],
                    'password' => $body['password']
                ];

                $authResponse = $userAuthenticateObj->authenticate($authData, 'credentials');
                // load a User object
                $forUser = BeanFactory::getBean('Users');
                $forUser->retrieve_by_string_fields(['user_name' => $authResponse->username]);
            }
        }

        if (!$forUser) {
            throw new UnauthorizedException('This API is can only be accessed with an authenticated admin user or credentials');
        }

        return $forUser;
    }

    /**
     * generates a 2FA Tooen and sends it out
     *
     * @param $req
     * @param $res
     * @param array $args
     * @return mixed
     * @throws NotFoundException
     */
    public function generate2FAToken( Request $req, Response $res, array $args)
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        $response = false;
        switch ($args['method']){
            case 'sms':
                $response = SpiceCRM2FAUtils::send2FACodeBySMS($currentUser->id);
                break;
            case 'email':
                $response = SpiceCRM2FAUtils::send2FACodeByEmail($currentUser->id);
                break;
        }

        return $res->withJson(['success' => $response]);
    }

    /**
     * sets a 2FA method
     *
     * @param $req
     * @param $res
     * @param array $args
     * @return mixed
     * @throws NotFoundException
     */
    public function set2FAMethod( Request $req, Response $res, array $args)
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        $response = false;
        try {
            if (SpiceCRM2FAUtils::check2FACode($currentUser, $args['method'], $args['code'])) {
                $currentUser->user_2fa_method = $args['method'];
                $currentUser->save();
                $response = true;
            }
        } catch (UnauthorizedException $e){
            $response = false;
        }

        return $res->withJson(['success' => $response]);
    }

    /**
     * sets a 2FA method
     *
     * @param $req
     * @param $res
     * @param array $args
     * @return mixed
     * @throws NotFoundException
     */
    public function delete2FASettings( Request $req, Response $res, array $args)
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        $response = false;
        try {
            if (SpiceCRM2FAUtils::check2FACode($currentUser, $currentUser->user_2fa_method, $args['code'])) {

                if($currentUser->user_2fa_method == 'one_time_password'){
                    TOTPAuthentication::deleteTOTP($currentUser->id);
                }

                $currentUser->user_2fa_method = '';
                $currentUser->save();
                $response = true;
            }
        } catch (UnauthorizedException $e){
            $response = false;
        }

        return $res->withJson(['success' => $response]);
    }
}
