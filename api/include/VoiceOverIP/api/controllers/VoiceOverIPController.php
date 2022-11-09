<?php

namespace SpiceCRM\includes\VoiceOverIP\api\controllers;

use Exception;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\includes\VoiceOverIP\VoiceOverIP;

class VoiceOverIPController
{
    /**
     * handle incoming call
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function handleEvent(Request $req, Response $res, array $args): Response
    {
        $callData = $req->getParsedBody();

        if (empty($callData['id'])) $callData['id'] = SpiceUtils::createGuid();

        $voiceOverIp = new VoiceOverIP();
        $voiceOverIp->handleEvent($callData['channel'], $callData);

        return $res->withJson(['id' => $callData['id']]);
    }


    /**
     * sets the preferences including checking the login
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function setPreferences(Request $req, Response $res, array $args): Response
    {
        $postBody = $req->getParsedBody();

        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $current_user->setPreference($this->preferenceName, $postBody, 0, $this->preferenceCategory);
        $current_user->savePreferencesToDB();

        return $res->withJson(['status' => 'success']);
    }

    /**
     * get preferences
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getPreferences(Request $req, Response $res, array $args): Response
    {
        $voiceOverIP = new VoiceOverIP();
        return $res->withJson($voiceOverIP->getPreferences());
    }
}