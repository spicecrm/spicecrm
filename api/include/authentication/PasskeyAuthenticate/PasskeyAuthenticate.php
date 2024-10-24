<?php

namespace SpiceCRM\includes\authentication\PasskeyAuthenticate;

use lbuchs\WebAuthn\WebAuthnException;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;

class PasskeyAuthenticate implements AuthenticatorI
{
    /**
     * Authenticates the user with the given signature
     * @param object $authData
     * @param string $authType
     * @return AuthResponse
     * @throws Exception|WebAuthnException
     */
    public function authenticate(object $authData, string $authType): AuthResponse
    {
        $params = json_decode(base64_decode($authData->token?->access_token));

        if (!$params) throw new UnauthorizedException('Invalid header');

        $utils = new PasskeyUtils($params->rpId);

        $clientDataJSON = !empty($params->clientDataJSON) ? base64_decode($params->clientDataJSON) : null;
        $authenticatorData = !empty($params->authenticatorData) ? base64_decode($params->authenticatorData) : null;
        $signature = !empty($params->signature) ? base64_decode($params->signature) : null;
        $userHandle = !empty($params->userHandle) ? base64_decode($params->userHandle) : null;
        $challenge = $utils->getChallenge($params->secret);
        $registration = $utils->getRegistrationByCredentialId(base64_decode($params->id), $params->rpId);
        $credentialPublicKey = $registration?->credentialPublicKey;

        if (!$registration || !$credentialPublicKey) {
            throw new UnauthorizedException('No registered passkey for this user');
        }

        // if we have resident key, we have to verify that the userHandle is the provided userId at registration
        if ($utils->config->requireResidentKey && $userHandle !== hex2bin($registration->userId)) {
            throw new \Exception('userId doesnt match (is ' . bin2hex($userHandle) . " but expect $params->userId)");
        }

        $utils->webAuthn->processGet($clientDataJSON, $authenticatorData, $signature, $credentialPublicKey, $challenge, null, $utils->config->userVerification === 'required');

        $user = BeanFactory::getBean('Users', $userHandle);

        if (!$user) {
            throw new UnauthorizedException('User not found');
        }

        return new AuthResponse($user->user_name);
    }
}