<?php

namespace SpiceCRM\includes\authentication\APIKeyAuthenticate;

use Exception;
use SpiceCRM\includes\authentication\interfaces\AuthenticatorI;
use SpiceCRM\includes\authentication\interfaces\AuthResponse;
use SpiceCRM\includes\authentication\SpiceCRMAuthenticate\SpiceCRMAuthenticate;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\UnauthorizedException;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class APIKeyAuthenticate extends SpiceCRMAuthenticate implements AuthenticatorI
{
    /**
     * @param object $authData
     * @param string $authType
     * @return AuthResponse
     * @throws UnauthorizedException | Exception
     */
    public function authenticate(object $authData, string $authType): AuthResponse
    {
        switch ($authType) {
            case 'token':
                $db = DBManagerFactory::getInstance();
                $now = $db->now();
                $apiKey = $this->encrypt($authData->token->access_token);
                $userId = (string) $db->getOne("SELECT user_id FROM api_keys WHERE is_active = 1 AND (valid_until IS NULL OR valid_until <= $now) AND api_key = '$apiKey'");

                if (!$userId) {
                    throw new UnauthorizedException('Invalid API Key', 'InvalidToken');
                }

                break;
            default:
                throw new UnauthorizedException("Invalid authentication method", 6);
        }

        return $this->generateAuthResponse($userId);
    }

    /**
     * encrypt the key
     * @param string $key
     * @return string
     * @throws Exception
     */
    public static function encrypt(string $key): string
    {
        $hashSalt = SpiceConfig::getInstance()->get('system.encryption_hash_salt');

        if (!$hashSalt) {
            throw new Exception('Config system.encryption_hash_salt is not set');
        }

        return crypt(md5($key), $hashSalt);
    }
}