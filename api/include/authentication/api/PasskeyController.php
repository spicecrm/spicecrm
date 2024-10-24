<?php

namespace SpiceCRM\includes\authentication\api;

use Exception;
use lbuchs\WebAuthn\WebAuthnException;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\authentication\api\controllers\AuthenticateController;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\authentication\PasskeyAuthenticate\PasskeyUtils;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class PasskeyController
{
    /**
     * @throws ForbiddenException
     */
    private function checkCanChangePasskey(): void
    {
        if (!AuthenticationController::getInstance()->isAdmin() && !AuthenticationController::getInstance()->getCanChangePassword()) {
            throw new ForbiddenException('Forbidden to create a passkey. User not allowed to change security setting.');
        }
    }
    /**
     * generate create args
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function createArgs(Request $req, Response $res, array $args): Response
    {
        $this->checkCanChangePasskey();

        $user = AuthenticationController::getInstance()->getCurrentUser();
        $rpId = $req->getParsedBody()['rpId'];

        $params = (object)[
            'userName' => $user->user_name,
            'userDisplayName' => "$user->first_name $user->last_name",
            'userId' => $user->id,
            'rpId' => $rpId
        ];

        $passkeyAuthenticate = new PasskeyUtils($params->rpId);
        $response = $passkeyAuthenticate->generateCreateArgs($params);
        return $res->withJson($response);
    }

    /**
     * process create passkey
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws WebAuthnException
     * @throws Exception
     */
    public function processCreate(Request $req, Response $res, array $args): Response
    {
        $this->checkCanChangePasskey();

        $params = (object) $req->getParsedBody();

        $passkeyAuthenticate = new PasskeyUtils($params->rpId);
        $response = $passkeyAuthenticate->processCreate($params);

        return $res->withJson($response);
    }

    /**
     * generate get args
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function getArgs(Request $req, Response $res, array $args): Response
    {
        $params = (object) $req->getParsedBody();

        $passkeyAuthenticate = new PasskeyUtils($params->rpId);
        $response = $passkeyAuthenticate->generateGetArgs($params);
        return $res->withJson($response);
    }

    /**
     * check if the user has a passkey
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function checkPasskey(Request $req, Response $res, array $args): Response
    {
        $params = (object) $req->getQueryParams();

        $passkeyAuthenticate = new PasskeyUtils($params->rpId);
        $response = $passkeyAuthenticate->getRegistrationByUserId($args['userId'], $params->rpId);
        if (!$response) {
            return $res->withJson(null);
        }
        $metadata = $passkeyAuthenticate->getAuthenticatorMetadata($response->AAGUID);
        return $res->withJson($metadata);
    }

    /**
     * delete the user passkey
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function removePasskey(Request $req, Response $res, array $args): Response
    {
        $this->checkCanChangePasskey();

        $params = (object) $req->getQueryParams();

        $passkeyAuthenticate = new PasskeyUtils($params->rpId);
        $response = $passkeyAuthenticate->removeUserRegistration($args['userId'], $params->rpId);

        return $res->withJson(!!$response);
    }
}